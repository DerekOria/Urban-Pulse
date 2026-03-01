<?php
// =====================================================
// API: Logout de usuario
// GET /api/auth/logout.php
// =====================================================

session_start();
header('Content-Type: application/json');

$_SESSION = [];
session_destroy();

echo json_encode([
    'status' => 'success',
    'message' => 'Déconnexion réussie'
]);
