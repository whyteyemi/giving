<?php
$host = "localhost";
$db_name = "giving without limit";
$username = "root";
$password = "";

echo "--- GIVING WITHOUT LIMIT: Local Account Setup ---\n";

try {
    // Connect without db name first to create it if needed
    $conn = new PDO("mysql:host=$host", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // 1. Create Database if missing
    echo "[1/4] Checking database '$db_name'...\n";
    $conn->exec("CREATE DATABASE IF NOT EXISTS `$db_name` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    
    // 2. Connect to the specific DB
    $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 3. Create Profiles Table if missing
    echo "[2/4] Checking 'profiles' table...\n";
    $sql = "CREATE TABLE IF NOT EXISTS profiles (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        role VARCHAR(20) DEFAULT 'user',
        location VARCHAR(100),
        phone VARCHAR(20),
        department VARCHAR(50),
        position VARCHAR(50),
        bio TEXT,
        avatar_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )";
    $conn->exec($sql);

    // 4. Create password_resets Table if missing
    echo "[3/4] Checking 'password_resets' table...\n";
    $conn->exec("CREATE TABLE IF NOT EXISTS password_resets (
        email VARCHAR(255) PRIMARY KEY,
        token VARCHAR(255) NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    // 5. Reset Admin Account
    echo "[4/4] Resetting account 'osabiyemi@yahoo.com'...\n";
    $email = 'osabiyemi@yahoo.com';
    $plain_password = 'Admin@123'; // NEW PASSWORD
    $hash = password_hash($plain_password, PASSWORD_DEFAULT);
    $id = bin2hex(random_bytes(16));

    $stmt = $conn->prepare("SELECT id FROM profiles WHERE email = ?");
    $stmt->execute([$email]);
    $existing = $stmt->fetch();

    if ($existing) {
        $stmt = $conn->prepare("UPDATE profiles SET password_hash = ?, role = 'admin' WHERE email = ?");
        $stmt->execute([$hash, $email]);
        echo ">>> SUCCESS: Account 'osabiyemi@yahoo.com' updated with new password.\n";
    } else {
        $stmt = $conn->prepare("INSERT INTO profiles (id, email, password_hash, full_name, role) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$id, $email, $hash, 'Admin User', 'admin']);
        echo ">>> SUCCESS: Account 'osabiyemi@yahoo.com' created with power role.\n";
    }

    echo "\n------------------------------------------------\n";
    echo "YOU CAN NOW LOG IN WITH:\n";
    echo "Email: $email\n";
    echo "Password: $plain_password\n";
    echo "------------------------------------------------\n";

} catch (PDOException $e) {
    if (strpos($e->getMessage(), "refused") !== false || strpos($e->getMessage(), "2002") !== false) {
        echo "\n[CRITICAL ERROR] MySQL is not running! \n>>> PLEASE START MYSQL IN XAMPP FIRST.\n";
    } else {
        echo "\n[ERROR] " . $e->getMessage() . "\n";
    }
}
?>
