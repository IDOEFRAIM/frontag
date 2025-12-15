'use client';

import React from 'react';

// On reprend les codes couleurs de ton Design System
const THEME = {
    ocre: '#A63C06',
    sand: '#F9F9F7',
    textMain: '#2D2D2D',
    textSub: '#5D4037',
    border: '#dcdcdc',
};

// Liste des régions stratégiques du Burkina (Extensible)
const REGIONS = [
    { id: 'all', name: '🇧🇫 TOUT LE BURKINA', count: null },
    { id: 'hauts-bassins', name: '📍 HAUTS-BASSINS (Bobo)', count: 12 },
    { id: 'centre', name: '📍 CENTRE (Ouaga)', count: 8 },
    { id: 'boucle-mouhoun', name: '📍 BOUCLE DU MOUHOUN', count: 5 },
    { id: 'nord', name: '📍 NORD (Ouahigouya)', count: 3 },
];

interface RegionFilterProps {
    currentRegion: string;
    onSelectRegion: (regionId: string) => void;
}

export default function RegionFilter({ currentRegion, onSelectRegion }: RegionFilterProps) {
    return (
        <div style={{ marginTop: '30px', borderTop: `1px solid ${THEME.border}`, paddingTop: '20px' }}>
            <h4 style={{ 
                fontSize: '0.9rem', 
                fontWeight: 'bold', 
                color: THEME.textSub,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '15px'
            }}>
                🌍 Filtrer par Terroir
            </h4>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {REGIONS.map((region) => {
                    const isActive = currentRegion === region.id;

                    return (
                        <li key={region.id} style={{ marginBottom: '8px' }}>
                            <button
                                onClick={() => onSelectRegion(region.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    padding: '10px 15px',
                                    backgroundColor: isActive ? '#FFF3E0' : 'transparent', // Fond léger si actif
                                    border: isActive ? `1px solid ${THEME.ocre}` : '1px solid transparent',
                                    borderLeft: isActive ? `4px solid ${THEME.ocre}` : '4px solid transparent',
                                    color: isActive ? THEME.ocre : THEME.textMain,
                                    fontWeight: isActive ? 'bold' : 'normal',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    transition: 'all 0.2s',
                                    fontSize: '0.9rem'
                                }}
                            >
                                <span>{region.name}</span>
                                {region.count && (
                                    <span style={{ 
                                        fontSize: '0.8rem', 
                                        backgroundColor: isActive ? THEME.ocre : '#eee',
                                        color: isActive ? 'white' : '#666',
                                        padding: '2px 6px',
                                        borderRadius: '4px'
                                    }}>
                                        {region.count}
                                    </span>
                                )}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}