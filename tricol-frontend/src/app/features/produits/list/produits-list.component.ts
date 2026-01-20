import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProduitService } from '../../../core/services/api.service';
import { Produit } from '../../../core/models/entities.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-produits-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Produits</h1>
        <button *ngIf="canCreate" routerLink="/produits/new" class="btn-primary">Nouveau Produit</button>
      </div>

      <div class="filters">
        <input type="text" [(ngModel)]="categorieFilter" (ngModelChange)="onFilter()" placeholder="Filtrer par catégorie...">
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th>Référence</th>
            <th>Nom</th>
            <th>Catégorie</th>
            <th>Prix Unitaire</th>
            <th>Stock</th>
            <th>Point Commande</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let p of produits">
            <td>{{ p.reference }}</td>
            <td>{{ p.nom }}</td>
            <td>{{ p.categorie }}</td>
            <td>{{ p.prixUnitaire | number:'1.2-2' }} MAD</td>
            <td>
              <span [class.stock-critique]="p.stockActuel <= p.pointCommande">
                {{ p.stockActuel }} {{ p.uniteMesure }}
              </span>
            </td>
            <td>{{ p.pointCommande }}</td>
            <td>
              <button *ngIf="canUpdate" [routerLink]="['/produits/edit', p.id]" class="btn-sm">Modifier</button>
              <button *ngIf="canDelete" (click)="delete(p.id)" class="btn-sm btn-danger">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="pagination">
        <button (click)="previousPage()" [disabled]="page === 0">Précédent</button>
        <span>Page {{ page + 1 }}</span>
        <button (click)="nextPage()" [disabled]="!hasMore">Suivant</button>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 2rem; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .filters { margin-bottom: 1rem; }
    .filters input { width: 100%; max-width: 400px; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; }
    .data-table { width: 100%; background: white; border-collapse: collapse; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .data-table th, .data-table td { padding: 1rem; text-align: left; border-bottom: 1px solid #ddd; }
    .data-table th { background: #f8f9fa; font-weight: 600; }
    .stock-critique { color: #dc3545; font-weight: bold; }
    .btn-primary { padding: 0.5rem 1rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .btn-sm { padding: 0.25rem 0.5rem; margin-right: 0.5rem; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .btn-danger { background: #dc3545; }
    .pagination { display: flex; justify-content: center; align-items: center; gap: 1rem; margin-top: 2rem; }
  `]
})
export class ProduitsListComponent implements OnInit {
  private produitService = inject(ProduitService);
  private authService = inject(AuthService);

  produits: Produit[] = [];
  categorieFilter = '';
  page = 0;
  size = 10;
  hasMore = true;

  canCreate = this.authService.hasPermission('CREATE_PRODUIT');
  canUpdate = this.authService.hasPermission('UPDATE_PRODUIT');
  canDelete = this.authService.hasPermission('DELETE_PRODUIT');

  ngOnInit(): void {
    this.loadProduits();
  }

  loadProduits(): void {
    this.produitService.getAll(this.page, this.size, this.categorieFilter).subscribe({
      next: (data) => {
        this.produits = data.content;
        this.hasMore = !data.last;
      }
    });
  }

  onFilter(): void {
    this.page = 0;
    this.loadProduits();
  }

  nextPage(): void {
    this.page++;
    this.loadProduits();
  }

  previousPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadProduits();
    }
  }

  delete(id: number): void {
    if (confirm('Confirmer la suppression ?')) {
      this.produitService.delete(id).subscribe({
        next: () => this.loadProduits()
      });
    }
  }
}
