<?php
// =====================================================
// API: Agregar producto al carrito
// POST /api/cart/add.php
// Body: { "name": "...", "price": 10.00, "quantity": 1, "personnalisation": {} }
// =====================================================

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

header('Content-Type: application/json');
header('Cache-Control: no-cache, must-revalidate');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Méthode non autorisée']);
    exit;
}

$user_id = requireAuth();

try {
    $data = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Données JSON invalides');
    }

    if (!isset($data['name']) || !isset($data['price']) || !isset($data['quantity'])) {
        throw new Exception('Données manquantes');
    }

    $name = trim($data['name']);
    $price = floatval($data['price']);
    $quantity = intval($data['quantity']);
    $personnalisation = isset($data['personnalisation']) ? json_encode($data['personnalisation']) : null;

    if (empty($name) || $price <= 0 || $quantity <= 0) {
        throw new Exception('Valeurs invalides pour le produit');
    }

    $stmt = $pdo->prepare('INSERT INTO cart (user_id, name, price, quantity, personnalisation) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([$user_id, $name, $price, $quantity, $personnalisation]);

    echo json_encode([
        'status' => 'success',
        'message' => 'Produit ajouté au panier'
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
