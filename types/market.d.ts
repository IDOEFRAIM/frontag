// types/catalogue.d.ts

// Import de la structure de localisation 
import { Location } from './auth'; 


/**
 * Interface pour une fiche produit mise en vente par un Producteur.
 */
export interface Product {
    id: string; // Identifiant unique du produit (du Service Catalogue)
    producerId: string; // Clé étrangère vers l'ID du Producteur (du Service Utilisateurs)
    name: string;
    description: string;
    category: string; // Ex: 'Céréales', 'Légumineuses', 'Élevage'
    unit: string; // Unité de mesure pour la vente (ex: 'kg', 'sac de 100kg', 'pièce')
    price: number; // Prix de vente par unité (XOF)
    stock: number; // Quantité disponible
    images: string[];
    location?: Location; // Lieu précis où le stock est disponible (pour la logistique)

    // 👇 NOUVELLE CLÉ AJOUTÉE POUR LE FILTRAGE PAR RÉGION
    regionId: string; // ID de la région administrative (ex: 'hauts-bassins', 'centre')
    
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Interface pour les filtres utilisés par le Front-End lors de la recherche dans le Catalogue.
 */
export interface ProductFilters {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    // 👇 NOUVEAU FILTRE AJOUTÉ POUR L'ORIGINE GÉOGRAPHIQUE
    region?: string; // Filtre par regionId
    
    location?: Location; // Pour filtrer par proximité (utilisé différemment de region)
    searchQuery?: string;
}

/**
 * Interface pour le stock réservé. Utile si l'on veut modéliser 
 * les réserves effectuées par le Service Transactionnel.
 */
export interface StockReservation {
    productId: string;
    orderId: string;
    quantity: number;
    reservationDate: Date;
}

export type ProductCategory = 'legumes' | 'cereales' | 'fruits' | 'animaux' | 'intrants' | 'outils';

export const CATEGORIES: {id: ProductCategory, label: string, icon: string}[] = [
    { id: 'cereales', label: 'Céréales (Maïs, Mil...)', icon: '🌽' },
    { id: 'legumes', label: 'Légumes', icon: '🍅' },
    { id: 'animaux', label: 'Bétail & Volaille', icon: 'goat' }, // Icone à remplacer
    // ...
];

export interface ProducerProduct {
    id: string;
    category: ProductCategory;
    imageBlob?: Blob; // Stocké en local avant upload
    imageUrl?: string;
    price: number;
    unit: string; // "le sac", "le tas", "l'unité"
    stockQuantity: number;
    audioDescriptionBlob?: Blob; // La voix du paysan
    isOnline: boolean; // Est-ce visible sur le marché ?
    synced: boolean; // Est-ce envoyé au serveur ?
}