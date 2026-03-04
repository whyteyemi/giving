<?php
require_once __DIR__ . '/auth.php';

function gwl_read_json_body() {
  $raw = file_get_contents('php://input');
  if (!$raw) return [];
  $data = json_decode($raw, true);
  return is_array($data) ? $data : [];
}

function gwl_require_auth($config) {
  $token = gwl_get_bearer_token();
  $claims = gwl_verify_token($token, (string)($config['APP_SECRET'] ?? ''));
  if (!$claims || empty($claims['uid'])) {
    gwl_error('Unauthorized', 401);
  }
  return $claims;
}

function gwl_require_role($claims, $roles) {
  $role = $claims['role'] ?? 'user';
  if (!in_array($role, $roles, true)) {
    gwl_error('Forbidden', 403);
  }
}

function gwl_health() {
  gwl_json(['ok' => true, 'service' => 'gwl-api']);
}

function gwl_login($pdo, $config, $data) {
  $email = trim((string)($data['email'] ?? ''));
  $password = (string)($data['password'] ?? '');
  if (!$email || !$password) gwl_error('Email and password required', 400);

  $stmt = $pdo->prepare('SELECT id, email, full_name, role, password_hash FROM profiles WHERE email = ? LIMIT 1');
  $stmt->execute([$email]);
  $user = $stmt->fetch();

  if (!$user || !password_verify($password, $user['password_hash'])) {
    gwl_error('Invalid credentials', 401);
  }

  $claims = ['uid' => $user['id'], 'email' => $user['email'], 'role' => $user['role']];
  $token = gwl_issue_token($claims, (string)($config['APP_SECRET'] ?? ''));

  unset($user['password_hash']);
  gwl_json(['user' => $user, 'token' => $token]);
}

function gwl_signup($pdo, $data) {
  $email = trim((string)($data['email'] ?? ''));
  $password = (string)($data['password'] ?? '');
  $fullName = trim((string)($data['fullName'] ?? $data['full_name'] ?? ''));

  if (!$email || !$password || !$fullName) gwl_error('Email, password, full name required', 400);
  if (strlen($password) < 8) gwl_error('Password must be at least 8 characters', 400);

  $id = bin2hex(random_bytes(16));
  $hash = password_hash($password, PASSWORD_DEFAULT);

  $stmt = $pdo->prepare('INSERT INTO profiles (id, email, password_hash, full_name, role) VALUES (?, ?, ?, ?, ?)');
  try {
    $stmt->execute([$id, $email, $hash, $fullName, 'user']);
    gwl_json(['success' => true, 'id' => $id]);
  } catch (PDOException $e) {
    // Duplicate email
    gwl_error('Could not create account (email may already exist)', 400);
  }
}

function gwl_get_me($pdo, $config) {
  $claims = gwl_require_auth($config);
  $stmt = $pdo->prepare('SELECT id, email, full_name, role, location, phone, department, position, bio, avatar_url, created_at, updated_at FROM profiles WHERE id = ? LIMIT 1');
  $stmt->execute([$claims['uid']]);
  $me = $stmt->fetch();
  if (!$me) gwl_error('User not found', 404);
  gwl_json(['user' => $me]);
}

function gwl_list_table_admin($pdo, $config, $table, $orderBy) {
  $claims = gwl_require_auth($config);
  gwl_require_role($claims, ['admin', 'staff']);

  $allowed = [
    'profiles' => ['id', 'created_at'],
    'volunteer_applications' => ['created_at'],
    'field_reports' => ['created_at'],
    'donations' => ['created_at'],
  ];
  if (!isset($allowed[$table])) gwl_error('Invalid table', 400);
  if (!in_array($orderBy, $allowed[$table], true)) $orderBy = $allowed[$table][0];

  $sql = 'SELECT * FROM ' . $table . ' ORDER BY ' . $orderBy . ' DESC';
  $stmt = $pdo->query($sql);
  gwl_json($stmt->fetchAll());
}

function gwl_list_public_table($pdo, $table, $orderBy) {
  $allowed = [
    'events' => ['date', 'created_at'],
    'event_media' => ['created_at'],
    'impact_records' => ['created_at'],
    'help_me_campaigns' => ['created_at'],
  ];
  if (!isset($allowed[$table])) gwl_error('Invalid table', 400);
  if (!in_array($orderBy, $allowed[$table], true)) $orderBy = $allowed[$table][0];

  $sql = 'SELECT * FROM ' . $table . ' ORDER BY ' . $orderBy . ' DESC';
  $stmt = $pdo->query($sql);
  gwl_json($stmt->fetchAll());
}

