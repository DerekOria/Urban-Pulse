<?php
// =====================================================
// API: Validar pedido (checkout)
// POST /api/orders/validate.php
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
    $pdo->beginTransaction();

    // Obtener articulos del carrito
    $stmt = $pdo->prepare('SELECT * FROM cart WHERE user_id = ?');
    $stmt->execute([$user_id]);
    $cartItems = $stmt->fetchAll();

    if (empty($cartItems)) {
        throw new Exception('Le panier est vide');
    }

    // Calcular total
    $totalAmount = 0;
    foreach ($cartItems as $item) {
        $totalAmount += $item['price'] * $item['quantity'];
    }

    // Crear el pedido
    $stmt = $pdo->prepare("INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, 'completed')");
    $stmt->execute([$user_id, $totalAmount]);
    $orderId = $pdo->lastInsertId();

    // Agregar articulos al pedido
    $stmt = $pdo->prepare('INSERT INTO order_items (order_id, name, price, quantity, personnalisation) VALUES (?, ?, ?, ?, ?)');
    foreach ($cartItems as $item) {
        $stmt->execute([
            $orderId,
            $item['name'],
            $item['price'],
            $item['quantity'],
            $item['personnalisation']
        ]);
    }

    // Vaciar el carrito
    $stmt = $pdo->prepare('DELETE FROM cart WHERE user_id = ?');
    $stmt->execute([$user_id]);

    // Agregar coins (10% del total)
    $coinsToAdd = (int) floor($totalAmount * 10);
    $stmt = $pdo->prepare('UPDATE users SET coins = coins + ? WHERE id = ?');
    $stmt->execute([$coinsToAdd, $user_id]);

    // Registrar transaccion de coins
    $stmt = $pdo->prepare('INSERT INTO coin_transactions (user_id, amount, reason) VALUES (?, ?, ?)');
    $stmt->execute([$user_id, $coinsToAdd, "Commande #$orderId - 10% cashback"]);

    // Obtener nuevo balance
    $stmt = $pdo->prepare('SELECT coins FROM users WHERE id = ?');
    $stmt->execute([$user_id]);
    $newCoins = $stmt->fetchColumn();

    // Actualizar sesion
    $_SESSION['coins'] = (int) $newCoins;

    $pdo->commit();

    echo json_encode([
        'status' => 'success',
        'message' => 'Commande validée avec succès',
        'order_id' => (int) $orderId,
        'coins_earned' => $coinsToAdd,
        'new_balance' => (int) $newCoins
    ]);

} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
