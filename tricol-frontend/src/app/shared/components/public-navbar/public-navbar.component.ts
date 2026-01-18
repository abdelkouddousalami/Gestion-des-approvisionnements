import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-public-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar" [class.scrolled]="isScrolled()">
      <div class="nav-container">
        <a routerLink="/" class="logo">TRICOL</a>

        <button class="mobile-toggle" (click)="toggleMenu()">
          <span class="hamburger" [class.active]="menuOpen()"></span>
        </button>

        <div class="nav-menu" [class.active]="menuOpen()">
          <div class="nav-links">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="closeMenu()">Accueil</a>
            <a routerLink="/about" routerLinkActive="active" (click)="closeMenu()">À propos</a>
            <a routerLink="/contact" routerLinkActive="active" (click)="closeMenu()">Contact</a>
          </div>
          <div class="nav-actions">
            <a routerLink="/auth/login" class="btn btn-outline" (click)="closeMenu()">Se connecter</a>
            <a routerLink="/auth/register" class="btn btn-primary" (click)="closeMenu()">S'inscrire</a>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      padding: 1rem 2rem;
      background: white;
      border-bottom: 1px solid #e5e5e5;
    }

    .navbar.scrolled {
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .nav-container {
      max-width: 1100px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      color: #000;
      text-decoration: none;
      letter-spacing: -0.5px;
    }

    .nav-menu {
      display: flex;
      align-items: center;
      gap: 3rem;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
    }

    .nav-links a {
      color: #555;
      text-decoration: none;
      font-size: 0.95rem;
    }

    .nav-links a:hover,
    .nav-links a.active {
      color: #000;
    }

    .nav-actions {
      display: flex;
      gap: 0.75rem;
    }

    .btn {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
      text-decoration: none;
      border-radius: 4px;
    }

    .btn-outline {
      color: #333;
      border: 1px solid #ddd;
    }

    .btn-outline:hover {
      border-color: #000;
    }

    .btn-primary {
      background: #000;
      color: white;
    }

    .btn-primary:hover {
      background: #222;
    }

    .mobile-toggle {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
    }

    .hamburger {
      display: block;
      width: 20px;
      height: 2px;
      background: #000;
      position: relative;
    }

    .hamburger::before,
    .hamburger::after {
      content: '';
      position: absolute;
      width: 20px;
      height: 2px;
      background: #000;
    }

    .hamburger::before { top: -6px; }
    .hamburger::after { top: 6px; }

    .hamburger.active { background: transparent; }
    .hamburger.active::before { top: 0; transform: rotate(45deg); }
    .hamburger.active::after { top: 0; transform: rotate(-45deg); }

    @media (max-width: 768px) {
      .mobile-toggle { display: block; }

      .nav-menu {
        position: fixed;
        top: 0;
        right: -100%;
        width: 260px;
        height: 100vh;
        background: white;
        flex-direction: column;
        padding: 4rem 1.5rem;
        border-left: 1px solid #e5e5e5;
        transition: right 0.3s ease;
      }

      .nav-menu.active { right: 0; }

      .nav-links {
        flex-direction: column;
        gap: 1rem;
      }

      .nav-actions {
        flex-direction: column;
        width: 100%;
      }

      .nav-actions .btn {
        text-align: center;
      }
    }
  `]
})
export class PublicNavbarComponent {
  isScrolled = signal(false);
  menuOpen = signal(false);

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled.set(window.scrollY > 50);
  }

  toggleMenu() {
    this.menuOpen.update(v => !v);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }
}
