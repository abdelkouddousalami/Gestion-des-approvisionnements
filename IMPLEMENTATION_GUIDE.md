# TRICOL - Guide d'Implémentation Frontend

## Structure Créée

### ✅ Core Module
- **Services**
  - `AuthService`: Gestion authentification JWT, login, register, logout, refresh token
  - `FournisseurService`: CRUD fournisseurs avec pagination
  - `ProduitService`: CRUD produits, alertes stock critique
  - `CommandeService`: Gestion commandes (création, validation, livraison)
  - `StockService`: Consultation lots, mouvements, valorisation FIFO
  - `BonSortieService`: Gestion bons de sortie

- **Guards**
  - `authGuard`: Protection routes authentifiées
  - `roleGuard`: Vérification rôle utilisateur
  - `permissionGuard`: Vérification permissions spécifiques

- **Interceptors**
  - `jwtInterceptor`: Ajout automatique token JWT aux requêtes
  - `errorInterceptor`: Gestion globale des erreurs HTTP

- **Models**
  - Interfaces TypeScript pour User, Role, Permission
  - Interfaces pour Fournisseur, Produit, Commande, Lot, MouvementStock, BonSortie

### ✅ Features Modules

#### Auth
- `LoginComponent`: Formulaire connexion avec validation
- `RegisterComponent`: Formulaire inscription

#### Dashboard
- `DashboardComponent`: Tableau de bord adapté par rôle
- Affichage statistiques (stock critique, commandes, valorisation)

#### Fournisseurs
- `FournisseursListComponent`: Liste paginée avec recherche
- `FournisseurFormComponent`: Formulaire création/modification

#### Produits
- `ProduitsListComponent`: Liste avec filtrage, indicateur stock critique
- `ProduitFormComponent`: Formulaire création/modification

### ✅ Shared Module
- `HasPermissionDirective`: Directive pour affichage conditionnel
- `HasRoleDirective`: Directive pour vérification rôle
- `NotFoundComponent`: Page 404
- `ForbiddenComponent`: Page 403

### ✅ Configuration
- Environments (dev, prod)
- Routes avec lazy loading
- App config avec interceptors
- Navigation avec permissions dynamiques

### ✅ DevOps
- Dockerfile multi-stage (build + nginx)
- nginx.conf pour SPA routing
- GitHub Actions workflow
- docker-compose.yml pour stack complète

## Prochaines Étapes

### 1. Modules à Compléter

#### Commandes Module
```bash
mkdir -p src/app/features/commandes/{list,form,reception}
```

Créer:
- `CommandesListComponent`: Liste avec filtres (fournisseur, statut, période)
- `CommandeFormComponent`: Création commande multi-produits
- `CommandeReceptionComponent`: Interface réception avec création lots

#### Stock Module
```bash
mkdir -p src/app/features/stock/{overview,lots,mouvements}
```

Créer:
- `StockOverviewComponent`: Vue globale stock par produit
- `LotsComponent`: Détail lots par produit
- `MouvementsComponent`: Historique avec recherche avancée

#### Bons Sortie Module
```bash
mkdir -p src/app/features/bons-sortie/{list,form}
```

Créer:
- `BonsSortieListComponent`: Liste avec filtres
- `BonSortieFormComponent`: Création/validation bon sortie

#### Admin Module
```bash
mkdir -p src/app/features/admin/{users,roles,logs}
```

Créer:
- `UsersComponent`: Gestion utilisateurs et attribution rôles
- `PermissionsComponent`: Personnalisation permissions
- `LogsComponent`: Logs d'audit (optionnel)

### 2. Composants Partagés à Ajouter

```typescript
// Loading Spinner
@Component({
  selector: 'app-loading',
  template: '<div class="spinner"></div>'
})
export class LoadingComponent {}

// Toast Notifications
@Injectable({ providedIn: 'root' })
export class ToastService {
  success(message: string) {}
  error(message: string) {}
  warning(message: string) {}
}

// Confirmation Dialog
@Component({
  selector: 'app-confirm-dialog',
  template: '...'
})
export class ConfirmDialogComponent {}
```

### 3. Tests

```bash
# Tests unitaires
ng test

# Tests e2e
ng e2e
```

### 4. Optimisations

- Lazy loading pour tous les modules
- OnPush change detection strategy
- TrackBy functions pour *ngFor
- Pagination côté serveur
- Debounce pour recherches

### 5. Sécurité

- [ ] Implémenter httpOnly cookies (recommandé vs localStorage)
- [ ] CSRF protection
- [ ] Content Security Policy
- [ ] Input sanitization
- [ ] XSS protection

## Commandes Utiles

```bash
# Développement
npm start

# Build production
npm run build -- --configuration production

# Linter
ng lint

# Format code
npm run format

# Docker build
docker build -t tricol-frontend .

# Docker run
docker run -p 80:80 tricol-frontend

# Full stack
docker-compose up -d
```

## Variables d'Environnement

### Development
```typescript
apiUrl: 'http://localhost:8080/api'
```

### Production
```typescript
apiUrl: 'https://api.tricol.com/api'
```

### Docker
Utiliser ARG dans Dockerfile pour injection au build:
```dockerfile
ARG API_URL=http://backend:8080/api
```

## Matrice des Permissions

Implémenter dans le backend et utiliser dans le frontend:

```typescript
// Exemple d'utilisation
<button *hasPermission="'CREATE_FOURNISSEUR'">Nouveau</button>
<div *hasRole="'ADMIN'">Admin Panel</div>
```

Permissions à gérer:
- VIEW_*, CREATE_*, UPDATE_*, DELETE_* pour chaque entité
- VALIDATE_COMMANDE, RECEIVE_COMMANDE
- VALIDATE_BON_SORTIE
- MANAGE_USERS, MANAGE_ROLES

## Notes Importantes

1. **Standalone Components**: Tous les composants utilisent l'approche standalone (Angular 20)
2. **Reactive Forms**: Utilisation exclusive de Reactive Forms pour validation
3. **HttpClient**: Tous les appels API via services dédiés
4. **Guards**: Protection systématique des routes
5. **Interceptors**: Gestion automatique JWT et erreurs
6. **Responsive**: Design mobile-first avec media queries
7. **Performance**: Lazy loading et optimisations Angular

## Support

Pour toute question sur l'implémentation, consulter:
- Documentation Angular: https://angular.dev
- API Backend: Documentation Swagger du backend Spring Boot