function gwl_add_event($pdo, $config, $data) {
  $claims = gwl_require_auth($config);
  gwl_require_role($claims, ['admin', 'staff']);

  $id = bin2hex(random_bytes(16));
  $stmt = $pdo->prepare('INSERT INTO events (id, title, description, date, location, status, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)');
  $stmt->execute([
    $id,
    (string)($data['title'] ?? ''),
    (string)($data['description'] ?? ''),
    (string)($data['date'] ?? ''),
    (string)($data['location'] ?? ''),
    (string)($data['status'] ?? 'upcoming'),
    (string)($data['image_url'] ?? ''),
  ]);
  gwl_json(['success' => true, 'id' => $id]);
}

function gwl_delete_by_id_admin($pdo, $config, $table, $id) {
  $claims = gwl_require_auth($config);
  gwl_require_role($claims, ['admin']);

  $allowed = ['events','event_media','impact_records','profiles','volunteer_applications','field_reports','help_me_campaigns'];
  if (!in_array($table, $allowed, true)) gwl_error('Invalid table', 400);

  $stmt = $pdo->prepare('DELETE FROM ' . $table . ' WHERE id = ?');
  $stmt->execute([$id]);
  gwl_json(['success' => true]);
}

function gwl_get_event_media($pdo, $eventId) {
  if (!$eventId) gwl_error('event_id required', 400);
  $stmt = $pdo->prepare('SELECT * FROM event_media WHERE event_id = ? ORDER BY created_at DESC');
  $stmt->execute([$eventId]);
  gwl_json($stmt->fetchAll());
}

function gwl_add_event_media($pdo, $config, $data) {
  $claims = gwl_require_auth($config);
  gwl_require_role($claims, ['admin', 'staff']);

  $id = bin2hex(random_bytes(16));
  $stmt = $pdo->prepare('INSERT INTO event_media (id, event_id, media_url, media_type, title) VALUES (?, ?, ?, ?, ?)');
  $stmt->execute([
    $id,
    (string)($data['event_id'] ?? ''),
    (string)($data['media_url'] ?? ''),
    (string)($data['media_type'] ?? 'image'),
    (string)($data['title'] ?? ''),
  ]);
  gwl_json(['success' => true, 'id' => $id]);
}

function gwl_add_impact($pdo, $config, $data) {
  $claims = gwl_require_auth($config);
  gwl_require_role($claims, ['admin', 'staff']);

  $id = bin2hex(random_bytes(16));
  $stmt = $pdo->prepare('INSERT INTO impact_records (id, type, title, content, media_url, thumbnail_url, category, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  $stmt->execute([
    $id,
    (string)($data['type'] ?? 'story'),
    (string)($data['title'] ?? ''),
    (string)($data['content'] ?? ''),
    (string)($data['media_url'] ?? ''),
    (string)($data['thumbnail_url'] ?? ''),
    (string)($data['category'] ?? 'general'),
    !empty($data['is_featured']) ? 1 : 0,
  ]);
  gwl_json(['success' => true, 'id' => $id]);
}

function gwl_update_me($pdo, $config, $data) {
  $claims = gwl_require_auth($config);
  $id = (string)$claims['uid'];

  $allowedFields = ['full_name','location','phone','department','position','bio','avatar_url'];
  $fields = [];
  $params = [];
  foreach ($allowedFields as $key) {
    if (array_key_exists($key, $data)) {
      $fields[] = $key . ' = ?';
      $params[] = $data[$key];
    }
  }
  if (!$fields) gwl_json(['success' => true, 'message' => 'No changes']);

  $params[] = $id;
  $sql = 'UPDATE profiles SET ' . implode(', ', $fields) . ' WHERE id = ?';
  $stmt = $pdo->prepare($sql);
  $stmt->execute($params);

  $stmt = $pdo->prepare('SELECT id, email, full_name, role, location, phone, department, position, bio, avatar_url, created_at, updated_at FROM profiles WHERE id = ? LIMIT 1');
  $stmt->execute([$id]);
  $me = $stmt->fetch();

  gwl_json(['success' => true, 'user' => $me]);
}

