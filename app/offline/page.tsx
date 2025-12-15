// app/offline/page.tsx
import React from 'react';
import Link from 'next/link';

export const metadata = {
    title: 'Hors Connexion | AgriConnect',
};

const THEME = {
    ocre: '#A63C06',
    sand: '#F9F9F7',
    text: '#2D2D2D',
};

export default function OfflinePage() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: THEME.sand,
            padding: '20px',
            textAlign: 'center',
            fontFamily: 'system-ui, sans-serif'
        }}>
            {/* Icône SVG simple et légère */}
            <div style={{ 
                fontSize: '4rem', 
                marginBottom: '20px',
                color: THEME.ocre 
            }}>
                📡
            </div>

            <h1 style={{ 
                fontSize: '2rem', 
                color: THEME.text, 
                marginBottom: '10px',
                textTransform: 'uppercase' 
            }}>
                Réseau Coupé
            </h1>

            <p style={{ 
                fontSize: '1.1rem', 
                color: '#666', 
                maxWidth: '400px', 
                marginBottom: '40px',
                lineHeight: '1.5'
            }}>
                Vous êtes dans une zone sans internet. 
                Cette page n'est pas encore enregistrée sur votre téléphone.
            </p>

            <div style={{ 
                backgroundColor: '#fff', 
                padding: '20px', 
                borderRadius: '8px', 
                border: '1px solid #ddd',
                marginBottom: '30px'
            }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem' }}>Que pouvez-vous faire ?</h3>
                <ul style={{ textAlign: 'left', color: '#555', fontSize: '0.95rem', paddingLeft: '20px' }}>
                    <li>Consulter le Catalogue (Déjà chargé)</li>
                    <li>Préparer votre panier</li>
                    <li>Voir vos commandes passées</li>
                </ul>
            </div>

            <Link href="/" style={{
                backgroundColor: THEME.ocre,
                color: '#fff',
                textDecoration: 'none',
                padding: '15px 30px',
                borderRadius: '50px',
                fontWeight: 'bold',
                boxShadow: '0 4px 10px rgba(166, 60, 6, 0.3)'
            }}>
                RETOURNER AU MARCHÉ
            </Link>
        </div>
    );
}