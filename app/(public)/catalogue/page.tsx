// app/catalogue/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types/market';
import { getProducts, getCategories, Category } from '@/services/catalogue.service'; 
import ProductCard from './ProductCard';
import UnifiedFilter from './filter'; // <--- NOUVEL IMPORT

const THEME = {
    ocre: '#A63C06',    
    green: '#2E7D32',   
    sand: '#F9F9F7',    
    white: '#FFFFFF',
    textMain: '#2D2D2D',
    textSub: '#5D4037', 
    fontHead: 'Oswald, sans-serif',
    fontBody: 'Barlow, sans-serif', 
};

export default function CataloguePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    
    // États de filtre unifiés
    const [currentCategory, setCurrentCategory] = useState<string>('all');
    const [currentRegion, setCurrentRegion] = useState<string>('all'); 
    
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    // const [isOnline, setIsOnline] = useState<boolean>(true); // Non utilisé ici

    // Fonction de chargement centrale
    const loadProducts = useCallback(async (catKey: string, regionKey: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const filters: any = {};
            
            if (catKey !== 'all') filters.category = catKey;
            if (regionKey !== 'all') filters.region = regionKey; 

            console.log("🚀 Charger les produits avec filtres:", filters);
            
            const fetchedProducts = await getProducts(filters);
            setProducts(fetchedProducts);
        } catch (err) {
            console.error("Failed to load products:", err);
            setError("Liaison avec les zones de production difficile.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Chargement initial
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const fetchedCategories = await getCategories();
                setCategories(fetchedCategories);
                // On charge tout par défaut
                await loadProducts('all', 'all');
            } catch (err) {
                setError("Impossible de synchroniser le catalogue.");
            }
        };
        loadInitialData();
    }, [loadProducts]);

    // --- HANDLER UNIFIÉ (Gère Catégorie ET Région) ---
    const handleFilterChange = (type: 'category' | 'region', value: string) => {
        if (type === 'category') {
            setCurrentCategory(value);
            // On charge avec la nouvelle catégorie et la région actuelle
            loadProducts(value, currentRegion); 
        } else {
            setCurrentRegion(value);
            // On charge avec la nouvelle région et la catégorie actuelle
            loadProducts(currentCategory, value); 
        }
    };

    const handleReset = () => {
        setCurrentCategory('all');
        setCurrentRegion('all');
        loadProducts('all', 'all');
    };

    return (
        <div style={{ fontFamily: THEME.fontBody, backgroundColor: THEME.sand, color: THEME.textMain, minHeight: '100vh' }}>
            
             <header style={{ 
                borderBottom: `4px solid ${THEME.ocre}`,
                padding: '30px 20px', 
                backgroundColor: THEME.white,
            }}>
                <h1 style={{ fontFamily: THEME.fontHead, fontSize: 'clamp(2rem, 5vw, 3.5rem)', margin: 0, fontWeight: '700', textTransform: 'uppercase', lineHeight: 0.9 }}>
                    NOS TERRES,<br/> <span style={{ color: THEME.green }}>VOTRE TABLE.</span>
                </h1>
            </header>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', maxWidth: '1400px', margin: '0 auto' }}>
                
                {/* SIDEBAR AVEC LE FILTRE UNIQUE */}
                <aside style={{ flex: '1 1 280px', minWidth: '280px', padding: '30px 20px' }}>
                    <UnifiedFilter 
                        categories={categories}
                        activeCategory={currentCategory}
                        activeRegion={currentRegion}
                        onFilterChange={handleFilterChange}
                        onReset={handleReset}
                    />
                </aside>
                
                {/* MAIN CONTENT */}
                <main style={{ flex: '3 1 600px', padding: '30px 20px', minHeight: '60vh' }}>
                    
                    {/* Feedback visuel simple */}
                    {(currentCategory !== 'all' || currentRegion !== 'all') && (
                        <div style={{ marginBottom: '20px', fontSize: '0.9rem', color: THEME.textSub }}>
                            Affichage : 
                            <b> {categories.find(c => c.key === currentCategory)?.name || 'Tout'} </b>
                            dans 
                            <b> {currentRegion === 'all' ? 'Tout le pays' : currentRegion}</b>
                        </div>
                    )}
                     
                    {error && (
                        <div style={{ color: 'red', border: '1px solid red', padding: '15px', marginBottom: '20px' }}>
                            Erreur de connexion : {error}
                        </div>
                    )}

                    {isLoading ? (
                         <div style={{ textAlign: 'center', padding: '100px 0', color: THEME.ocre }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', animation: 'pulse 1s infinite' }}>
                                Recherche dans les terroirs...
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
                             {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                     
                    {!isLoading && products.length === 0 && (
                         <div style={{ textAlign: 'center', padding: '40px', border: `2px dashed ${THEME.textSub}`, backgroundColor: THEME.white }}>
                            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🌾</div>
                            <h3>Aucun stock trouvé pour cette sélection.</h3>
                            <button 
                                onClick={handleReset} 
                                style={{ marginTop: '15px', padding: '10px 20px', backgroundColor: THEME.textMain, color: 'white', border: 'none', cursor: 'pointer' }}
                            >
                                RÉINITIALISER LES FILTRES
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}