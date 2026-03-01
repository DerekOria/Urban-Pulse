<?php
// =====================================================
// API: Login de usuario
// POST /api/auth/login.php
// Body: { "email": "...", "password": "..." }
// =====================================================

require_once __DIR__ . '/../config/database.php';
session_start();

header('Content-Type: application/json');
header('Cache-Control: no-cache, must-revalidate');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Méthode non autorisée']);
    exit;
}

try {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data || !isset($data['email']) || !isset($data['password'])) {
        throw new Exception('Champs requis manquants');
    }

    $email = filter_var($data['email'], FILTER_VALIDATE_EMAIL);
    if (!$email) {
        throw new Exception("Format d'email invalide");
    }

    $password = $data['password'];

    // Buscar usuario con prepared statement (seguro contra SQL injection)
    $stmt = $pdo->prepare('SELECT id, email, password, coins, street, city, postal_code, country FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password'])) {
        throw new Exception('Email ou mot de passe incorrect');
    }

    // Guardar en sesion
    $_SESSION['user_id'] = (int) $user['id'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['coins'] = (int) $user['coins'];

    echo json_encode([
        'status' => 'success',
        'user' => [
            'id' => (int) $user['id'],
            'email' => $user['email'],
            'coins' => (int) $user['coins'],
            'address' => [
                'street' => $user['street'] ?? '',
                'city' => $user['city'] ?? '',
                'postal_code' => $user['postal_code'] ?? '',
                'country' => $user['country'] ?? ''
            ]
        ]
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
