<?php
session_start();
require 'db.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];

// Fetch user details
$userQuery = "SELECT name, email, phone FROM users WHERE id = ?";
$stmt = $conn->prepare($userQuery);
$stmt->bind_param('i', $user_id);
$stmt->execute();
$userResult = $stmt->get_result();
$user = $userResult->fetch_assoc();
$stmt->close();

if (!$user) {
    echo json_encode(['success' => false, 'message' => 'User not found']);
    exit;
}

// Fetch user orders
$orderQuery = "SELECT orders.id, orders.total_price, orders.order_date, 
                      orders.shipping_name, orders.shipping_address, orders.shipping_city, orders.shipping_zip, orders.shipping_method,
                      products.name AS product_name, order_details.quantity, order_details.price, order_details.size
               FROM orders
               JOIN order_details ON orders.id = order_details.order_id
               JOIN products ON order_details.product_id = products.id
               WHERE orders.user_id = ?";
$stmt = $conn->prepare($orderQuery);
$stmt->bind_param('i', $user_id);
$stmt->execute();
$result = $stmt->get_result();

$orders = [];
while ($row = $result->fetch_assoc()) {
    $orderId = $row['id'];
    if (!isset($orders[$orderId])) {
        $orders[$orderId] = [
            'id' => $orderId,
            'total_price' => $row['total_price'],
            'order_date' => $row['order_date'],
            'shipping_name' => $row['shipping_name'],
            'shipping_address' => $row['shipping_address'],
            'shipping_city' => $row['shipping_city'],
            'shipping_zip' => $row['shipping_zip'],
            'shipping_method' => $row['shipping_method'],
            'items' => []
        ];
    }
    $orders[$orderId]['items'][] = [
        'name' => $row['product_name'],
        'quantity' => $row['quantity'],
        'price' => $row['price'],
        'size' => $row['size']
    ];
}

echo json_encode([
    'success' => true,
    'user' => $user,
    'orders' => array_values($orders)
]);

$conn->close();
?>
