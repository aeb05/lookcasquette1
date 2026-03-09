<?php
$allowed_origins = getenv('ALLOWED_ORIGINS') ?: '*';
header("Access-Control-Allow-Origin: " . $allowed_origins);
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

function sendResponse($status, $data) {
    http_response_code($status);
    echo json_encode($data);
    exit();
}

function generateUUID() {
    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}

function verifyToken() {
    $headers = getallheaders();
    $token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;
    
    if (!$token) {
        sendResponse(401, ['error' => 'Unauthorized']);
    }
    
    session_start();
    if (!isset($_SESSION['admin_id']) || $_SESSION['token'] !== $token) {
        sendResponse(401, ['error' => 'Invalid token']);
    }
    
    return $_SESSION['admin_id'];
}
