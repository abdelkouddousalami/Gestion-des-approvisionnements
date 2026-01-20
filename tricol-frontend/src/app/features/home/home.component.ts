import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PublicNavbarComponent } from '../../shared/components/public-navbar/public-navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, PublicNavbarComponent, FooterComponent],
  template: `
    <div class="home-page">
      <app-public-navbar />

      <section class="hero">
        <div class="hero-content">
          <h1>Gérez vos approvisionnements simplement</h1>
          <p>TRICOL est une solution complète pour gérer vos stocks, fournisseurs et commandes en toute simplicité.</p>
          <div class="hero-actions">
            <a routerLink="/auth/register" class="btn btn-primary">Commencer</a>
            <a routerLink="/contact" class="btn btn-outline">Nous contacter</a>
          </div>
        </div>
      </section>

      <section class="features">
        <div class="container">
          <h2>Fonctionnalités</h2>
          <div class="features-grid">
            @for (feature of features; track feature.title) {
              <div class="feature-card">
                <div class="feature-icon">{{ feature.icon }}</div>
                <h3>{{ feature.title }}</h3>
                <p>{{ feature.description }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <section class="how-it-works">
        <div class="container">
          <h2>Comment ça marche</h2>
          <div class="steps">
            @for (step of steps; track step.number) {
              <div class="step">
                <div class="step-number">{{ step.number }}</div>
                <h3>{{ step.title }}</h3>
                <p>{{ step.description }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <section class="cta">
        <div class="container">
          <h2>Prêt à commencer ?</h2>
          <p>Créez votre compte gratuitement et commencez à gérer vos approvisionnements dès aujourd'hui.</p>
          <a routerLink="/auth/register" class="btn btn-primary">Créer un compte</a>
        </div>
      </section>

      <app-footer />
    </div>
  `,
  styles: [`
    .home-page {
      min-height: 100vh;
    }

    .hero {
      padding: 8rem 2rem 5rem;
      text-align: center;
      background: #fafafa;
      border-bottom: 1px solid #e5e5e5;
    }

    .hero-content {
      max-width: 700px;
      margin: 0 auto;
    }

    .hero h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      line-height: 1.2;
    }

    .hero p {
      font-size: 1.1rem;
      color: #555;
      margin-bottom: 2rem;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 500;
    }

    .btn-primary {
      background: #000;
      color: white;
    }

    .btn-primary:hover {
      background: #222;
    }

    .btn-outline {
      border: 1px solid #ddd;
      color: #333;
    }

    .btn-outline:hover {
      border-color: #000;
    }

    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .features {
      padding: 5rem 0;
    }

    .features h2 {
      text-align: center;
      font-size: 2rem;
      margin-bottom: 3rem;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }

    .feature-card {
      padding: 2rem;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
    }

    .feature-icon {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    .feature-card h3 {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
    }

    .feature-card p {
      color: #666;
      font-size: 0.95rem;
      line-height: 1.5;
    }

    .how-it-works {
      padding: 5rem 0;
      background: #fafafa;
      border-top: 1px solid #e5e5e5;
      border-bottom: 1px solid #e5e5e5;
    }

    .how-it-works h2 {
      text-align: center;
      font-size: 2rem;
      margin-bottom: 3rem;
    }

    .steps {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }

    .step {
      text-align: center;
    }

    .step-number {
      width: 40px;
      height: 40px;
      background: #000;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
      font-weight: 600;
    }

    .step h3 {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
    }

    .step p {
      color: #666;
      font-size: 0.95rem;
    }

    .cta {
      padding: 5rem 0;
      text-align: center;
    }

    .cta h2 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    .cta p {
      color: #666;
      margin-bottom: 2rem;
    }

    @media (max-width: 768px) {
      .hero h1 {
        font-size: 2rem;
      }

      .hero-actions {
        flex-direction: column;
      }

      .features-grid,
      .steps {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent {
  features = [
    { icon: '📦', title: 'Gestion des stocks', description: 'Suivez vos niveaux de stock en temps réel et recevez des alertes automatiques.' },
    { icon: '🤝', title: 'Fournisseurs', description: 'Gérez vos relations fournisseurs et centralisez toutes vos informations.' },
    { icon: '📋', title: 'Commandes', description: 'Créez et suivez vos commandes facilement avec un historique complet.' }
  ];

  steps = [
    { number: '1', title: 'Créez votre compte', description: 'Inscrivez-vous gratuitement en quelques secondes.' },
    { number: '2', title: 'Configurez', description: 'Ajoutez vos produits et fournisseurs.' },
    { number: '3', title: 'Gérez', description: 'Commencez à gérer vos approvisionnements.' }
  ];
}
