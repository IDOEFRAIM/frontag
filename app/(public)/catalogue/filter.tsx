'use client';

import React, { memo } from 'react';
import { Category } from '@/services/catalogue.service';
import { Map, Tag, RotateCcw } from 'lucide-react';

const THEME = {
    accent: '#E65100',
    text: '#2D3436',
    muted: '#7F8C8D',
    surface: '#FFFFFF',
    border: '#EEEAE5',
    bgActive: '#FFF3E0',
    hover: '#FDF7F2'
};

interface UnifiedFilterProps {
    categories: Category[];
    regions: { id: string, name: string }[];
    activeCategory: string;
    activeRegion: string;
    onFilterChange: (type: 'category' | 'region', value: string) => void; 
    onReset: () => void;
}

// Sous-composant mémoïsé pour la robustesse visuelle
const SectionHeader = memo(({ title, icon: Icon }: { title: string, icon: any }) => (
    <div style={{ 
        fontSize: '0.7rem', fontWeight: '800', color: THEME.muted, 
        textTransform: 'uppercase', letterSpacing: '1.2px', margin: '32px 0 12px 0',
        display: 'flex', alignItems: 'center', gap: '8px'
    }}>
        <Icon size={14} strokeWidth={2.5} />
        {title}
        <div style={{ flex: 1, height: '1px', backgroundColor: THEME.border }}></div>
    </div>
));

export default function UnifiedFilter({ 
    categories = [], 
    regions = [],
    activeCategory, 
    activeRegion, 
    onFilterChange, 
    onReset 
}: UnifiedFilterProps) {

    const isFiltered = activeCategory !== 'all' || activeRegion !== 'all';

    return (
        <nav style={{ 
            backgroundColor: THEME.surface, 
            border: `1px solid ${THEME.border}`, 
            padding: '28px', 
            borderRadius: '24px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
            position: 'sticky', 
            top: '40px',
            width: '100%'
        }}>
            {/* Header du Panel */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '10px' 
            }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '900', color: THEME.text, letterSpacing: '-0.5px' }}>
                    Configuration
                </h3>
                {isFiltered && (
                    <button 
                        onClick={onReset}
                        style={{ 
                            display: 'flex', alignItems: 'center', gap: '4px',
                            fontSize: '0.7rem', color: THEME.accent, background: 'none', 
                            border: `1.5px solid ${THEME.accent}`, padding: '6px 10px', 
                            borderRadius: '8px', cursor: 'pointer', fontWeight: '800',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <RotateCcw size={12} /> RESET
                    </button>
                )}
            </div>

            {/* Section Catégories */}
            <SectionHeader title="Ressources" icon={Tag} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {categories.length > 0 ? (
                    categories.map((cat) => (
                        <FilterButton 
                            key={cat.key} 
                            icon={cat.icon}
                            label={cat.name} 
                            isActive={activeCategory === cat.key} 
                            onClick={() => onFilterChange('category', cat.key)} 
                        />
                    ))
                ) : (
                    <div style={{ padding: '12px', color: THEME.muted, fontSize: '0.8rem', fontStyle: 'italic' }}>
                        Chargement des flux...
                    </div>
                )}
            </div>

            {/* Section Régions */}
            <SectionHeader title="Localisation" icon={Map} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {regions.length > 0 ? (
                    regions.map((reg) => (
                        <FilterButton 
                            key={reg.id} 
                            label={reg.name} 
                            isActive={activeRegion === reg.id} 
                            onClick={() => onFilterChange('region', reg.id)} 
                        />
                    ))
                ) : (
                    <div style={{ padding: '12px', color: THEME.muted, fontSize: '0.8rem', fontStyle: 'italic' }}>
                        Chargement des zones...
                    </div>
                )}
            </div>

            {/* Badge de Statut */}
            <div style={{ 
                marginTop: '32px', padding: '16px', borderRadius: '16px', 
                backgroundColor: '#F9FAFB', border: `1px solid ${THEME.border}`,
                display: 'flex', flexDirection: 'column', gap: '8px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem', fontWeight: '700', color: '#10B981' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                    DONNÉES TEMPS RÉEL
                </div>
                <p style={{ margin: 0, fontSize: '0.7rem', color: THEME.muted, lineHeight: '1.4' }}>
                    Fréquence de rafraîchissement des stocks : <span style={{ color: THEME.text, fontWeight: '600' }}>15 min</span>
                </p>
            </div>
        </nav>
    );
}

// Composant interne pour la gestion des boutons
function FilterButton({ label, icon, isActive, onClick }: { label: string, icon?: string | null | undefined, isActive: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '12px 16px',
                backgroundColor: isActive ? THEME.bgActive : 'transparent',
                border: 'none', borderRadius: '12px',
                color: isActive ? THEME.accent : THEME.text,
                cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                fontSize: '0.9rem', fontWeight: isActive ? '750' : '500',
                textAlign: 'left'
            }}
            onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = THEME.hover;
            }}
            onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
            }}
        >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {icon && <span>{icon}</span>}
                {label}
            </span>
            {isActive && (
                <div style={{ 
                    width: '6px', height: '6px', borderRadius: '50%', 
                    backgroundColor: THEME.accent, boxShadow: `0 0 8px ${THEME.accent}` 
                }} />
            )}
        </button>
    );
}
