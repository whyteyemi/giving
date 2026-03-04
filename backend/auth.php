<?php
// Minimal stateless auth token (HMAC signed).

function gwl_b64url_encode($data) {
  return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function gwl_b64url_decode($data) {
  $remainder = strlen($data) % 4;
  if ($remainder) {
    $data .= str_repeat('=', 4 - $remainder);
  }
  return base64_decode(strtr($data, '-_', '+/'));
}

function gwl_sign($msg, $secret) {
  return hash_hmac('sha256', $msg, $secret, true);
}

function gwl_issue_token($claims, $secret) {
  $claims['iat'] = time();
  if (!isset($claims['exp'])) {
    $claims['exp'] = time() + (60 * 60 * 24 * 7); // 7 days
  }
  $payload = gwl_b64url_encode(json_encode($claims));
  $sig = gwl_b64url_encode(gwl_sign($payload, $secret));
  return $payload . '.' . $sig;
}

function gwl_verify_token($token, $secret) {
  if (!$token || strpos($token, '.') === false) return null;
  [$payload, $sig] = explode('.', $token, 2);
  $expected = gwl_b64url_encode(gwl_sign($payload, $secret));
  if (!hash_equals($expected, $sig)) return null;
  $json = gwl_b64url_decode($payload);
  $claims = json_decode($json, true);
  if (!is_array($claims)) return null;
  if (isset($claims['exp']) && time() > (int)$claims['exp']) return null;
  return $claims;
}

function gwl_get_bearer_token() {
  $hdr = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['Authorization'] ?? '';
  if (!$hdr) return '';
  if (stripos($hdr, 'Bearer ') === 0) {
    return trim(substr($hdr, 7));
  }
  return '';
}
