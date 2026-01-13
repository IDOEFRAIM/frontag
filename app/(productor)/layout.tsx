'use client';

import React, { useState, useEffect } from 'react';
import ProductorSidebar from '@/components/utils/productorSidebar'; 
import { FaBars, FaSpinner } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function ProductorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const { userRole, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // 1. GESTION DES ACCÈS
    useEffect(() => {
        if (isLoading) return;

        // Si non connecté -> redirection login
        if (!isAuthenticated) {
            router.replace('/login');
            return;
        }

        // Vérification du rôle (on force la majuscule pour éviter les erreurs)
        const role = userRole?.toUpperCase();
        
        if (role !== 'PRODUCER') {
            console.warn(`Accès refusé. Rôle actuel: ${role}`);
            
            if (role === 'ADMIN') {
                router.replace('/admin');
            } else {
                router.replace('/market');
            }
        }
    }, [isLoading, isAuthenticated, userRole, router]);

    // 2. ÉTATS DE CHARGEMENT ET SÉCURITÉ
    
    // Chargement initial
    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <FaSpinner className="animate-spin text-4xl text-green-600 mb-4" />
                <p className="text-lg font-medium text-gray-700">Vérification de vos accès producteur...</p>
            </div>
        );
    }

    // Sécurité stricte : si pas de role ou pas PRODUCER, on ne rend rien (le useEffect redirigera)
    if (!isAuthenticated || userRole?.toUpperCase() !== 'PRODUCER') {
        return null; 
    }

    // 3. RENDU DU DASHBOARD
    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            
            {/* Sidebar (Menu Latéral) */}
            <ProductorSidebar 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
            />
            
            {/* Contenu Principal */}
            <div className="flex flex-col flex-1 w-full overflow-hidden">
                
                {/* Header Mobile */}
                <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 h-16 md:hidden sticky top-0 z-30">
                    <button 
                        onClick={toggleSidebar} 
                        className="p-2 -ml-2 text-gray-600 hover:text-green-600 transition-colors"
                        aria-label="Ouvrir le menu"
                    >
                        <FaBars size={22} />
                    </button>
                    
                    <h1 className="text-md font-bold text-green-700 uppercase tracking-tight">
                        Espace Producteur
                    </h1>
                    
                    <div className="w-8"></div> {/* Équilibre visuel */}
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8 custom-scrollbar">
                    {/* Conteneur pour limiter la largeur sur très grands écrans */}
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            {/* Overlay Mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden transition-opacity" 
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}