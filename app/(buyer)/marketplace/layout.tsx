'use client';

import React from 'react';
import BuyerNavbar from '@/components/utils/BuyetNavbar';
import { useAuth } from '@/hooks/useAuth';

interface PublicLayoutProps {
    children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    // Note: useAuth est surtout utilisé ici pour s'assurer que si un utilisateur admin/producteur
    // arrive ici, il est traité comme un utilisateur "buyer" dans l'interface, 
    // ou simplement pour gérer les liens de connexion/déconnexion de la Navbar.
    const { isAuthenticated, userRole } = useAuth();
    
    // Si l'utilisateur est un producteur ou un admin, il utilise techniquement ce layout pour
    // naviguer sur le marché, mais si nous voulons le rediriger automatiquement vers 
    // son espace s'il essaie d'accéder à l'accueil public, cette logique se trouve 
    // dans le Root Layout de l'App Router ou dans le useAuth hook lui-même. 

    // Pour l'instant, ce layout sert principalement d'enveloppe structurelle.

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* La barre de navigation du marché */}
            <BuyerNavbar />
            
            {/* Contenu principal. Nous ajoutons un padding top pour compenser la barre fixe. */}
            <main className="flex-grow max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
                {children}
            </main>

            {/* Pied de page 
            <Footer />*/}
        </div>
    );
}