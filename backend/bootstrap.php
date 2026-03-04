<?php
// Central bootstrap for API endpoints.

// Security headers
header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: no-referrer');

// Load config (env preferred)
$config = null;
$localConfigPath = __DIR__ . '/config.php';
$sampleConfigPath = __DIR__ . '/config.sample.php';
if (file_exists($localConfigPath)) {
  $config = require $localConfigPath;
} else {
  $config = require $sampleConfigPath;
}

$appEnv = $config['APP_ENV'] ?? 'development';
$debug = ($appEnv !== 'production');

ini_set('display_errors', $debug ? '1' : '0');
error_reporting(E_ALL);

// CORS (allowlist)
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = array_map('trim', explode(',', (string)($config['CORS_ORIGINS'] ?? '*')));
$allowAll = (count($allowed) === 1 && $allowed[0] === '*');
if ($allowAll) {
  header('Access-Control-Allow-Origin: *');
} else if ($origin && in_array($origin, $allowed, true)) {
  header('Access-Control-Allow-Origin: ' . $origin);
  header('Vary: Origin');
}
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
  http_response_code(200);
  echo json_encode(['ok' => true]);
  exit();
}

function gwl_json($payload, $code = 200) {
  http_response_code($code);
  echo json_encode($payload);
  exit();
}

function gwl_error($message, $code = 400, $meta = null) {
  $body = ['error' => $message];
  if ($meta !== null) $body['meta'] = $meta;
  gwl_json($body, $code);
}

// DB connect
function gwl_db($config) {
  $host = $config['DB_HOST'] ?? '127.0.0.1';
  $db = $config['DB_NAME'] ?? '';
  $user = $config['DB_USER'] ?? '';
  $pass = $config['DB_PASS'] ?? '';

  if (!$db || !$user) {
    gwl_error('Database configuration missing', 500);
  }

  $dsn = 'mysql:host=' . $host . ';dbname=' . $db . ';charset=utf8mb4';
  try {
    $pdo = new PDO($dsn, $user, $pass, [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
      PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    return $pdo;
  } catch (PDOException $e) {
    // Never leak creds/errors in production
    gwl_error('Database connection failed', 500);
  }
}
