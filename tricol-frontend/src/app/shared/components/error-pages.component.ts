import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="error-page">
      <h1>404</h1>
      <p>Page non trouvée</p>
      <a routerLink="/dashboard" class="btn">Retour au tableau de bord</a>
    </div>
  `,
  styles: [`
    .error-page { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; text-align: center; }
    h1 { font-size: 6rem; margin: 0; color: #007bff; }
    p { font-size: 1.5rem; margin: 1rem 0; }
    .btn { padding: 0.75rem 1.5rem; background: #007bff; color: white; text-decoration: none; border-radius: 4px; }
  `]
})
export class NotFoundComponent {}

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="error-page">
      <h1>403</h1>
      <p>Accès refusé</p>
      <a routerLink="/dashboard" class="btn">Retour au tableau de bord</a>
    </div>
  `,
  styles: [`
    .error-page { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; text-align: center; }
    h1 { font-size: 6rem; margin: 0; color: #dc3545; }
    p { font-size: 1.5rem; margin: 1rem 0; }
    .btn { padding: 0.75rem 1.5rem; background: #007bff; color: white; text-decoration: none; border-radius: 4px; }
  `]
})
export class ForbiddenComponent {}
