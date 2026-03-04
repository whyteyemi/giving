<?php
require_once __DIR__ . '/auth.php';

function gwl_paystack_secret($config) {
  $k = (string)($config['PAYSTACK_SECRET_KEY'] ?? '');
  if (!$k) {
    gwl_error('Paystack is not configured', 500);
  }
  return $k;
}

function gwl_paystack_initialize($pdo, $config, $data) {
  $required = ['amount', 'email', 'first_name', 'last_name'];
  foreach ($required as $f) {
    if (empty($data[$f])) gwl_error('Missing required field: ' . $f, 400);
  }

  $amount = (float)$data['amount'];
  if ($amount <= 0) gwl_error('Invalid amount', 400);

  $email = (string)$data['email'];
  $reference = bin2hex(random_bytes(10));
  $amountKobo = (int)round($amount * 100);

  $payload = [
    'email' => $email,
    'amount' => $amountKobo,
    'reference' => $reference,
    'metadata' => [
      'first_name' => (string)$data['first_name'],
      'last_name' => (string)$data['last_name'],
      'program' => (string)($data['program'] ?? 'General Fund'),
      'frequency' => (string)($data['frequency'] ?? 'one-time'),
    ],
  ];

  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, 'https://api.paystack.co/transaction/initialize');
  curl_setopt($ch, CURLOPT_POST, true);
  curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
  curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . gwl_paystack_secret($config),
    'Cache-Control: no-cache',
    'Content-Type: application/json',
  ]);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

  $result = curl_exec($ch);
  $response = json_decode($result, true);
  curl_close($ch);

  if (!$response || empty($response['status'])) {
    gwl_error('Paystack initialization failed', 400);
  }

  // Save pending donation
  $donationId = bin2hex(random_bytes(16));
  $donorName = trim(((string)$data['first_name']) . ' ' . ((string)$data['last_name']));
  $stmt = $pdo->prepare('INSERT INTO donations (id, donor_name, email, amount, frequency, program, status, payment_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  $stmt->execute([
    $donationId,
    $donorName,
    $email,
    $amount,
    (string)($data['frequency'] ?? 'one-time'),
    (string)($data['program'] ?? 'General Fund'),
    'pending',
    $reference,
  ]);

  gwl_json([
    'status' => true,
    'authorization_url' => $response['data']['authorization_url'],
    'access_code' => $response['data']['access_code'],
    'reference' => $reference,
  ]);
}

function gwl_paystack_verify($pdo, $config, $reference) {
  if (!$reference) gwl_error('Reference required', 400);

  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, 'https://api.paystack.co/transaction/verify/' . rawurlencode($reference));
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . gwl_paystack_secret($config),
    'Cache-Control: no-cache',
  ]);

  $result = curl_exec($ch);
  $response = json_decode($result, true);
  curl_close($ch);

  if ($response && !empty($response['status']) && ($response['data']['status'] ?? '') === 'success') {
    $stmt = $pdo->prepare("UPDATE donations SET status = 'success' WHERE payment_id = ?");
    $stmt->execute([$reference]);
    gwl_json(['success' => true, 'status' => 'success', 'data' => $response['data']]);
  }

  gwl_json(['success' => false, 'status' => 'failed', 'message' => $response['message'] ?? 'Verification failed']);
}

function gwl_donations_list_admin($pdo, $config) {
  $claims = gwl_require_auth($config);
  gwl_require_role($claims, ['admin','staff']);

  $stmt = $pdo->query('SELECT * FROM donations ORDER BY created_at DESC');
  gwl_json($stmt->fetchAll());
}

function gwl_paystack_webhook($pdo, $config) {
  if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') gwl_json(['ok' => true]);

  $input = file_get_contents('php://input');
  $sig = $_SERVER['HTTP_X_PAYSTACK_SIGNATURE'] ?? '';
  $expected = hash_hmac('sha512', $input, gwl_paystack_secret($config));
  if (!$sig || !hash_equals($expected, $sig)) {
    http_response_code(401);
    exit();
  }

  $event = json_decode($input, true);
  if (is_array($event) && ($event['event'] ?? '') === 'charge.success') {
    $reference = $event['data']['reference'] ?? '';
    if ($reference) {
      $stmt = $pdo->prepare("UPDATE donations SET status = 'success' WHERE payment_id = ?");
      $stmt->execute([$reference]);
    }
  }

  gwl_json(['status' => 'success']);
}
