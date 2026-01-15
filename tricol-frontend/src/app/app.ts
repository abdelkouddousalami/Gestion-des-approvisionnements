import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <div class="app-container">
      <nav class="navbar" *ngIf="authService.currentUser$ | async as user">
        <div class="nav-brand">TRICOL</div>
        <div class="nav-links">
          <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
          <a routerLink="/fournisseurs" routerLinkActive="active" *ngIf="authService.hasPermission('VIEW_FOURNISSEUR')">Fournisseurs</a>
          <a routerLink="/produits" routerLinkActive="active" *ngIf="authService.hasPermission('VIEW_PRODUIT')">Produits</a>
          <a routerLink="/commandes" routerLinkActive="active" *ngIf="authService.hasPermission('VIEW_COMMANDE')">Commandes</a>
          <a routerLink="/stock" routerLinkActive="active" *ngIf="authService.hasPermission('VIEW_STOCK')">Stock</a>
          <a routerLink="/bons-sortie" routerLinkActive="active" *ngIf="authService.hasPermission('VIEW_BON_SORTIE')">Bons de Sortie</a>
          <a routerLink="/admin" routerLinkActive="active" *ngIf="authService.hasRole('ADMIN')">Administration</a>
        </div>
        <div class="nav-user">
          <span>{{ user.prenom }} {{ user.nom }}</span>
          <button (click)="authService.logout()" class="btn-logout">Déconnexion</button>
        </div>
      </nav>
      <main>
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .app-container { min-height: 100vh; background: #f5f5f5; }
    .navbar { background: #2c3e50; color: white; padding: 1rem 2rem; display: flex; align-items: center; gap: 2rem; }
    .nav-brand { font-size: 1.5rem; font-weight: bold; }
    .nav-links { display: flex; gap: 1rem; flex: 1; }
    .nav-links a { color: white; text-decoration: none; padding: 0.5rem 1rem; border-radius: 4px; }
    .nav-links a:hover, .nav-links a.active { background: rgba(255,255,255,0.1); }
    .nav-user { display: flex; align-items: center; gap: 1rem; }
    .btn-logout { padding: 0.5rem 1rem; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; }
    main { min-height: calc(100vh - 60px); }
  `]
})
export class AppComponent {
  authService = inject(AuthService);
}
