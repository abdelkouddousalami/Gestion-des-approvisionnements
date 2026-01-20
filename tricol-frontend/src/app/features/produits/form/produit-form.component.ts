import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProduitService } from '../../../core/services/api.service';

@Component({
  selector: 'app-produit-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-container">
      <h1>{{ isEdit ? 'Modifier' : 'Nouveau' }} Produit</h1>
      
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-card">
        <div class="form-row">
          <div class="form-group">
            <label>Référence *</label>
            <input type="text" formControlName="reference" class="form-control">
          </div>
          
          <div class="form-group">
            <label>Nom *</label>
            <input type="text" formControlName="nom" class="form-control">
          </div>
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea formControlName="description" class="form-control" rows="3"></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Prix Unitaire *</label>
            <input type="number" formControlName="prixUnitaire" class="form-control" step="0.01">
          </div>
          
          <div class="form-group">
            <label>Catégorie *</label>
            <input type="text" formControlName="categorie" class="form-control">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Point de Commande *</label>
            <input type="number" formControlName="pointCommande" class="form-control">
          </div>
          
          <div class="form-group">
            <label>Unité de Mesure *</label>
            <input type="text" formControlName="uniteMesure" class="form-control">
          </div>
        </div>

        <div class="form-actions">
          <button type="button" (click)="cancel()" class="btn-secondary">Annuler</button>
          <button type="submit" [disabled]="form.invalid || loading" class="btn-primary">
            {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .page-container { padding: 2rem; max-width: 800px; margin: 0 auto; }
    .form-card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    .form-control { width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; }
    .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; }
    .btn-primary, .btn-secondary { padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; }
    .btn-primary { background: #007bff; color: white; }
    .btn-secondary { background: #6c757d; color: white; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
  `]
})
export class ProduitFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private produitService = inject(ProduitService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form: FormGroup;
  isEdit = false;
  loading = false;
  produitId?: number;

  constructor() {
    this.form = this.fb.group({
      reference: ['', Validators.required],
      nom: ['', Validators.required],
      description: [''],
      prixUnitaire: [0, [Validators.required, Validators.min(0)]],
      categorie: ['', Validators.required],
      pointCommande: [0, [Validators.required, Validators.min(0)]],
      uniteMesure: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.produitId = +id;
      this.loadProduit();
    }
  }

  loadProduit(): void {
    if (this.produitId) {
      this.produitService.getById(this.produitId).subscribe({
        next: (data) => this.form.patchValue(data)
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.loading = true;
      const request = this.isEdit
        ? this.produitService.update(this.produitId!, this.form.value)
        : this.produitService.create(this.form.value);

      request.subscribe({
        next: () => this.router.navigate(['/produits']),
        error: () => this.loading = false
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/produits']);
  }
}
