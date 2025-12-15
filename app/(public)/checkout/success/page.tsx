// app/checkout/success/page.tsx
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CheckoutSuccessPage() {
    const { clearCart } = useCart();

    // Au montage de la page, on s'assure que le panier est vidé
    useEffect(() => {
        clearCart();
    }, []);

    // Génération d'un faux numéro de commande
    const orderId = `CMD-${Math.floor(Math.random() * 1000000)}`;

    return (
        <div style={{ 
            minHeight: '80vh', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            textAlign: 'center', 
            padding: '20px',
            fontFamily: 'system-ui, sans-serif'
        }}>
            {/* Cercle Animé Succès */}
            <div style={{ 
                width: '100px', height: '100px', backgroundColor: '#d1fae5', 
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '30px', animation: 'pulse 2s infinite'
            }}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>

            <h1 style={{ color: '#064e3b', marginBottom: '10px' }}>Paiement Réussi !</h1>
            <p style={{ fontSize: '1.2rem', color: '#555' }}>Votre commande <strong>#{orderId}</strong> a été enregistrée.</p>

            <div style={{ 
                backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', 
                maxWidth: '500px', margin: '30px 0', border: '1px solid #eee' 
            }}>
                <h3 style={{ marginTop: 0, color: '#333' }}>Et maintenant ?</h3>
                <ul style={{ textAlign: 'left', color: '#666', lineHeight: '1.6' }}>
                    <li>📲 Vous recevrez un SMS de confirmation dans 2 minutes.</li>
                    <li>🚜 Le producteur a été notifié pour préparer votre colis.</li>
                    <li>🚚 La livraison est prévue sous 24h à 48h.</li>
                </ul>
            </div>

            <Link 
                href="/catalogue"
                style={{
                    padding: '15px 40px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '50px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)',
                    transition: 'transform 0.2s'
                }}
            >
                Retourner à la boutique
            </Link>
        </div>
    );
}