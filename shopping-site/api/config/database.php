<?php
// =====================================================
// Urban Pulse - Conexion unica a la base de datos
// TODOS los endpoints PHP deben usar este archivo
// =====================================================

$host = 'localhost';
$dbname = 'urban_pulse';
$username = 'root';
$password = '';

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode([
        'status' => 'error',
        'message' => 'Erreur de connexion à la base de données'
    ]));
}
