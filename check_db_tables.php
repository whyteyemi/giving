<?php
$host = "localhost";
$db_name = "giving without limit";
$username = "root";
$password = "";

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $stmt = $conn->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "Tables in 'giving without limit': " . count($tables) . "\n";
    echo implode(", ", $tables);
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
