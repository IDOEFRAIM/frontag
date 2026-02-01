'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
    FaChartLine, FaBox, FaShoppingCart, FaCog, 
    FaSignOutAlt, FaPlusCircle, FaTimes, FaCircle, FaUsers, FaWarehouse,
    FaChevronLeft, FaChevronRight
} from 'react-icons/fa';

const PRODUCER_LINKS = [
    { name: 'Tableau de bord', href: '/dashboard', icon: FaChartLine },
    { name: 'Mon Stock', href: '/inventory', icon: FaWarehouse },
    { name: 'Catalogue', href: '/products', icon: FaBox },
    { name: 'Ventes', href: '/sales', icon: FaShoppingCart },
    { name: 'Nouveau Produit', href: '/products/add', icon: FaPlusCircle },
    { name: 'Mes Clients', href: '/clients', icon: FaUsers },
    { name: 'Paramètres', href: '/settings', icon: FaCog },
];

export default function ProductorSidebar({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const pathname = usePathname();
    const { logout } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <>
            {/* Overlay mobile */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-sm" onClick={onClose} />
            )}

            <aside className={`
                fixed inset-y-0 left-0 z-50 bg-[#F7F5EE] border-r border-[#E0E0D1] transition-all duration-500 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                md:translate-x-0 md:static md:h-screen
                ${isCollapsed ? 'w-28' : 'w-72'}
            `}>
                
                {/* Toggle Button (Desktop Only) */}
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden md:flex absolute -right-3 top-10 w-6 h-6 bg-white border border-[#E0E0D1] rounded-full items-center justify-center text-[#7C795D] hover:text-[#5B4636] shadow-sm z-50 transition-colors"
                >
                    {isCollapsed ? <FaChevronRight size={10} /> : <FaChevronLeft size={10} />}
                </button>

                {/* Conteneur Flex vertical sans débordement */}
                <div className={`flex flex-col h-full ${isCollapsed ? 'p-4' : 'p-6'}`}>
                    
                    {/* 1. Header (Fixe) */}
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start pl-2'} mb-10 shrink-0`}>
                        <Link href="/dashboard" onClick={onClose} className="group">
                            {isCollapsed ? (
                                <h2 className="text-2xl font-black text-[#5B4636]">F<span className="text-[#497A3A]">.</span></h2>
                            ) : (
                                <div>
                                    <h2 className="text-3xl font-black text-[#5B4636] tracking-tight leading-none">
                                        FrontAg<span className="text-[#497A3A]">.</span>
                                    </h2>
                                    <p className="text-[10px] font-bold text-[#7C795D] uppercase tracking-wider mt-1">
                                        Espace Producteur
                                    </p>
                                </div>
                            )}
                        </Link>
                        <button onClick={onClose} className="md:hidden ml-auto text-[#7C795D] hover:text-[#5B4636]">
                            <FaTimes size={18} />
                        </button>
                    </div>

                    {/* 2. Navigation */}
                    <nav className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {PRODUCER_LINKS.map((link) => {
                            const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
                            
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={onClose}
                                    title={isCollapsed ? link.name : ''}
                                    className={`
                                        group flex items-center ${isCollapsed ? 'justify-center px-0 py-4' : 'justify-between px-5 py-3.5'} rounded-2xl transition-all duration-300
                                        ${isActive 
                                            ? 'bg-white text-[#497A3A] shadow-sm border border-[#E0E0D1]' 
                                            : 'text-[#7C795D] hover:text-[#5B4636] hover:bg-white/50'}
                                    `}
                                >
                                    <div className={`flex items-center ${isCollapsed ? 'gap-0' : 'gap-4'}`}>
                                        <link.icon size={isCollapsed ? 20 : 18} className={`${isActive ? 'text-[#497A3A]' : 'text-[#A4A291] group-hover:text-[#5B4636]'}`} />
                                        {!isCollapsed && (
                                            <span className="text-xs font-bold uppercase tracking-wider">
                                                {link.name}
                                            </span>
                                        )}
                                    </div>
                                    {!isCollapsed && isActive && (
                                        <FaCircle size={6} className="text-[#497A3A]" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* 3. Footer / Logout */}
                    <div className="pt-6 mt-auto border-t border-[#E0E0D1]">
                        <button 
                            onClick={() => { onClose(); logout(); }}
                            title={isCollapsed ? "Déconnexion" : ""}
                            className={`
                                w-full flex items-center ${isCollapsed ? 'justify-center bg-red-50 p-4 text-red-600' : 'justify-start gap-4 px-5 py-4 bg-[#FFEAEA] text-[#D32F2F]'} 
                                rounded-2xl transition-all duration-300 hover:bg-[#FFD1D1]
                            `}
                        >
                            <FaSignOutAlt size={isCollapsed ? 18 : 16} />
                            {!isCollapsed && (
                                <span className="text-xs font-bold uppercase tracking-wider">Déconnexion</span>
                            )}
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}