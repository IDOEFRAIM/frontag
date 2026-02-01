'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth'; 
import { 
    FaShoppingBasket, 
    FaBars, 
    FaTimes, 
    FaLeaf, 
    FaUser, 
    FaTractor,
    FaSignOutAlt,
    FaUserCircle,
    FaDashcube
} from 'react-icons/fa';

const NAV_LINKS = [
    { name: 'Accueil', href: '/' },
    { name: 'Produits', href: '/products' },
    { name: 'Catalogue', href: '/catalogue' },
];

export default function Navbar() { 
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { isAuthenticated, userRole, user, logout } = useAuth();
    const pathname = usePathname();

    // Fermer les menus si on change de page
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
    }, [pathname]);

    // Action de déconnexion avec redirection forcée pour garantir le reset
    const handleLogout = async () => {
        await logout();
        window.location.href = '/login'; // Reset complet de l'état client
    };

    const getUserDashboardPath = () => {
        switch (userRole?.toUpperCase()) {
            case 'ADMIN': return '/admin';
            case 'PRODUCER': return '/productor';
            case 'USER': return '/market'; // Redirection vers l'espace acheteur
            default: return '/login';
        }
    };

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* 1. LOGO */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-green-600 text-white p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
                            <FaLeaf size={20} />
                        </div>
                        <span className="font-black text-xl text-gray-800 tracking-tight">
                            Front<span className="text-green-600">Ag</span>
                        </span>
                    </Link>

                    {/* 2. MENU DESKTOP (Public uniquement) */}
                    <div className="hidden md:flex items-center space-x-8">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-sm font-semibold transition-colors relative py-1 ${
                                    pathname === link.href ? 'text-green-600' : 'text-gray-500 hover:text-green-600'
                                }`}
                            >
                                {link.name}
                                {pathname === link.href && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 rounded-full" />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* 3. ACTIONS */}
                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <Link 
                                href={getUserDashboardPath()}
                                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-all font-medium text-sm"
                            >
                                <FaUserCircle /> Mon Espace
                            </Link>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/login" className="text-gray-600 hover:text-green-600 font-medium text-sm px-3 py-2">
                                    Connexion
                                </Link>
                                <Link href="/signup" className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-all font-medium text-sm">
                                    Inscription
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}