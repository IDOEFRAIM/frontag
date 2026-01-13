import { Product, ProductFilters } from '@/types/catalogue';

export type Category = {
    key: string;
    name: string;
    icon?: string;
};

const CATEGORIES_CONFIG: Category[] = [
    { key: 'cereales', name: 'Céréales & Grains', icon: '🌾' },
    { key: 'legumes', name: 'Légumes', icon: '🥕' },
    { key: 'animaux', name: 'Animaux', icon: '🐂' },
    { key: 'transforme', name: 'Transformé', icon: '📦' },
    { key: 'outils', name: 'Outils', icon: '🚜' },
];

// Utilitaire pour obtenir l'URL de base (nécessaire pour le côté serveur)
const getBaseUrl = () => {
    if (typeof window !== 'undefined') return ''; // Navigateur : URL relative OK
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // Vercel
    return 'http://localhost:3000'; // Développement local
};

export const getCategories = async (): Promise<Category[]> => {
    return [{ key: 'all', name: 'Toutes les Catégories', icon: '🌍' }, ...CATEGORIES_CONFIG];
};

/**
 * Récupère les produits (Utilisé par le Catalogue - Client Side)
 */
export const getProducts = async (filters: ProductFilters = {}): Promise<Product[]> => {
    try {
        const params = new URLSearchParams();
        if (filters.category && filters.category !== 'all') params.append('category', filters.category);
        if (filters.region && filters.region !== 'all') params.append('region', filters.region);
        if (filters.searchQuery) params.append('search', filters.searchQuery);

        const response = await fetch(`${getBaseUrl()}/api/publicProduct?${params.toString()}`, {
            next: { revalidate: 60 } // Cache de 60 secondes (ISR)
        });

        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        console.error("Erreur getProducts:", error);
        return [];
    }
};

/**
 * Récupère un produit par ID (Utilisé par la Page Détail - Server Side)
 */
export const getProductById = async (id: string): Promise<Product | null> => {
    try {
        // Important: Utilisation de l'URL absolue via getBaseUrl() pour le serveur
        const response = await fetch(`${getBaseUrl()}/api/publicProduct/${id}`, {
            next: { revalidate: 0 } // On veut les données fraîches pour un détail produit
        });

        if (!response.ok) {
            console.error(`Erreur API: ${response.status}`);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error(`Erreur getProductById (${id}):`, error);
        return null;
    }
};