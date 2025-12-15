'use client'; // Les composants d'erreur doivent toujours être des Client Components

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    
    // Log de l'erreur dans la console (utile pour le débogage)
    useEffect(() => {
        console.error("Erreur capturée dans la page produit :", error);
    }, [error]);

    return (
        <div style={{ 
            padding: '60px 20px', 
            textAlign: 'center', 
            maxWidth: '600px', 
            margin: '0 auto',
            fontFamily: 'system-ui, sans-serif'
        }}>
            <h2 style={{ color: '#d32f2f', marginBottom: '20px', fontSize: '1.8rem' }}>
                Oups ! Une erreur est survenue.
            </h2>
            
            <p style={{ color: '#555', marginBottom: '30px', fontSize: '1.1rem' }}>
                {/* Affiche le message d'erreur dynamique ou un message par défaut */}
                {error.message || "Impossible de charger les détails du produit."}
            </p>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                {/* Bouton pour réessayer l'action qui a échoué */}
                <button
                    onClick={
                        // Tente de re-rendre le segment
                        () => reset()
                    }
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#333',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Réessayer
                </button>

                {/* Lien pour retourner à l'accueil ou au catalogue */}
                <Link 
                    href="/catalogue" 
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#f0f0f0',
                        color: '#333',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        fontWeight: 'bold'
                    }}
                >
                    Retour au catalogue
                </Link>
            </div>
        </div>
    );
}