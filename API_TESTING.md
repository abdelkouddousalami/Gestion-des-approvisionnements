# API Testing Guide

## 1. Get OAuth2 Token from Keycloak

### Request
```bash
curl -X POST http://localhost:8080/oauth2/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=gestion-stock-client" \
  -d "client_secret=your-client-secret" \
  -d "grant_type=client_credentials"
```

### Expected Response (Success)
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "read write"
}
```

### Expected Response (Failure)
```json
{
  "error": "invalid_client"
}
```

## 2. Local Authentication

### Request
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### Response
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400000
}
```

## 3. List Products (Read Permission)

### Request
```bash
curl -X GET http://localhost:8080/api/produits \
  -H "Authorization: Bearer <access_token>"
```

### Response (200 OK)
```json
[
  {
    "id": 1,
    "reference": "PROD-001",
    "nom": "Product Name",
    "prixUnitaire": 100.00,
    "categorie": "Category",
    "stockActuel": 50
  }
]
```

### Response (204 No Content)
Empty list

## 4. Get Product by ID (Read Permission)

### Request
```bash
curl -X GET http://localhost:8080/api/produits/1 \
  -H "Authorization: Bearer <access_token>"
```

### Response (200 OK)
```json
{
  "id": 1,
  "reference": "PROD-001",
  "nom": "Product Name",
  "description": "Description",
  "prixUnitaire": 100.00,
  "categorie": "Category",
  "stockActuel": 50,
  "pointDeCommande": 10,
  "uniteMesure": "unité"
}
```

## 5. Create Product (Write Permission)

### Request
```bash
curl -X POST http://localhost:8080/api/produits \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "reference": "PROD-NEW",
    "nom": "New Product",
    "description": "Product description",
    "prixUnitaire": 150.00,
    "categorie": "Electronics",
    "stockInitial": 20,
    "pointDeCommande": 5,
    "uniteMesure": "unité"
  }'
```

### Response (201 Created)
```json
{
  "id": 2,
  "reference": "PROD-NEW",
  "nom": "New Product",
  "prixUnitaire": 150.00,
  "categorie": "Electronics",
  "stockActuel": 20
}
```

### Response (403 Forbidden - Insufficient Permissions)
```json
{
  "error": "Forbidden",
  "message": "Access Denied"
}
```

## 6. Test Scenarios

### Test 1: testGetAccessTokenFail
```bash
curl -X POST http://localhost:8080/oauth2/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=invalid_client" \
  -d "client_secret=invalid_secret" \
  -d "grant_type=client_credentials"
```
Expected: 401 Unauthorized with `{"error": "invalid_client"}`

### Test 2: testAccessTokenSuccess
```bash
curl -X POST http://localhost:8080/oauth2/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=gestion-stock-client" \
  -d "client_secret=your-client-secret" \
  -d "grant_type=client_credentials"
```
Expected: 200 OK with access_token, token_type, expires_in

### Test 3: testListProductWithPermissionRead
Use token with "read" scope to GET /api/produits
Expected: 200 OK or 204 No Content

### Test 4: testProductWithPermissionRead
Use token with "read" scope to GET /api/produits/{id}
Expected: 200 OK with product details

### Test 5: testAddProductWithPermissionWrite
Use token with "write" scope to POST /api/produits
Expected: 201 Created

### Test 6: testAddProductWithPermissionRead
Use token with only "read" scope to POST /api/produits
Expected: 403 Forbidden
