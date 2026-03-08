<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$config = [
    'consumer_key' => 'API_Key',
    'consumer_secret' => 'api_secret',
    'token_access' => '449651ad-cd8d-43c3-9d62-10077e069db0',
    'token_secret' => '7192d223-95d7-4a1e-8761-2c1b9efa50285872bb60-a38b-4045-b09b-d3e19d26f944',
    'base_url' => 'https://federacaonacional201538.fluig.cloudtotvs.com.br'
];

$inputJSON = file_get_contents('php://input');
$method = isset($_GET['method']) ? strtoupper($_GET['method']) : $_SERVER['REQUEST_METHOD'];

// ✅ CORREÇÃO: Separar endpoint de query string
$endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : '/dataset/api/v2/dataset-handle/search';

// ✅ Parse do endpoint para separar path e query
$endpointParts = parse_url($endpoint);
$endpointPath = $endpointParts['path'] ?? $endpoint;
$endpointQuery = [];

// Se o endpoint já tem query string, extrai ela
if (isset($endpointParts['query'])) {
    parse_str($endpointParts['query'], $endpointQuery);
}

// ✅ Pega params adicionais da URL do proxy
$queryParams = $_GET;
unset($queryParams['endpoint']);
unset($queryParams['method']);

// ✅ Mescla query do endpoint com query do proxy
$allParams = array_merge($endpointQuery, $queryParams);

// ✅ Monta URL final corretamente
$targetUrl = $config['base_url'] . $endpointPath;
if (!empty($allParams)) {
    $targetUrl .= '?' . http_build_query($allParams);
}

// Log para debug (remova em produção)
error_log("=== PROXY DEBUG ===");
error_log("Endpoint recebido: " . $endpoint);
error_log("Endpoint path: " . $endpointPath);
error_log("Endpoint query: " . print_r($endpointQuery, true));
error_log("Query params: " . print_r($queryParams, true));
error_log("All params merged: " . print_r($allParams, true));
error_log("Target URL: " . $targetUrl);

function buildOAuthHeader($baseUrl, $method, $allParams, $config)
{
    $timestamp = time();
    $nonce = md5(uniqid(rand(), true));

    $oauthParams = [
        'oauth_consumer_key' => $config['consumer_key'],
        'oauth_nonce' => $nonce,
        'oauth_signature_method' => 'HMAC-SHA1',
        'oauth_timestamp' => $timestamp,
        'oauth_token' => $config['token_access'],
        'oauth_version' => '1.0'
    ];

    $baseParams = array_merge($oauthParams, $allParams);
    uksort($baseParams, 'strcmp');

    $paramString = [];
    foreach ($baseParams as $key => $value) {
        if (is_array($value)) {
            sort($value);
            foreach ($value as $v) {
                $paramString[] = rawurlencode($key) . '=' . rawurlencode($v);
            }
        }
        else {
            $paramString[] = rawurlencode($key) . '=' . rawurlencode($value);
        }
    }

    $baseString = strtoupper($method) . '&' . rawurlencode($baseUrl) . '&' . rawurlencode(implode('&', $paramString));
    $signingKey = rawurlencode($config['consumer_secret']) . '&' . rawurlencode($config['token_secret']);
    $signature = base64_encode(hash_hmac('sha1', $baseString, $signingKey, true));

    $oauthParams['oauth_signature'] = $signature;
    $headerParts = [];
    foreach ($oauthParams as $key => $value) {
        $headerParts[] = $key . '="' . rawurlencode($value) . '"';
    }

    return 'OAuth ' . implode(', ', $headerParts);
}

try {
    $ch = curl_init();

    // ✅ Usa o path limpo para a assinatura OAuth
    $authHeader = buildOAuthHeader($config['base_url'] . $endpointPath, $method, $allParams, $config);

    curl_setopt($ch, CURLOPT_URL, $targetUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);

    if (in_array($method, ['POST', 'PUT', 'PATCH']) && !empty($inputJSON)) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, $inputJSON);
    }

    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json',
        'Authorization: ' . $authHeader
    ]);

    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($curlError) {
        throw new Exception("Erro cURL: $curlError");
    }

    http_response_code($httpCode);
    echo $response;

}
catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Erro no proxy',
        'message' => $e->getMessage(),
        'endpoint' => $endpoint ?? null,
        'targetUrl' => $targetUrl ?? null
    ]);
}