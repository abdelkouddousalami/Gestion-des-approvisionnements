import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { RoleOption } from '../../../core/models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <a routerLink="/" class="logo">TRICOL</a>
        
        <div class="auth-card">
          <h1>Inscription</h1>
          <p class="subtitle">Créez votre compte gratuitement</p>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <div class="form-group">
                <label for="prenom">Prénom</label>
                <input type="text" id="prenom" formControlName="prenom" placeholder="Prénom">
              </div>
              <div class="form-group">
                <label for="nom">Nom</label>
                <input type="text" id="nom" formControlName="nom" placeholder="Nom">
              </div>
            </div>
            
            <div class="form-group">
              <label for="username">Nom d'utilisateur</label>
              <input type="text" id="username" formControlName="username" placeholder="Choisissez un nom d'utilisateur">
            </div>
            
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" formControlName="email" placeholder="votre.email@exemple.com">
            </div>
            
            <div class="form-group">
              <label for="password">Mot de passe</label>
              <input type="password" id="password" formControlName="password" placeholder="Minimum 6 caractères">
            </div>

            <div class="form-group">
              <label for="role">Rôle</label>
              <select id="role" formControlName="role" class="form-select">
                <option value="">-- Sélectionnez un rôle --</option>
                @for (role of availableRoles; track role.id) {
                  <option [value]="role.name">{{ getRoleDisplayName(role.name) }}</option>
                }
              </select>
              @if (registerForm.get('role')?.value) {
                <small class="role-description">{{ getRoleDescription(registerForm.get('role')?.value) }}</small>
              }
            </div>

            @if (errorMessage) {
              <div class="error-message">{{ errorMessage }}</div>
            }
            
            <button type="submit" class="btn btn-primary" [disabled]="registerForm.invalid || loading">
              {{ loading ? 'Création...' : 'Créer mon compte' }}
            </button>
          </form>
          
          <div class="auth-footer">
            <p>Déjà un compte ? <a routerLink="/auth/login">Se connecter</a></p>
            <a routerLink="/" class="back-link">← Retour à l'accueil</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fafafa;
      padding: 2rem;
    }

    .auth-container {
      width: 100%;
      max-width: 450px;
    }

    .logo {
      display: block;
      text-align: center;
      font-size: 1.5rem;
      font-weight: 700;
      color: #000;
      text-decoration: none;
      margin-bottom: 2rem;
    }

    .auth-card {
      background: white;
      padding: 2rem;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
    }

    .auth-card h1 {
      font-size: 1.5rem;
      margin-bottom: 0.25rem;
    }

    .subtitle {
      color: #666;
      margin-bottom: 1.5rem;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-size: 0.9rem;
      font-weight: 500;
    }

    .form-group input {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.95rem;
    }

    .form-group input:focus {
      outline: none;
      border-color: #000;
    }

    .form-select {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.95rem;
      background-color: white;
      cursor: pointer;
      width: 100%;
    }

    .form-select:focus {
      outline: none;
      border-color: #000;
    }

    .role-description {
      color: #666;
      font-size: 0.85rem;
      margin-top: 0.25rem;
      display: block;
    }

    .error-message {
      padding: 0.75rem;
      background: #fff5f5;
      border: 1px solid #fed7d7;
      color: #c53030;
      border-radius: 4px;
      font-size: 0.9rem;
    }

    .btn {
      padding: 0.75rem;
      font-size: 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    }

    .btn-primary {
      background: #000;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #222;
    }

    .btn-primary:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .auth-footer {
      margin-top: 1.5rem;
      text-align: center;
    }

    .auth-footer p {
      color: #666;
      margin-bottom: 1rem;
    }

    .auth-footer a {
      color: #000;
      font-weight: 500;
    }

    .back-link {
      font-size: 0.9rem;
      color: #666 !important;
    }

    @media (max-width: 480px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  loading = false;
  errorMessage = '';
  availableRoles: RoleOption[] = [];

  private roleDisplayNames: Record<string, string> = {
    'ADMIN': 'Administrateur',
    'RESPONSABLE_ACHATS': 'Responsable des achats',
    'MAGASINIER': 'Magasinier',
    'CHEF_ATELIER': 'Chef d\'atelier',
    'USER': 'Utilisateur'
  };

  private roleDescriptions: Record<string, string> = {
    'ADMIN': 'Accès complet au système',
    'RESPONSABLE_ACHATS': 'Gestion des achats et des fournisseurs',
    'MAGASINIER': 'Gestion des stocks et des entrepôts',
    'CHEF_ATELIER': 'Supervision des ateliers',
    'USER': 'Accès standard utilisateur'
  };

  constructor() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAvailableRoles();
  }

  loadAvailableRoles(): void {
    this.authService.getAvailableRoles().subscribe({
      next: (roles) => {
        this.availableRoles = roles;
      },
      error: (err) => {
        console.error('Error loading roles:', err);
        // Fallback roles if API fails
        this.availableRoles = [
          { id: 2, name: 'RESPONSABLE_ACHATS', description: 'Purchasing manager' },
          { id: 3, name: 'MAGASINIER', description: 'Warehouse keeper' },
          { id: 4, name: 'CHEF_ATELIER', description: 'Workshop supervisor' }
        ];
      }
    });
  }

  getRoleDisplayName(roleName: string): string {
    return this.roleDisplayNames[roleName] || roleName;
  }

  getRoleDescription(roleName: string): string {
    return this.roleDescriptions[roleName] || '';
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      
      const registerData = {
        username: this.registerForm.value.username,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        firstName: this.registerForm.value.prenom,
        lastName: this.registerForm.value.nom,
        roleName: this.registerForm.value.role
      };
      
      this.authService.register(registerData).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err) => {
          console.error('Registration error:', err);
          this.errorMessage = 'Une erreur est survenue';
          this.loading = false;
        }
      });
    }
  }
}
