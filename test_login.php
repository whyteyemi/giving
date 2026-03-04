<?php
$host = "localhost";
$db_name = "asa";
$username = "root";
$password = "";

$conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$email = 'osabiyemi@yahoo.com';
$testPassword = 'test123';

// Fetch the stored hash
$stmt = $conn->prepare("SELECT id, email, password_hash, role FROM profiles WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

echo "=== DEBUG LOGIN TEST ===\n";
if ($user) {
    echo "User found: " . $user['email'] . "\n";
    echo "Role: " . $user['role'] . "\n";
    echo "Hash length: " . strlen($user['password_hash']) . "\n";
    echo "Hash (first 20): " . substr($user['password_hash'], 0, 20) . "\n";
    echo "Hash starts with \$2y\$: " . (strpos($user['password_hash'], '$2y$') === 0 ? 'YES' : 'NO') . "\n";
    
    $result = password_verify($testPassword, $user['password_hash']);
    echo "password_verify('$testPassword', hash): " . ($result ? 'SUCCESS' : 'FAIL') . "\n";
    
    // Also test with password123
    $result2 = password_verify('password123', $user['password_hash']);
    echo "password_verify('password123', hash): " . ($result2 ? 'SUCCESS' : 'FAIL') . "\n";
    
    // Generate a fresh known hash
    $newHash = password_hash('test123', PASSWORD_BCRYPT);
    echo "\nFresh hash for 'test123': $newHash\n";
    echo "Verify fresh hash: " . (password_verify('test123', $newHash) ? 'SUCCESS' : 'FAIL') . "\n";
    
} else {
    echo "NO USER FOUND for email: $email\n";
}
