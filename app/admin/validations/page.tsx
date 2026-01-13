'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaCheckCircle, FaUserPlus, FaBoxOpen, 
    FaSyncAlt, FaShieldAlt, FaChevronRight, FaClock, FaSearch, FaTimes
} from 'react-icons/fa';
import { mockValidations } from '@/lib/mockValidation';
import { ValidationItem, ValidationType } from '@/types/validation';

// --- CONFIGURATION VISUELLE ---
const TYPE_MAP = {
    producer: { icon: FaUserPlus, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Compte' },
    product: { icon: FaBoxOpen, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Produit' },
    update: { icon: FaSyncAlt, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Sécurité' },
};

export default function ValidationsPage() {
    const [filter, setFilter] = useState<ValidationType | 'all'>('all');
    const [search, setSearch] = useState('');

    // Filtrage intelligent
    const items = useMemo(() => {
        return mockValidations.filter(v => {
            const matchFilter = filter === 'all' || v.type === filter;
            const matchSearch = v.title.toLowerCase().includes(search.toLowerCase()) || 
                              v.id.toLowerCase().includes(search.toLowerCase());
            return matchFilter && matchSearch;
        });
    }, [filter, search]);

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-12 pb-32 font-sans">
            
            {/* --- HEADER RADICAL --- */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-16">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-4">
                        <FaShieldAlt className="animate-pulse" /> Security Protocol
                    </div>
                    <h1 className="text-6xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                        QUEUE<span className="text-slate-300">.</span>VET
                    </h1>
                </motion.div>

                {/* BARRE DE RECHERCHE RAPIDE */}
                <div className="relative w-full md:w-96 group">
                    <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                        type="text"
                        placeholder="Rechercher un dossier ou ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white border-none rounded-[2rem] py-6 pl-16 pr-8 shadow-xl shadow-slate-200/50 text-xs font-bold focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-300"
                    />
                </div>
            </header>

            {/* --- FILTRES DE TYPE --- */}
            <div className="flex gap-4 mb-12 overflow-x-auto pb-4 no-scrollbar">
                {['all', 'producer', 'product', 'update'].map((t) => (
                    <button
                        key={t}
                        onClick={() => setFilter(t as any)}
                        className={`px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                            filter === t 
                            ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20 scale-105' 
                            : 'bg-white text-slate-400 hover:bg-slate-50 shadow-sm border border-white'
                        }`}
                    >
                        {t === 'all' ? 'Tous les flux' : t}
                    </button>
                ))}
            </div>

            {/* --- LA FILE D'ATTENTE (FEED) --- */}
            <div className="space-y-6">
                <AnimatePresence mode='popLayout'>
                    {items.map((item, index) => {
                        const Config = TYPE_MAP[item.type];
                        return (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                                className="group bg-white border border-white rounded-[3rem] p-3 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all cursor-pointer overflow-hidden"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-4">
                                    
                                    {/* IDENTITÉ DU DOSSIER */}
                                    <div className="flex items-center gap-8">
                                        <div className={`w-20 h-20 ${Config.bg} ${Config.color} rounded-[2rem] flex items-center justify-center text-3xl group-hover:rotate-6 transition-transform`}>
                                            <Config.icon />
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-lg uppercase">
                                                    {item.id}
                                                </span>
                                                {item.priority === 'high' && (
                                                    <span className="animate-pulse bg-red-500 text-white text-[8px] font-black px-2 py-1 rounded uppercase tracking-tighter">
                                                        Priorité Critique
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter leading-tight group-hover:text-indigo-600 transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                {item.producerName}
                                            </p>
                                        </div>
                                    </div>

                                    {/* MÉTADONNÉES & ACTION */}
                                    <div className="flex items-center justify-between md:justify-end gap-10 border-t md:border-t-0 pt-4 md:pt-0">
                                        <div className="text-left md:text-right">
                                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1 flex items-center md:justify-end gap-2">
                                                <FaClock size={10} /> Soumis il y a 2h
                                            </p>
                                            <p className="text-sm font-black text-slate-900 italic uppercase">
                                                Attente Approbation
                                            </p>
                                        </div>
                                        
                                        <div className="w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                                            <FaChevronRight />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {items.length === 0 && (
                    <div className="py-20 text-center">
                        <p className="text-sm font-black text-slate-300 uppercase tracking-widest italic">Aucun dossier dans cette file.</p>
                    </div>
                )}
            </div>
        </div>
    );
}