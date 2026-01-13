'use client';

import React from 'react';
import { FaWarehouse, FaBoxOpen, FaThermometerHalf, FaClock, FaPlus } from 'react-icons/fa';

interface AssetInventoryProps {
    activeUnit: string;
}

// Simulation de données filtrées par culture
const STOCK_DATA: Record<string, any[]> = {
    global: [
        { id: 1, name: 'Maïs Grain', qty: '12.5', unit: 'Tones', value: 2500000, quality: 'Excellente', days: 12 },
        { id: 2, name: 'Tomates', qty: '850', unit: 'Kg', value: 680000, quality: 'Fragile', days: 2 },
        { id: 3, name: 'Oignons', qty: '3.2', unit: 'Tones', value: 1120000, quality: 'Stable', days: 45 },
    ],
    mais: [
        { id: 1, name: 'Maïs Grain Jaune', qty: '8.5', unit: 'Tones', value: 1700000, quality: 'Excellente', days: 10 },
        { id: 4, name: 'Maïs Semence', qty: '4.0', unit: 'Tones', value: 800000, quality: 'Premium', days: 15 },
    ],
    tomate: [
        { id: 2, name: 'Tomates Roma', qty: '850', unit: 'Kg', value: 680000, quality: 'Fragile', days: 2 },
    ]
};

export default function AssetInventory({ activeUnit }: AssetInventoryProps) {
    const assets = STOCK_DATA[activeUnit] || STOCK_DATA['global'];

    return (
        <section className="bg-white p-10 rounded-[3.5rem] shadow-xl shadow-slate-200/40 border border-white">
            
            {/* EN-TÊTE DE SECTION */}
            <div className="flex justify-between items-start mb-12">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-slate-900/20">
                        <FaWarehouse size={24} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Entrepôt Actif.</h2>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Gestion des Actifs Dormants</p>
                    </div>
                </div>
                
                <button className="group flex items-center gap-3 bg-slate-50 hover:bg-slate-900 px-6 py-4 rounded-2xl transition-all duration-500">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 group-hover:text-white transition-colors">Ajouter Entrée</span>
                    <FaPlus className="text-slate-400 group-hover:text-green-400" size={10} />
                </button>
            </div>

            {/* GRILLE D'INVENTAIRE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {assets.map((item) => (
                    <div key={item.id} className="relative p-8 bg-[#FBFDFF] rounded-[2.5rem] border border-slate-100 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-700 overflow-hidden group">
                        
                        {/* Décoration de fond subtile (L'unité de mesure) */}
                        <span className="absolute -right-4 -bottom-4 text-8xl font-black text-slate-50 uppercase italic pointer-events-none group-hover:text-slate-100 transition-colors">
                            {item.unit.substring(0, 1)}
                        </span>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.name}</p>
                                    <h3 className="text-5xl font-black text-slate-900 italic tracking-tighter">
                                        {item.qty} <span className="text-lg not-italic text-slate-300">{item.unit}</span>
                                    </h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-green-500 uppercase bg-green-50 px-3 py-1 rounded-lg">
                                        {item.value.toLocaleString()} F
                                    </p>
                                </div>
                            </div>

                            {/* INDICATEURS DE SANTÉ DU STOCK */}
                            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-50">
                                        <FaClock className="text-slate-300" size={12} />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-slate-300 uppercase">Stocké depuis</p>
                                        <p className="text-[10px] font-black text-slate-900 uppercase italic">{item.days} Jours</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-50 ${item.quality === 'Fragile' ? 'text-red-500' : 'text-green-500'}`}>
                                        <FaThermometerHalf size={12} />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-slate-300 uppercase">État Santé</p>
                                        <p className={`text-[10px] font-black uppercase italic ${item.quality === 'Fragile' ? 'text-red-500' : 'text-slate-900'}`}>
                                            {item.quality}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* RÉCAPITULATIF DE VALEUR TOTALE */}
            <div className="mt-12 p-8 bg-slate-900 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                        <FaBoxOpen className="text-white opacity-50" />
                    </div>
                    <p className="text-sm font-black text-white italic uppercase tracking-tight">Valeur totale des actifs dormants :</p>
                </div>
                <p className="text-4xl font-black text-green-400 italic tracking-tighter uppercase">
                    {assets.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()} F
                </p>
            </div>
        </section>
    );
}