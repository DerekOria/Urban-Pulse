<?php
// =====================================================
// API: Obtener datos del usuario loggeado
// GET /api/user/get.php
// =====================================================

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

header('Content-Type: application/json');
header('Cache-Control: no-cache, must-revalidate');

$user_id = requireAuth();

try {
    $stmt = $pdo->prepare('SELECT id, email, coins, street, city, postal_code, country FROM users WHERE id = ? LIMIT 1');
    $stmt->execute([$user_id]);
    $user = $stmt->fetch();

    if (!$user) {
        throw new Exception('Utilisateur non trouvé');
    }

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
