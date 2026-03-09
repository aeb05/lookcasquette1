<?php
require_once '../config/database.php';
require_once '../config/helpers.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
$request_uri = $_SERVER['REQUEST_URI'];
$uri_parts = explode('/', trim(parse_url($request_uri, PHP_URL_PATH), '/'));
$action = isset($uri_parts[3]) ? $uri_parts[3] : null;

switch($action) {
    case 'login':
        if ($method !== 'POST') {
            sendResponse(405, ['error' => 'Method not allowed']);
        }
        
        $data = json_decode(file_get_contents("php://input"));
        
        if (!$data->email || !$data->password) {
            sendResponse(400, ['error' => 'Email and password required']);
        }
        
        $query = "SELECT * FROM admin_users WHERE email = :email";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':email', $data->email);
        $stmt->execute();
        
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user && password_verify($data->password, $user['password_hash'])) {
            session_start();
            $token = bin2hex(random_bytes(32));
            $_SESSION['admin_id'] = $user['id'];
            $_SESSION['admin_email'] = $user['email'];
            $_SESSION['token'] = $token;
            
            sendResponse(200, [
                'token' => $token,
                'user' => [
                    'id' => $user['id'],
                    'email' => $user['email']
                ]
            ]);
        } else {
            sendResponse(401, ['error' => 'Invalid credentials']);
        }
        break;
        
    case 'logout':
        if ($method !== 'POST') {
            sendResponse(405, ['error' => 'Method not allowed']);
        }
        
        session_start();
        session_destroy();
        sendResponse(200, ['message' => 'Logged out']);
        break;
        
    case 'session':
        if ($method !== 'GET') {
            sendResponse(405, ['error' => 'Method not allowed']);
        }
        
        $admin_id = verifyToken();
        
        $query = "SELECT id, email FROM admin_users WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $admin_id);
        $stmt->execute();
        
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        sendResponse(200, ['user' => $user]);
        break;
        
    default:
        sendResponse(404, ['error' => 'Endpoint not found']);
}
