'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaWarehouse, FaSearch, FaBoxOpen, FaExclamationTriangle, 
    FaArrowRight, FaTag, FaUserCircle, FaSortAmountDown
} from 'react-icons/fa';

// --- MOCK DATA (Intégrée pour l'exemple) ---
const mockProducts = [
    { id: 'ITM-001', name: 'Tomates Fraîches', producerName: 'Ferme Bio Alpha', stockLevel: 150, price: 500, unit: 'Kg', status: 'live' },
    { id: 'ITM-002', name: 'Sacs de Maïs', producerName: 'Ferme Bio Alpha', stockLevel: 50, price: 12500, unit: 'Sac', status: 'live' },
    { id: 'ITM-003', name: 'Oignons Rouges', producerName: 'Jardin de Mariama', stockLevel: 0, price: 600, unit: 'Kg', status: 'archived' },
    { id: 'ITM-004', name: 'Mangues Séchées', producerName: 'AgriTech X', stockLevel: 20, price: 1500, unit: 'sachet', status: 'pending' },
];

export default function RadicalStockPage() {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-12 pb-32 font-sans">
            
            {/* --- HEADER : LOGISTICS CONTROL --- */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-20">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center gap-3 text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-4">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                        </span>
                        Inventory Real-Time
                    </div>
                    <h1 className="text-7xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                        STOCK<span className="text-slate-300">.</span>HUB
                    </h1>
                </motion.div>

                {/* RECHERCHE BRUTALISTE */}
                <div className="relative w-full md:w-96 group">
                    <input 
                        type="text"
                        placeholder="Référence ou Produit..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white border-4 border-slate-900 rounded-none py-6 pl-8 pr-16 text-xs font-black uppercase tracking-widest focus:ring-0 focus:translate-x-2 focus:-translate-y-2 transition-all shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]"
                    />
                    <FaSearch className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-900" />
                </div>
            </header>

            {/* --- QUICK STATS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <StatCard label="Valeur Totale" value="4.2M" unit="FCFA" color="text-slate-900" />
                <StatCard label="Ruptures" value="03" unit="Items" color="text-red-600" isAlert />
                <StatCard label="Flux Sortant" value="+12%" unit="Hebdo" color="text-emerald-600" />
            </div>

            {/* --- FILTRES --- */}
            <div className="flex gap-4 mb-12 overflow-x-auto no-scrollbar">
                {['all', 'live', 'pending', 'archived'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                            filter === f ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-400 hover:text-slate-900 border border-slate-100'
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* --- STOCK LIST --- */}
            <div className="grid grid-cols-1 gap-6">
                <AnimatePresence>
                    {mockProducts.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.01 }}
                            className="group bg-white border border-white rounded-[3.5rem] p-8 shadow-sm hover:shadow-2xl transition-all"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                
                                {/* Info Produit */}
                                <div className="flex items-center gap-8">
                                    <div className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center text-2xl ${product.stockLevel === 0 ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-900'}`}>
                                        {product.stockLevel === 0 ? <FaExclamationTriangle className="animate-pulse" /> : <FaBoxOpen />}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{product.id}</p>
                                        <h3 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter leading-none group-hover:text-emerald-600 transition-colors">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-2 text-[10px] font-bold text-slate-400 uppercase">
                                            <FaUserCircle /> {product.producerName}
                                        </div>
                                    </div>
                                </div>

                                {/* Metrics */}
                                <div className="flex flex-wrap items-center gap-12 lg:gap-20">
                                    <div className="text-left">
                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2">Disponibilité</p>
                                        <p className={`text-2xl font-black italic ${product.stockLevel < 10 ? 'text-red-600' : 'text-slate-900'}`}>
                                            {product.stockLevel} <span className="text-[10px] not-italic opacity-40 uppercase">{product.unit}</span>
                                        </p>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2">Prix Unitaire</p>
                                        <p className="text-2xl font-black italic text-slate-900 tracking-tighter">
                                            {product.price.toLocaleString()} <span className="text-[10px] not-italic opacity-40 uppercase">FCFA</span>
                                        </p>
                                    </div>
                                    <button className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                                        <FaArrowRight />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}

function StatCard({ label, value, unit, color, isAlert }: any) {
    return (
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-white relative overflow-hidden">
            {isAlert && <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full -mr-10 -mt-10 blur-2xl" />}
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4">{label}</p>
            <p className={`text-5xl font-black italic tracking-tighter ${color}`}>
                {value} <span className="text-xs not-italic opacity-30 tracking-widest ml-1 uppercase">{unit}</span>
            </p>
        </div>
    );
}