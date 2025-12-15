// types/index.d.ts

// --- 1. TYPES GÉNÉRAUX ET UTILISATEURS (Service Utilisateurs) ---

/**
 * Définit les rôles utilisateurs principaux dans la plateforme.
 */
export type Role = 'buyer' | 'producer' | 'admin';

/**
 * Interface pour les données de géolocalisation.
 */
export interface Location {
    lat: number;
    lng: number;
    address: string;
}

/**
 * Interface complète pour un utilisateur AgriConnect.
 */
export interface User {
    id: string; // Utilisé comme _id MongoDB ou UUID PostgreSQL
    email: string;
    role: Role;
    name: string;
    phone?: string;
    location?: Location;
    isVerified: boolean;
    
    // Champs spécifiques au Producteur
    producerProfile?: {
        farmName: string;
        certifications: string[];
        score: number; // Score de crédibilité/performance
    };
}


// --- 2. TYPES DU CATALOGUE ET DES PRODUITS (Service Catalogue) ---

/**
 * Interface pour une fiche produit mise en vente.
 */
export interface Product {
    id: string; // Utilisé comme _id MongoDB
    producerId: string; // Clé étrangère vers l'ID du Producteur
    name: string;
    description: string;
    category: string; // Ex: 'Céréales', 'Légumineuses'
    unit: string; // Ex: 'kg', 'sac de 100kg', 'pièce'
    price: number; // Prix de vente par unité (XOF)
    stock: number; // Quantité disponible
    images: string[];
    location?: Location; // Lieu où le stock est disponible
    createdAt: Date;
}

/**
 * Interface pour les filtres de recherche sur le catalogue.
 */
export interface ProductFilters {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: Location;
    searchQuery?: string;
}


// --- 3. TYPES DES TRANSACTIONS ET COMMANDES (Service Transactionnel) ---

/**
 * Définit le cycle de vie d'une commande.
 */
export type OrderStatus = 
    'PENDING' |         // Commande créée, en attente de vérification ou de paiement
    'STOCK_RESERVED' |  // Stock bloqué par le Service Catalogue
    'AWAITING_PAYMENT' |// En attente de la confirmation de paiement
    'PAID' |            // Paiement confirmé
    'DELIVERED' |       // Produit en cours de livraison
    'COMPLETED' |       // Transaction terminée et livrée
    'CANCELED' |        // Transaction annulée (remboursement en cours si payé)
    'FAILED';           // Échec de la transaction (ex: paiement refusé)

/**
 * Interface pour un article spécifique inclus dans une commande.
 */
export interface OrderItem {
    productId: string;
    quantity: number;
    unitPrice: number; // Prix fixé au moment de la commande
    productNameSnapshot: string; // Pour l'historique, au cas où le nom change
}

/**
 * Interface pour l'objet de commande principal.
 */
export interface Order {
    id: string; // UUID PostgreSQL
    buyerId: string;
    producerId: string; 
    items: OrderItem[];
    status: OrderStatus;
    totalAmount: number;
    paymentId?: string; // Référence de paiement externe
    shippingAddress: Location;
    createdAt: Date;
    updatedAt: Date;
}


// --- 4. TYPES DES RÉCLAMATIONS (Service Réclamations) ---

/**
 * Définit les statuts de traitement d'une réclamation.
 */
export type ClaimStatus = 'OPEN' | 'IN_REVIEW' | 'AWAITING_RESPONSE' | 'RESOLVED' | 'CLOSED';

/**
 * Interface pour un ticket de réclamation.
 */
export interface Claim {
    id: string;
    orderId: string; // Lien direct vers la commande concernée
    reporterId: string; // ID de l'utilisateur qui fait la réclamation
    reportedAgainstId: string; // ID de l'autre partie (producteur ou acheteur)
    type: 'DELIVERY_ISSUE' | 'QUALITY_ISSUE' | 'PAYMENT_ISSUE' | 'OTHER';
    description: string;
    status: ClaimStatus;
    resolutionDetails?: string;
    createdAt: Date;
}


// --- 5. TYPES DES DONNÉES IA / MARCHÉ (Service IA & Marché) ---

/**
 * Interface pour une entrée d'analyse de tendance du marché.
 */
export interface MarketTrend {
    id: string;
    productCategory: string;
    trendDate: Date;
    currentAvgPrice: number; // Prix moyen observé
    prediction7Days: number; // Prédiction du prix futur
    dataSources: string[];
}