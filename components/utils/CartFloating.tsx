// components/CartFloatingIcon.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartFloatingIcon() {
    const { items } = useCart();
    
    // Calcul du nombre total d'articles (pas juste le nombre de lignes)
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

    // Si le panier est vide, on n'affiche rien pour ne pas polluer l'écran
    if (totalItems === 0) return null;

    return (
        <Link href="/checkout" style={{ textDecoration: 'none' }}>
            <div style={{
                position: 'fixed',
                bottom: '30px',
                right: '30px',
                width: '60px',
                height: '60px',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 1000,
                transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                {/* Icône Panier SVG */}
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>

                {/* Badge de compteur */}
                <div style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid white'
                }}>
                    {totalItems}
                </div>
            </div>
        </Link>
    );
}