<?php
require_once __DIR__ . '/backend/bootstrap.php';
require_once __DIR__ . '/backend/api_handlers.php'; // for auth helpers
require_once __DIR__ . '/backend/donate_handlers.php';

$pdo = gwl_db($config);
$action = $_GET['action'] ?? '';
$data = gwl_read_json_body();

try {
  switch ($action) {
    case 'initialize_transaction':
      gwl_paystack_initialize($pdo, $config, $data);
      break;
    case 'verify_transaction':
      gwl_paystack_verify($pdo, $config, (string)($_GET['reference'] ?? ''));
      break;
    case 'get_donations':
      gwl_donations_list_admin($pdo, $config);
      break;
    case 'paystack_webhook':
      gwl_paystack_webhook($pdo, $config);
      break;
    default:
      gwl_json(['message' => 'Donate API is live', 'action' => $action ?: null]);
  }
} catch (Throwable $e) {
  $debug = (($config['APP_ENV'] ?? 'development') !== 'production');
  if ($debug) {
    gwl_error('Internal Server Error', 500, ['detail' => $e->getMessage()]);
  }
  gwl_error('Internal Server Error', 500);
}
<<<<<<< HEAD
=======

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
        'currency' => 'USD',
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
>>>>>>> f0b75e4 (Added new trustee Mrs Afusatu Bamigbose and updated Paystack default currency to USD)
