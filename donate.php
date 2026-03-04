<?php
/**
 * =====================================================
 * GIVING WITHOUT LIMIT - PAYSTACK DONATION API
 * =====================================================
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

ini_set('display_errors', 0);
error_reporting(E_ALL);

// =====================================================
// CONFIGURATION
// =====================================================

// ** Set your Paystack keys as server environment variables **
// On cPanel: Go to "Setup Node.js App" or add to .htaccess / php.ini:
//   SetEnv PAYSTACK_SECRET_KEY sk_live_YOUR_KEY_HERE
define('PAYSTACK_SECRET_KEY', getenv('PAYSTACK_SECRET_KEY') ?: 'YOUR_PAYSTACK_SECRET_KEY_HERE');

// Database - Matches your central config
$host = "localhost";
$db_name = "giving without limit";
$username = "root";
$password = ""; // Change for production

// Database connection
try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

// =====================================================
// ROUTING
// =====================================================

$action = $_GET['action'] ?? '';
$input = file_get_contents("php://input");
$data = json_decode($input, true) ?? [];

try {
    switch ($action) {
        case 'initialize_transaction':
            initializeTransaction($conn, $data);
            break;

        case 'verify_transaction':
            verifyTransaction($conn, $_GET['reference'] ?? '');
            break;

        case 'get_donations':
            getDonations($conn);
            break;

        case 'paystack_webhook':
            handlePaystackWebhook($conn);
            break;

        default:
            echo json_encode(["message" => "Paystack Donate API is live. Action: " . $action]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Server error: " . $e->getMessage()]);
}

// =====================================================
// HANDLER FUNCTIONS
// =====================================================

/**
 * Step 1: Initialize Paystack Transaction
 */
function initializeTransaction($conn, $data) {
    $required = ['amount', 'email', 'first_name', 'last_name'];
    foreach ($required as $field) {
        if (empty($data[$field])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing required field: $field"]);
            return;
        }
    }

    $amount = floatval($data['amount']);
    $email = $data['email'];
    $reference = bin2hex(random_bytes(10)); // Unique reference for this transaction
    
    // Paystack amount is in KOBO (amount * 100)
    $amountKobo = intval($amount * 100);

    $url = "https://api.paystack.co/transaction/initialize";
    $fields = [
        'email' => $email,
        'amount' => $amountKobo,
        'reference' => $reference,
        'metadata' => [
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'program' => $data['program'] ?? 'General Fund',
            'frequency' => $data['frequency'] ?? 'one-time'
        ]
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        "Authorization: Bearer " . PAYSTACK_SECRET_KEY,
        "Cache-Control: no-cache",
        "Content-Type: application/json"
    ));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $result = curl_exec($ch);
    $response = json_decode($result, true);
    curl_close($ch);

    if (!$response || !$response['status']) {
        http_response_code(400);
        echo json_encode(["error" => "Paystack initialization failed: " . ($response['message'] ?? 'Unknown error')]);
        return;
    }

    // Save pending donation to database
    // Note: We use the existing columns but store Paystack reference in stripe_payment_intent_id for compatibility
    $donationId = bin2hex(random_bytes(16));
    $stmt = $conn->prepare(
        "INSERT INTO donations (id, first_name, last_name, email, amount, frequency, program, status, stripe_payment_intent_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)"
    );
    $stmt->execute([
        $donationId, 
        $data['first_name'], 
        $data['last_name'], 
        $email, 
        $amount,
        $data['frequency'] ?? 'one-time', 
        $data['program'] ?? 'General Fund',
        $reference
    ]);

    echo json_encode([
        "status" => true,
        "authorization_url" => $response['data']['authorization_url'],
        "access_code" => $response['data']['access_code'],
        "reference" => $reference
    ]);
}

/**
 * Step 2: Verify Transaction Status
 */
function verifyTransaction($conn, $reference) {
    if (empty($reference)) {
        http_response_code(400);
        echo json_encode(["error" => "Reference required"]);
        return;
    }

    $url = "https://api.paystack.co/transaction/verify/" . rawurlencode($reference);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer " . PAYSTACK_SECRET_KEY,
        "Cache-Control: no-cache",
    ]);
    
    $result = curl_exec($ch);
    $response = json_decode($result, true);
    curl_close($ch);

    if ($response && $response['status'] && $response['data']['status'] === 'success') {
        // Update database status
        $stmt = $conn->prepare("UPDATE donations SET status = 'succeeded' WHERE stripe_payment_intent_id = ?");
        $stmt->execute([$reference]);

        echo json_encode(["success" => true, "status" => "succeeded", "data" => $response['data']]);
    } else {
        echo json_encode(["success" => false, "status" => "failed", "message" => $response['message'] ?? 'Verification failed']);
    }
}

/**
 * Get all donations
 */
function getDonations($conn) {
    $stmt = $conn->prepare("SELECT * FROM donations ORDER BY created_at DESC");
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}

/**
 * Webhook for background verification
 */
function handlePaystackWebhook($conn) {
    // Only process POST requests
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') return;

    // Retrieve the request's body
    $input = file_get_contents("php://input");
    
    // Verify signature (Security)
    if (!isset($_SERVER['HTTP_X_PAYSTACK_SIGNATURE']) || 
        $_SERVER['HTTP_X_PAYSTACK_SIGNATURE'] !== hash_hmac('sha512', $input, PAYSTACK_SECRET_KEY)) {
        http_response_code(401);
        exit();
    }

    $event = json_decode($input, true);
    
    if ($event['event'] === 'charge.success') {
        $reference = $event['data']['reference'];
        $stmt = $conn->prepare("UPDATE donations SET status = 'succeeded' WHERE stripe_payment_intent_id = ?");
        $stmt->execute([$reference]);
    }

    http_response_code(200);
    echo json_encode(["status" => "success"]);
}
?>
