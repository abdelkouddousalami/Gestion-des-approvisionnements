export interface Fournisseur {
  id: number;
  raisonSociale: string;
  adresse: string;
  ville: string;
  personneContact: string;
  email: string;
  telephone: string;
  ice: string;
}

export interface Produit {
  id: number;
  reference: string;
  nom: string;
  description: string;
  prixUnitaire: number;
  categorie: string;
  stockActuel: number;
  pointCommande: number;
  uniteMesure: string;
}

export interface Commande {
  id: number;
  numeroCommande: string;
  fournisseur: Fournisseur;
  dateCommande: string;
  statut: 'EN_ATTENTE' | 'VALIDEE' | 'LIVREE' | 'ANNULEE';
  montantTotal: number;
  lignesCommande: LigneCommande[];
}

export interface LigneCommande {
  id?: number;
  produit: Produit;
  quantite: number;
  prixUnitaire: number;
}

export interface Lot {
  id: number;
  numeroLot: string;
  produit: Produit;
  quantiteInitiale: number;
  quantiteRestante: number;
  prixUnitaire: number;
  dateEntree: string;
  commande?: Commande;
}

export interface MouvementStock {
  id: number;
  produit: Produit;
  type: 'ENTREE' | 'SORTIE';
  quantite: number;
  dateCreation: string;
  lot?: Lot;
  bonSortie?: BonSortie;
}

export interface BonSortie {
  id: number;
  numero: string;
  dateSortie: string;
  atelier: string;
  motif: 'PRODUCTION' | 'MAINTENANCE' | 'AUTRE';
  statut: 'BROUILLON' | 'VALIDE' | 'ANNULE';
  lignesSortie: LigneSortie[];
}

export interface LigneSortie {
  id?: number;
  produit: Produit;
  quantite: number;
}
