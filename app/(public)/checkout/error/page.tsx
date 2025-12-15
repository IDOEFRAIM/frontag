// app/checkout/error/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutErrorPage() {
    const router = useRouter();

    return (
        <div style={{ 
            minHeight: '70vh', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            textAlign: 'center', 
            padding: '20px',
            fontFamily: 'system-ui, sans-serif'
        }}>
            <div style={{ 
                width: '80px', height: '80px', backgroundColor: '#fee2e2', 
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '20px'
            }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </div>

            <h1 style={{ color: '#b91c1c', marginBottom: '10px' }}>Oups ! Le paiement a échoué.</h1>
            <p style={{ color: '#666', maxWidth: '500px', marginBottom: '30px' }}>
                Nous n'avons pas pu débiter votre compte Mobile Money. Cela peut être dû à un problème de réseau ou à un solde insuffisant.
            </p>

            <div style={{ display: 'flex', gap: '20px' }}>
                <button 
                    onClick={() => router.back()} // Retourne au formulaire pour réessayer
                    style={{
                        padding: '12px 30px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    Réessayer le paiement
                </button>

                <Link 
                    href="/contact" // Lien hypothétique
                    style={{
                        padding: '12px 30px',
                        backgroundColor: 'transparent',
                        color: '#555',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        display: 'flex', alignItems: 'center'
                    }}
                >
                    Aide
                </Link>
            </div>
        </div>
    );
}