function gwl_update_profile_admin($pdo, $config, $data) {
  $claims = gwl_require_auth($config);
  gwl_require_role($claims, ['admin']);

  $id = (string)($data['id'] ?? '');
  if (!$id) gwl_error('id required', 400);

  $allowedFields = ['full_name','role','location','phone','department','position','bio','avatar_url'];
  $fields = [];
  $params = [];
  foreach ($allowedFields as $key) {
    if (array_key_exists($key, $data)) {
      $fields[] = $key . ' = ?';
      $params[] = $data[$key];
    }
  }
  if (!$fields) gwl_json(['success' => true, 'message' => 'No changes']);
  $params[] = $id;
  $sql = 'UPDATE profiles SET ' . implode(', ', $fields) . ' WHERE id = ?';
  $stmt = $pdo->prepare($sql);
  $stmt->execute($params);
  gwl_json(['success' => true]);
}

function gwl_update_volunteer_status($pdo, $config, $data) {
  $claims = gwl_require_auth($config);
  gwl_require_role($claims, ['admin','staff']);

  $id = (string)($data['id'] ?? '');
  $status = (string)($data['status'] ?? '');
  if (!$id || !$status) gwl_error('id and status required', 400);

  $stmt = $pdo->prepare('UPDATE volunteer_applications SET status = ? WHERE id = ?');
  $stmt->execute([$status, $id]);
  gwl_json(['success' => true]);
}

function gwl_add_field_report($pdo, $config, $data) {
  $claims = gwl_require_auth($config);
  gwl_require_role($claims, ['admin','staff']);

  $id = bin2hex(random_bytes(16));
  $stmt = $pdo->prepare('INSERT INTO field_reports (id, title, summary, full_report, beneficiaries, location, category, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  $stmt->execute([
    $id,
    (string)($data['title'] ?? ''),
    (string)($data['summary'] ?? ''),
    (string)($data['full_report'] ?? ''),
    (int)($data['beneficiaries'] ?? 0),
    (string)($data['location'] ?? ''),
    (string)($data['category'] ?? ''),
    (string)($data['status'] ?? 'draft'),
  ]);
  gwl_json(['success' => true, 'id' => $id]);
}

function gwl_update_field_report($pdo, $config, $data) {
  $claims = gwl_require_auth($config);
  gwl_require_role($claims, ['admin','staff']);

  $id = (string)($data['id'] ?? '');
  if (!$id) gwl_error('Report ID required', 400);

  $stmt = $pdo->prepare('UPDATE field_reports SET title = ?, summary = ?, full_report = ?, beneficiaries = ?, location = ?, category = ?, status = ? WHERE id = ?');
  $stmt->execute([
    (string)($data['title'] ?? ''),
    (string)($data['summary'] ?? ''),
    (string)($data['full_report'] ?? ''),
    (int)($data['beneficiaries'] ?? 0),
    (string)($data['location'] ?? ''),
    (string)($data['category'] ?? ''),
    (string)($data['status'] ?? 'draft'),
    $id,
  ]);
  gwl_json(['success' => true]);
}

function gwl_upload_media($config) {
  $claims = gwl_require_auth($config);
  gwl_require_role($claims, ['admin','staff']);

  if (!isset($_FILES['file'])) gwl_error('No file uploaded', 400);
  if ($_FILES['file']['error'] !== UPLOAD_ERR_OK) gwl_error('Upload error', 400);

  $maxBytes = 10 * 1024 * 1024;
  if (($_FILES['file']['size'] ?? 0) > $maxBytes) gwl_error('File too large (max 10MB)', 400);

  $tmp = $_FILES['file']['tmp_name'];
  $finfo = new finfo(FILEINFO_MIME_TYPE);
  $mime = $finfo->file($tmp);

  $allowed = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
    'image/gif' => 'gif',
    'video/mp4' => 'mp4',
  ];
  if (!isset($allowed[$mime])) gwl_error('Unsupported file type', 400, ['mime' => $mime]);

  $targetDir = __DIR__ . '/../uploads';
  if (!is_dir($targetDir)) {
    if (!mkdir($targetDir, 0755, true)) gwl_error('Failed to create uploads directory', 500);
  }

  $name = bin2hex(random_bytes(16)) . '.' . $allowed[$mime];
  $dest = $targetDir . '/' . $name;
  if (!move_uploaded_file($tmp, $dest)) gwl_error('Failed to store file', 500);

  // Public URL: assumes uploads is at /uploads in web root
  gwl_json(['url' => '/uploads/' . $name]);
}

