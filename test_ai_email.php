<?php
/**
 * GIVING WITHOUT LIMIT - AI ASSISTANT EMAIL TEST SCRIPT
 * This script bypasses the frontend to test the backend's ability 
 * to save leads and send email notifications.
 */

$host = "localhost";
$db_name = "giving without limit";
$username = "root";
$password = "";

echo "--- Starting Mission Alert Test ---\n";

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Mock data for the test
    $data = [
        'type' => 'donation',
        'full_name' => 'Test Runner (AI Mission System)',
        'email' => 'admin@test-lead.com',
        'amount' => '$1,000 (Test)',
        'program_info' => 'Automated Test Run for Mission Alerts'
    ];

    $id = bin2hex(random_bytes(16));
    $name = $data['full_name'];
    $email = $data['email'];
    $amount = $data['amount'];
    $program = $data['program_info'];
    $type = $data['type'];

    // 1. Save to Database
    $stmt = $conn->prepare("INSERT INTO ai_leads (id, type, full_name, email, amount, program_info) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$id, $type, $name, $email, $amount, $program]);
    echo "[DEBUG] Lead saved to database with ID: $id\n";

    // 2. Prepare Email
    $to = "bisowilly@yahoo.com";
    $subject = "🧪 TEST RUN: New Donation Interest from AI Assistant";
    
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: Giving Without Limit <no-reply@givingwithoutlimit.org>" . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    $body = "
        <div style='font-family: sans-serif; padding: 20px; border: 2px solid #8b0000; border-radius: 15px; color: #333;'>
            <h1 style='color: #8b0000;'>🧪 TEST SUCCESSFUL</h1>
            <p>Deaconess, this is a <strong>Test Run</strong> triggered by your AI Assistant to verify that your email notifications are working correctly.</p>
            <hr>
            <h2 style='color: #a1824a;'>Sample Lead Details:</h2>
            <p><strong>Name:</strong> $name</p>
            <p><strong>Email:</strong> $email</p>
            <p><strong>Proposed Amount:</strong> $amount</p>
            <p><strong>Program Interests:</strong> $program</p>
            <hr>
            <p style='color: #666; font-style: italic;'>If you are receiving this, your mission notification system is active and ready for visitors.</p>
        </div>
    ";

    // 3. Send Email
    echo "[DEBUG] Attempting to send email to: $to...\n";
    $sent = @mail($to, $subject, $body, $headers);

    if ($sent) {
        echo "[SUCCESS] Email function triggered successfully!\n";
        echo "[NOTE] If you are on localhost/XAMPP, check if your Sendmail/Mercury is configured.\n";
        echo "[NOTE] If on a live server (cPanel), check your '$to' inbox (and Spam folder).\n";
    } else {
        echo "[ERROR] PHP mail() function failed. This usually means a mail server is not configured on your local machine.\n";
    }

} catch(PDOException $e) {
    echo "[CRITICAL ERROR] Database connection failed: " . $e->getMessage() . "\n";
}

echo "--- Test Run Ended ---\n";
?>
