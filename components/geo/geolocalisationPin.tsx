// components/Geo/LocationPin.tsx
'use client';

import React, { useEffect } from 'react';
import { useGeoLocation, GeoPoint } from '@/hooks/useGeoLocalisation';

const THEME = {
    ocre: '#A63C06',
    green: '#2E7D32',
    warning: '#F57C00', // Orange pour précision moyenne
    gray: '#ccc',
};

interface LocationPinProps {
    onLocationFound: (loc: GeoPoint) => void;
}

export const LocationPin = ({ onLocationFound }: LocationPinProps) => {
    const { location, error, isLoading, getLocation } = useGeoLocation();

    // Dès qu'on a une position, on la remonte au composant parent
    useEffect(() => {
        if (location) {
            onLocationFound(location);
        }
    }, [location, onLocationFound]);

    // Détermine la couleur de confiance
    const getAccuracyColor = (acc: number) => {
        if (acc <= 20) return THEME.green; // Excellent
        if (acc <= 100) return THEME.warning; // Moyen
        return THEME.ocre; // Mauvais
    };

    return (
        <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px', textTransform: 'uppercase', fontSize: '0.9rem' }}>
                📍 Votre Position (GPS)
            </label>

            {!location ? (
                <button
                    onClick={getLocation}
                    disabled={isLoading}
                    style={{
                        width: '100%',
                        padding: '20px',
                        backgroundColor: isLoading ? THEME.gray : THEME.ocre,
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        cursor: isLoading ? 'wait' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                >
                    {isLoading ? (
                        <>📡 RECHERCHE SATELLITE...</>
                    ) : (
                        <>🎯 CLIQUER POUR ME GÉOLOCALISER</>
                    )}
                </button>
            ) : (
                <div style={{
                    padding: '15px',
                    border: `2px solid ${getAccuracyColor(location.accuracy)}`,
                    backgroundColor: '#FAFAFA',
                    borderRadius: '4px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                        <span style={{ fontWeight: 'bold', color: THEME.green }}>✅ Position capturée</span>
                        <button 
                            onClick={getLocation}
                            style={{ fontSize: '0.8rem', textDecoration: 'underline', border: 'none', background: 'none', cursor: 'pointer' }}
                        >
                            Actualiser
                        </button>
                    </div>
                    
                    <div style={{ fontSize: '0.9rem', color: '#555', fontFamily: 'monospace' }}>
                        {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                    </div>
                    
                    <div style={{ 
                        marginTop: '10px', 
                        fontSize: '0.8rem', 
                        color: getAccuracyColor(location.accuracy),
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}>
                        <span>📡 Précision : ± {location.accuracy} mètres</span>
                        {location.accuracy > 50 && (
                            <span>(Essayez de sortir dehors)</span>
                        )}
                    </div>
                </div>
            )}

            {error && (
                <div style={{ marginTop: '10px', color: THEME.ocre, fontSize: '0.9rem', fontWeight: 'bold', padding: '10px', backgroundColor: '#FFEBEE' }}>
                    ⚠️ {error}
                </div>
            )}
        </div>
    );
};