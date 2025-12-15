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

    // Détermine le chemin vers le dashboard (utilisé si l'utilisateur est Producteur ou Admin)
    const getUserDashboardPath = () => {
        if (userRole === 'admin') return '/admin';
        if (userRole === 'producer') return '/producer/dashboard';
        return '/market';
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
                                    <Link 
                                        href={getUserDashboardPath()}
                                        className="p-2 text-gray-600 hover:text-green-600 flex items-center gap-2"
                                    >
                                        <FaUserCircle size={24} />
                                        <span className='font-medium text-sm'>{user?.name || 'Mon Compte'}</span>
                                    </Link>
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 invisible group-hover:visible transition-all duration-150 z-20">
                                        
                                        {userRole !== 'buyer' && (
                                            <Link 
                                                href={getUserDashboardPath()}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Accéder à mon {userRole === 'producer' ? 'Dashboard' : 'Admin'}
                                            </Link>
                                        )}
                                        
                                        <Link 
                                            href="/settings"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Paramètres
                                        </Link>

                                        <button 
                                            onClick={logout}
                                            className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            <FaSignOutAlt /> Déconnexion
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <Link href="/login" className="p-2 text-gray-600 hover:text-green-600">
                                    <FaUser size={22} />
                                </Link>
                            )}
                        </div>

                        {/* 3c. Bouton Menu Mobile */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={toggleMobileMenu}
                                className="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
                            >
                                {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. MENU MOBILE */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg p-4">
                    <div className="mb-4">
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500"
                                placeholder="Rechercher des produits..."
                            />
                        </div>
                    </div>
                    
                    {BUYER_LINKS.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={toggleMobileMenu}
                            className={`flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium ${
                                pathname.startsWith(link.href) 
                                    ? 'text-green-700 bg-green-50' 
                                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                             {link.name === 'Commandes' ? <FaClipboardList /> : <FaSearch />} {link.name}
                        </Link>
                    ))}

                    <div className="border-t border-gray-100 my-4"></div>

                    {isAuthenticated ? (
                        <>
                            <Link 
                                href={getUserDashboardPath()}
                                onClick={toggleMobileMenu}
                                className="flex items-center gap-3 px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
                            >
                                <FaUserCircle className="text-green-600" /> Mon Compte ({userRole})
                            </Link>
                            <button 
                                onClick={() => { logout(); toggleMobileMenu(); }}
                                className="w-full text-left flex items-center gap-3 px-3 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
                            >
                                <FaSignOutAlt /> Déconnexion
                            </button>
                        </>
                    ) : (
                        <Link 
                            href="/login" 
                            onClick={toggleMobileMenu}
                            className="flex items-center gap-3 px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
                        >
                            <FaUser className="text-gray-400" /> Se connecter ou S'inscrire
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
}