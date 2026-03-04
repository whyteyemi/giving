<?php
/**
 * =====================================================
 * GIVING WITHOUT LIMIT - STRIPE DONATION API
 * =====================================================
 * 
 * SETUP INSTRUCTIONS:
 * 1. Install Stripe PHP via Composer: composer require stripe/stripe-php
 * 2. Copy this file + the vendor/ folder to your htdocs folder
 * 3. Replace STRIPE_SECRET_KEY with your real key from stripe.com/dashboard
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

// ** IMPORTANT: Set your Stripe Secret Key as a server environment variable **
// On cPanel: Go to "Setup Node.js App" or add to .htaccess / php.ini:
//   SetEnv STRIPE_SECRET_KEY sk_live_YOUR_KEY_HERE
// Get your key from: https://dashboard.stripe.com/apikeys
// Use TEST key (sk_test_...) for development, LIVE key (sk_live_...) for production
define('STRIPE_SECRET_KEY', getenv('STRIPE_SECRET_KEY') ?: 'YOUR_STRIPE_SECRET_KEY_HERE');

// Database
$host = "localhost";
$db_name = "giving without limit";
$username = "root";
$password = ""; // Change for production

// Load Stripe PHP library (installed via Composer)
require_once __DIR__ . '/vendor/autoload.php';

\Stripe\Stripe::setApiKey(STRIPE_SECRET_KEY);

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
        case 'create_payment_intent':
            createPaymentIntent($conn, $data);
            break;

        case 'confirm_donation':
            confirmDonation($conn, $data);
            break;

        case 'get_donations':
            getDonations($conn);
            break;

        case 'stripe_webhook':
            handleStripeWebhook($conn);
            break;

        default:
            echo json_encode(["message" => "Donate API is live. Action: " . $action]);
            break;
    }
} catch (\Stripe\Exception\CardException $e) {
    http_response_code(400);
    echo json_encode(["error" => $e->getMessage()]);
} catch (\Stripe\Exception\ApiErrorException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Payment service error: " . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Server error: " . $e->getMessage()]);
}


// =====================================================
// HANDLER FUNCTIONS
// =====================================================

/**
 * Step 1: Create a Stripe PaymentIntent
 * Called when user clicks "COMPLETE DONATION" on the frontend
 */
function createPaymentIntent($conn, $data) {
    // Validate required fields
    $required = ['amount', 'first_name', 'last_name', 'email'];
    foreach ($required as $field) {
        if (empty($data[$field])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing required field: $field"]);
            return;
        }
    }

    $amount = floatval($data['amount']);
    if ($amount < 1) {
        http_response_code(400);
        echo json_encode(["error" => "Minimum donation is $1"]);
        return;
    }

    $email = $data['email'];
    $firstName = $data['first_name'];
    $lastName = $data['last_name'];
    $frequency = $data['frequency'] ?? 'one-time';
    $program = $data['program'] ?? 'General Fund (Most Needed)';

    // Find or create a Stripe Customer
    $customers = \Stripe\Customer::all(['email' => $email, 'limit' => 1]);
    if (count($customers->data) > 0) {
        $customer = $customers->data[0];
    } else {
        $customer = \Stripe\Customer::create([
            'email' => $email,
            'name' => "$firstName $lastName",
            'metadata' => ['source' => 'giving_without_limit']
        ]);
    }

    // Convert dollars to cents for Stripe
    $amountCents = intval($amount * 100);

    // Create a PaymentIntent
    $paymentIntent = \Stripe\PaymentIntent::create([
        'amount' => $amountCents,
        'currency' => 'usd',
        'customer' => $customer->id,
        'metadata' => [
            'program' => $program,
            'frequency' => $frequency,
            'donor_name' => "$firstName $lastName"
        ],
        'description' => "Donation to Giving Without Limit - $program",
        'automatic_payment_methods' => ['enabled' => true],
    ]);

    // Save pending donation to database
    $donationId = bin2hex(random_bytes(16));
    $stmt = $conn->prepare(
        "INSERT INTO donations (id, first_name, last_name, email, amount, frequency, program, stripe_payment_intent_id, stripe_customer_id, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')"
    );
    $stmt->execute([
        $donationId, $firstName, $lastName, $email, $amount,
        $frequency, $program, $paymentIntent->id, $customer->id
    ]);

    // Return client secret to the frontend (needed to confirm payment)
    echo json_encode([
        "clientSecret" => $paymentIntent->client_secret,
        "donationId" => $donationId,
        "paymentIntentId" => $paymentIntent->id
    ]);
}


/**
 * Step 2: Confirm donation succeeded (called after Stripe confirms payment)
 */
function confirmDonation($conn, $data) {
    $paymentIntentId = $data['payment_intent_id'] ?? '';
    
    if (empty($paymentIntentId)) {
        http_response_code(400);
        echo json_encode(["error" => "Payment intent ID required"]);
        return;
    }

    // Verify with Stripe that the payment actually succeeded
    $paymentIntent = \Stripe\PaymentIntent::retrieve($paymentIntentId);
    
    $status = ($paymentIntent->status === 'succeeded') ? 'succeeded' : 'failed';

    // Update database
    $stmt = $conn->prepare("UPDATE donations SET status = ? WHERE stripe_payment_intent_id = ?");
    $stmt->execute([$status, $paymentIntentId]);

    echo json_encode([
        "success" => $status === 'succeeded',
        "status" => $status,
        "amount" => $paymentIntent->amount / 100
    ]);
}


/**
 * Get all donations (admin use)
 */
function getDonations($conn) {
    $stmt = $conn->prepare("SELECT * FROM donations ORDER BY created_at DESC");
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}


/**
 * Handle Stripe Webhook (optional but recommended for production)
 * This is called directly by Stripe servers when payment status changes
 */
function handleStripeWebhook($conn) {
    $payload = file_get_contents('php://input');
    $event = json_decode($payload, true);

    if (!$event || !isset($event['type'])) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid webhook payload"]);
        return;
    }

    switch ($event['type']) {
        case 'payment_intent.succeeded':
            $pi = $event['data']['object'];
            $stmt = $conn->prepare("UPDATE donations SET status = 'succeeded' WHERE stripe_payment_intent_id = ?");
            $stmt->execute([$pi['id']]);
            break;

        case 'payment_intent.payment_failed':
            $pi = $event['data']['object'];
            $stmt = $conn->prepare("UPDATE donations SET status = 'failed' WHERE stripe_payment_intent_id = ?");
            $stmt->execute([$pi['id']]);
            break;
    }

    echo json_encode(["received" => true]);
}
?>
