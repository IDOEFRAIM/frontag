'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/Market/ProductCard';
import FilterSidebar from '@/components/Market/FilterSidebar';
// import { getProducts } from '@/services/catalogue.service'; // <-- ANCIENNE LIGNE (Supprimée)
import { ProductRepository } from '@/services/repository'; // <-- NOUVELLE LIGNE (Repository Intelligent)
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

    // 1. Chargement initial des données via le REPOSITORY
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                
                // ✅ CHANGEMENT ICI :
                // Le Repository va décider tout seul :
                // 1. Essayer de chercher sur Internet
                // 2. Si ça rate (Offline), prendre dans Dexie (Cache)
                const data = await ProductRepository.getAllProducts(); 
                
                setProducts(data);
                setFilteredProducts(data);
            } catch (err: any) {
                console.error(err);
                setError("Impossible de charger les produits (ni réseau, ni cache).");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // 2. Logique de filtrage (INCHANGÉE)
    useEffect(() => {
        let results = products;

        if (currentFilters.category) {
            results = results.filter(p => p.category === currentFilters.category);
        }

        if (currentFilters.minPrice > 0) {
            results = results.filter(p => p.price >= currentFilters.minPrice);
        }

        setFilteredProducts(results);
    }, [products, currentFilters]);

    // Gestion du changement de filtre (INCHANGÉE)
    const handleFilterChange = (filters: { category: string, minPrice: number }) => {
        setCurrentFilters(filters);
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="spinner"></div> {/* Tu peux ajouter une classe spinner css */}
                <p>Chargement du Catalogue...</p>
            </div>
        );
    }

    if (error) {
        return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>⚠️ {error}</div>;
    }
    
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
            {/* Barre Latérale des Filtres */}
            <FilterSidebar onFilterChange={handleFilterChange} />

            {/* Contenu Principal du Marché */}
            <main style={{ flex: 1, padding: '20px' }}>
                <h1 style={{ marginBottom: '20px', color: '#333' }}>🛒 Le Marché AgriConnect</h1>
                <p style={{ marginBottom: '25px', color: '#666' }}>
                    {filteredProducts.length} produits trouvés (sur {products.length} au total).
                </p>

                {filteredProducts.length === 0 ? (
                    <div style={{ textAlign: 'center', marginTop: '50px', color: '#888' }}>
                        Aucun produit ne correspond à vos critères de recherche.
                    </div>
                ) : (
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                        gap: '25px' 
                    }}>
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}