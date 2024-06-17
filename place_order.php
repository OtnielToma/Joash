<?php
session_start();
include 'db.php'; // Include your database connection file

header('Content-Type: application/json'); // Ensure the response is in JSON format

// Enable error logging for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    try {
        // Log POST data for debugging
        file_put_contents('order_debug.log', "POST Data: " . print_r($_POST, true) . "\n", FILE_APPEND);
        file_put_contents('order_debug.log', "FILES Data: " . print_r($_FILES, true) . "\n", FILE_APPEND);

        // Collect order data from the form
        $shipping_name = $_POST['shipping-name'];
        $shipping_address = $_POST['shipping-address'];
        $shipping_city = $_POST['shipping-city'];
        $shipping_zip = $_POST['shipping-zip'];
        $shipping_method = $_POST['shipping-method'];
        $cart = json_decode($_POST['cart'], true); // Assuming cart is sent as a JSON string

        // Debugging: Output the cart data
        error_log(print_r($cart, true));
        file_put_contents('order_debug.log', "Cart Data: " . print_r($cart, true) . "\n", FILE_APPEND);

        // Calculate total function
        function calculateTotal($cart) {
            $total = 0;
            foreach ($cart as $item) {
                $total += $item['price'] * $item['quantity'];
            }
            return $total;
        }

        // Validate cart data function
        function validateCartData($cart) {
            foreach ($cart as $item) {
                if (!isset($item['id']) || !is_numeric($item['id'])) {
                    return 'Invalid product ID';
                }
                if (!isset($item['name']) || empty($item['name'])) {
                    return 'Product name is missing';
                }
                if (!isset($item['price']) || !is_numeric($item['price'])) {
                    return 'Invalid product price';
                }
                if (!isset($item['category']) || empty($item['category'])) {
                    return 'Product category is missing';
                }
                if (!isset($item['quantity']) || !is_numeric($item['quantity'])) {
                    return 'Invalid product quantity';
                }
                if (!isset($item['size']) || empty($item['size'])) {
                    return 'Product size is missing';
                }
            }
            return true;
        }

        // Validate cart data
        $validationResult = validateCartData($cart);
        if ($validationResult !== true) {
            echo json_encode(['success' => false, 'message' => $validationResult]);
            file_put_contents('order_debug.log', "Validation error: " . $validationResult . "\n", FILE_APPEND);
            exit;
        }

        // Insert the order into the database
        $query = "INSERT INTO orders (user_id, total_price, order_date, shipping_name, shipping_address, shipping_city, shipping_zip, shipping_method) VALUES (?, ?, NOW(), ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            throw new Exception('Database prepare error: ' . $conn->error);
        }

        $total = calculateTotal($cart);
        $stmt->bind_param("idsssss", $user_id, $total, $shipping_name, $shipping_address, $shipping_city, $shipping_zip, $shipping_method);

        if ($stmt->execute()) {
            $orderId = $stmt->insert_id;
            file_put_contents('order_debug.log', "Order inserted: Order ID: " . $orderId . "\n", FILE_APPEND);

            // Insert order items
            foreach ($cart as $item) {
                $productId = $item['id'];
                $query = "SELECT id FROM products WHERE id = ?";
                $checkStmt = $conn->prepare($query);
                $checkStmt->bind_param("i", $productId);
                $checkStmt->execute();
                $result = $checkStmt->get_result();
                if ($result->num_rows === 0) {
                    throw new Exception('Invalid product ID: ' . $productId);
                }

                $size = isset($item['size']) ? $item['size'] : 'N/A'; // Default to 'N/A' if size is not set

                $query = "INSERT INTO order_details (order_id, product_id, quantity, price, size) VALUES (?, ?, ?, ?, ?)";
                $stmt = $conn->prepare($query);
                if (!$stmt) {
                    throw new Exception('Database prepare error: ' . $conn->error);
                }
                $stmt->bind_param("iiids", $orderId, $item['id'], $item['quantity'], $item['price'], $size);
                if (!$stmt->execute()) {
                    throw new Exception('Database execute error: ' . $stmt->error);
                }
            }

            // Fetch the recipient email from the users table
            $query = "SELECT email FROM users WHERE id = ?";
            $stmt = $conn->prepare($query);
            if (!$stmt) {
                throw new Exception('Database prepare error: ' . $conn->error);
            }
            $stmt->bind_param("i", $user_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $user = $result->fetch_assoc();
            $recipient_email = $user['email'];

            // Create the email content
            $items_table = '';
            foreach ($cart as $item) {
                $items_table .= "<tr>
                                    <td>{$item['name']}</td>
                                    <td>{$item['size']}</td>
                                    <td>{$item['quantity']}</td>
                                    <td>{$item['price']} Lei</td>
                                    <td>" . ($item['price'] * $item['quantity']) . " Lei</td>
                                 </tr>";
            }

            // Call Node.js script to send email
            $nodeScript = 'sendEmail.js';
            $command = "node $nodeScript " . escapeshellarg($recipient_email) . " " . escapeshellarg($orderId) . " " . escapeshellarg($items_table) . " " . escapeshellarg($total) . " " . escapeshellarg($shipping_name) . " " . escapeshellarg($shipping_address) . " " . escapeshellarg($shipping_city) . " " . escapeshellarg($shipping_zip) . " " . escapeshellarg($shipping_method);
            file_put_contents('order_debug.log', "Executing command: $command\n", FILE_APPEND);
            exec($command, $output, $return_var);
            file_put_contents('order_debug.log', "Output: " . implode("\n", $output) . "\nReturn var: $return_var\n", FILE_APPEND);
            if ($return_var !== 0) {
                throw new Exception('Error sending email: ' . implode("\n", $output));
            }

            echo json_encode(['success' => true, 'order_id' => $orderId]);
        } else {
            throw new Exception('Failed to place order: ' . $stmt->error);
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        file_put_contents('order_debug.log', "Error: " . $e->getMessage() . "\n", FILE_APPEND);
    }
}
?>
