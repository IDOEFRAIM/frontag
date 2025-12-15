'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth'; // 👈 IMPORTATION DU HOOK D'AUTH
import { 
    FaChartLine, 
    FaBox, 
    FaShoppingCart, 
    FaUsers, 
    FaCog, 
    FaSignOutAlt,
    FaTractor,
    FaTimes
} from 'react-icons/fa';

interface NavLink {
    name: string;
    href: string;
    icon: React.ElementType;
}

// Définition des liens pour la navigation Producteur
const PRODUCER_LINKS: NavLink[] = [
    // Note: Le chemin devrait probablement être '/dashboard' si le layout est dans /producer
    { name: 'Tableau de bord', href: '/dashboard', icon: FaChartLine },
    { name: 'Mes Produits', href: '/products', icon: FaBox },
    { name: 'Commandes', href: '/orders', icon: FaShoppingCart },
    { name: 'Ajouter Produit', href: '/products/add', icon: FaTractor }, // Utiliser une icône plus pertinente
    // { name: 'Clients', href: '/clients', icon: FaUsers }, // Note: FaUsers est déjà utilisé pour les clients, vérifiez le bon chemin
];

const SECONDARY_LINKS: NavLink[] = [
    { name: 'Paramètres', href: '/settings', icon: FaCog },
];

interface ProductorSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProductorSidebar({ isOpen, onClose }: ProductorSidebarProps) {
    const pathname = usePathname();
    const { logout } = useAuth(); // 👈 1. Récupérer la fonction logout

    // Fonction de déconnexion unifiée
    const handleLogout = () => {
        onClose(); // Fermer la sidebar mobile avant de déconnecter
        logout(); // 2. Appel de la fonction logout du contexte
    };

    return (
        // Sidebar fixe (Desktop) et modale (Mobile)
        <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transition-transform duration-300 ease-in-out
                md:translate-x-0 md:static md:shadow-lg`}>
            
            <div className="flex flex-col h-full p-4">
                
                {/* En-tête / Logo */}
                <div className="flex items-center justify-between mb-8 border-b border-gray-700 pb-4">
                    <Link href="/dashboard" className="flex items-center gap-2" onClick={onClose}>
                        <FaTractor className="text-green-500 text-2xl" />
                        <span className="font-bold text-xl text-white">
                            Producteur
                        </span>
                    </Link>
                    {/* Bouton de fermeture mobile */}
                    <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Liens Principaux */}
                <nav className="flex-grow space-y-2">
                    {PRODUCER_LINKS.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={onClose}
                            // Assurer que le chemin matche correctement, en tenant compte de l'arborescence.
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                                pathname.startsWith(link.href) || (link.href === '/dashboard' && pathname === '/producer')
                                    ? 'bg-green-600 text-white' 
                                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                            }`}
                        >
                            <link.icon size={18} />
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Liens Secondaires / Déconnexion */}
                <div className="mt-8 pt-4 border-t border-gray-700 space-y-2">
                    {SECONDARY_LINKS.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                                pathname.startsWith(link.href) 
                                    ? 'bg-gray-700 text-white' 
                                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                            }`}
                        >
                            <link.icon size={18} />
                            {link.name}
                        </Link>
                    ))}
                    
                    <button
                        onClick={handleLogout} // 👈 Appel de la fonction de déconnexion unifiée
                        className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-gray-700 transition-colors"
                    >
                        <FaSignOutAlt size={18} />
                        Déconnexion
                    </button>
                </div>
            </div>
        </div>
    );
}