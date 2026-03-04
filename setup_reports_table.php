<?php
$host = "localhost";
$db_name = "giving without limit";
$username = "root";
$password = "";

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create the table
    $sql = "CREATE TABLE IF NOT EXISTS field_reports (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        summary TEXT,
        full_report LONGTEXT,
        beneficiaries INT DEFAULT 0,
        location VARCHAR(255),
        category VARCHAR(100),
        status ENUM('draft', 'internal', 'released') DEFAULT 'draft',
        author_id VARCHAR(36),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )";
    $conn->exec($sql);
    echo "Table 'field_reports' created/verified.\n";

    // Insert seeds if empty
    $stmt = $conn->query("SELECT COUNT(*) FROM field_reports");
    if ($stmt->fetchColumn() == 0) {
        $seeds = "INSERT INTO field_reports (id, title, summary, full_report, beneficiaries, location, category, status) VALUES 
            (UUID(), 'Widows Support Q1 - Lagos', 'Supporting 50 widows in the Ikorodu area with essential food items and micro-grants.', 'Full detailed report with expenditure tracking for Q1 2024 operations in Lagos state...', 50, 'Ikorodu, Lagos', 'Widow Support', 'released'),
            (UUID(), 'Feeding Program - Ibadan Hub', 'Daily meal distribution report for the Ibadan community hub.', 'Detailed breakdown of nutritional intake and attendance for the past month...', 450, 'Ibadan, Oyo', 'Feeding Program', 'internal'),
            (UUID(), 'Educational Hub Launch - Abuja', 'Preliminary report on the new educational resource center in Abuja.', 'Infrastructure status and curriculum planning results for the Abuja North hub...', 120, 'Abuja, FCT', 'Education', 'draft')";
        $conn->exec($seeds);
        echo "Seed data inserted.\n";
    }

} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
