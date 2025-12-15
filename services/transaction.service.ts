// types/transaction.d.ts

// Nécessite l'import de Location pour l'adresse de livraison
import { Location } from '@/types/auth'; 

/**
 * Définit le cycle de vie d'une commande.
 */
export type OrderStatus = 
    'PENDING' | 'STOCK_RESERVED' | 'AWAITING_PAYMENT' | 'PAID' | 
    'DELIVERED' | 'COMPLETED' | 'CANCELED' | 'FAILED';

/**
 * Interface pour un article tel qu'il est stocké dans le Panier (état local).
 * Le panier a besoin des détails du produit pour l'affichage.
 */
export interface CartItem {
    productId: string;
    producerId: string; // Important pour le split des commandes par producteur
    name: string; // Nom du produit (pour l'affichage)
    unit: string; // Unité (pour l'affichage)
    quantity: number;
    unitPrice: number; // Prix actuel du marché
}

/**
 * Interface pour un article spécifique inclus dans une commande (état persistant).
 */
export interface OrderItem {
    productId: string;
    quantity: number;
    unitPrice: number; 
    productNameSnapshot: string; // Nom figé au moment de l'achat
}

/**
 * Interface pour l'objet de commande principal.
 */
export interface Order {
    id: string; 
    buyerId: string;
    producerId: string; // S'il s'agit d'une commande unique (monoproducteur)
    items: OrderItem[];
    status: OrderStatus;
    totalAmount: number;
    paymentId?: string; 
    shippingAddress: Location;
    createdAt: Date;
    updatedAt: Date;
}