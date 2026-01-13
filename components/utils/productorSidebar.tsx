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
    { name: 'Dashboard', href: '/dashboard', icon: FaChartLine },
    { name: 'Inventaire', href: '/inventory', icon: FaWarehouse }, // New Inventory Link
    { name: 'Catalogue', href: '/products', icon: FaBox },
    { name: 'Flux Commandes', href: '/sales', icon: FaShoppingCart },
    { name: 'Ajouter', href: '/products/add', icon: FaPlusCircle },
    { name: 'Clients', href: '/products/clients', icon: FaUsers },
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
                fixed inset-y-0 left-0 z-50 bg-[#F8FAFC] border-r border-slate-100 transition-all duration-500 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                md:translate-x-0 md:static md:h-screen
                ${isCollapsed ? 'w-28' : 'w-72'}
            `}>
                
                {/* Toggle Button (Desktop Only) */}
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden md:flex absolute -right-3 top-10 w-6 h-6 bg-white border border-slate-200 rounded-full items-center justify-center text-slate-400 hover:text-slate-900 shadow-sm z-50"
                >
                    {isCollapsed ? <FaChevronRight size={10} /> : <FaChevronLeft size={10} />}
                </button>

                {/* Conteneur Flex vertical sans débordement */}
                <div className={`flex flex-col h-full ${isCollapsed ? 'p-4' : 'p-6'}`}>
                    
                    {/* 1. Header (Fixe) */}
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-10 shrink-0`}>
                        <Link href="/dashboard" onClick={onClose} className="group text-center">
                            {isCollapsed ? (
                                <h2 className="text-2xl font-black text-slate-900 italic">V<span className="text-green-500">.</span></h2>
                            ) : (
                                <>
                                    <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                                        Vital<span className="text-green-500 not-italic">.</span>
                                    </h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="h-[2px] w-3 bg-slate-900"></span>
                                        <p className="text-[7px] font-black text-slate-400 uppercase tracking-[0.4em]">
                                            Engine
                                        </p>
                                    </div>
                                </>
                            )}
                        </Link>
                        <button onClick={onClose} className="md:hidden text-slate-400 hover:text-slate-900">
                            <FaTimes size={18} />
                        </button>
                    </div>

                    {/* 2. Navigation (Défilante si trop de liens) */}
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
                                        group flex items-center ${isCollapsed ? 'justify-center px-0 py-4' : 'justify-between px-5 py-4'} rounded-[2rem] transition-all duration-300
                                        ${isActive 
                                            ? 'bg-white text-slate-900 shadow-sm border border-slate-100 scale-[1.02]' 
                                            : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}
                                    `}
                                >
                                    <div className={`flex items-center ${isCollapsed ? 'gap-0' : 'gap-4'}`}>
                                        <link.icon size={isCollapsed ? 20 : 16} className={`${isActive ? 'text-green-500' : 'group-hover:text-slate-900'}`} />
                                        {!isCollapsed && (
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] italic">
                                                {link.name}
                                            </span>
                                        )}
                                    </div>
                                    {!isCollapsed && isActive && <FaCircle size={5} className="text-green-500 animate-pulse" />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* 3. Footer (Toujours en bas) */}
                    <div className="mt-6 pt-6 border-t border-slate-200 space-y-4 shrink-0">
                        <Link 
                            href="/settings" 
                            className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-4 px-5'} text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] hover:text-slate-900 transition-all`}
                            title={isCollapsed ? 'Configuration' : ''}
                        >
                            <FaCog size={isCollapsed ? 18 : 14} className="animate-spin-slow" /> 
                            {!isCollapsed && 'Configuration'}
                        </Link>
                        
                        <button
                            onClick={() => { onClose(); logout(); }}
                            className={`w-full bg-slate-900 text-white ${isCollapsed ? 'py-4 rounded-xl' : 'py-5 rounded-[2rem]'} flex items-center justify-center gap-3 shadow-lg shadow-slate-200 active:scale-95 transition-all`}
                            title={isCollapsed ? 'Déconnexion' : ''}
                        >
                            <FaSignOutAlt size={isCollapsed ? 16 : 14} />
                            {!isCollapsed && <span className="text-[9px] font-black uppercase tracking-widest">Déconnexion</span>}
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}