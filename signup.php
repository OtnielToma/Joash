<?php
include 'db.php';

header('Content-Type: application/json'); // Set the header to return JSON

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = filter_var($_POST['name'], FILTER_SANITIZE_SPECIAL_CHARS);
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $password = $_POST['password'];
    $phone = $_POST['phone'];

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email format']);
        exit;
    }

    // Check if the email already exists
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

    if ($stmt = $conn->prepare("INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)")) {
        $stmt->bind_param("ssss", $name, $email, $hashed_password, $phone);
        if ($stmt->execute()) {
            $stmt->close();
            $conn->close();
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
