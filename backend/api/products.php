<?php
require_once '../config/database.php';
require_once '../config/helpers.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
$request_uri = $_SERVER['REQUEST_URI'];
$uri_parts = explode('/', trim(parse_url($request_uri, PHP_URL_PATH), '/'));
$product_id = isset($uri_parts[3]) ? $uri_parts[3] : null;

switch($method) {
    case 'GET':
        if ($product_id) {
            // Get single product
            $query = "SELECT * FROM products WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $product_id);
            $stmt->execute();
            
            $product = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($product) {
                $product['images'] = json_decode($product['images']);
                $product['details'] = json_decode($product['details']);
                sendResponse(200, $product);
            } else {
                sendResponse(404, ['error' => 'Product not found']);
            }
        } else {
            // Get all products
            $query = "SELECT * FROM products ORDER BY created_at ASC";
            $stmt = $db->prepare($query);
            $stmt->execute();
            
            $products = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $row['images'] = json_decode($row['images']);
                $row['details'] = json_decode($row['details']);
                $products[] = $row;
            }
            sendResponse(200, $products);
        }
        break;
        
    case 'POST':
        verifyToken();
        $data = json_decode(file_get_contents("php://input"));
        
        if (!$data->name || !$data->price || !$data->category || !$data->image) {
            sendResponse(400, ['error' => 'Missing required fields']);
        }
        
        $id = generateUUID();
        $query = "INSERT INTO products (id, name, price, category, image, images, description, details) 
                  VALUES (:id, :name, :price, :category, :image, :images, :description, :details)";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':name', $data->name);
        $stmt->bindParam(':price', $data->price);
        $stmt->bindParam(':category', $data->category);
        $stmt->bindParam(':image', $data->image);
        $images = json_encode($data->images ?? []);
        $stmt->bindParam(':images', $images);
        $stmt->bindParam(':description', $data->description);
        $details = json_encode($data->details ?? []);
        $stmt->bindParam(':details', $details);
        
        if ($stmt->execute()) {
            sendResponse(201, ['id' => $id, 'message' => 'Product created']);
        } else {
            sendResponse(500, ['error' => 'Failed to create product']);
        }
        break;
        
    case 'PUT':
        verifyToken();
        if (!$product_id) {
            sendResponse(400, ['error' => 'Product ID required']);
        }
        
        $data = json_decode(file_get_contents("php://input"));
        
        $query = "UPDATE products SET name = :name, price = :price, category = :category, 
                  image = :image, images = :images, description = :description, details = :details 
                  WHERE id = :id";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $product_id);
        $stmt->bindParam(':name', $data->name);
        $stmt->bindParam(':price', $data->price);
        $stmt->bindParam(':category', $data->category);
        $stmt->bindParam(':image', $data->image);
        $images = json_encode($data->images ?? []);
        $stmt->bindParam(':images', $images);
        $stmt->bindParam(':description', $data->description);
        $details = json_encode($data->details ?? []);
        $stmt->bindParam(':details', $details);
        
        if ($stmt->execute()) {
            sendResponse(200, ['message' => 'Product updated']);
        } else {
            sendResponse(500, ['error' => 'Failed to update product']);
        }
        break;
        
    case 'DELETE':
        verifyToken();
        if (!$product_id) {
            sendResponse(400, ['error' => 'Product ID required']);
        }
        
        $query = "DELETE FROM products WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $product_id);
        
        if ($stmt->execute()) {
            sendResponse(200, ['message' => 'Product deleted']);
        } else {
            sendResponse(500, ['error' => 'Failed to delete product']);
        }
        break;
        
    default:
        sendResponse(405, ['error' => 'Method not allowed']);
}
