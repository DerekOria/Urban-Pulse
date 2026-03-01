<?php
// =====================================================
// API: Actualizar direccion del usuario
// POST /api/user/update-address.php
// Body: { "street": "...", "city": "...", "postal_code": "...", "country": "..." }
// =====================================================

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Méthode non autorisée']);
    exit;
}

$user_id = requireAuth();

try {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['street']) || !isset($data['city']) || !isset($data['postal_code']) || !isset($data['country'])) {
        throw new Exception("Données d'adresse incomplètes");
    }

    // Sanitizar datos
    $street = trim($data['street']);
    $city = trim($data['city']);
    $postal_code = trim($data['postal_code']);
    $country = trim($data['country']);

    $stmt = $pdo->prepare('UPDATE users SET street = ?, city = ?, postal_code = ?, country = ? WHERE id = ?');
    $stmt->execute([$street, $city, $postal_code, $country, $user_id]);

    echo json_encode([
        'status' => 'success',
        'message' => 'Adresse mise à jour'
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
