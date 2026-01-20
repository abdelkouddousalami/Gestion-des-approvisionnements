import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PublicNavbarComponent } from '../../shared/components/public-navbar/public-navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PublicNavbarComponent, FooterComponent],
  template: `
    <div class="contact-page">
      <app-public-navbar />

      <section class="hero">
        <div class="container">
          <h1>Contactez-nous</h1>
          <p>Une question ? N'hésitez pas à nous écrire.</p>
        </div>
      </section>

      <section class="contact-section">
        <div class="container">
          <div class="contact-grid">
            <div class="contact-form-wrapper">
              <h2>Envoyez-nous un message</h2>
              
              @if (submitted()) {
                <div class="success-message">
                  <p>Merci pour votre message. Nous vous répondrons rapidement.</p>
                </div>
              } @else {
                <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="contact-form">
                  <div class="form-row">
                    <div class="form-group">
                      <label for="firstName">Prénom</label>
                      <input type="text" id="firstName" formControlName="firstName" placeholder="Votre prénom">
                    </div>
                    <div class="form-group">
                      <label for="lastName">Nom</label>
                      <input type="text" id="lastName" formControlName="lastName" placeholder="Votre nom">
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" formControlName="email" placeholder="votre.email@exemple.com">
                  </div>
                  
                  <div class="form-group">
                    <label for="subject">Sujet</label>
                    <input type="text" id="subject" formControlName="subject" placeholder="Sujet de votre message">
                  </div>
                  
                  <div class="form-group">
                    <label for="message">Message</label>
                    <textarea id="message" formControlName="message" rows="5" placeholder="Votre message..."></textarea>
                  </div>
                  
                  <button type="submit" class="btn btn-primary" [disabled]="contactForm.invalid">Envoyer</button>
                </form>
              }
            </div>
            
            <div class="contact-info">
              <h2>Informations</h2>
              
              <div class="info-item">
                <h3>Email</h3>
                <p>contact&#64;tricol.com</p>
              </div>
              
              <div class="info-item">
                <h3>Téléphone</h3>
                <p>+33 1 23 45 67 89</p>
              </div>
              
              <div class="info-item">
                <h3>Adresse</h3>
                <p>123 Rue de la Gestion<br>75001 Paris, France</p>
              </div>
              
              <div class="info-item">
                <h3>Horaires</h3>
                <p>Lun - Ven : 9h - 18h</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <app-footer />
    </div>
  `,
  styles: [`
    .contact-page {
      min-height: 100vh;
    }

    .container {
      max-width: 1000px;
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

    .contact-section {
      padding: 4rem 0;
    }

    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 4rem;
    }

    .contact-form-wrapper h2,
    .contact-info h2 {
      font-size: 1.25rem;
      margin-bottom: 1.5rem;
    }

    .contact-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
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

    .form-group input,
    .form-group textarea {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.95rem;
    }

    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #000;
    }

    .form-group textarea {
      resize: vertical;
    }

    .btn {
      padding: 0.75rem 1.5rem;
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

    .success-message {
      padding: 2rem;
      background: #f5f5f5;
      border: 1px solid #e5e5e5;
      border-radius: 4px;
      text-align: center;
    }

    .contact-info {
      padding-left: 2rem;
      border-left: 1px solid #e5e5e5;
    }

    .info-item {
      margin-bottom: 1.5rem;
    }

    .info-item h3 {
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .info-item p {
      color: #666;
      font-size: 0.95rem;
      line-height: 1.5;
    }

    @media (max-width: 768px) {
      .hero h1 {
        font-size: 2rem;
      }

      .contact-grid {
        grid-template-columns: 1fr;
        gap: 3rem;
      }

      .contact-info {
        padding-left: 0;
        border-left: none;
        border-top: 1px solid #e5e5e5;
        padding-top: 2rem;
      }

      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ContactComponent {
  contactForm: FormGroup;
  submitted = signal(false);

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      console.log('Form submitted:', this.contactForm.value);
      this.submitted.set(true);
    }
  }
}
