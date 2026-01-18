import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-main">
          <div class="footer-brand">
            <h3>TRICOL</h3>
            <p>Solution de gestion des approvisionnements</p>
          </div>
          
          <div class="footer-links">
            <div class="footer-col">
              <h4>Navigation</h4>
              <a routerLink="/">Accueil</a>
              <a routerLink="/about">À propos</a>
              <a routerLink="/contact">Contact</a>
            </div>
            
            <div class="footer-col">
              <h4>Compte</h4>
              <a routerLink="/auth/login">Se connecter</a>
              <a routerLink="/auth/register">S'inscrire</a>
            </div>
            
            <div class="footer-col">
              <h4>Contact</h4>
              <p>contact&#64;tricol.com</p>
              <p>+33 1 23 45 67 89</p>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2025 TRICOL. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #fafafa;
      border-top: 1px solid #e5e5e5;
      padding: 3rem 2rem 1.5rem;
    }

    .footer-container {
      max-width: 1100px;
      margin: 0 auto;
    }

    .footer-main {
      display: flex;
      justify-content: space-between;
      gap: 3rem;
      margin-bottom: 2rem;
    }

    .footer-brand h3 {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .footer-brand p {
      color: #666;
      font-size: 0.9rem;
    }

    .footer-links {
      display: flex;
      gap: 4rem;
    }

    .footer-col h4 {
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .footer-col a,
    .footer-col p {
      display: block;
      color: #666;
      text-decoration: none;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .footer-col a:hover {
      color: #000;
    }

    .footer-bottom {
      padding-top: 1.5rem;
      border-top: 1px solid #e5e5e5;
    }

    .footer-bottom p {
      color: #999;
      font-size: 0.85rem;
    }

    @media (max-width: 768px) {
      .footer-main {
        flex-direction: column;
        gap: 2rem;
      }

      .footer-links {
        flex-wrap: wrap;
        gap: 2rem;
      }
    }
  `]
})
export class FooterComponent {}
