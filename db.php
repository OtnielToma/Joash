<?php
$servername = "localhost";
$username = "app_user"; // Replace with your new MySQL username
$password = "secure_password"; // Replace with your new MySQL password
$dbname = "clothing_shop";
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
