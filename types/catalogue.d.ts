import { Location } from './auth'; 

/**
 * Interface pour une fiche produit (Synchronisée avec Prisma)
 */
export interface Product {
    id: string;
    producerId: string;
    // Note : Prisma utilise categoryLabel pour le nom affiché
    categoryLabel: string; 
    category: string; 
    unit: string; 
    price: number; 
    quantity: number; // Renommé 'stock' en 'quantity' pour matcher le schema.prisma
    images: string[];
    audioUrl?: string; // Ajouté car présent dans Prisma
    status: string;
    location?: Location; 
    createdAt: Date;
    updatedAt: Date;
    
    // Jointure optionnelle si on récupère le producteur avec
    producer?: {
        name: string;
        location: string;
    };
}

/**
 * Interface pour les filtres de recherche
 */
export interface ProductFilters {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    region?: string; // Plus simple que l'objet Location pour les filtres d'URL
    searchQuery?: string;
    producerId?: string;
}