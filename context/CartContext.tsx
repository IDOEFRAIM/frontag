'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';
import { Product } from '@/types/market'; // Assurez-vous que ce chemin est correct

// Clé utilisée dans localStorage
const LOCAL_STORAGE_KEY = 'agriConnectCart'; 

// On étend le produit pour ajouter la quantité choisie
export interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product, quantity: number) => void;
    removeFromCart: (id: string, removeAll?: boolean) => void; // Ajout d'une option pour retirer une unité
    clearCart: () => void;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// --- FONCTION UTILITAIRE DE CHARGEMENT SÉCURISÉ ---
// Cette fonction est utilisée pour l'initialisation de l'état useState
const getInitialState = (): CartItem[] => {
    // 1. Vérifie si le code s'exécute côté client (pour éviter l'erreur de SSR)
    if (typeof window === 'undefined') {
        return [];
    }

    try {
        const storedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
        
        // 2. CORRECTION CLÉ : Vérifie si la chaîne est valide/non vide avant JSON.parse
        if (storedItems) {
            // Le .trim() est utile si par accident une chaîne d'espaces est stockée.
            const trimmedStore = storedItems.trim(); 
            if (trimmedStore.length > 0) {
                return JSON.parse(trimmedStore) as CartItem[];
            }
        }
        
    } catch (e) {
        // En cas d'erreur de JSON.parse (corruption), log et retourne un tableau vide
        console.error("Erreur lors du chargement de l'état du panier, état réinitialisé:", e);
    }
    
    // Retourne le tableau vide par défaut si aucune donnée valide n'est trouvée
    return [];
};


export function CartProvider({ children }: { children: ReactNode }) {
    // Utilise la fonction getInitialState pour l'initialisation sécurisée
    const [items, setItems] = useState<CartItem[]>(getInitialState);

    // --- EFFET DE SYNCHRONISATION (Sauvegarde) ---
    useEffect(() => {
        // Synchronise l'état avec localStorage à chaque changement de 'items'
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    }, [items]);
    
    // --- ACTIONS DU PANIER ---

    const addToCart = (product: Product, quantity: number) => {
        setItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                // Mise à jour de la quantité
                return prev.map(item => 
                    item.id === product.id 
                        ? { ...item, quantity: Math.max(1, item.quantity + quantity) } // Assure que la quantité reste >= 1
                        : item
                );
            }
            // Ajout du nouvel article
            return [...prev, { ...product, quantity: Math.max(1, quantity) }];
        });
    };

    // Nouvelle fonction pour retirer une unité ou l'article entier
    const removeFromCart = (id: string, removeAll: boolean = true) => {
        setItems(prev => {
            if (removeAll) {
                // Retirer l'article entièrement
                return prev.filter(item => item.id !== id);
            } else {
                // Retirer seulement une unité (si la quantité > 1)
                const existing = prev.find(item => item.id === id);
                if (existing && existing.quantity > 1) {
                    return prev.map(item => 
                        item.id === id 
                            ? { ...item, quantity: item.quantity - 1 }
                            : item
                    );
                }
                // Si la quantité est 1, on retire l'article entièrement
                return prev.filter(item => item.id !== id);
            }
        });
    };

    const clearCart = () => setItems([]);

    // Calcul du total optimisé avec useMemo
    const cartTotal = useMemo(() => {
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }, [items]);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};