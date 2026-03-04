<?php
$host = "localhost";
$db_name = "giving without limit";
$username = "root";
$password = "";

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $sql = "CREATE TABLE IF NOT EXISTS ai_leads (
        id VARCHAR(36) PRIMARY KEY,
        type ENUM('donation', 'volunteer') NOT NULL,
        full_name VARCHAR(255),
        email VARCHAR(255),
        amount VARCHAR(100),
        program_info TEXT,
        status VARCHAR(50) DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $conn->exec($sql);
    echo "Table 'ai_leads' created/verified.\n";
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
