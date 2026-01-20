import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/auth.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard" [ngClass]="'dashboard-' + userRole.toLowerCase()">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <div class="welcome-section">
            <h1>{{ getGreeting() }}, {{ user?.prenom || 'Utilisateur' }}!</h1>
            <p class="role-badge" [ngClass]="'role-' + userRole.toLowerCase()">
              {{ getRoleDisplayName() }}
            </p>
          </div>
          <div class="header-actions">
            <span class="date">{{ currentDate | date:'EEEE d MMMM yyyy':'':'fr' }}</span>
            <button class="btn-logout" (click)="logout()">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <!-- Admin Dashboard -->
      <div class="dashboard-content" *ngIf="userRole === 'ADMIN'">
        <div class="stats-grid">
          <div class="stat-card primary">
            <div class="stat-icon">👥</div>
            <div class="stat-info">
              <h3>Utilisateurs</h3>
              <p class="stat-value">{{ stats.totalUsers }}</p>
              <span class="stat-change positive">+12% ce mois</span>
            </div>
          </div>
          <div class="stat-card success">
            <div class="stat-icon">📦</div>
            <div class="stat-info">
              <h3>Produits</h3>
              <p class="stat-value">{{ stats.totalProduits }}</p>
              <span class="stat-change">Total en stock</span>
            </div>
          </div>
          <div class="stat-card warning">
            <div class="stat-icon">🏭</div>
            <div class="stat-info">
              <h3>Fournisseurs</h3>
              <p class="stat-value">{{ stats.totalFournisseurs }}</p>
              <span class="stat-change">Actifs</span>
            </div>
          </div>
          <div class="stat-card danger">
            <div class="stat-icon">⚠️</div>
            <div class="stat-info">
              <h3>Stock Critique</h3>
              <p class="stat-value">{{ stats.stockCritique }}</p>
              <span class="stat-change negative">À surveiller</span>
            </div>
          </div>
        </div>

        <div class="quick-actions">
          <h2>Actions Rapides</h2>
          <div class="actions-grid">
            <a routerLink="/admin/users" class="action-card">
              <span class="action-icon">👤</span>
              <span>Gérer Utilisateurs</span>
            </a>
            <a routerLink="/produits" class="action-card">
              <span class="action-icon">📦</span>
              <span>Gérer Produits</span>
            </a>
            <a routerLink="/fournisseurs" class="action-card">
              <span class="action-icon">🏭</span>
              <span>Gérer Fournisseurs</span>
            </a>
            <a routerLink="/admin/roles" class="action-card">
              <span class="action-icon">🔐</span>
              <span>Gérer Rôles</span>
            </a>
            <a routerLink="/commandes" class="action-card">
              <span class="action-icon">📋</span>
              <span>Voir Commandes</span>
            </a>
            <a routerLink="/admin/reports" class="action-card">
              <span class="action-icon">📊</span>
              <span>Rapports</span>
            </a>
          </div>
        </div>

        <div class="recent-activity">
          <h2>Activité Récente</h2>
          <div class="activity-list">
            <div class="activity-item">
              <span class="activity-icon">🆕</span>
              <div class="activity-content">
                <p>Nouvel utilisateur inscrit</p>
                <span class="activity-time">Il y a 2 heures</span>
              </div>
            </div>
            <div class="activity-item">
              <span class="activity-icon">📦</span>
              <div class="activity-content">
                <p>Stock mis à jour pour 5 produits</p>
                <span class="activity-time">Il y a 4 heures</span>
              </div>
            </div>
            <div class="activity-item">
              <span class="activity-icon">✅</span>
              <div class="activity-content">
                <p>Commande #1234 validée</p>
                <span class="activity-time">Hier</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Responsable Achats Dashboard -->
      <div class="dashboard-content" *ngIf="userRole === 'RESPONSABLE_ACHATS'">
        <div class="stats-grid">
          <div class="stat-card primary">
            <div class="stat-icon">📋</div>
            <div class="stat-info">
              <h3>Commandes en cours</h3>
              <p class="stat-value">{{ stats.commandesEnCours }}</p>
              <span class="stat-change">À traiter</span>
            </div>
          </div>
          <div class="stat-card success">
            <div class="stat-icon">✅</div>
            <div class="stat-info">
              <h3>Commandes validées</h3>
              <p class="stat-value">{{ stats.commandesValidees }}</p>
              <span class="stat-change positive">Ce mois</span>
            </div>
          </div>
          <div class="stat-card warning">
            <div class="stat-icon">🏭</div>
            <div class="stat-info">
              <h3>Fournisseurs</h3>
              <p class="stat-value">{{ stats.totalFournisseurs }}</p>
              <span class="stat-change">Partenaires</span>
            </div>
          </div>
          <div class="stat-card info">
            <div class="stat-icon">💰</div>
            <div class="stat-info">
              <h3>Budget Mensuel</h3>
              <p class="stat-value">{{ stats.budgetMensuel | number:'1.0-0' }} MAD</p>
              <span class="stat-change">Dépensé</span>
            </div>
          </div>
        </div>

        <div class="quick-actions">
          <h2>Mes Actions</h2>
          <div class="actions-grid">
            <a routerLink="/commandes/new" class="action-card highlight">
              <span class="action-icon">➕</span>
              <span>Nouvelle Commande</span>
            </a>
            <a routerLink="/fournisseurs" class="action-card">
              <span class="action-icon">🏭</span>
              <span>Mes Fournisseurs</span>
            </a>
            <a routerLink="/commandes" class="action-card">
              <span class="action-icon">📋</span>
              <span>Suivi Commandes</span>
            </a>
            <a routerLink="/produits" class="action-card">
              <span class="action-icon">📦</span>
              <span>Catalogue Produits</span>
            </a>
          </div>
        </div>

        <div class="pending-orders">
          <h2>Commandes à Traiter</h2>
          <div class="orders-list">
            <div class="order-item pending">
              <span class="order-id">#CMD-2024-001</span>
              <span class="order-supplier">Fournisseur A</span>
              <span class="order-amount">15,000 MAD</span>
              <span class="order-status">En attente</span>
            </div>
            <div class="order-item pending">
              <span class="order-id">#CMD-2024-002</span>
              <span class="order-supplier">Fournisseur B</span>
              <span class="order-amount">8,500 MAD</span>
              <span class="order-status">En attente</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Magasinier Dashboard -->
      <div class="dashboard-content" *ngIf="userRole === 'MAGASINIER'">
        <div class="stats-grid">
          <div class="stat-card primary">
            <div class="stat-icon">📦</div>
            <div class="stat-info">
              <h3>Total Produits</h3>
              <p class="stat-value">{{ stats.totalProduits }}</p>
              <span class="stat-change">En stock</span>
            </div>
          </div>
          <div class="stat-card danger">
            <div class="stat-icon">⚠️</div>
            <div class="stat-info">
              <h3>Stock Critique</h3>
              <p class="stat-value">{{ stats.stockCritique }}</p>
              <span class="stat-change negative">À réapprovisionner</span>
            </div>
          </div>
          <div class="stat-card success">
            <div class="stat-icon">📥</div>
            <div class="stat-info">
              <h3>Entrées du jour</h3>
              <p class="stat-value">{{ stats.entreesJour }}</p>
              <span class="stat-change positive">Mouvements</span>
            </div>
          </div>
          <div class="stat-card warning">
            <div class="stat-icon">📤</div>
            <div class="stat-info">
              <h3>Sorties du jour</h3>
              <p class="stat-value">{{ stats.sortiesJour }}</p>
              <span class="stat-change">Mouvements</span>
            </div>
          </div>
        </div>

        <div class="quick-actions">
          <h2>Gestion Stock</h2>
          <div class="actions-grid">
            <a routerLink="/stock/entree" class="action-card highlight">
              <span class="action-icon">📥</span>
              <span>Entrée Stock</span>
            </a>
            <a routerLink="/stock/sortie" class="action-card highlight">
              <span class="action-icon">📤</span>
              <span>Sortie Stock</span>
            </a>
            <a routerLink="/produits" class="action-card">
              <span class="action-icon">📦</span>
              <span>Inventaire</span>
            </a>
            <a routerLink="/stock/mouvements" class="action-card">
              <span class="action-icon">🔄</span>
              <span>Mouvements</span>
            </a>
            <a routerLink="/bons-sortie" class="action-card">
              <span class="action-icon">📄</span>
              <span>Bons de Sortie</span>
            </a>
            <a routerLink="/stock/alertes" class="action-card">
              <span class="action-icon">🔔</span>
              <span>Alertes Stock</span>
            </a>
          </div>
        </div>

        <div class="stock-alerts">
          <h2>Alertes Stock</h2>
          <div class="alerts-list">
            <div class="alert-item critical">
              <span class="alert-icon">🔴</span>
              <div class="alert-content">
                <p>Huile moteur 5W30 - Stock épuisé</p>
                <span class="alert-qty">0 unités restantes</span>
              </div>
            </div>
            <div class="alert-item warning">
              <span class="alert-icon">🟡</span>
              <div class="alert-content">
                <p>Filtre à air - Stock bas</p>
                <span class="alert-qty">5 unités restantes</span>
              </div>
            </div>
            <div class="alert-item warning">
              <span class="alert-icon">🟡</span>
              <div class="alert-content">
                <p>Bougie d'allumage - Stock bas</p>
                <span class="alert-qty">8 unités restantes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chef Atelier Dashboard -->
      <div class="dashboard-content" *ngIf="userRole === 'CHEF_ATELIER'">
        <div class="stats-grid">
          <div class="stat-card primary">
            <div class="stat-icon">🔧</div>
            <div class="stat-info">
              <h3>Demandes en cours</h3>
              <p class="stat-value">{{ stats.demandesEnCours }}</p>
              <span class="stat-change">À traiter</span>
            </div>
          </div>
          <div class="stat-card success">
            <div class="stat-icon">✅</div>
            <div class="stat-info">
              <h3>Demandes validées</h3>
              <p class="stat-value">{{ stats.demandesValidees }}</p>
              <span class="stat-change positive">Cette semaine</span>
            </div>
          </div>
          <div class="stat-card warning">
            <div class="stat-icon">📄</div>
            <div class="stat-info">
              <h3>Bons en attente</h3>
              <p class="stat-value">{{ stats.bonsEnAttente }}</p>
              <span class="stat-change">À récupérer</span>
            </div>
          </div>
          <div class="stat-card info">
            <div class="stat-icon">👷</div>
            <div class="stat-info">
              <h3>Mon Atelier</h3>
              <p class="stat-value">{{ stats.atelierNom }}</p>
              <span class="stat-change">Actif</span>
            </div>
          </div>
        </div>

        <div class="quick-actions">
          <h2>Mes Actions</h2>
          <div class="actions-grid">
            <a routerLink="/bons-sortie/new" class="action-card highlight">
              <span class="action-icon">📝</span>
              <span>Nouvelle Demande</span>
            </a>
            <a routerLink="/bons-sortie" class="action-card">
              <span class="action-icon">📄</span>
              <span>Mes Bons de Sortie</span>
            </a>
            <a routerLink="/produits" class="action-card">
              <span class="action-icon">📦</span>
              <span>Voir Stock Disponible</span>
            </a>
            <a routerLink="/atelier/historique" class="action-card">
              <span class="action-icon">📜</span>
              <span>Historique</span>
            </a>
          </div>
        </div>

        <div class="my-requests">
          <h2>Mes Demandes Récentes</h2>
          <div class="requests-list">
            <div class="request-item pending">
              <span class="request-id">#BS-2024-001</span>
              <span class="request-items">3 articles</span>
              <span class="request-status status-pending">En attente</span>
            </div>
            <div class="request-item approved">
              <span class="request-id">#BS-2024-002</span>
              <span class="request-items">5 articles</span>
              <span class="request-status status-approved">Approuvé</span>
            </div>
            <div class="request-item delivered">
              <span class="request-id">#BS-2024-003</span>
              <span class="request-items">2 articles</span>
              <span class="request-status status-delivered">Livré</span>
            </div>
          </div>
        </div>
      </div>

      <!-- User Dashboard (Default) -->
      <div class="dashboard-content" *ngIf="userRole === 'USER' || !['ADMIN', 'RESPONSABLE_ACHATS', 'MAGASINIER', 'CHEF_ATELIER'].includes(userRole)">
        <div class="stats-grid">
          <div class="stat-card primary">
            <div class="stat-icon">📦</div>
            <div class="stat-info">
              <h3>Produits Disponibles</h3>
              <p class="stat-value">{{ stats.totalProduits }}</p>
              <span class="stat-change">En catalogue</span>
            </div>
          </div>
          <div class="stat-card success">
            <div class="stat-icon">🏭</div>
            <div class="stat-info">
              <h3>Fournisseurs</h3>
              <p class="stat-value">{{ stats.totalFournisseurs }}</p>
              <span class="stat-change">Partenaires</span>
            </div>
          </div>
        </div>

        <div class="quick-actions">
          <h2>Navigation</h2>
          <div class="actions-grid">
            <a routerLink="/produits" class="action-card">
              <span class="action-icon">📦</span>
              <span>Voir Produits</span>
            </a>
            <a routerLink="/fournisseurs" class="action-card">
              <span class="action-icon">🏭</span>
              <span>Voir Fournisseurs</span>
            </a>
          </div>
        </div>

        <div class="user-info">
          <h2>Mon Profil</h2>
          <div class="profile-card">
            <div class="profile-avatar">{{ getInitials() }}</div>
            <div class="profile-details">
              <p class="profile-name">{{ user?.prenom }} {{ user?.nom }}</p>
              <p class="profile-email">{{ user?.email }}</p>
              <p class="profile-role">Rôle: {{ getRoleDisplayName() }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Base Dashboard Styles */
    .dashboard {
      min-height: 100vh;
      background: #f5f7fa;
    }

    /* Role-specific themes */
    .dashboard-admin { --theme-color: #6366f1; --theme-light: #e0e7ff; }
    .dashboard-responsable_achats { --theme-color: #0891b2; --theme-light: #cffafe; }
    .dashboard-magasinier { --theme-color: #059669; --theme-light: #d1fae5; }
    .dashboard-chef_atelier { --theme-color: #d97706; --theme-light: #fef3c7; }
    .dashboard-user { --theme-color: #6b7280; --theme-light: #f3f4f6; }

    /* Header */
    .dashboard-header {
      background: linear-gradient(135deg, var(--theme-color) 0%, color-mix(in srgb, var(--theme-color) 80%, black) 100%);
      color: white;
      padding: 2rem;
      margin-bottom: 2rem;
    }

    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .welcome-section h1 {
      font-size: 1.75rem;
      margin: 0 0 0.5rem;
      font-weight: 600;
    }

    .role-badge {
      display: inline-block;
      padding: 0.35rem 1rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 500;
      background: rgba(255,255,255,0.2);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .date {
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .btn-logout {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.3);
      border-radius: 8px;
      color: white;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-logout:hover {
      background: rgba(255,255,255,0.25);
    }

    /* Dashboard Content */
    .dashboard-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem 2rem;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .stat-icon {
      font-size: 2.5rem;
      line-height: 1;
    }

    .stat-info h3 {
      font-size: 0.85rem;
      color: #6b7280;
      margin: 0 0 0.5rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      margin: 0;
      color: #1f2937;
    }

    .stat-change {
      font-size: 0.8rem;
      color: #6b7280;
    }

    .stat-change.positive { color: #059669; }
    .stat-change.negative { color: #dc2626; }

    .stat-card.primary { border-left: 4px solid var(--theme-color); }
    .stat-card.success { border-left: 4px solid #059669; }
    .stat-card.warning { border-left: 4px solid #d97706; }
    .stat-card.danger { border-left: 4px solid #dc2626; }
    .stat-card.info { border-left: 4px solid #0891b2; }

    /* Quick Actions */
    .quick-actions, .recent-activity, .pending-orders, .stock-alerts, .my-requests, .user-info {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .quick-actions h2, .recent-activity h2, .pending-orders h2, .stock-alerts h2, .my-requests h2, .user-info h2 {
      font-size: 1.1rem;
      margin: 0 0 1.25rem;
      color: #374151;
      font-weight: 600;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .action-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 1.25rem 1rem;
      background: #f9fafb;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      text-decoration: none;
      color: #374151;
      transition: all 0.2s;
      text-align: center;
    }

    .action-card:hover {
      border-color: var(--theme-color);
      background: var(--theme-light);
      transform: translateY(-2px);
    }

    .action-card.highlight {
      background: var(--theme-light);
      border-color: var(--theme-color);
    }

    .action-icon {
      font-size: 2rem;
    }

    .action-card span:last-child {
      font-size: 0.9rem;
      font-weight: 500;
    }

    /* Activity List */
    .activity-list, .alerts-list, .requests-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item, .alert-item, .request-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f9fafb;
      border-radius: 10px;
    }

    .activity-icon, .alert-icon {
      font-size: 1.5rem;
    }

    .activity-content p, .alert-content p {
      margin: 0;
      font-weight: 500;
      color: #374151;
    }

    .activity-time, .alert-qty {
      font-size: 0.8rem;
      color: #6b7280;
    }

    /* Orders List */
    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .order-item {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr auto;
      gap: 1rem;
      padding: 1rem;
      background: #f9fafb;
      border-radius: 10px;
      align-items: center;
    }

    .order-id {
      font-weight: 600;
      color: var(--theme-color);
    }

    .order-status {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
      background: #fef3c7;
      color: #92400e;
    }

    /* Request Items */
    .request-item {
      display: grid;
      grid-template-columns: 1fr 1fr auto;
      gap: 1rem;
    }

    .request-id {
      font-weight: 600;
      color: var(--theme-color);
    }

    .request-status {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .status-pending { background: #fef3c7; color: #92400e; }
    .status-approved { background: #d1fae5; color: #065f46; }
    .status-delivered { background: #dbeafe; color: #1e40af; }

    /* Alert Items */
    .alert-item.critical {
      background: #fef2f2;
      border-left: 4px solid #dc2626;
    }

    .alert-item.warning {
      background: #fffbeb;
      border-left: 4px solid #d97706;
    }

    /* Profile Card */
    .profile-card {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 1.5rem;
      background: #f9fafb;
      border-radius: 12px;
    }

    .profile-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: var(--theme-color);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.75rem;
      font-weight: 600;
    }

    .profile-details {
      flex: 1;
    }

    .profile-name {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 0.25rem;
      color: #1f2937;
    }

    .profile-email, .profile-role {
      margin: 0.25rem 0;
      color: #6b7280;
      font-size: 0.9rem;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .dashboard-header {
        padding: 1.5rem;
      }

      .header-content {
        flex-direction: column;
        align-items: flex-start;
      }

      .welcome-section h1 {
        font-size: 1.35rem;
      }

      .dashboard-content {
        padding: 0 1rem 1rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .actions-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .order-item, .request-item {
        grid-template-columns: 1fr;
        gap: 0.5rem;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);

  user: User | null = null;
  userRole: string = 'USER';
  currentDate = new Date();

  stats = {
    totalUsers: 25,
    totalProduits: 150,
    totalFournisseurs: 12,
    stockCritique: 8,
    commandesEnCours: 5,
    commandesValidees: 23,
    budgetMensuel: 125000,
    entreesJour: 12,
    sortiesJour: 8,
    demandesEnCours: 3,
    demandesValidees: 15,
    bonsEnAttente: 2,
    atelierNom: 'Atelier Principal',
    valorisationStock: 500000
  };

  private roleDisplayNames: Record<string, string> = {
    'ADMIN': 'Administrateur',
    'RESPONSABLE_ACHATS': 'Responsable des Achats',
    'MAGASINIER': 'Magasinier',
    'CHEF_ATELIER': 'Chef d\'Atelier',
    'USER': 'Utilisateur'
  };

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.userRole = this.authService.getUserRole();
    this.loadStats();
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  }

  getRoleDisplayName(): string {
    return this.roleDisplayNames[this.userRole] || 'Utilisateur';
  }

  getInitials(): string {
    const prenom = this.user?.prenom || '';
    const nom = this.user?.nom || '';
    return (prenom.charAt(0) + nom.charAt(0)).toUpperCase() || 'U';
  }

  logout(): void {
    this.authService.logout();
  }

  loadStats(): void {
    // In a real app, you would load stats from API based on role
    // For now, using mock data
  }
}
