// lib/db.ts
import Dexie, { Table } from 'dexie';
import { Product } from '@/types/market'; 

// --- INTERFACES LOCALES ---

// Structure d'une commande en attente de synchro (Mode Hors-Ligne)
export interface OfflineOrder {
    id?: number;            // ID local auto-incrémenté
    productIds: any[];      // Liste des produits (IDs + Quantités)
    totalAmount: number;    // Montant total
    
    // Infos Client
    customerName: string;   // AJOUTÉ (Pour le SyncIndicator "Envoi de Ali...")
    customerPhone: string;
    
    // Infos Livraison (Localisation)
    deliveryDesc?: string;  // AJOUTÉ (Le texte "Porte bleue...")
    voiceNoteBlob?: Blob | null; // L'audio
    gpsLat?: number;
    gpsLng?: number;
    
    createdAt: Date;
    synced: boolean;
}

// Structure du Panier
export interface CartItem {
    id?: number;
    productId: string;
    quantity: number;
    addedAt: Date;
}

// --- CLASSE DE LA BASE DE DONNÉES ---
class AgriConnectDB extends Dexie {
    products!: Table<Product, string>;
    offlineOrders!: Table<OfflineOrder, number>;
    cart!: Table<CartItem, number>;

    constructor() {
        super('AgriConnectDatabase');
        
        // Si tu changes le schéma (ajout de champs), il faut incrémenter la version
        // Mais comme on utilise Dexie en JS/TS dynamique, tant qu'on n'indexe pas les nouveaux champs,
        // la version(1) suffit souvent pour le dév. Sinon passe à version(2).
        this.version(1).stores({
            products: 'id, regionId, category',
            offlineOrders: '++id, synced, createdAt', // On indexe ce qu'on cherche souvent
            cart: '++id, productId'
        });
    }
}

// --- INSTANCE UNIQUE ---
export const db = new AgriConnectDB();

// --- FONCTIONS HELPERS ---

export async function cacheProductsLocally(products: Product[]) {
    try {
        await db.products.bulkPut(products);
        console.log(`📦 ${products.length} produits mis en cache local.`);
    } catch (error) {
        console.error("Erreur de mise en cache:", error);
    }
}

export async function getLocalProducts(regionId?: string) {
    if (regionId) {
        return await db.products.where('regionId').equals(regionId).toArray();
    }
    return await db.products.toArray();
}

/**
 * Ajoute une commande dans la "boîte d'envoi" locale
 */
export async function queueOfflineOrder(orderData: Omit<OfflineOrder, 'id' | 'synced' | 'createdAt'>) {
    // Clonage pour éviter les soucis de référence, surtout avec les Blobs
    await db.offlineOrders.add({
        ...orderData,
        synced: false,
        createdAt: new Date()
    });
    console.log("🔒 Commande stockée dans le coffre-fort local.");
}

/**
 * [AJOUTÉ] Récupère toutes les commandes en attente (Utilisé par SyncIndicator)
 */
export async function getOfflineOrders() {
    // On récupère tout ce qui n'est pas encore sync (synced === 0/false)
    return await db.offlineOrders
        .filter(order => !order.synced)
        .toArray();
}

/**
 * [AJOUTÉ] Vide la file d'attente après succès (Utilisé par SyncIndicator)
 * Note: Dans une vraie app, on marquerait plutôt synced=true au lieu de supprimer.
 */
export async function clearOfflineOrders() {
    // Option A: Tout supprimer (Simple)
    await db.offlineOrders.clear();
    
    // Option B (Plus pro): Marquer comme sync
    // await db.offlineOrders.toCollection().modify({ synced: true });
}