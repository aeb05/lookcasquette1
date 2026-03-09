<?php
require_once '../config/database.php';
require_once '../config/helpers.php';

verifyToken();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(405, ['error' => 'Method not allowed']);
}

if (!isset($_FILES['image'])) {
    sendResponse(400, ['error' => 'No image uploaded']);
}

$file = $_FILES['image'];
$allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
$filename = $file['name'];
$ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

if (!in_array($ext, $allowed)) {
    sendResponse(400, ['error' => 'Invalid file type']);
}

if ($file['size'] > 5000000) { // 5MB
    sendResponse(400, ['error' => 'File too large']);
}

$new_filename = generateUUID() . '.' . $ext;
$upload_path = '../uploads/products/' . $new_filename;

if (move_uploaded_file($file['tmp_name'], $upload_path)) {
    $base_url = getenv('PUBLIC_URL') ?: 'http://localhost';
    $url = $base_url . '/uploads/products/' . $new_filename;
    sendResponse(200, ['url' => $url]);
} else {
    sendResponse(500, ['error' => 'Failed to upload image']);
}
