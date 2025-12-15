'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth'; // 👈 Importation du hook d'authentification
// On réintroduit useCart si on veut afficher le badge du panier, mais je le garde commenté pour l'instant.
// import { useCart } from '@/context/CartContext'; 
import { 
    FaShoppingBasket, 
    FaSearch, 
    FaBars, 
    FaTimes, 
    FaLeaf, 
    FaUser, 
    FaTractor,
    FaSignOutAlt,
    FaUserCircle // Utilisé pour le menu de l'utilisateur
} from 'react-icons/fa';

// Définition de l'array de liens (Scalabilité)
const NAV_LINKS = [
    { name: 'Accueil', href: '/' },
    { name: 'Produits', href: '/products' },
    { name: 'Catalogue', href: '/catalogue' },
];

export default function Navbar() { 
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // Pour le menu déroulant utilisateur
    
    // 1. UTILISATION DU HOOK useAuth
    const { isAuthenticated, userRole, user, logout } = useAuth();

    const pathname = usePathname();
    const totalItems = 0; // Remplacez par useCart().state.totalItems lorsque le contexte sera prêt.

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Détermine le chemin vers l'espace personnel
    const getUserDashboardPath = () => {
        switch (userRole) {
            case 'admin':
                return '/admin';
            case 'producer':
                return '/productor/dashboard';
            case 'buyer':
            default:
                return '/market';
        }
    };

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* 1. LOGO */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="bg-green-600 text-white p-1.5 rounded-lg">
                                <FaLeaf size={20} />
                            </div>
                            <span className="font-black text-xl text-gray-800 tracking-tight">
                                Agri<span className="text-green-600">Connect</span>
                            </span>
                        </Link>
                    </div>

                    {/* 2. MENU PRINCIPAL (Desktop) */}
                    <div className="hidden md:flex flex-1 items-center justify-center space-x-4">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`px-3 py-2 text-sm font-medium transition-colors ${
                                    pathname === link.href 
                                        ? 'text-green-700 border-b-2 border-green-600' 
                                        : 'text-gray-500 hover:text-gray-900'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* 3. ICONES & MENU DROITE */}
                    <div className="flex items-center gap-4">
                        
                        {/* 3a. LIEN PRODUCTEUR (Si non Producteur) */}
                        {!isAuthenticated || userRole !== 'producer' ? (
                             <Link 
                                href="/productor/dashboard" // Lien de promotion vers l'espace producteur
                                className="hidden md:flex items-center gap-2 text-xs font-bold text-green-700 bg-green-50 px-3 py-2 rounded-full hover:bg-green-100 transition-colors"
                             >
                                <FaTractor />
                                Espace Producteur
                            </Link>
                        ) : null}

                        {/* 3b. Panier */}
                        <Link href="/cart" className="relative p-2 text-gray-600 hover:text-green-600 transition-colors">
                            <FaShoppingBasket size={24} />
                            {totalItems > 0 && ( 
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                                    {totalItems} 
                                </span>
                            )}
                        </Link>

                        {/* 3c. Connexion / Profil (Desktop) */}
                        <div className="hidden md:block relative">
                            {isAuthenticated ? (
                                // Menu Utilisateur Connecté
                                <>
                                    <button 
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="p-2 text-gray-600 hover:text-green-600 focus:outline-none flex items-center gap-2"
                                    >
                                        <FaUserCircle size={24} />
                                        <span className='font-medium text-sm'>{user?.name || user?.email}</span>
                                    </button>
                                    
                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-20">
                                            <Link 
                                                href={getUserDashboardPath()}
                                                onClick={() => { setIsUserMenuOpen(false); }}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Mon Espace ({userRole})
                                            </Link>
                                            <button 
                                                onClick={() => { logout(); setIsUserMenuOpen(false); }}
                                                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                <FaSignOutAlt /> Déconnexion
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                // Lien vers la Connexion/Inscription
                                <Link href="/login" className="p-2 text-gray-600 hover:text-green-600">
                                    <FaUser size={22} />
                                </Link>
                            )}
                        </div>

                        {/* 3d. Bouton Menu Mobile (Hamburger) */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={toggleMobileMenu}
                                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                            >
                                {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. MENU MOBILE (Déroulant) */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        
                        {/* Recherche Mobile... (Laissée telle quelle) */}
                        <div className="mb-4 px-2">
                             <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSearch className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500"
                                    placeholder="Rechercher..."
                                />
                             </div>
                        </div>

                        {/* Liens Principaux Mobile */}
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={toggleMobileMenu}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${
                                    pathname === link.href 
                                        ? 'text-green-700 bg-green-50' 
                                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="border-t border-gray-100 my-2"></div>

                        {/* Liens Spéciaux Mobile (Conditionnels) */}
                        {isAuthenticated ? (
                             // Utilisateur Connecté (Accès Dashboard + Déconnexion)
                             <>
                                <Link 
                                    href={getUserDashboardPath()}
                                    onClick={toggleMobileMenu}
                                    className="flex items-center gap-3 px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    <FaUserCircle className="text-green-600" /> Mon Espace ({userRole})
                                </Link>
                                <button 
                                    onClick={() => { logout(); toggleMobileMenu(); }}
                                    className="w-full text-left flex items-center gap-3 px-3 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
                                >
                                    <FaSignOutAlt /> Déconnexion
                                </button>
                             </>
                        ) : (
                            // Utilisateur Déconnecté (Connexion/Inscription)
                            <>
                                <Link 
                                    href="/login" 
                                    onClick={toggleMobileMenu}
                                    className="flex items-center gap-3 px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    <FaUser className="text-gray-400" /> Se connecter
                                </Link>
                                <Link 
                                    href="/register" 
                                    onClick={toggleMobileMenu}
                                    className="flex items-center gap-3 px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    <FaUser className="text-gray-400" /> S'inscrire
                                </Link>
                            </>
                        )}
                        
                        {/* Lien Producteur Mobile (Promotion) */}
                        {!isAuthenticated || userRole !== 'producer' ? (
                            <Link 
                                href="/productor/dashboard" 
                                onClick={toggleMobileMenu}
                                className="flex items-center gap-3 px-3 py-3 text-base font-bold text-green-700 bg-green-50 rounded-lg mx-2 mt-2"
                            >
                                <FaTractor /> Je suis Producteur
                            </Link>
                        ) : null}

                    </div>
                </div>
            )}
        </nav>
    );
}