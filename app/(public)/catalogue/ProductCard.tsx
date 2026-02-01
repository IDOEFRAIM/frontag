'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import { Product } from '@/types/market'; 

interface ProductCardProps {
    product: Product;
    viewMode?: 'grid' | 'list';
}

const THEME = {
    accent: '#E65100',    // Terre cuite
    text: '#2D3436',      // Anthracite
    muted: '#7F8C8D',     // Gris
    surface: '#FFFFFF',   // Blanc
    border: '#EEEAE5',    // Beige clair
};

export default function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
    const isOutOfStock = product.quantity <= 0;
    
    return (
        <motion.div
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300 }}
            style={{ height: '100%' }}
        >
            <Link 
                href={!isOutOfStock ? `/publicProducts/${product.id}` : '#'} 
                style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}
                onClick={(e) => isOutOfStock && e.preventDefault()}
            >
                <div style={{
                    backgroundColor: THEME.surface,
                    border: `1px solid ${THEME.border}`,
                    borderRadius: '24px',
                    overflow: 'hidden',
                    opacity: isOutOfStock ? 0.7 : 1,
                    transition: 'box-shadow 0.3s ease',
                    cursor: isOutOfStock ? 'not-allowed' : 'pointer', 
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    position: 'relative',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                }}
                onMouseEnter={(e) => {
                    if(!isOutOfStock) e.currentTarget.style.boxShadow = '0 12px 24px rgba(230,81,0,0.1)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
                }}
                >
                    {/* Image Section */}
                    <div style={{ height: '220px', position: 'relative', overflow: 'hidden', backgroundColor: '#F1F2F6' }}>
                        <img 
                            src={product.images && product.images.length > 0 ? `/uploads/products/${product.images[0]}` : '/placeholder.jpg'} 
                            alt={product?.name || 'Product picture'}
                            style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover',
                                filter: isOutOfStock ? 'grayscale(1)' : 'none'
                            }}
                        />
                        
                        {/* Statut Badge */}
                        <div style={{
                            position: 'absolute', top: '15px', left: '15px',
                            backgroundColor: isOutOfStock ? '#636E72' : THEME.accent,
                            color: 'white', padding: '6px 12px', borderRadius: '8px',
                            fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.5px'
                        }}>
                            {isOutOfStock ? 'RUPTURE' : 'DISPONIBLE'}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: THEME.accent, marginBottom: '12px' }}>
                            <MapPin size={14} />
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
                                {product.location?.address.split(',')[0] || 'Région'}
                            </span>
                        </div>
                        
                        <h3 style={{ 
                            margin: '0 0 8px 0', fontSize: '1.4rem', fontWeight: '800', 
                            color: THEME.text, lineHeight: 1.2 
                        }}>
                            {product.name}
                        </h3>
                        
                        <p style={{ fontSize: '0.85rem', color: THEME.muted, marginBottom: '20px' }}>
                            Catégorie : {product.category}
                        </p>
                        
                        <div style={{ 
                            marginTop: 'auto', paddingTop: '16px', borderTop: `1px solid ${THEME.border}`,
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
                        }}>
                            <div>
                                <span style={{ display: 'block', fontSize: '0.7rem', color: THEME.muted, fontWeight: '700' }}>PRIX UNITAIRE</span>
                                <span style={{ fontSize: '1.4rem', fontWeight: '900', color: THEME.text }}>
                                    {product.price.toLocaleString('fr-FR')} 
                                    <small style={{ fontSize: '0.8rem', marginLeft: '4px', color: THEME.accent }}>CFA</small>
                                </span>
                            </div>
                            
                            <div style={{ 
                                width: '40px', height: '40px', borderRadius: '50%', 
                                backgroundColor: THEME.accent, color: 'white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <ArrowRight size={20} />
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}