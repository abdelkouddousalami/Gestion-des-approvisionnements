import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <a routerLink="/" class="logo">TRICOL</a>
        
        <div class="auth-card">
          <h1>Connexion</h1>
          <p class="subtitle">Connectez-vous à votre compte</p>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="username">Nom d'utilisateur</label>
              <input type="text" id="username" formControlName="username" placeholder="Votre nom d'utilisateur">
            </div>
            
            <div class="form-group">
              <label for="password">Mot de passe</label>
              <input type="password" id="password" formControlName="password" placeholder="Votre mot de passe">
            </div>

            @if (errorMessage) {
              <div class="error-message">{{ errorMessage }}</div>
            }
            
            <button type="submit" class="btn btn-primary" [disabled]="loginForm.invalid || loading">
              {{ loading ? 'Connexion...' : 'Se connecter' }}
            </button>
          </form>
          
          <div class="auth-footer">
            <p>Pas encore de compte ? <a routerLink="/auth/register">S'inscrire</a></p>
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
      max-width: 400px;
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
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      
      this.authService.login(this.loginForm.value).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err) => {
          console.error('Login error:', err);
          this.errorMessage = 'Une erreur est survenue';
          this.loading = false;
        }
      });
    }
  }
}
