<?php
// =====================================================
// API: Obtener contenido del carrito
// GET /api/cart/get.php
// =====================================================

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

header('Content-Type: application/json');

$user_id = requireAuth();

try {
    $stmt = $pdo->prepare('SELECT id, name, price, quantity, personnalisation FROM cart WHERE user_id = ?');
    $stmt->execute([$user_id]);
    $items = $stmt->fetchAll();

    // Formatear los datos
    $formattedItems = array_map(function ($row) {
        return [
            'id' => (int) $row['id'],
            'name' => $row['name'],
            'price' => (float) $row['price'],
            'quantity' => (int) $row['quantity'],
            'personnalisation' => $row['personnalisation'] ? json_decode($row['personnalisation']) : null
        ];
    }, $items);

    echo json_encode([
        'status' => 'success',
        'items' => $formattedItems
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Erreur lors de la récupération du panier'
    ]);
}
