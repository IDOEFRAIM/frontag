'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    FaTachometerAlt, FaUsers, FaWarehouse, 
    FaCheckCircle, FaCog, FaSignOutAlt 
} from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth'; // 👈 IMPORTATION DU HOOK D'AUTH

// --- STRUCTURE DE NAVIGATION ---
const adminNavItems = [
    { name: 'Dashboard', href: '/admin', icon: FaTachometerAlt, exact: true },
    { name: 'Producteurs', href: '/admin/producers', icon: FaUsers },
    { name: 'Stocks', href: '/admin/stock', icon: FaWarehouse },
    { name: 'Validations', href: '/admin/validations', icon: FaCheckCircle },
    { name: 'Paramètres', href: '/admin/settings', icon: FaCog },
];

// --- COMPOSANT DE NAVIGATION ADMIN ---

export default function AdminNavbar() {
    const pathname = usePathname();
    const { logout } = useAuth(); // 👈 1. Récupérer la fonction logout

    // Fonction de déconnexion
    const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        // 2. Appel de la fonction logout du contexte, qui gère le nettoyage et la redirection.
        logout(); 
    };

    return (
        // Les styles de positionnement sticky/fixed sont gérés dans AdminLayout pour le mobile/desktop
        // Ici, nous nous concentrons sur les éléments internes de la barre de navigation
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:relative md:border-none md:shadow-none md:mt-0">
            <div className="flex justify-around items-center h-16 max-w-7xl mx-auto md:justify-start md:space-x-8 md:h-auto md:p-0">
                
                {adminNavItems.map((item) => {
                    // Déterminer si le lien est actif
                    const isActive = item.exact 
                        ? pathname === item.href
                        : pathname.startsWith(item.href) && pathname !== '/admin'; // Fix: s'assurer que /admin ne matche pas /admin/qch

                    const colorClass = isActive ? 'text-green-700 font-bold' : 'text-gray-500 hover:text-green-600';

                    return (
                        <Link key={item.name} href={item.href} className="flex-1 md:flex-none">
                            <div className="flex flex-col items-center justify-center p-2 text-center transition-colors duration-150 active:scale-95 md:flex-row md:p-3 md:rounded-xl md:gap-2">
                                <item.icon className={`text-xl md:text-lg ${colorClass}`} />
                                <span className={`text-xs md:text-sm ${colorClass}`}>
                                    {item.name}
                                </span>
                            </div>
                        </Link>
                    );
                })}

                {/* Bouton de Déconnexion (Maintenant fonctionnel) */}
                <button
                    onClick={handleLogout} // 👈 Appel de la nouvelle fonction
                    className="hidden md:flex md:flex-row md:items-center md:p-3 md:rounded-xl md:gap-2 text-red-500 hover:bg-red-50 transition-colors duration-150"
                    aria-label="Déconnexion"
                >
                    <FaSignOutAlt className="text-lg" />
                    <span className="text-sm font-medium">Quitter</span>
                </button>

                {/* Le bouton de déconnexion est souvent caché sur mobile et placé dans le menu paramètres pour économiser de l'espace */}
                {/* Si vous voulez l'inclure sur mobile, déplacez le bouton dans la boucle ou ajoutez-le ici sans 'hidden md:flex' */}

            </div>
        </nav>
    );
}