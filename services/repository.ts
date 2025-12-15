import { db } from '@/lib/db';
import { Product } from '@/types/market'; // Assure-toi d'avoir ce type défini quelque part

const API_URL = '/api/products'; // Ton endpoint réel (ou mock)

export const ProductRepository = {
    /**
     * Stratégie : "Network First, Fallback to Cache"
     * 1. On essaie de récupérer les données fraîches du serveur.
     * 2. Si ça marche, on met à jour la base locale (Dexie).
     * 3. Si ça échoue (pas d'internet), on renvoie ce qu'on a en local.
     */
    async getAllProducts(): Promise<Product[]> {
        try {
            // 1. Tentative appel réseau
            // Note: On peut ajouter un timeout court ici pour ne pas faire attendre l'utilisateur trop longtemps
            const response = await fetch(API_URL, { 
                method: 'GET',
                cache: 'no-store' // On veut toujours du frais si possible
            });

            if (!response.ok) throw new Error('Erreur serveur');

            const products: Product[] = await response.json();

            // 2. Mise à jour du Cache (Dexie)
            // .clear() nettoie l'ancien cache pour éviter les produits fantômes (supprimés du serveur)
            // .bulkPut() insère tout d'un coup (très rapide)
            await db.transaction('rw', db.products, async () => {
                await db.products.clear(); 
                await db.products.bulkPut(products);
            });

            console.log("🌍 Données chargées depuis le Serveur");
            return products;

        } catch (error) {
            console.warn("⚠️ Mode Hors-Ligne (ou erreur serveur) : Chargement depuis le cache local.");
            
            // 3. Fallback : Lecture Dexie
            const cachedProducts = await db.products.toArray();
            
            if (cachedProducts.length === 0) {
                console.log("ℹ️ Aucun produit en cache.");
                return [];
            }
            
            return cachedProducts;
        }
    },

    /**
     * Récupère un produit par son ID.
     * Ici, on tape directement dans le cache car getAllProducts() l'a probablement déjà rempli.
     */
    async getProductById(id: string): Promise<Product | undefined> {
        return await db.products.get(id);
    },

    /**
     * Recherche locale (très rapide grâce à IndexedDB)
     */
    async searchProducts(query: string): Promise<Product[]> {
        if (!query) return this.getAllProducts();
        
        const lowerQuery = query.toLowerCase();
        
        // Dexie permet de filtrer facilement
        return await db.products
            .filter(p => p.name.toLowerCase().includes(lowerQuery))
            .toArray();
    }
};