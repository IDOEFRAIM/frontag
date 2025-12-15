'use client'; // 👈 RENDU OBLIGATOIRE pour utiliser les hooks (comme useAuth)

import React, { useEffect } from 'react';
import AdminNavbar from '@/components/utils/adminNavbar'; 
import Link from 'next/link';
import { FaShieldAlt, FaSpinner } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth'; // 👈 IMPORTATION DU HOOK D'AUTHENTIFICATION
import { useRouter } from 'next/navigation';


// --- METADATA (Ne peut pas être exporté dans un composant client) ---
// Note : La metadata doit être définie dans un fichier séparé ou dans le parent pour un composant client.
// Pour les besoins de cet exemple, nous laissons la définition ici comme commentaire.
/*
export const metadata = {
    title: 'Admin Dashboard | Plateforme Agricole',
    description: 'Espace de gestion et de supervision de la plateforme.',
};
*/


// --- COMPOSANT LAYOUT ---

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { userRole, isAuthenticated, isLoading } = useAuth(); // 👈 UTILISATION DU HOOK
    const router = useRouter();

    // 1. GESTION DE L'ACCÈS ET DE LA REDIRECTION CÔTÉ CLIENT
    useEffect(() => {
        // Attendre que le chargement initial soit terminé
        if (isLoading) return; 

        // Si l'utilisateur est authentifié mais n'est PAS un admin, rediriger
        if (isAuthenticated && userRole !== 'admin') {
            console.warn(`Tentative d'accès à l'Admin Console par le rôle: ${userRole}`);
            
            // Redirection vers le dashboard approprié (ou la page d'accueil)
            if (userRole === 'producer') {
                router.replace('/producer/dashboard'); 
            } else { // 'buyer' ou autre rôle non reconnu
                router.replace('/'); 
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
                <p className="ml-3 text-lg font-medium text-gray-700">Vérification de la session...</p>
            </div>
        );
    }
    
    // B. Bloquer l'affichage si l'utilisateur n'est pas Admin (le middleware devrait déjà l'avoir géré)
    // On peut renvoyer null ou un composant d'erreur simple ici, car la redirection est gérée par useEffect.
    if (userRole !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-700">
                <p>Accès non autorisé. Redirection en cours...</p>
            </div>
        );
    }

    // 3. AFFICHAGE NORMAL DU LAYOUT ADMIN (Seulement si userRole === 'admin')
    return (
        <div className="min-h-screen bg-gray-50">
            
            {/* 1. TOP HEADER (Visible sur tous les écrans) */}
            <header className="bg-gray-800 text-white p-4 shadow-lg sticky top-0 z-20">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link href="/admin" className="text-xl font-extrabold flex items-center gap-2 transition-opacity hover:opacity-90">
                        <FaShieldAlt className="text-green-400" /> 
                        ADMIN CONSOLE
                    </Link>
                    {/* Le bouton de déconnexion est souvent ici sur desktop, géré par un composant utilitaire */}
                </div>
            </header>

            {/* 2. BARRE DE NAVIGATION (Desktop/Tablette) */}
            <div className="hidden md:block bg-white border-b border-gray-200 shadow-sm sticky top-16 z-10"> {/* Rendu sticky */}
                <div className="max-w-7xl mx-auto px-4">
                    <AdminNavbar />
                </div>
            </div>

            {/* 3. CONTENU PRINCIPAL */}
            <main className="max-w-7xl mx-auto p-4 md:p-6 pb-20 md:pb-6"> 
                {children}
            </main>

            {/* 4. BARRE DE NAVIGATION (Mobile - Fixe en bas) */}
            <div className="block md:hidden fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-200 shadow-lg">
                <AdminNavbar />
            </div>

        </div>
    );
}