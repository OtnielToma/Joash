<?php
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    echo json_encode(['loggedIn' => false]);
} else {
    echo json_encode(['loggedIn' => true, 'username' => $_SESSION['username']]);
}
?>
