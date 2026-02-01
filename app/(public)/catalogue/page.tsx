'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, LayoutGrid, List, RefreshCw, Search } from 'lucide-react';

// Imports de tes services et types
import { Product } from '@/types/catalogue';
import { Product as MarketProduct } from '@/types/market';
import { getProducts, getCategories, getRegions, Category } from '@/services/catalogue.service'; 
import ProductCard from './ProductCard';
import UnifiedFilter from './filter';

const THEME = {
    bg: '#FDFCFB',
    surface: '#FFFFFF',
    accent: '#E65100',
    secondary: '#2D3436',
    muted: '#7F8C8D',
    border: '#EEEAE5',
    active: '#FFF3E0'
};

export default function CataloguePage() {
    // --- ÉTATS ---
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [regions, setRegions] = useState<{id: string, name: string}[]>([]);
    const [currentCategory, setCurrentCategory] = useState<string>('all');
    const [currentRegion, setCurrentRegion] = useState<string>('all'); 
    const [searchQuery, setSearchQuery] = useState<string>('');
    
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [error, setError] = useState<string | null>(null);

    // --- LOGIQUE DE CHARGEMENT ---
    const loadProducts = useCallback(async (cat: string, reg: string, search: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const fetchedProducts = await getProducts({
                category: cat,
                region: reg,
                searchQuery: search
            });
            setProducts(fetchedProducts);
        } catch (err) {
            setError("Connexion au serveur perdue.");
            console.error(err);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    // Initialisation : Charger les catégories et régions
    useEffect(() => {
        const init = async () => {
            const [cats, regs] = await Promise.all([
                getCategories(),
                getRegions()
            ]);
            setCategories(cats);
            setRegions(regs);
        };
        init();
    }, []);

    // Effet de recherche (Debounce) : Évite de surcharger l'API à chaque lettre tapée
    useEffect(() => {
        const timer = setTimeout(() => {
            loadProducts(currentCategory, currentRegion, searchQuery);
        }, 400); // 400ms de délai

        return () => clearTimeout(timer);
    }, [searchQuery, currentCategory, currentRegion, loadProducts]);

    // --- HANDLERS ---
    const handleFilterChange = (type: 'category' | 'region', value: string) => {
        if (type === 'category') setCurrentCategory(value);
        if (type === 'region') setCurrentRegion(value);
    };

    const handleReset = () => {
        setCurrentCategory('all');
        setCurrentRegion('all');
        setSearchQuery('');
    };

    const handleManualRefresh = () => {
        setIsRefreshing(true);
        loadProducts(currentCategory, currentRegion, searchQuery);
    };

    return (
        <div style={{ backgroundColor: THEME.bg, color: THEME.secondary, minHeight: '100vh', fontFamily: 'inherit' }}>
            
            {/* HEADER SECTION */}
            <header style={{ backgroundColor: THEME.surface, borderBottom: `1px solid ${THEME.border}`, padding: '60px 5% 40px' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: THEME.accent, marginBottom: '12px', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '2px' }}>
                            <Database size={14} /> RÉSEAU DE DISTRIBUTION NATIONAL
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0, letterSpacing: '-0.03em' }}>
                            STOCKS <span style={{ color: THEME.accent }}>DISPONIBLES</span>
                        </h1>
                    </div>
                    
                    <div style={{ position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: THEME.muted }} size={18} />
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Rechercher (ex: Maïs, Niébé...)" 
                            style={{ padding: '15px 15px 15px 45px', borderRadius: '14px', border: `1px solid ${THEME.border}`, width: '320px', backgroundColor: THEME.bg, outline: 'none', fontSize: '0.9rem' }} 
                        />
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT AREA */}
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', maxWidth: '1600px', margin: '0 auto', padding: '40px 5%', gap: '40px' }}>
                
                {/* SIDEBAR FILTERS */}
                <aside>
                    <UnifiedFilter 
                        categories={categories} 
                        regions={regions}
                        activeCategory={currentCategory} 
                        activeRegion={currentRegion} 
                        onFilterChange={handleFilterChange} 
                        onReset={handleReset} 
                    />
                </aside>
                
                {/* PRODUCTS GRID/LIST */}
                <main>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <div style={{ fontSize: '0.9rem', color: THEME.muted }}>
                            <strong style={{ color: THEME.secondary }}>{products.length}</strong> ressources identifiées
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <motion.button 
                                onClick={handleManualRefresh}
                                whileTap={{ scale: 0.95 }}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '12px', border: `1px solid ${THEME.border}`, backgroundColor: THEME.surface, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                            >
                                <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} color={THEME.accent} />
                                Actualiser
                            </motion.button>

                            <div style={{ display: 'flex', backgroundColor: '#F1F2F6', padding: '4px', borderRadius: '12px' }}>
                                <button onClick={() => setViewMode('grid')} style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: viewMode === 'grid' ? THEME.surface : 'transparent', color: viewMode === 'grid' ? THEME.accent : THEME.muted }}>
                                    <LayoutGrid size={18} />
                                </button>
                                <button onClick={() => setViewMode('list')} style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: viewMode === 'list' ? THEME.surface : 'transparent', color: viewMode === 'list' ? THEME.accent : THEME.muted }}>
                                    <List size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {isLoading && products.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '80px 0' }}>
                            <div className="animate-spin" style={{ width: '30px', height: '30px', border: `3px solid ${THEME.border}`, borderTopColor: THEME.accent, borderRadius: '50%', margin: '0 auto 15px' }} />
                            <p style={{ fontSize: '0.8rem', fontWeight: 700, color: THEME.muted }}>SYNCHRONISATION DU RÉSERVOIR...</p>
                        </div>
                    ) : (
                        <motion.div 
                            layout 
                            style={{ 
                                display: 'grid', 
                                gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : '1fr', 
                                gap: '25px' 
                            }}
                        >
                            <AnimatePresence mode="popLayout">
                                {products.map(product => (
                                    <ProductCard 
                                        key={product.id} 
                                        product={product as unknown as MarketProduct} 
                                        viewMode={viewMode} 
                                    />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {!isLoading && products.length === 0 && (
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }}
                            style={{ textAlign: 'center', padding: '100px', backgroundColor: THEME.surface, borderRadius: '30px', border: `2px dashed ${THEME.border}` }}
                        >
                            <p style={{ color: THEME.muted, fontWeight: 600 }}>Aucune ressource ne correspond à ces filtres.</p>
                            <button onClick={handleReset} style={{ color: THEME.accent, background: 'none', border: 'none', fontWeight: 800, cursor: 'pointer', marginTop: '10px', textDecoration: 'underline' }}>
                                Réinitialiser les paramètres
                            </button>
                        </motion.div>
                    )}
                </main>
            </div>
        </div>
    );
}