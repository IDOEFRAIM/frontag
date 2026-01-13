'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/Market/ProductCard';
import FilterSidebar from '@/components/Market/FilterSidebar';
import { ProductRepository } from '@/services/repository'; 
// Assure-toi que ce type correspond à la structure de ta DB
import { Product } from '@/types/market'; 

export default function MarketPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // État des filtres actuels
    const [currentFilters, setCurrentFilters] = useState<{ category: string, minPrice: number }>({
        category: '',
        minPrice: 0,
    });

    // 1. Chargement initial des données via le REPOSITORY (Offline First)
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Le Repository gère la logique Réseau vs Cache Dexie
                const data = await ProductRepository.getAllProducts(); 
                
                setProducts(data);
                setFilteredProducts(data);
            } catch (err: any) {
                console.error("Erreur de chargement catalogue:", err);
                setError("Impossible de charger les produits. Vérifiez votre connexion.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // 2. Logique de filtrage
    useEffect(() => {
        let results = [...products]; // On travaille sur une copie

        if (currentFilters.category) {
            results = results.filter(p => p.category === currentFilters.category);
        }

        if (currentFilters.minPrice > 0) {
            // Note: Number(p.price) au cas où Prisma renvoie un Decimal stringifié
            results = results.filter(p => Number(p.price) >= currentFilters.minPrice);
        }

        setFilteredProducts(results);
    }, [products, currentFilters]);

    const handleFilterChange = (filters: { category: string, minPrice: number }) => {
        setCurrentFilters(filters);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mb-4"></div>
                <p className="text-gray-600 font-medium">Chargement du Catalogue...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-200 text-center max-w-md">
                    <p className="text-2xl mb-2">⚠️</p>
                    <p>{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Barre Latérale des Filtres */}
            <FilterSidebar onFilterChange={handleFilterChange} />

            {/* Contenu Principal du Marché */}
            <main className="flex-1 p-4 md:p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">🛒 Le Marché AgriConnect</h1>
                    <p className="text-gray-500 mt-2">
                        <span className="font-bold text-green-600">{filteredProducts.length}</span> produits disponibles 
                        {currentFilters.category && ` dans la catégorie ${currentFilters.category}`}
                    </p>
                </header>

                {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
                        <p className="text-xl">Aucun produit ne correspond à vos critères.</p>
                        <button 
                            onClick={() => setCurrentFilters({ category: '', minPrice: 0 })}
                            className="mt-4 text-green-600 underline"
                        >
                            Réinitialiser les filtres
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}