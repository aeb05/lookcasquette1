<?php
require_once '../config/database.php';
require_once '../config/helpers.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
$request_uri = $_SERVER['REQUEST_URI'];
$uri_parts = explode('/', trim(parse_url($request_uri, PHP_URL_PATH), '/'));
$order_id = isset($uri_parts[3]) ? $uri_parts[3] : null;

switch($method) {
    case 'GET':
        verifyToken();
        $query = "SELECT * FROM orders ORDER BY created_at DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        
        $orders = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $row['items'] = json_decode($row['items']);
            $orders[] = $row;
        }
        sendResponse(200, $orders);
        break;
        
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        if (!$data->customer_name || !$data->customer_phone || !$data->customer_address || !$data->items || !$data->total) {
            sendResponse(400, ['error' => 'Missing required fields']);
        }
        
        // Check blacklist
        $query = "SELECT * FROM blacklist WHERE type = 'phone' AND value = :phone";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':phone', $data->customer_phone);
        $stmt->execute();
        if ($stmt->fetch()) {
            sendResponse(403, ['error' => 'Numéro bloqué']);
        }
        
        $id = generateUUID();
        $query = "INSERT INTO orders (id, customer_name, customer_phone, customer_city, customer_address, items, total) 
                  VALUES (:id, :customer_name, :customer_phone, :customer_city, :customer_address, :items, :total)";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':customer_name', $data->customer_name);
        $stmt->bindParam(':customer_phone', $data->customer_phone);
        $city = $data->customer_city ?? '';
        $stmt->bindParam(':customer_city', $city);
        $stmt->bindParam(':customer_address', $data->customer_address);
        $items = json_encode($data->items);
        $stmt->bindParam(':items', $items);
        $stmt->bindParam(':total', $data->total);
        
        if ($stmt->execute()) {
            sendResponse(201, ['id' => $id, 'message' => 'Order created']);
        } else {
            sendResponse(500, ['error' => 'Failed to create order']);
        }
        break;
        
    case 'PUT':
        verifyToken();
        if (!$order_id) {
            sendResponse(400, ['error' => 'Order ID required']);
        }
        
        $data = json_decode(file_get_contents("php://input"));
        
        if (!isset($data->status)) {
            sendResponse(400, ['error' => 'Status required']);
        }
        
        $query = "UPDATE orders SET status = :status WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $order_id);
        $stmt->bindParam(':status', $data->status);
        
        if ($stmt->execute()) {
            sendResponse(200, ['message' => 'Order updated']);
        } else {
            sendResponse(500, ['error' => 'Failed to update order']);
        }
        break;
        
    default:
        sendResponse(405, ['error' => 'Method not allowed']);
}
