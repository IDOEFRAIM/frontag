// app/catalogue/CategoryFilter.tsx
'use client';

import React from 'react';
import { Category } from '@/services/catalogue.service'; // Import du type Category

interface CategoryFilterProps {
    categories: Category[];
    currentFilter: string; // La clé de la catégorie actuellement sélectionnée
    onSelectCategory: (categoryKey: string) => void;
}

// Composant pour la sélection des catégories (style Brutaliste / GOAI)
export default function CategoryFilter({ categories, currentFilter, onSelectCategory }: CategoryFilterProps) {
    
    const THEME = {
        black: '#0a0a0a',
        green: '#00c853',
        border: '#e5e5e5',
        gray: '#f4f4f5',
        subText: '#666',
        white:'#fff'
    };

    return (
        <nav style={{ 
            border: `1px solid ${THEME.border}`, 
            backgroundColor: THEME.white, 
            padding: '20px 0',
            // On le rend compact, prêt à être placé en sidebar ou au-dessus
        }}>
            <h3 style={{ 
                margin: '0 20px 15px 20px', 
                fontSize: '0.9rem', 
                fontWeight: 'bold', 
                color: THEME.black,
                textTransform: 'uppercase',
                letterSpacing: '1px'
            }}>
                Filtrer par Type de Produit
            </h3>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {categories.map((cat) => {
                    const isActive = cat.key === currentFilter;
                    
                    return (
                        <li key={cat.key}>
                            <button
                                onClick={() => onSelectCategory(cat.key)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    padding: '12px 20px',
                                    textAlign: 'left',
                                    border: 'none',
                                    backgroundColor: isActive ? THEME.gray : 'transparent',
                                    color: isActive ? THEME.black : THEME.subText,
                                    fontWeight: isActive ? 'bold' : 'normal',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.1s',
                                    borderLeft: isActive ? `4px solid ${THEME.green}` : '4px solid transparent',
                                }}
                                onMouseEnter={(e) => { 
                                    if (!isActive) e.currentTarget.style.backgroundColor = THEME.gray; 
                                }}
                                onMouseLeave={(e) => { 
                                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; 
                                }}
                            >
                                <span>
                                    {cat.icon} {cat.name}
                                </span>
                                {isActive && (
                                    <span style={{ color: THEME.green, fontSize: '0.9rem' }}>
                                        ✓
                                    </span>
                                )}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}