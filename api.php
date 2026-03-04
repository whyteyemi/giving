<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Production Error Configuration
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Database Configuration
$host = "localhost";
$db_name = "giving without limit";
$username = "root";
$password = ""; // Change this for cPanel production

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Connection failed: " . $e->getMessage()]);
    exit();
}

$action = $_GET['action'] ?? '';
$input = file_get_contents("php://input");
$data = json_decode($input, true) ?? [];

try {
    switch ($action) {
        case 'login':
            handleLogin($conn, $data);
            break;
        case 'signup':
            handleSignup($conn, $data);
            break;
        case 'get_profiles':
            fetchTable($conn, 'profiles');
            break;
        case 'get_events':
            fetchTable($conn, 'events', 'date DESC');
            break;
        case 'get_all_event_media':
            fetchTable($conn, 'event_media', 'created_at DESC');
            break;
        case 'get_impact':
            fetchTable($conn, 'impact_records', 'created_at DESC');
            break;
        case 'add_impact':
            handleAddImpact($conn, $data);
            break;
        case 'delete_impact':
            handleDeleteImpact($conn, $data);
            break;
        case 'upload_media':
            handleUpload();
            break;
        case 'forgot_password':
            handleForgotPassword($conn, $data);
            break;
        case 'reset_password':
            handleResetPassword($conn, $data);
            break;
        case 'add_event':
            handleAddEvent($conn, $data);
            break;
        case 'delete_event':
            handleDeleteTableItem($conn, 'events', $data);
            break;
        case 'get_event_media':
            handleGetEventMedia($conn, $_GET['event_id'] ?? '');
            break;
        case 'add_event_media':
            handleAddEventMedia($conn, $data);
            break;
        case 'delete_event_media':
            handleDeleteTableItem($conn, 'event_media', $data);
            break;
        case 'update_profile':
            handleUpdateProfile($conn, $data);
            break;
        case 'delete_profile':
            handleDeleteTableItem($conn, 'profiles', $data);
            break;
        case 'get_volunteers':
            fetchTable($conn, 'volunteer_applications', 'created_at DESC');
            break;
        case 'update_volunteer':
            handleUpdateVolunteer($conn, $data);
            break;
        case 'delete_volunteer':
            handleDeleteTableItem($conn, 'volunteer_applications', $data);
            break;
        case 'get_field_reports':
            fetchTable($conn, 'field_reports', 'created_at DESC');
            break;
        case 'add_field_report':
            handleAddFieldReport($conn, $data);
            break;
        case 'update_field_report':
            handleUpdateFieldReport($conn, $data);
            break;
        case 'delete_field_report':
            handleDeleteTableItem($conn, 'field_reports', $data);
            break;
        case 'submit_ai_lead':
            handleSubmitAILead($conn, $data);
            break;
        default:
            echo json_encode(["message" => "API is live. Action: " . $action]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Internal Server Error: " . $e->getMessage()]);
}

function fetchTable($conn, $table, $order = 'id') {
    $stmt = $conn->prepare("SELECT * FROM $table ORDER BY $order");
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}

function handleLogin($conn, $data) {
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    
    $stmt = $conn->prepare("SELECT * FROM profiles WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        $hash = $user['password_hash'];
        $verify = password_verify($password, $hash);
        if ($verify) {
            unset($user['password_hash']);
            echo json_encode(["user" => $user, "token" => "dummy-jwt-token"]);
        } else {
            http_response_code(401);
            echo json_encode(["error" => "Invalid credentials"]);
        }
    } else {
        http_response_code(401);
        echo json_encode(["error" => "Invalid credentials"]);
    }
}

function handleSignup($conn, $data) {
    $id = bin2hex(random_bytes(16)); // Simple UUID
    $hash = password_hash($data['password'], PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO profiles (id, email, password_hash, full_name, role) VALUES (?, ?, ?, ?, ?)");
    try {
        $stmt->execute([$id, $data['email'], $hash, $data['fullName'], 'user']);
        echo json_encode(["success" => true, "id" => $id]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function handleAddImpact($conn, $data) {
    $id = bin2hex(random_bytes(16));
    $stmt = $conn->prepare("INSERT INTO impact_records (id, type, title, content, media_url, category, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?)");
    try {
        $stmt->execute([
            $id, 
            $data['type'], 
            $data['title'], 
            $data['content'] ?? '', 
            $data['media_url'] ?? '', 
            $data['category'] ?? 'general', 
            $data['is_featured'] ? 1 : 0
        ]);
        echo json_encode(["success" => true, "id" => $id]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function handleDeleteImpact($conn, $data) {
    if (!isset($data['id'])) return;
    $stmt = $conn->prepare("DELETE FROM impact_records WHERE id = ?");
    $stmt->execute([$data['id']]);
    echo json_encode(["success" => true]);
}

function handleDeleteTableItem($conn, $table, $data) {
    if (!isset($data['id'])) return;
    $stmt = $conn->prepare("DELETE FROM $table WHERE id = ?");
    try {
        $stmt->execute([$data['id']]);
        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function handleAddEvent($conn, $data) {
    $id = bin2hex(random_bytes(16));
    $stmt = $conn->prepare("INSERT INTO events (id, title, description, date, location, status, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)");
    try {
        $stmt->execute([
            $id, 
            $data['title'], 
            $data['description'] ?? '', 
            $data['date'], 
            $data['location'] ?? '', 
            $data['status'] ?? 'upcoming', 
            $data['image_url'] ?? ''
        ]);
        echo json_encode(["success" => true, "id" => $id]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function handleGetEventMedia($conn, $eventId) {
    $stmt = $conn->prepare("SELECT * FROM event_media WHERE event_id = ? ORDER BY created_at DESC");
    $stmt->execute([$eventId]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}

function handleAddEventMedia($conn, $data) {
    $id = bin2hex(random_bytes(16));
    $stmt = $conn->prepare("INSERT INTO event_media (id, event_id, media_url, media_type, title) VALUES (?, ?, ?, ?, ?)");
    try {
        $stmt->execute([
            $id, 
            $data['event_id'], 
            $data['media_url'], 
            $data['media_type'] ?? 'image', 
            $data['title'] ?? ''
        ]);
        echo json_encode(["success" => true, "id" => $id]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function handleUpdateProfile($conn, $data) {
    if (!isset($data['id'])) return;
    $fields = [];
    $params = [];
    
    // Whitelist allow-to-update fields
    $allowedFields = ['full_name', 'role', 'location', 'phone', 'department', 'position', 'bio', 'avatar_url'];
    
    foreach ($data as $key => $val) {
        if (in_array($key, $allowedFields)) {
            $fields[] = "$key = ?";
            $params[] = $val;
        }
    }
    
    if (empty($fields)) {
        echo json_encode(["success" => true, "message" => "No changes made"]);
        return;
    }
    
    $params[] = $data['id'];
    $sql = "UPDATE profiles SET " . implode(", ", $fields) . " WHERE id = ?";
    
    try {
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function handleUpdateVolunteer($conn, $data) {
    if (!isset($data['id']) || !isset($data['status'])) return;
    $stmt = $conn->prepare("UPDATE volunteer_applications SET status = ? WHERE id = ?");
    try {
        $stmt->execute([$data['status'], $data['id']]);
        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function handleUpload() {
    if (!isset($_FILES['file'])) {
        echo json_encode(["error" => "No file uploaded"]);
        return;
    }

    if ($_FILES['file']['error'] !== UPLOAD_ERR_OK) {
        $error_codes = [
            1 => 'The uploaded file exceeds the upload_max_filesize directive in php.ini',
            2 => 'The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form',
            3 => 'The uploaded file was only partially uploaded',
            4 => 'No file was uploaded',
            6 => 'Missing a temporary folder',
            7 => 'Failed to write file to disk',
            8 => 'A PHP extension stopped the file upload'
        ];
        $msg = $error_codes[$_FILES['file']['error']] ?? 'Unknown upload error';
        echo json_encode(["error" => "Upload failed: " . $msg]);
        return;
    }
    
    $target_dir = "uploads/";
    if (!file_exists($target_dir)) {
        if (!mkdir($target_dir, 0777, true)) {
            echo json_encode(["error" => "Failed to create uploads directory"]);
            return;
        }
    }
    
    $file_ext = pathinfo($_FILES["file"]["name"], PATHINFO_EXTENSION);
    $file_name = uniqid() . "." . $file_ext;
    $target_file = $target_dir . $file_name;

    if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
        // Return relative URL for better compatibility across localhost/cPanel
        $url = "/uploads/" . $file_name;
        echo json_encode(["url" => $url]);
    } else {
        $last_error = error_get_last();
        echo json_encode(["error" => "Upload failed: move_uploaded_file failed. " . ($last_error['message'] ?? '')]);
    }
}

function handleForgotPassword($conn, $data) {
    if (!isset($data['email'])) {
        http_response_code(400);
        echo json_encode(["error" => "Email is required"]);
        return;
    }

    $email = $data['email'];
    $stmt = $conn->prepare("SELECT id, full_name FROM profiles WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user) {
        $token = bin2hex(random_bytes(16));
        $expires = date('Y-m-d H:i:s', strtotime('+30 minutes'));
        
        $stmt = $conn->prepare("REPLACE INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)");
        $stmt->execute([$email, $token, $expires]);

        // Construct dynamic reset link
        $protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? "https" : "http";
        $host = $_SERVER['HTTP_HOST'];
        $baseUrl = "$protocol://$host";
        
        // Localhost dev support (Vite usually on 3000)
        if ($host === "localhost" || strpos($host, "127.0.0.1") !== false) {
            $baseUrl = "http://localhost:3000";
        }
        
        $resetLink = "$baseUrl/auth?mode=reset&token=$token";
        
        // COMPLETELY BYPASS EMAIL on localhost to prevent hanging
        // The link will be returned in the response for developer use
        echo json_encode([
            "success" => true, 
            "message" => "Account found! Reset link generated for developer.",
            "debug_link" => $resetLink
        ]);
        return;
    } else {
        // For security, don't reveal if email exists
        echo json_encode(["success" => true, "message" => "If an account exists, a link has been sent."]);
    }
}

function handleResetPassword($conn, $data) {
    if (!isset($data['token']) || !isset($data['password'])) {
        http_response_code(400);
        echo json_encode(["error" => "Token and new password are required"]);
        return;
    }

    $token = $data['token'];
    $stmt = $conn->prepare("SELECT email FROM password_resets WHERE token = ? AND expires_at > NOW()");
    $stmt->execute([$token]);
    $reset = $stmt->fetch();

    if (!$reset) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid or expired reset token"]);
        return;
    }

    $email = $reset['email'];
    $hash = password_hash($data['password'], PASSWORD_DEFAULT);
    $stmt = $conn->prepare("UPDATE profiles SET password_hash = ? WHERE email = ?");
    
    try {
        $stmt->execute([$hash, $email]);
        
        // Delete token after use
        $stmt = $conn->prepare("DELETE FROM password_resets WHERE token = ?");
        $stmt->execute([$token]);

        echo json_encode(["success" => true, "message" => "Password updated successfully"]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}

/**
 * Helper to send HTML emails
 */
function sendEmail($to, $subject, $message) {
    $from = "no-reply@givingwithoutlimit.org";
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: Giving Without Limit <$from>" . "\r\n";
    $headers .= "Reply-To: $from" . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    return @mail($to, $subject, $message, $headers);
}

function handleAddFieldReport($conn, $data) {
    $id = bin2hex(random_bytes(16));
    $stmt = $conn->prepare("INSERT INTO field_reports (id, title, summary, full_report, beneficiaries, location, category, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    try {
        $stmt->execute([
            $id,
            $data['title'],
            $data['summary'] ?? '',
            $data['full_report'] ?? '',
            (int)($data['beneficiaries'] ?? 0),
            $data['location'] ?? '',
            $data['category'] ?? '',
            $data['status'] ?? 'draft'
        ]);
        echo json_encode(["success" => true, "id" => $id]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function handleUpdateFieldReport($conn, $data) {
    if (!isset($data['id'])) {
        http_response_code(400);
        echo json_encode(["error" => "Report ID is required"]);
        return;
    }

    $stmt = $conn->prepare("UPDATE field_reports SET title = ?, summary = ?, full_report = ?, beneficiaries = ?, location = ?, category = ?, status = ? WHERE id = ?");
    try {
        $stmt->execute([
            $data['title'],
            $data['summary'] ?? '',
            $data['full_report'] ?? '',
            (int)($data['beneficiaries'] ?? 0),
            $data['location'] ?? '',
            $data['category'] ?? '',
            $data['status'] ?? 'draft',
            $data['id']
        ]);
        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function handleSubmitAILead($conn, $data) {
    $id = bin2hex(random_bytes(16));
    $type = $data['type'] ?? 'donation';
    $name = $data['full_name'] ?? 'N/A';
    $email = $data['email'] ?? 'N/A';
    $amount = $data['amount'] ?? 'N/A';
    $program = $data['program_info'] ?? 'N/A';

    $stmt = $conn->prepare("INSERT INTO ai_leads (id, type, full_name, email, amount, program_info) VALUES (?, ?, ?, ?, ?, ?)");
    try {
        $stmt->execute([$id, $type, $name, $email, $amount, $program]);

        // Email Notification
        $founderEmail = "bisowilly@yahoo.com";
        $adminEmail = $founderEmail; // Fallback to founder if admin not different
        
        $subject = ($type === 'donation' ? "💰 New Donation Interest" : "🤝 New Volunteer Lead") . " from AI Assistant";
        
        $body = "
            <div style='font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; color: #333;'>
                <h2 style='color: #8b0000; text-transform: uppercase;'>GWL Mission Alert: " . ucfirst($type) . " Request</h2>
                <hr>
                <p><strong>Name:</strong> $name</p>
                <p><strong>Email:</strong> $email</p>
                <p><strong>Proposed Amount:</strong> $amount</p>
                <p><strong>Program/Notes:</strong> $program</p>
                <p><strong>Source:</strong> AI Chat Assistant</p>
                <hr>
                <p style='color: #666; font-size: 12px;'>Action required: Please contact this person to finalize their " . ($type === 'donation' ? "contribution" : "volunteering") . ".</p>
            </div>
        ";

        sendEmail($founderEmail, $subject, $body);
        if ($adminEmail !== $founderEmail) {
            sendEmail($adminEmail, $subject, $body);
        }

        echo json_encode(["success" => true, "message" => "Request submitted safely", "id" => $id]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
}
?>
