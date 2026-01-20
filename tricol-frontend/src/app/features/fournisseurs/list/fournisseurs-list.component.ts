import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FournisseurService } from '../../../core/services/api.service';
import { Fournisseur } from '../../../core/models/entities.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-fournisseurs-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Fournisseurs</h1>
        <button *ngIf="canCreate" routerLink="/fournisseurs/new" class="btn-primary">Nouveau Fournisseur</button>
      </div>

      <div class="search-bar">
        <input type="text" [(ngModel)]="searchTerm" (ngModelChange)="onSearch()" placeholder="Rechercher...">
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th>Raison Sociale</th>
            <th>Ville</th>
            <th>Contact</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let f of fournisseurs">
            <td>{{ f.raisonSociale }}</td>
            <td>{{ f.ville }}</td>
            <td>{{ f.personneContact }}</td>
            <td>{{ f.email }}</td>
            <td>{{ f.telephone }}</td>
            <td>
              <button *ngIf="canUpdate" [routerLink]="['/fournisseurs/edit', f.id]" class="btn-sm">Modifier</button>
              <button *ngIf="canDelete" (click)="delete(f.id)" class="btn-sm btn-danger">Supprimer</button>
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
    .search-bar { margin-bottom: 1rem; }
    .search-bar input { width: 100%; max-width: 400px; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; }
    .data-table { width: 100%; background: white; border-collapse: collapse; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .data-table th, .data-table td { padding: 1rem; text-align: left; border-bottom: 1px solid #ddd; }
    .data-table th { background: #f8f9fa; font-weight: 600; }
    .btn-primary { padding: 0.5rem 1rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .btn-sm { padding: 0.25rem 0.5rem; margin-right: 0.5rem; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .btn-danger { background: #dc3545; }
    .pagination { display: flex; justify-content: center; align-items: center; gap: 1rem; margin-top: 2rem; }
  `]
})
export class FournisseursListComponent implements OnInit {
  private fournisseurService = inject(FournisseurService);
  private authService = inject(AuthService);

  fournisseurs: Fournisseur[] = [];
  searchTerm = '';
  page = 0;
  size = 10;
  hasMore = true;

  canCreate = this.authService.hasPermission('CREATE_FOURNISSEUR');
  canUpdate = this.authService.hasPermission('UPDATE_FOURNISSEUR');
  canDelete = this.authService.hasPermission('DELETE_FOURNISSEUR');

  ngOnInit(): void {
    this.loadFournisseurs();
  }

  loadFournisseurs(): void {
    this.fournisseurService.getAll(this.page, this.size, this.searchTerm).subscribe({
      next: (data) => {
        this.fournisseurs = data.content;
        this.hasMore = !data.last;
      }
    });
  }

  onSearch(): void {
    this.page = 0;
    this.loadFournisseurs();
  }

  nextPage(): void {
    this.page++;
    this.loadFournisseurs();
  }

  previousPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadFournisseurs();
    }
  }

  delete(id: number): void {
    if (confirm('Confirmer la suppression ?')) {
      this.fournisseurService.delete(id).subscribe({
        next: () => this.loadFournisseurs()
      });
    }
  }
}
