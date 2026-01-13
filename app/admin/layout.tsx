'use client';

import React, { useEffect } from 'react';
import AdminNavbar from '@/components/utils/adminNavbar'; 
import Link from 'next/link';
import { FaShieldAlt, FaSpinner } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth'; 
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { userRole, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    // 1. GESTION DE L'ACCÈS (Côté Client)
    useEffect(() => {
        if (isLoading) return; 

        // Normalisation de la casse pour la comparaison
        const role = userRole?.toUpperCase();

        // Si l'utilisateur n'est pas connecté
        if (!isAuthenticated) {
             router.replace('/login');
             return;
        }

        // Si l'utilisateur est connecté mais n'est PAS ADMIN
        if (role !== 'ADMIN') {
            console.warn(`Accès refusé à l'Admin Console. Rôle actuel: ${role}`);
            
            if (role === 'PRODUCER') {
                router.replace('/productor/dashboard'); 
            } else {
                router.replace('/market'); 
            }
        }
    }, [isLoading, isAuthenticated, userRole, router]);

    // 2. ÉTATS D'AFFICHAGE CONDITIONNEL

    // A. Chargement de la session
    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <FaSpinner className="animate-spin text-4xl text-green-600 mb-4" />
                <p className="text-lg font-medium text-gray-700">Vérification des privilèges admin...</p>
            </div>
        );
    }
    
    // B. Sécurité : Ne rien afficher si le rôle n'est pas ADMIN
    if (!isAuthenticated || userRole?.toUpperCase() !== 'ADMIN') {
        return null; 
    }

    // 3. AFFICHAGE DU LAYOUT ADMIN
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            
            {/* 1. TOP HEADER (Fixe) */}
            <header className="bg-slate-900 text-white p-4 shadow-xl sticky top-0 z-30">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link href="/admin" className="text-xl font-black flex items-center gap-2 hover:text-green-400 transition-colors">
                        <FaShieldAlt className="text-green-500" /> 
                        <span className="tracking-tighter uppercase italic">Admin<span className="text-green-500 not-italic">.</span>Console</span>
                    </Link>
                    
                    <div className="flex items-center gap-4">
                        <span className="hidden sm:block text-[10px] font-bold bg-green-500/20 text-green-400 px-3 py-1 rounded-full uppercase tracking-widest border border-green-500/30">
                            Mode Superviseur
                        </span>
                    </div>
                </div>
            </header>

            {/* 2. BARRE DE NAVIGATION (Desktop) */}
            <div className="hidden md:block bg-white border-b border-gray-200 shadow-sm sticky top-[68px] z-20">
                <div className="max-w-7xl mx-auto px-4">
                    <AdminNavbar />
                </div>
            </div>

            {/* 3. CONTENU PRINCIPAL */}
            <main className="max-w-7xl mx-auto w-full p-4 md:p-8 flex-grow mb-20 md:mb-0"> 
                {children}
            </main>

            {/* 4. BARRE DE NAVIGATION (Mobile - Fixe en bas) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                <AdminNavbar />
            </nav>

        </div>
    );
}