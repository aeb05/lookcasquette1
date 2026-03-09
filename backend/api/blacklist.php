<?php
require_once '../config/database.php';
require_once '../config/helpers.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
$request_uri = $_SERVER['REQUEST_URI'];
$uri_parts = explode('/', trim(parse_url($request_uri, PHP_URL_PATH), '/'));
$blacklist_id = isset($uri_parts[3]) ? $uri_parts[3] : null;

switch($method) {
    case 'GET':
        verifyToken();
        $query = "SELECT * FROM blacklist ORDER BY created_at DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        
        $blacklist = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $blacklist[] = $row;
        }
        sendResponse(200, $blacklist);
        break;
        
    case 'POST':
        verifyToken();
        $data = json_decode(file_get_contents("php://input"));
        
        if (!$data->type || !$data->value) {
            sendResponse(400, ['error' => 'Type and value required']);
        }
        
        // Check if already exists
        $query = "SELECT * FROM blacklist WHERE type = :type AND value = :value";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':type', $data->type);
        $stmt->bindParam(':value', $data->value);
        $stmt->execute();
        
        if ($stmt->fetch()) {
            sendResponse(409, ['error' => 'Already blacklisted']);
        }
        
        $id = generateUUID();
        $query = "INSERT INTO blacklist (id, type, value, reason) 
                  VALUES (:id, :type, :value, :reason)";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':type', $data->type);
        $stmt->bindParam(':value', $data->value);
        $reason = $data->reason ?? '';
        $stmt->bindParam(':reason', $reason);
        
        if ($stmt->execute()) {
            sendResponse(201, ['id' => $id, 'message' => 'Blacklisted']);
        } else {
            sendResponse(500, ['error' => 'Failed to blacklist']);
        }
        break;
        
    case 'DELETE':
        verifyToken();
        if (!$blacklist_id) {
            sendResponse(400, ['error' => 'Blacklist ID required']);
        }
        
        $query = "DELETE FROM blacklist WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $blacklist_id);
        
        if ($stmt->execute()) {
            sendResponse(200, ['message' => 'Removed from blacklist']);
        } else {
            sendResponse(500, ['error' => 'Failed to remove']);
        }
        break;
        
    default:
        sendResponse(405, ['error' => 'Method not allowed']);
}
