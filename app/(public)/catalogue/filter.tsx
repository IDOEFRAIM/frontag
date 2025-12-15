'use client';

import React from 'react';
import { Category } from '@/services/catalogue.service';

const THEME = {
    ocre: '#A63C06',
    textMain: '#2D2D2D',
    textSub: '#5D4037',
    border: '#dcdcdc',
    activeBg: '#FFF3E0', 
};

// Liste des régions (Les IDs doivent correspondre à ceux dans mockProducts.regionId)
const REGIONS = [
    { id: 'all', name: '🇧🇫 Tout le Burkina' },
    { id: 'hauts-bassins', name: '📍 Hauts-Bassins (Bobo)' },
    { id: 'centre', name: '📍 Centre (Ouaga)' },
    { id: 'boucle-mouhoun', name: '📍 Boucle du Mouhoun' },
    { id: 'nord', name: '📍 Nord (Ouahigouya)' },
];

interface UnifiedFilterProps {
    categories: Category[];
    activeCategory: string;
    activeRegion: string;
    // Handler unifié pour gérer les deux types de filtre
    onFilterChange: (type: 'category' | 'region', value: string) => void; 
    onReset: () => void;
}

export default function UnifiedFilter({ 
    categories, 
    activeCategory, 
    activeRegion, 
    onFilterChange,
    onReset 
}: UnifiedFilterProps) {

    const SectionTitle = ({ title }: { title: string }) => (
        <h4 style={{ 
            fontSize: '0.85rem', 
            fontWeight: '900', 
            color: THEME.textSub,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            margin: '20px 0 10px 0',
            borderBottom: `2px solid ${THEME.ocre}`,
            display: 'inline-block',
            paddingBottom: '3px'
        }}>
            {title}
        </h4>
    );

    const FilterButton = ({ id, label, isActive, type }: { id: string, label: string, isActive: boolean, type: 'category' | 'region' }) => (
        <button
            onClick={() => onFilterChange(type, id)}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '8px 12px',
                marginBottom: '4px',
                backgroundColor: isActive ? THEME.activeBg : 'transparent',
                border: '1px solid',
                borderColor: isActive ? THEME.ocre : 'transparent',
                borderRadius: '4px',
                color: isActive ? THEME.ocre : THEME.textMain,
                fontWeight: isActive ? 'bold' : 'normal',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
                fontSize: '0.9rem'
            }}
        >
            <span>{label}</span>
            {isActive && <span style={{ fontSize: '1.2rem', lineHeight: 0 }}>•</span>}
        </button>
    );

    return (
        <div style={{ 
            backgroundColor: 'white', 
            border: `1px solid ${THEME.border}`, 
            padding: '20px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
        }}>
            {/* En-tête du panneau */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', fontFamily: 'Oswald, sans-serif' }}>
                    ⚡️ TRI & ORIGINE
                </h3>
                {(activeCategory !== 'all' || activeRegion !== 'all') && (
                    <button 
                        onClick={onReset}
                        style={{ fontSize: '0.75rem', textDecoration: 'underline', color: THEME.textSub, border: 'none', background: 'none', cursor: 'pointer' }}
                    >
                        Réinitialiser
                    </button>
                )}
            </div>

            {/* --- SECTION 1: CATÉGORIES --- */}
            <SectionTitle title="📦 Type de Denrée" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <FilterButton 
                    id="all" 
                    label="Tous les produits" 
                    isActive={activeCategory === 'all'} 
                    type="category" 
                />
                {categories
                    .filter(c => c.key !== 'all') // On filtre le "Toutes les catégories" du service
                    .map((cat) => (
                    <FilterButton 
                        key={cat.key} 
                        id={cat.key} 
                        label={cat.name} 
                        isActive={activeCategory === cat.key} 
                        type="category" 
                    />
                ))}
            </div>

            {/* --- SECTION 2: RÉGIONS --- */}
            <SectionTitle title="🌍 Terroir / Origine" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {REGIONS.map((reg) => (
                    <FilterButton 
                        key={reg.id} 
                        id={reg.id} 
                        label={reg.name} 
                        isActive={activeRegion === reg.id} 
                        type="region" 
                    />
                ))}
            </div>

            <div style={{ marginTop: '20px', borderTop: '2px dashed #ddd', paddingTop: '10px', textAlign: 'center', fontSize: '0.7rem', color: '#999' }}>
                AGRICONNECT LOGISTICS
            </div>
        </div>
    );
}