// services/catalogue.service.ts

// Utilisation des types modulaires
import { Product, ProductFilters } from '@/types/market'; 
import { Location } from '@/types/auth'; 

// --- Configuration ---
const CATALOGUE_API_URL = process.env.NEXT_PUBLIC_CATALOGUE_API_URL || 'http://localhost:3001/api/v1/catalogue';

// --- TYPES LOCAUX AJOUTÉS ---
export type Category = {
    key: string; // Utilisé pour le filtrage (ex: 'cereals')
    name: string; // Nom affiché (ex: 'Céréales & Grains')
    icon?: string; 
};

// --- MOCK DE DONNÉES (Simulation de la réponse du Microservice) ---
const mockLocation1: Location = { lat: 11.36, lng: -4.95, address: 'Kénédougou, BF' }; // Région Ouest
const mockLocation2: Location = { lat: 12.37, lng: -1.53, address: 'Ouagadougou, BF' }; // Région Centre
const mockLocation3: Location = { lat: 13.56, lng: 2.11, address: 'Niamey, NE' }; // Produit Divers (Niger)

// Liste de catégories standardisées pour le marché africain (Non modifiée)
const mockCategories: Category[] = [
    { key: 'Céréales', name: 'Céréales & Grains', icon: '🌾' },
    { key: 'Légumineuses', name: 'Légumineuses & Oléagineux', icon: '🥜' },
    { key: 'Fruits', name: 'Fruits Frais & Séchés', icon: '🥭' },
    { key: 'Légumes', name: 'Légumes Racines & Feuilles', icon: '🍠' },
    { key: 'Épices', name: 'Épices & Aromates', icon: '🌶️' },
    { key: 'Divers', name: 'Autres Produits Agricoles', icon: '📦' },
];

const mockProducts: Product[] = [
    { 
        id: 'p1', 
        producerId: 'u-prod1',
        name: 'Mangues Sèches de Kénédougou', 
        description: "Mangues de variété Amélie, séchées naturellement. Idéal pour l'exportation.", 
        price: 1500, 
        stock: 500, 
        unit: 'kg', 
        category: 'Fruits', 
        images: ['/images/p1-1.jpg','/images/p1-2.jpg','/images/p1-3.jpg'], 
        createdAt: new Date(2025, 1, 1),
        updatedAt: new Date(2025, 1, 1),
        location: mockLocation1,
        // CLÉ DE FILTRAGE AJOUTÉE
        regionId: 'hauts-bassins'
    },
    { 
        id: 'p2', 
        producerId: 'u-prod2',
        name: 'Haricots Cornille (Niébé)', 
        description: 'Sac de 100kg, récolte saison sèche, faible taux d’humidité.', 
        price: 35000, 
        stock: 50, 
        unit: 'sac', 
        category: 'Légumineuses',
        images: ['/images/p2-1.jpg','/images/p2-2.jpg','/images/p2-3.jpg'], 
        createdAt: new Date(2025, 1, 10),
        updatedAt: new Date(2025, 1, 10),
        location: mockLocation2,
        // CLÉ DE FILTRAGE AJOUTÉE
        regionId: 'centre' 
    },
    { 
        id: 'p3', 
        producerId: 'u-prod1',
        name: 'Sorgho Rouge Local', 
        description: 'Sorgho rouge de qualité supérieure, idéal pour la bière de mil ou la consommation.', 
        price: 180000, 
        stock: 12, 
        unit: 'tonne', 
        category: 'Céréales',
        images: ['/images/p3-1.jpg','/images/p3-2.jpg','/images/p3-3.jpg'], 
        createdAt: new Date(2025, 2, 5),
        updatedAt: new Date(2025, 2, 5),
        location: mockLocation1,
        // CLÉ DE FILTRAGE AJOUTÉE
        regionId: 'hauts-bassins'
    },
    { 
        id: 'p4', 
        producerId: 'u-prod3',
        name: 'Gombo Séché du Niger', 
        description: 'Poudre de gombo premium pour sauces. Vendu en gros sacs.', 
        price: 90000, 
        stock: 80, 
        unit: 'kg', 
        category: 'Légumes', 
        images: ['/images/p4-1.jpg'], 
        createdAt: new Date(2025, 3, 1),
        updatedAt: new Date(2025, 3, 1),
        location: mockLocation3,
        // CLÉ DE FILTRAGE AJOUTÉE (Exemple pour tester)
        regionId: 'boucle-mouhoun' 
    },
];

// --- Fonctions du Service ---

export const getCategories = async (): Promise<Category[]> => {
    console.log(`[CATALOGUE SERVICE] Fetching categories list.`);
    
    try {
        await new Promise(resolve => setTimeout(resolve, 100)); 
        return [{ key: 'all', name: 'Toutes les Catégories', icon: '🌍' }, ...mockCategories];

    } catch (error) {
        console.error("Error fetching categories:", error);
        throw new Error("Unable to fetch categories list.");
    }
}


export const getProducts = async (filters: ProductFilters = {}): Promise<Product[]> => {
    console.log(`[CATALOGUE SERVICE] Fetching products with filters:`, filters);
    
    try {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simuler la latence

        let results = mockProducts;

        // 1. FILTRE CATÉGORIE
        if (filters.category && filters.category !== 'all') { 
            results = results.filter(p => p.category === filters.category);
        }

        // 2. FILTRE RÉGION (LA CORRECTION)
        if (filters.region && filters.region !== 'all') {
            // Utilise la propriété regionId que nous avons ajoutée aux mocks
            results = results.filter(p => (p as any).regionId === filters.region);
            console.log(`[CATALOGUE SERVICE] Filtré par région (${filters.region}): ${results.length} résultats`);
        }
        
        // 3. FILTRE PRIX
        if (filters.minPrice !== undefined) {
            results = results.filter(p => p.price >= filters.minPrice!);
        }

        // 4. FILTRE RECHERCHE
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            results = results.filter(p => 
                p.name.toLowerCase().includes(query) || 
                p.description.toLowerCase().includes(query)
            );
        }
        
        // Tri par date
        results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        
        return results;

    } catch (error) {
        console.error("Error fetching products:", error);
        throw new Error("Unable to fetch product list from Catalogue Service.");
    }
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
    console.log(`[CATALOGUE SERVICE] Fetching product with ID: ${id}`);
    
    try {
        await new Promise(resolve => setTimeout(resolve, 300)); 
        
        return mockProducts.find(p => p.id === id);

    } catch (error) {
        console.error(`Error fetching product ${id}:`, error);
        throw new Error(`Unable to fetch product details for ID: ${id}.`);
    }
};