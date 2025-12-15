// components/Market/ProductCard.tsx

import React from 'react';
import { Product } from '@/types/market';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const router = useRouter();

    const handleViewProduct = () => {
        router.push(`/product/${product.id}`);
    };

    const isLowStock = product.stock < 100; // Seuil arbitraire

    return (
        <div 
            onClick={handleViewProduct}
            style={{ 
                border: '1px solid #e0e0e0', 
                borderRadius: '8px', 
                padding: '15px', 
                cursor: 'pointer', 
                transition: 'box-shadow 0.3s',
                backgroundColor: 'white',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
        >
            {/* Image Placeholder */}
            <div style={{ 
                height: '150px', 
                backgroundColor: '#f0f0f0', 
                borderRadius: '6px', 
                marginBottom: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#888',
                fontSize: '0.9em'
            }}>
                Image du {product.name}
            </div>

            <h3 style={{ 
                fontSize: '1.2em', 
                color: '#333', 
                marginBottom: '5px' 
            }}>
                {product.name}
            </h3>
            
            <p style={{ 
                fontSize: '1.5em', 
                fontWeight: 'bold', 
                color: '#10b981', // Vert pour le prix
                marginBottom: '10px'
            }}>
                {product.price.toLocaleString('fr-FR')} XOF / {product.unit}
            </p>

            <p style={{ 
                fontSize: '0.9em', 
                color: '#666', 
                flexGrow: 1 // Permet au contenu de s'étirer
            }}>
                {product.description.substring(0, 80)}...
            </p>
            
            <div style={{ 
                marginTop: '10px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
            }}>
                <span style={{ 
                    fontSize: '0.8em', 
                    fontWeight: 'bold',
                    color: isLowStock ? '#e74c3c' : '#333'
                }}>
                    Stock : {product.stock} {product.unit}
                </span>

                <button 
                    onClick={handleViewProduct}
                    style={{ 
                        backgroundColor: '#0070f3', 
                        color: 'white', 
                        border: 'none', 
                        padding: '8px 15px', 
                        borderRadius: '4px', 
                        cursor: 'pointer' 
                    }}
                >
                    Détails
                </button>
            </div>
        </div>
    );
}