function gwl_submit_volunteer_application($pdo, $data) {
  // Public endpoint
  $id = bin2hex(random_bytes(16));
  $fullName = trim((string)($data['full_name'] ?? ''));
  $email = trim((string)($data['email'] ?? ''));
  $phone = trim((string)($data['phone'] ?? ''));
  $interest = trim((string)($data['interest_area'] ?? ''));
  $bio = (string)($data['bio'] ?? '');

  if (!$fullName || !$email) gwl_error('Full name and email are required', 400);

  $stmt = $pdo->prepare('INSERT INTO volunteer_applications (id, full_name, email, phone, interest_area, bio, status) VALUES (?, ?, ?, ?, ?, ?, ?)');
  $stmt->execute([$id, $fullName, $email, $phone, $interest, $bio, 'pending']);

  gwl_json(['success' => true, 'id' => $id]);
}

function gwl_forgot_password($pdo, $config, $data) {
  $email = trim((string)($data['email'] ?? ''));
  if (!$email) gwl_error('Email is required', 400);

  // Always respond success to avoid account enumeration
  $stmt = $pdo->prepare('SELECT id, full_name FROM profiles WHERE email = ? LIMIT 1');
  $stmt->execute([$email]);
  $user = $stmt->fetch();

  if (!$user) {
    gwl_json(['success' => true, 'message' => 'If an account exists, a link has been sent.']);
  }

  $token = bin2hex(random_bytes(16));
  $expires = date('Y-m-d H:i:s', time() + (30 * 60));
  $stmt = $pdo->prepare('REPLACE INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)');
  $stmt->execute([$email, $token, $expires]);

  $appUrl = (string)($config['APP_URL'] ?? '');
  $resetLink = rtrim($appUrl, '/') . '/auth?mode=reset&token=' . urlencode($token);

  $isProd = (($config['APP_ENV'] ?? 'development') === 'production');
  if (!$isProd) {
    gwl_json(['success' => true, 'message' => 'Reset link generated (dev mode).', 'debug_link' => $resetLink]);
  }

  // Production: send email via mail()
  $subject = 'Reset your Giving Without Limit password';
  $body = "<p>Hello,</p><p>Click to reset your password:</p><p><a href=\"{$resetLink}\">Reset Password</a></p><p>This link expires in 30 minutes.</p>";
  $headers = "MIME-Version: 1.0\r\n";
  $headers .= "Content-type:text/html;charset=UTF-8\r\n";
  $headers .= "From: Giving Without Limit <no-reply@" . ($_SERVER['HTTP_HOST'] ?? 'localhost') . ">\r\n";

  @mail($email, $subject, $body, $headers);

  gwl_json(['success' => true, 'message' => 'If an account exists, a link has been sent.']);
}

function gwl_reset_password($pdo, $data) {
  $token = (string)($data['token'] ?? '');
  $password = (string)($data['password'] ?? '');
  if (!$token || !$password) gwl_error('Token and password are required', 400);
  if (strlen($password) < 8) gwl_error('Password must be at least 8 characters', 400);

  $stmt = $pdo->prepare('SELECT email FROM password_resets WHERE token = ? AND expires_at > NOW() LIMIT 1');
  $stmt->execute([$token]);
  $row = $stmt->fetch();
  if (!$row) gwl_error('Invalid or expired reset token', 400);

  $hash = password_hash($password, PASSWORD_DEFAULT);
  $stmt = $pdo->prepare('UPDATE profiles SET password_hash = ? WHERE email = ?');
  $stmt->execute([$hash, $row['email']]);

  $stmt = $pdo->prepare('DELETE FROM password_resets WHERE token = ?');
  $stmt->execute([$token]);

  gwl_json(['success' => true]);
}

function gwl_submit_ai_lead($pdo, $data) {
  // Public endpoint; sanitize & store.
  $id = bin2hex(random_bytes(16));
  $type = (string)($data['type'] ?? 'donation');
  $name = (string)($data['full_name'] ?? '');
  $email = (string)($data['email'] ?? '');
  $amount = (string)($data['amount'] ?? '');
  $program = (string)($data['program_info'] ?? '');

  $stmt = $pdo->prepare('INSERT INTO ai_leads (id, type, full_name, email, amount, program_info) VALUES (?, ?, ?, ?, ?, ?)');
  $stmt->execute([$id, $type, $name, $email, $amount, $program]);

  gwl_json(['success' => true, 'id' => $id]);
}
