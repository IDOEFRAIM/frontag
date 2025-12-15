// app/catalogue/ProductCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
// CORRECTION : Import du type Product depuis le chemin standardisé (market)
import { Product } from '@/types/market'; 

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const isOutOfStock = product.stock <= 0;
    
    // Thème (cohérent avec app/page.tsx)
    const THEME = {
        black: '#0a0a0a',
        green: '#00c853',
        border: '#e5e5e5',
        subText: '#666',
        error: '#c0392b'
    };

    const isLowStock = product.stock > 0 && product.stock <= 20 && product.unit === 'sac'; // Exemple de règle "Low Stock" pour des unités de gros

    return (
        <Link 
            href={!isOutOfStock ? `/publicProducts/${product.id}` : '#'} 
            style={{ textDecoration: 'none', color: 'inherit' }}
            onClick={(e) => isOutOfStock && e.preventDefault()}
        >
            <div style={{
                // Style GOAI : Carré, bordure nette
                border: isOutOfStock ? `1px dashed ${THEME.error}` : `1px solid ${THEME.border}`,
                borderRadius: '0px', // Suppression des arrondis
                overflow: 'hidden',
                backgroundColor: isOutOfStock ? '#fffafa' : 'white',
                opacity: isOutOfStock ? 0.7 : 1,
                transition: 'border 0.2s', // Seul effet de transition
                cursor: isOutOfStock ? 'not-allowed' : 'pointer', 
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}
            // Suppression des effets onMouseEnter (plus sobre, moins "jeu vidéo")
            >
                {/* Image */}
                <div style={{ height: '220px', backgroundColor: '#f9f9f9', position: 'relative', borderBottom: THEME.border }}>
                    <img 
                        src={product.images[0] || '/placeholder.jpg'} 
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    
                    {/* Tags d'état */}
                    {isOutOfStock && (
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.4)', color: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'uppercase'
                        }}>
                            HORS LIGNE
                        </div>
                    )}
                    {!isOutOfStock && isLowStock && (
                         <div style={{
                            position: 'absolute', top: 10, right: 10,
                            backgroundColor: THEME.error, color: 'white',
                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold'
                        }}>
                            STOCK BAS
                        </div>
                    )}
                </div>

                {/* Contenu - Structuré comme un rapport */}
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    
                    {/* Ligne 1 : Catégorie & Localisation (Valeurs Clés AgriMarket) */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <div style={{ fontSize: '0.8rem', color: THEME.subText, textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}>
                            {product.category}
                        </div>
                        {product.location && (
                            <div style={{ fontSize: '0.8rem', color: THEME.black, fontWeight: 'bold' }}>
                                📍 {product.location.address.split(',')[0] || 'Local'}
                            </div>
                        )}
                    </div>
                    
                    {/* Ligne 2 : Nom du Produit */}
                    <h3 style={{ margin: '5px 0 15px 0', fontSize: '1.4rem', color: THEME.black, minHeight: '3em', lineHeight: '1.2' }}>
                        {product.name}
                    </h3>
                    
                    {/* Ligne 3 : Prix & Unité (Section Transactionnelle) */}
                    <div style={{ 
                        marginTop: 'auto', 
                        paddingTop: '15px',
                        borderTop: isOutOfStock ? 'none' : `1px solid ${THEME.border}`, 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'baseline' 
                    }}>
                        <span style={{ 
                            fontSize: '1.6rem', 
                            fontWeight: '600', 
                            color: isOutOfStock ? THEME.subText : THEME.black, 
                            lineHeight: 1 
                        }}>
                            {product.price.toLocaleString('fr-FR')} 
                            <span style={{ fontSize: '0.9rem', color: THEME.subText, marginLeft: '5px' }}>XOF</span>
                        </span>
                        
                        <span style={{ fontSize: '1rem', color: THEME.subText }}>
                            / {product.unit}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}