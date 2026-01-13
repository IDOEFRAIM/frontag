'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
// Importez useCart ici une fois que vous l'aurez finalisé, pour l'affichage du badge
// import { useCart } from '@/context/CartContext'; 
import { 
    FaShoppingBasket, 
    FaSearch, 
    FaBars, 
    FaTimes, 
    FaUser,
    FaSignOutAlt,
    FaClipboardList, // Pour les commandes
    FaUserCircle 
} from 'react-icons/fa';

const BUYER_LINKS = [
    { name: 'Le Marché', href: '/market' },
    { name: 'Commandes', href: '/orders' },
    // Ajoutez d'autres liens spécifiques à l'acheteur ici (ex: Favoris)
];

export default function BuyerNavbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isAuthenticated, userRole, user, logout } = useAuth();
    const pathname = usePathname();

    // const { state } = useCart(); // À décommenter plus tard
    const totalItems = 0; // Remplacez par state.totalItems

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Déconnexion
    const handleLogout = async () => {
        await logout();
        window.location.href = '/login';
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* 1. LOGO/TITRE */}
                    <div className="flex items-center">
                        <Link href="/market" className="flex items-center gap-2 text-2xl font-black text-green-700">
                            Agri<span className="text-gray-900">Market</span>
                        </Link>
                    </div>

                    {/* 2. MENU CENTRAL (Desktop) */}
                    <div className="hidden md:flex flex-1 items-center justify-center space-x-6">
                        {BUYER_LINKS.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`px-3 py-2 text-sm font-medium transition-colors ${
                                    pathname.startsWith(link.href) && (link.href !== '/market' || pathname === '/market')
                                        ? 'text-green-700 border-b-2 border-green-600' 
                                        : 'text-gray-600 hover:text-green-700'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* 3. ACTIONS DE DROITE */}
                    <div className="flex items-center gap-4">
                        
                        {/* 3a. Panier */}
                        <Link href="/cart" className="relative p-2 text-gray-600 hover:text-green-600 transition-colors">
                            <FaShoppingBasket size={24} />
                            {totalItems > 0 && ( 
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                                    {totalItems} 
                                </span>
                            )}
                        </Link>

                        {/* 3b. Espace Utilisateur */}
                        <div className="hidden md:block">
                            {isAuthenticated ? (
                                <div className="relative group">
                                    <button 
                                        className="p-2 text-gray-600 hover:text-green-600 flex items-center gap-2"
                                    >
                                        <FaUserCircle size={24} />
                                        <span className='font-medium text-sm'>{user?.name || 'Mon Compte'}</span>
                                    </button>
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 invisible group-hover:visible transition-all duration-150 z-20">
                                        
                                        {userRole !== 'USER' && (
                                            <Link href={userRole === 'ADMIN' ? '/admin' : '/productor/dashboard'} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                Basculer vers {userRole === 'ADMIN' ? 'Admin' : 'Producteur'}
                                            </Link>
                                        )}
                                        
                                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                            <FaSignOutAlt className="inline mr-2"/> Déconnexion
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <Link href="/login" className="text-sm font-bold text-green-700">Connexion</Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}