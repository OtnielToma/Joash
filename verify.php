<?php
include 'db.php';
session_start();

ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);
ob_start();

header('Content-Type: application/json'); // Set the header to return JSON

$response = ['success' => false, 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $verification_code = intval($_POST['verification_code']);
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = 'Invalid email format';
        echo json_encode($response);
        exit;
    }

    // Check if the verification code matches
    $stmt = $conn->prepare("SELECT id, name FROM users WHERE email = ? AND verification_code = ?");
    if ($stmt === false) {
        $response['message'] = 'Prepare statement failed';
        error_log('Prepare statement failed: ' . $conn->error);
        echo json_encode($response);
        exit;
    }
    $stmt->bind_param("si", $email, $verification_code);
    $stmt->execute();
    $stmt->bind_result($user_id, $user_name);
    $stmt->store_result();
    if ($stmt->num_rows > 0) {
        $stmt->fetch();
        // Verification code matches, update user to set is_verified to true
        $stmt->close();
        $stmt = $conn->prepare("UPDATE users SET is_verified = 1 WHERE email = ?");
        if ($stmt === false) {
            $response['message'] = 'Prepare statement failed';
            error_log('Prepare statement failed: ' . $conn->error);
            echo json_encode($response);
            exit;
        }
        $stmt->bind_param("s", $email);
        if ($stmt->execute()) {
            // Start the session and set session variables
            $_SESSION['user_id'] = $user_id;
            $_SESSION['user_name'] = $user_name;
            $_SESSION['user_email'] = $email;
            $_SESSION['loggedin'] = true;

            $stmt->close();
            $conn->close();
            $response['success'] = true;
            echo json_encode($response);
            exit;
        } else {
            error_log('Database error: ' . $stmt->error);
            $stmt->close();
            $conn->close();
            $response['message'] = 'Database error';
            echo json_encode($response);
            exit;
        }
    } else {
        $stmt->close();
        $conn->close();
        $response['message'] = 'Invalid verification code';
        echo json_encode($response);
        exit;
    }
} else {
    $response['message'] = 'Invalid request';
    echo json_encode($response);
    exit;
}

$output = ob_get_clean();
if (!empty($output)) {
    error_log("Unexpected output: $output");
}
?>
