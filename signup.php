<?php
include 'db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = filter_var($_POST['name'], FILTER_SANITIZE_SPECIAL_CHARS);
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $password = $_POST['password'];
    $phone = $_POST['phone'];

    // Email validation
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email format']);
        exit;
    }

    // Phone number validation
    if (!preg_match('/^\+?[0-9]\d{10,14}$/', $phone)) {
        echo json_encode(['success' => false, 'message' => 'Invalid phone number format']);
        exit;
    }

    // Password validation (at least 8 characters, one letter, one number)
    if (strlen($password) < 8 || !preg_match('/[A-Za-z]/', $password) || !preg_match('/[0-9]/', $password)) {
        echo json_encode(['success' => false, 'message' => 'Password must be at least 8 characters long and contain both letters and numbers']);
        exit;
    }

    // Check if the email is already registered
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows > 0) {
        $stmt->close();
        $conn->close();
        echo json_encode(['success' => false, 'message' => 'This email is already registered']);
        exit;
    }
    $stmt->close();

    $hashed_password = password_hash($password, PASSWORD_BCRYPT);
    $verification_code = rand(100000, 999999); 

    if ($stmt = $conn->prepare("INSERT INTO users (name, email, password, phone, verification_code) VALUES (?, ?, ?, ?, ?)")) {
        $stmt->bind_param("ssssi", $name, $email, $hashed_password, $phone, $verification_code);
        if ($stmt->execute()) {
            $stmt->close();
            $conn->close();

            $command = escapeshellcmd("node send_verification_email.js $email $verification_code");
            shell_exec($command);

            echo json_encode(['success' => true]);
            exit;
        } else {
            error_log('Database error: ' . $stmt->error);
            $stmt->close();
            $conn->close();
            echo json_encode(['success' => false, 'message' => 'Database error']);
            exit;
        }
    } else {
        error_log('Prepare statement failed: ' . $conn->error);
        $conn->close();
        echo json_encode(['success' => false, 'message' => 'Database error']);
        exit;
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit;
}
?>
