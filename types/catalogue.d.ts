// types/catalogue.d.ts

// Nécessite l'import de Location pour la cohérence des coordonnées
import { Location } from './auth'; 

/**
 * Interface pour une fiche produit mise en vente par un Producteur.
 */
export interface Product {
    id: string; // Identifiant unique du produit (clé primaire du Microservice Catalogue)
    producerId: string; // ID du Producteur (clé étrangère vers le Service Utilisateurs)
    name: string;
    description: string;
    category: string; // Ex: 'Céréales', 'Légumineuses', 'Élevage', 'Fruits'
    unit: string; // Unité de mesure pour la vente (ex: 'kg', 'sac de 100kg', 'pièce')
    price: number; // Prix de vente par unité (XOF)
    stock: number; // Quantité disponible
    images: string[];
    location?: Location; // Lieu de stockage du produit (pour la logistique)
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Interface pour les filtres de recherche que le Front-End peut appliquer sur le Catalogue.
 */
export interface ProductFilters {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: Location; // Pour filtrer par proximité ou région
    searchQuery?: string;
    producerId?: string; // Pour filtrer les produits d'un seul producteur
}