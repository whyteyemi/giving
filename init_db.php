<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

$host = "localhost";
$username = "root";
$password = "";

try {
    $conn = new PDO("mysql:host=$host", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $sql = file_get_contents('database/mysql_schema.sql');
    $conn->exec($sql);
    
    echo "Schema created.\n";
    
    // Switch to database
    $conn->exec("USE `giving without limit`");
    
    // Insert admin user
    $email = 'osabiyemi@yahoo.com';
    $password_hash = password_hash('Pass123$$', PASSWORD_DEFAULT);
    
    $stmt = $conn->prepare("INSERT INTO profiles (id, email, password_hash, full_name, role) VALUES ('admin-uuid-1', :email, :hash, 'Admin User', 'admin') ON CONFLICT DO NOTHING;");
    // Wait, MySQL uses ON DUPLICATE KEY UPDATE
    $stmt = $conn->prepare("INSERT INTO profiles (id, email, password_hash, full_name, role) VALUES ('admin-uuid-1', :email, :hash, 'Admin User', 'admin') ON DUPLICATE KEY UPDATE password_hash=:hash_upd, role='admin'");
    $stmt->execute(['email' => $email, 'hash' => $password_hash, 'hash_upd' => $password_hash]);
    
    echo "Admin user setup completed. Password: Pass123$$\n";

} catch(PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
