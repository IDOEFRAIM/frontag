'use client';

import React, { useState, useEffect } from 'react';
import ProductorSidebar from '@/components/utils/productorSidebar'; 
import { FaBars, FaSpinner } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth'; // 👈 Importation du hook d'authentification
import { useRouter } from 'next/navigation';

/**
 * Layout pour la zone Producteur.
 * Fournit une structure de tableau de bord avec une barre latérale et une zone de contenu,
 * tout en assurant que seul un utilisateur de rôle 'producer' y accède.
 */
export default function ProductorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const { userRole, isAuthenticated, isLoading } = useAuth(); // 👈 UTILISATION DU HOOK
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // 1. GESTION DE L'ACCÈS ET DE LA REDIRECTION CÔTÉ CLIENT
    useEffect(() => {
        // Attendre que le chargement initial soit terminé
        if (isLoading) return;

        // Si l'utilisateur est authentifié mais n'est PAS un producteur, rediriger
        if (isAuthenticated && userRole !== 'producer') {
            console.warn(`Tentative d'accès à l'Espace Producteur par le rôle: ${userRole}`);
            
            // Redirection vers le dashboard approprié (Admin ou Market)
            if (userRole === 'admin') {
                router.replace('/admin'); 
            } else { // 'buyer' ou 'guest'
                router.replace('/market'); 
            }
        } 
        
        // Si l'utilisateur n'est pas connecté du tout, on le renvoie à la connexion
        if (!isAuthenticated) {
            router.replace('/login');
        }

    }, [isLoading, isAuthenticated, userRole, router]);

    // 2. ÉTATS D'AFFICHAGE CONDITIONNEL

    // A. Affichage pendant le chargement (vérification de la session)
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <FaSpinner className="animate-spin text-4xl text-green-600" />
                <p className="ml-3 text-lg font-medium text-gray-700">Vérification de la session Producteur...</p>
            </div>
        );
    }
    
    // B. Bloquer l'affichage si l'utilisateur n'est pas Producteur
    if (userRole !== 'producer') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-700">
                <p>Accès non autorisé. Redirection en cours...</p>
            </div>
        );
    }

    // 3. AFFICHAGE NORMAL DU LAYOUT PRODUCTEUR (Seulement si userRole === 'producer')
    return (
        <div className="flex h-screen bg-gray-50">
            
            {/* 1. Sidebar (Menu Latéral) */}
            <ProductorSidebar 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
            />
            
            {/* 2. Contenu Principal et En-tête */}
            <div className="flex flex-col flex-1 overflow-hidden">
                
                {/* Header (Barre du Haut) - Visible uniquement sur mobile/tablette */}
                <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 h-16 md:hidden sticky top-0 z-10">
                    
                    {/* Bouton pour ouvrir la Sidebar sur mobile */}
                    <button 
                        onClick={toggleSidebar} 
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <FaBars size={24} />
                    </button>
                    
                    <h1 className="text-lg font-semibold text-gray-800">
                        Espace Producteur
                    </h1>
                    
                    <div className="w-6"></div> {/* Placeholder */}

                </header>

                {/* Zone de Contenu Défilant */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    {children}
                </main>
            </div>

            {/* Overlay pour le menu mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black opacity-50 md:hidden" 
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}