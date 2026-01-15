import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
  { path: 'about', loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent) },
  { path: 'contact', loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent) },
  {
    path: 'auth',
    children: [
      { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) }
    ]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'fournisseurs',
    canActivate: [authGuard],
    children: [
      { path: '', loadComponent: () => import('./features/fournisseurs/list/fournisseurs-list.component').then(m => m.FournisseursListComponent) },
      { path: 'new', loadComponent: () => import('./features/fournisseurs/form/fournisseur-form.component').then(m => m.FournisseurFormComponent) },
      { path: 'edit/:id', loadComponent: () => import('./features/fournisseurs/form/fournisseur-form.component').then(m => m.FournisseurFormComponent) }
    ]
  },
  {
    path: 'produits',
    canActivate: [authGuard],
    children: [
      { path: '', loadComponent: () => import('./features/produits/list/produits-list.component').then(m => m.ProduitsListComponent) },
      { path: 'new', loadComponent: () => import('./features/produits/form/produit-form.component').then(m => m.ProduitFormComponent) },
      { path: 'edit/:id', loadComponent: () => import('./features/produits/form/produit-form.component').then(m => m.ProduitFormComponent) }
    ]
  },
  { path: '403', loadComponent: () => import('./shared/components/forbidden.component').then(m => m.ForbiddenComponent) },
  { path: '**', loadComponent: () => import('./shared/components/not-found.component').then(m => m.NotFoundComponent) }
];
