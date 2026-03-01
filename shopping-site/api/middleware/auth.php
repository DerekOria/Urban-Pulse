<?php
// =====================================================
// Middleware de autenticacion
// Verifica que el usuario tiene sesion activa
// =====================================================

session_start();

function requireAuth() {
    if (!isset($_SESSION['user_id']) || empty($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode([
            'status' => 'error',
            'message' => 'Non connecté'
        ]);
        exit;
    }
    return (int) $_SESSION['user_id'];
}

function isLoggedIn() {
    return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
}
