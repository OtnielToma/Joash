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

    $stmt = $conn->prepare("SELECT id, name, password, is_verified, verification_code FROM users WHERE email = ?");
    if ($stmt === false) {
        $response['message'] = 'Database error';
        error_log('Prepare statement failed: ' . $conn->error);
        echo json_encode($response);
        exit;
    }
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($user_id, $username, $hashed_password, $is_verified, $verification_code);
    $stmt->fetch();

    if ($stmt->num_rows > 0) {
        if (password_verify($password, $hashed_password)) {
            if ($is_verified == 1) {
                $_SESSION['loggedin'] = true;
                $_SESSION['username'] = $username;
                $_SESSION['user_id'] = $user_id;

                $response['success'] = true;
                $response['userName'] = $username;
                $response['message'] = 'Login successful';
            } else {
                if (is_null($verification_code)) {
                    // Generate a new verification code
                    $verification_code = rand(100000, 999999);
                    $stmt = $conn->prepare("UPDATE users SET verification_code = ? WHERE email = ?");
                    if ($stmt === false) {
                        $response['message'] = 'Database error';
                        error_log('Prepare statement failed: ' . $conn->error);
                        echo json_encode($response);
                        exit;
                    }
                    $stmt->bind_param("is", $verification_code, $email);
                    $stmt->execute();

                    // Call Node.js script to send verification email
                    $command = escapeshellcmd("node send_verification_email.js $email $verification_code");
                    shell_exec($command);

                    $response['message'] = 'Verification code sent. Please check your email.';
                } else {
                    $response['message'] = 'Account not verified. Please enter the verification code sent to your email.';
                }
                $response['is_verified'] = false;
            }
        } else {
            $response['message'] = 'Invalid email or password';
        }
    } else {
        $response['message'] = 'Invalid email or password';
    }

    $stmt->close();
    $conn->close();
} else {
    $response['message'] = 'Invalid request method';
}

echo json_encode($response);
?>
