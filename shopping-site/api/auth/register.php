<?php
// =====================================================
// API: Registro de usuario
// POST /api/auth/register.php
// Body: { "email": "...", "password": "..." }
// =====================================================

require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Méthode non autorisée']);
    exit;
}

try {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['email']) || !isset($data['password'])) {
        throw new Exception('Email et mot de passe requis');
    }

    $email = filter_var($data['email'], FILTER_VALIDATE_EMAIL);
    if (!$email) {
        throw new Exception('Email invalide');
    }

    if (strlen($data['password']) < 6) {
        throw new Exception('Le mot de passe doit contenir au moins 6 caractères');
    }

    // Verificar si el email ya existe
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        throw new Exception('Cet email est déjà utilisé');
    }

    // Hashear la contrasena de forma segura
    $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

    // Insertar nuevo usuario
    $stmt = $pdo->prepare('INSERT INTO users (email, password, coins) VALUES (?, ?, 0)');
    $stmt->execute([$email, $hashedPassword]);

    echo json_encode([
        'status' => 'success',
        'message' => 'Compte créé avec succès'
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
