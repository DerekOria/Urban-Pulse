<?php
// =====================================================
// API: Actualizar coins del usuario
// POST /api/coins/update.php
// Body: { "amount": 100, "reason": "..." }
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
    $amount = isset($data['amount']) ? intval($data['amount']) : 0;
    $reason = isset($data['reason']) ? trim($data['reason']) : '';

    if ($amount === 0) {
        throw new Exception('Montant invalide');
    }

    if (empty($reason)) {
        throw new Exception('Raison requise');
    }

    $pdo->beginTransaction();

    // Obtener balance actual con bloqueo
    $stmt = $pdo->prepare('SELECT coins FROM users WHERE id = ? FOR UPDATE');
    $stmt->execute([$user_id]);
    $user = $stmt->fetch();

    if (!$user) {
        throw new Exception('Utilisateur non trouvé');
    }

    $newBalance = $user['coins'] + $amount;

    // Verificar balance suficiente para deduccion
    if ($amount < 0 && $newBalance < 0) {
        $pdo->rollBack();
        echo json_encode(['status' => 'error', 'message' => 'Solde insuffisant']);
        exit;
    }

    // Actualizar balance
    $stmt = $pdo->prepare('UPDATE users SET coins = ? WHERE id = ?');
    $stmt->execute([$newBalance, $user_id]);

    // Registrar transaccion
    $stmt = $pdo->prepare('INSERT INTO coin_transactions (user_id, amount, reason) VALUES (?, ?, ?)');
    $stmt->execute([$user_id, $amount, $reason]);

    // Actualizar sesion
    $_SESSION['coins'] = $newBalance;

    $pdo->commit();

    echo json_encode([
        'status' => 'success',
        'newBalance' => $newBalance
    ]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
