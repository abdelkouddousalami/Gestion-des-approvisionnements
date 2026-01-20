import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PublicNavbarComponent } from '../../shared/components/public-navbar/public-navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink, PublicNavbarComponent, FooterComponent],
  template: `
    <div class="about-page">
      <app-public-navbar />

      <section class="hero">
        <div class="container">
          <h1>À propos de TRICOL</h1>
          <p>Une solution simple pour la gestion des approvisionnements</p>
        </div>
      </section>

      <section class="story">
        <div class="container">
          <div class="story-content">
            <h2>Notre mission</h2>
            <p>TRICOL a été créé pour simplifier la gestion des approvisionnements des entreprises. Notre objectif est de fournir une solution intuitive et efficace qui permet aux équipes de se concentrer sur l'essentiel.</p>
            <p>Nous croyons que la gestion des stocks ne devrait pas être compliquée. C'est pourquoi nous avons développé une plateforme qui combine simplicité d'utilisation et fonctionnalités puissantes.</p>
          </div>
        </div>
      </section>

      <section class="values">
        <div class="container">
          <h2>Nos valeurs</h2>
          <div class="values-grid">
            @for (value of values; track value.title) {
              <div class="value-card">
                <div class="value-icon">{{ value.icon }}</div>
                <h3>{{ value.title }}</h3>
                <p>{{ value.description }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <section class="team">
        <div class="container">
          <h2>Notre équipe</h2>
          <div class="team-grid">
            @for (member of team; track member.name) {
              <div class="team-card">
                <div class="member-avatar">{{ member.initials }}</div>
                <h3>{{ member.name }}</h3>
                <p>{{ member.role }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <section class="cta">
        <div class="container">
          <h2>Rejoignez-nous</h2>
          <p>Découvrez comment TRICOL peut vous aider à gérer vos approvisionnements.</p>
          <a routerLink="/auth/register" class="btn btn-primary">Créer un compte</a>
        </div>
      </section>

      <app-footer />
    </div>
  `,
  styles: [`
    .about-page {
      min-height: 100vh;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .hero {
      padding: 8rem 2rem 4rem;
      text-align: center;
      background: #fafafa;
      border-bottom: 1px solid #e5e5e5;
    }

    .hero h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .hero p {
      color: #666;
      font-size: 1.1rem;
    }

    .story {
      padding: 4rem 0;
    }

    .story h2 {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .story p {
      color: #555;
      line-height: 1.7;
      margin-bottom: 1rem;
    }

    .values {
      padding: 4rem 0;
      background: #fafafa;
      border-top: 1px solid #e5e5e5;
      border-bottom: 1px solid #e5e5e5;
    }

    .values h2 {
      text-align: center;
      font-size: 1.5rem;
      margin-bottom: 2.5rem;
    }

    .values-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }

    .value-card {
      text-align: center;
    }

    .value-icon {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    .value-card h3 {
      font-size: 1rem;
      margin-bottom: 0.5rem;
    }

    .value-card p {
      color: #666;
      font-size: 0.9rem;
      line-height: 1.5;
    }

    .team {
      padding: 4rem 0;
    }

    .team h2 {
      text-align: center;
      font-size: 1.5rem;
      margin-bottom: 2.5rem;
    }

    .team-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }

    .team-card {
      text-align: center;
    }

    .member-avatar {
      width: 60px;
      height: 60px;
      background: #000;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
      font-weight: 600;
    }

    .team-card h3 {
      font-size: 1rem;
      margin-bottom: 0.25rem;
    }

    .team-card p {
      color: #666;
      font-size: 0.9rem;
    }

    .cta {
      padding: 4rem 0;
      text-align: center;
      background: #fafafa;
      border-top: 1px solid #e5e5e5;
    }

    .cta h2 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }

    .cta p {
      color: #666;
      margin-bottom: 1.5rem;
    }

    .btn {
      display: inline-block;
      padding: 0.75rem 1.5rem;
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

    @media (max-width: 768px) {
      .hero h1 {
        font-size: 2rem;
      }

      .values-grid,
      .team-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AboutComponent {
  values = [
    { icon: '✨', title: 'Simplicité', description: 'Une interface intuitive et facile à utiliser.' },
    { icon: '🔒', title: 'Fiabilité', description: 'Des données sécurisées et toujours disponibles.' },
    { icon: '🚀', title: 'Efficacité', description: 'Des outils pour gagner du temps au quotidien.' }
  ];

  team = [
    { name: 'Jean Dupont', role: 'Fondateur', initials: 'JD' },
    { name: 'Marie Martin', role: 'Développement', initials: 'MM' },
    { name: 'Pierre Bernard', role: 'Design', initials: 'PB' }
  ];
}
