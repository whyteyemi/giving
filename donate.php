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
