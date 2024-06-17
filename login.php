<?php
session_start();
include 'db.php';
header('Content-Type: application/json');

$response = ['success' => false, 'message' => '', 'userName' => ''];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $password = $_POST['password'];

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = 'Invalid email format';
        echo json_encode($response);
        exit;
    }

    $stmt = $conn->prepare("SELECT id, name, password FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($user_id, $username, $hashed_password);
    $stmt->fetch();

    if ($stmt->num_rows > 0 && password_verify($password, $hashed_password)) {
        $_SESSION['loggedin'] = true;
        $_SESSION['username'] = $username;
        $_SESSION['user_id'] = $user_id;

        $response['success'] = true;
        $response['userName'] = $username;
        $response['message'] = 'Login successful';
    } else {
        $response['message'] = 'Invalid email or password';
    }

    $stmt->close();
    $conn->close();
}

echo json_encode($response);
?>
