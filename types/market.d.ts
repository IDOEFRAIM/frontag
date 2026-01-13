// types/catalogue.d.ts

import { Location } from './auth'; 

/**
 * Catégories strictement alignées avec le ProductFlow et Prisma
 */
export type ProductCategory = 'cereales' | 'legumes' | 'animaux' | 'transforme' | 'outils';

/**
 * Interface principale utilisée pour l'affichage (Marketplace)
 * Elle combine les données du Produit et du Producteur
 */
export interface Product {
    id: string; 
    producerId: string;
    category: ProductCategory;
    categoryLabel: string; // Ex: 'Céréales & Grains'
    unit: string; // 'KG', 'SAC', 'TONNE', 'UNITÉ'
    price: number; 
    quantity: number; // On utilise 'quantity' comme dans le schema Prisma
    images: string[];
    audioUrl?: string; 
    status: string; // 'active', 'sold_out', 'pending'
    
    // Jointure avec le producteur pour la localisation et le nom
    producer?: {
        name: string;
        location: string;
        phone: string;
    };

    createdAt: Date;
    updatedAt: Date;
}

/**
 * Interface pour les filtres de recherche
 */
export interface ProductFilters {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    region?: string; // Filtrage par localisation du producteur
    searchQuery?: string;
}

/**
 * Interface spécifique pour l'état local du formulaire (ProductFlow)
 * Utilisée pour gérer les fichiers avant qu'ils ne soient des URLs
 */
export interface ProducerProductForm {
    id?: string;
    category: ProductCategory | '';
    categoryLabel: string;
    price: string; // String car lié à un input text/number
    unit: string;
    quantity: string;
    newImages: File[]; // Fichiers réels à uploader
    existingImages: string[]; // URLs déjà présentes (en mode édition)
    audioBlob: Blob | null; // Enregistrement vocal
}

/**
 * Constante des catégories pour l'UI (utilisée dans le ProductFlow et les filtres)
 */
export const CATEGORIES_DATA = [
    { id: 'cereales', label: 'Céréales', icon: '🌾' },
    { id: 'legumes', label: 'Légumes', icon: '🥕' },
    { id: 'animaux', label: 'Animaux', icon: '🐂' },
    { id: 'transforme', label: 'Transformé', icon: '📦' },
    { id: 'outils', label: 'Outils', icon: '🚜' },
] as const;