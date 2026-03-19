<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

$host = "localhost";
$username = "root";
$password = "";

try {
    $conn = new PDO("mysql:host=$host", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $stmt = $conn->query("SHOW DATABASES;");
    $dbs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    file_put_contents('php_out.txt', print_r($dbs, true));
} catch(PDOException $e) {
    file_put_contents('php_out.txt', "Error: " . $e->getMessage());
}
?>
