<?php
include 'db.php'; // Include your database connection file

if (isset($_GET['order_id'])) {
    $orderId = intval($_GET['order_id']);

    // Fetch order details
    $query = "SELECT id, total_price, order_date FROM orders WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $orderId);
    $stmt->execute();
    $result = $stmt->get_result();
    $order = $result->fetch_assoc();

    // Fetch order items
    $query = "SELECT products.name, order_details.quantity, order_details.price, order_details.size 
              FROM order_details 
              JOIN products ON order_details.product_id = products.id 
              WHERE order_details.order_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $orderId);
    $stmt->execute();
    $result = $stmt->get_result();
    $items = $result->fetch_all(MYSQLI_ASSOC);

    $order['items'] = $items;
    echo json_encode($order);
}
?>
