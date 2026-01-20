import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FournisseurService } from '../../../core/services/api.service';

@Component({
  selector: 'app-fournisseur-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-container">
      <h1>{{ isEdit ? 'Modifier' : 'Nouveau' }} Fournisseur</h1>
      
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-card">
        <div class="form-row">
          <div class="form-group">
            <label>Raison Sociale *</label>
            <input type="text" formControlName="raisonSociale" class="form-control">
          </div>
          
          <div class="form-group">
            <label>ICE *</label>
            <input type="text" formControlName="ice" class="form-control">
          </div>
        </div>

        <div class="form-group">
          <label>Adresse *</label>
          <input type="text" formControlName="adresse" class="form-control">
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Ville *</label>
            <input type="text" formControlName="ville" class="form-control">
          </div>
          
          <div class="form-group">
            <label>Personne de Contact *</label>
            <input type="text" formControlName="personneContact" class="form-control">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Email *</label>
            <input type="email" formControlName="email" class="form-control">
          </div>
          
          <div class="form-group">
            <label>Téléphone *</label>
            <input type="tel" formControlName="telephone" class="form-control">
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
export class FournisseurFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private fournisseurService = inject(FournisseurService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form: FormGroup;
  isEdit = false;
  loading = false;
  fournisseurId?: number;

  constructor() {
    this.form = this.fb.group({
      raisonSociale: ['', Validators.required],
      adresse: ['', Validators.required],
      ville: ['', Validators.required],
      personneContact: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      ice: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.fournisseurId = +id;
      this.loadFournisseur();
    }
  }

  loadFournisseur(): void {
    if (this.fournisseurId) {
      this.fournisseurService.getById(this.fournisseurId).subscribe({
        next: (data) => this.form.patchValue(data)
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.loading = true;
      const request = this.isEdit
        ? this.fournisseurService.update(this.fournisseurId!, this.form.value)
        : this.fournisseurService.create(this.form.value);

      request.subscribe({
        next: () => this.router.navigate(['/fournisseurs']),
        error: () => this.loading = false
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/fournisseurs']);
  }
}
