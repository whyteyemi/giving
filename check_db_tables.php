<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

$host = "localhost";
$db_name = "asa";
$username = "root";
$password = "";

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $stmt = $conn->query("DESCRIBE profiles");
    $desc = $stmt->fetchAll(PDO::FETCH_ASSOC);
    print_r($desc);
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
