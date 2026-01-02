# Complete OAuth2 Secured Application - Setup Guide

## Project Structure Created

### Security Implementation
✅ OAuth2 Resource Server with Keycloak integration
✅ Local JWT authentication
✅ Role-based access control (RBAC)
✅ Permission-based authorization
✅ CORS configuration
✅ Audit logging

### Infrastructure
✅ Docker & Docker Compose configuration
✅ Keycloak authentication server
✅ MySQL database
✅ SonarQube code quality
✅ Jenkins CI/CD pipeline

### Tests (6 Required Tests)
✅ testGetAccessTokenFail - OAuth2 token failure test
✅ testAccessTokenSuccess - OAuth2 token success test
✅ testListProductWithPermissionRead - List products with read permission
✅ testProductWithPermissionRead - Get product by ID with read permission
✅ testAddProductWithPermissionWrite - Create product with write permission
✅ testAddProductWithPermissionRead - Create product denied with only read permission

### Additional Tests
✅ Integration tests
✅ Security configuration tests
✅ CORS tests
✅ Service layer tests
✅ Audit service tests

## Files Created/Modified

### Configuration Files
- `pom.xml` - Added OAuth2, JaCoCo, Testcontainers dependencies
- `application.properties` - OAuth2 and Keycloak configuration
- `application-test.properties` - Test configuration with H2
- `SecurityConfig.java` - OAuth2 resource server configuration

### Controllers
- `OAuth2TokenController.java` - Token endpoint for Keycloak integration
- `ProduitController.java` - Updated with OAuth2 scopes (read/write)

### Tests
- `OAuth2TokenTests.java` - Tests 1 & 2 (token endpoints)
- `OAuth2ResourceServerTests.java` - Tests 3-6 (product APIs with permissions)
- `ProductWorkflowIntegrationTests.java` - Complete workflow tests
- `SecurityConfigTests.java` - Security configuration tests
- `CorsConfigTests.java` - CORS configuration tests
- `ProduitServiceTests.java` - Service layer tests
- `UserManagementServiceTests.java` - User management tests
- `AuditServiceTests.java` - Audit logging tests

### Infrastructure
- `Dockerfile` - Multi-stage build for application
- `docker-compose.yml` - Complete infrastructure (MySQL, Keycloak, App, SonarQube, Jenkins)
- `Jenkinsfile` - CI/CD pipeline with quality gates
- `sonar-project.properties` - SonarQube configuration
- `setup-keycloak.sh` - Keycloak realm configuration script
- `deploy.sh` - Automated deployment script
- `run-tests.sh` - Test execution script

### Documentation
- `README.md` - Complete setup and usage guide
- `API_TESTING.md` - API testing examples
- `PERMISSIONS_MATRIX.md` - Roles and permissions matrix

## Quick Start

### Prerequisites
- Java 11
- Maven 3.9+
- Docker & Docker Compose

### 1. Build Application
```bash
cd gestion-stock
mvn clean package -DskipTests
```

### 2. Start Infrastructure
```bash
cd ..
docker-compose up -d
```

### 3. Configure Keycloak
```bash
./setup-keycloak.sh
```

### 4. Run Tests
```bash
./run-tests.sh
```

## Test Execution

All 6 required tests are implemented:

1. **testGetAccessTokenFail**: POST /oauth2/token with invalid credentials → 401 + {"error": "invalid_client"}
2. **testAccessTokenSuccess**: POST /oauth2/token with valid credentials → 200 + access_token
3. **testListProductWithPermissionRead**: GET /api/produits with "read" scope → 200 OK
4. **testProductWithPermissionRead**: GET /api/produits/{id} with "read" scope → 200 OK
5. **testAddProductWithPermissionWrite**: POST /api/produits with "write" scope → 201 Created
6. **testAddProductWithPermissionRead**: POST /api/produits with only "read" scope → 403 Forbidden

## Coverage Target

JaCoCo configured for 80% minimum coverage with automatic reporting.

## CI/CD Pipeline Stages

1. Checkout
2. Build
3. Unit Tests (with JaCoCo)
4. SonarQube Analysis
5. Quality Gate (80% coverage required)
6. Package
7. Docker Build
8. Deploy

## Security Features

- **Dual Authentication**: Local JWT + OAuth2/Keycloak
- **Stateless**: No server-side sessions
- **Granular Permissions**: Method-level security with @PreAuthorize
- **CORS**: Restricted to approved origins
- **Audit Trail**: All sensitive actions logged
- **Token Expiration**: 1h access, 7d refresh

## API Endpoints

### OAuth2
- POST /oauth2/token - Get access token from Keycloak

### Local Auth
- POST /api/auth/login - Local authentication
- POST /api/auth/register - User registration
- POST /api/auth/refresh - Refresh token

### Products (Protected)
- GET /api/produits - List products (read permission)
- GET /api/produits/{id} - Get product (read permission)
- POST /api/produits - Create product (write permission)
- PUT /api/produits/{id} - Update product (write permission)
- DELETE /api/produits/{id} - Delete product (write permission)

## Roles & Permissions

| Role | Permissions |
|------|-------------|
| ADMIN | All permissions |
| MANAGER | VIEW, CREATE, UPDATE |
| OPERATOR | VIEW, CREATE |
| VIEWER | VIEW only |

## OAuth2 Scopes

- `read` - View resources
- `write` - Create/Update/Delete resources

## Services URLs

- Application: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html
- Keycloak: http://localhost:8180 (admin/admin)
- SonarQube: http://localhost:9000 (admin/admin)
- Jenkins: http://localhost:8081

## Notes

The application is fully configured and ready for deployment. All security requirements are implemented:
- OAuth2 resource server with Keycloak
- Local JWT authentication
- Role and permission-based authorization
- CORS configuration
- Audit logging
- Complete test coverage
- CI/CD pipeline
- Code quality analysis

To run the application, ensure Java 11 is installed and follow the Quick Start guide above.
