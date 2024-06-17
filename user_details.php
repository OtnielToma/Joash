<?php
session_start();
include 'db.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in.']);
    exit;
}

$user_id = $_SESSION['user_id'];

$orders_query = "SELECT id, total_price, order_date FROM orders WHERE user_id = $user_id";
$orders_result = mysqli_query($conn, $orders_query);

$orders = [];
while ($order = mysqli_fetch_assoc($orders_result)) {
    $order_id = $order['id'];
    $order_details_query = "SELECT od.quantity, od.price, p.name
                            FROM order_details od
                            JOIN products p ON od.product_id = p.id
                            WHERE od.order_id = $order_id";
    $order_details_result = mysqli_query($conn, $order_details_query);
    $items = [];
    while ($item = mysqli_fetch_assoc($order_details_result)) {
        $items[] = $item;
    }
    $order['items'] = $items;
    $orders[] = $order;
}

echo json_encode(['success' => true, 'orders' => $orders]);

mysqli_close($conn);
?>
