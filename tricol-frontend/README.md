# TRICOL - Frontend Angular 20

Application frontend pour la gestion des approvisionnements et stocks de TRICOL.

## Stack Technique

- Angular 20
- TypeScript
- SCSS
- Standalone Components
- Reactive Forms
- HttpClient avec Interceptors
- JWT Authentication

## Architecture

```
src/app/
├── core/                    # Services, Guards, Interceptors
│   ├── services/           # AuthService, API Services
│   ├── guards/             # Auth, Role, Permission Guards
│   ├── interceptors/       # JWT, Error Interceptors
│   └── models/             # TypeScript Interfaces
├── features/               # Feature Modules
│   ├── auth/              # Login, Register
│   ├── dashboard/         # Tableaux de bord
│   ├── fournisseurs/      # CRUD Fournisseurs
│   ├── produits/          # CRUD Produits
│   ├── commandes/         # Gestion Commandes
│   ├── stock/             # Gestion Stock & Lots
│   ├── bons-sortie/       # Bons de Sortie
│   └── admin/             # Administration
└── shared/                # Composants réutilisables
```

## Installation

```bash
npm install
```

## Configuration

Modifier `src/environments/environment.ts` pour pointer vers votre API backend:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

## Développement

```bash
npm start
```

L'application sera accessible sur `http://localhost:4200`

## Build

```bash
npm run build
```

## Docker

### Build l'image

```bash
docker build -t tricol-frontend .
```

### Run le container

```bash
docker run -p 80:80 tricol-frontend
```

## Fonctionnalités

### Authentification
- Login avec JWT
- Register
- Refresh Token automatique
- Guards pour protection des routes

### Gestion des Permissions
- Permissions dynamiques par rôle
- Permissions personnalisées par utilisateur
- Affichage conditionnel selon permissions

### Modules Métier
- **Fournisseurs**: CRUD complet avec pagination
- **Produits**: Gestion avec alertes stock critique
- **Commandes**: Création, validation, réception
- **Stock**: Consultation lots, mouvements, valorisation FIFO
- **Bons de Sortie**: Création et validation avec sortie FIFO
- **Administration**: Gestion utilisateurs et permissions

## CI/CD

Le projet utilise GitHub Actions pour:
1. Build automatique
2. Création image Docker
3. Push vers Docker Hub

Configurer les secrets GitHub:
- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`

## Sécurité

- Tokens JWT stockés en localStorage
- Refresh token automatique
- Interceptor pour gestion erreurs HTTP
- Sanitization des inputs
- Guards pour protection routes

## Déploiement

L'application est containerisée avec Docker et utilise Nginx pour servir les fichiers statiques avec support du routing SPA.
