import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Fournisseur, Produit, Commande, Lot, MouvementStock, BonSortie } from '../models/entities.model';

@Injectable({ providedIn: 'root' })
export class FournisseurService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/fournisseurs`;

  getAll(page = 0, size = 10, search = ''): Observable<any> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (search) params = params.set('search', search);
    return this.http.get<any>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Fournisseur> {
    return this.http.get<Fournisseur>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<Fournisseur>): Observable<Fournisseur> {
    return this.http.post<Fournisseur>(this.apiUrl, data);
  }

  update(id: number, data: Partial<Fournisseur>): Observable<Fournisseur> {
    return this.http.put<Fournisseur>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

@Injectable({ providedIn: 'root' })
export class ProduitService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/produits`;

  getAll(page = 0, size = 10, categorie = ''): Observable<any> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (categorie) params = params.set('categorie', categorie);
    return this.http.get<any>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Produit> {
    return this.http.get<Produit>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<Produit>): Observable<Produit> {
    return this.http.post<Produit>(this.apiUrl, data);
  }

  update(id: number, data: Partial<Produit>): Observable<Produit> {
    return this.http.put<Produit>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getStockCritique(): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/stock-critique`);
  }
}

@Injectable({ providedIn: 'root' })
export class CommandeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/commandes`;

  getAll(params?: any): Observable<any> {
    return this.http.get<any>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Commande> {
    return this.http.get<Commande>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<Commande>): Observable<Commande> {
    return this.http.post<Commande>(this.apiUrl, data);
  }

  valider(id: number): Observable<Commande> {
    return this.http.put<Commande>(`${this.apiUrl}/${id}/valider`, {});
  }

  livrer(id: number): Observable<Commande> {
    return this.http.put<Commande>(`${this.apiUrl}/${id}/livrer`, {});
  }

  annuler(id: number): Observable<Commande> {
    return this.http.put<Commande>(`${this.apiUrl}/${id}/annuler`, {});
  }
}

@Injectable({ providedIn: 'root' })
export class StockService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/stock`;

  getLots(produitId: number): Observable<Lot[]> {
    return this.http.get<Lot[]>(`${this.apiUrl}/lots`, { params: { produitId } });
  }

  getMouvements(params?: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/mouvements`, { params });
  }

  getValorisation(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/valorisation`);
  }
}

@Injectable({ providedIn: 'root' })
export class BonSortieService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/bons-sortie`;

  getAll(params?: any): Observable<any> {
    return this.http.get<any>(this.apiUrl, { params });
  }

  getById(id: number): Observable<BonSortie> {
    return this.http.get<BonSortie>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<BonSortie>): Observable<BonSortie> {
    return this.http.post<BonSortie>(this.apiUrl, data);
  }

  valider(id: number): Observable<BonSortie> {
    return this.http.put<BonSortie>(`${this.apiUrl}/${id}/valider`, {});
  }

  annuler(id: number): Observable<BonSortie> {
    return this.http.put<BonSortie>(`${this.apiUrl}/${id}/annuler`, {});
  }
}
