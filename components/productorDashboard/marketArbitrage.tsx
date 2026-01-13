'use client';

import React from 'react';
import { FaChartLine, FaArrowUp, FaArrowDown, FaInfoCircle, FaBalanceScale } from 'react-icons/fa';

interface ArbitrageProps {
    activeUnit: string;
}

// Données simulées : Comparaison Marché vs Interne
const MARKET_DATA: Record<string, any> = {
    global: { marketName: "Moyenne Nationale", diff: "+12%", advice: "Vendre Maïs, Stocker Oignons" },
    mais: { marketName: "Marché de Gros Dakar", internal: 550, market: 620, trend: 'up', advice: "Opportunité de profit : +70F/kg" },
    tomate: { marketName: "Marché Local", internal: 800, market: 750, trend: 'down', advice: "Prix en baisse : Vendre immédiatement" },
    elevage: { marketName: "Prix Régional Volaille", internal: 2500, market: 2650, trend: 'stable', advice: "Prix stable : Vendre selon besoin cash" },
};

export default function MarketArbitrage({ activeUnit }: ArbitrageProps) {
    const data = MARKET_DATA[activeUnit] || MARKET_DATA['global'];

    return (
        <section className="bg-white p-10 rounded-[3.5rem] shadow-xl shadow-slate-200/50 border border-white">
            
            {/* EN-TÊTE */}
            <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                        <FaBalanceScale size={20} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter text-left">Arbitrage.</h2>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest text-left">Marché vs Stock</p>
                    </div>
                </div>
                <div className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-tighter italic">
                    Live Data
                </div>
            </div>

            {activeUnit === 'global' ? (
                /* VUE GLOBALE - TRENDS */
                <div className="space-y-6">
                    <div className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Tendance Générale</p>
                        <div className="flex items-center gap-4">
                            <span className="text-5xl font-black text-indigo-900 italic tracking-tighter">{data.diff}</span>
                            <FaArrowUp className="text-indigo-600 animate-bounce" size={24} />
                        </div>
                        <p className="mt-4 text-[11px] font-bold text-indigo-900 uppercase italic leading-relaxed">
                            {data.advice}
                        </p>
                    </div>
                </div>
            ) : (
                /* VUE SPÉCIFIQUE - COMPARAISON DE PRIX */
                <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 bg-slate-50 rounded-[2rem]">
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Ton Prix</p>
                            <p className="text-3xl font-black text-slate-900 italic tracking-tighter">{data.internal} F</p>
                        </div>
                        <div className="p-6 bg-green-50 rounded-[2rem] border border-green-100">
                            <p className="text-[9px] font-black text-green-600 uppercase mb-2">Marché</p>
                            <p className="text-3xl font-black text-green-600 italic tracking-tighter">{data.market} F</p>
                        </div>
                    </div>

                    {/* GAP ANALYSIS */}
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            {data.trend === 'up' ? 
                                <FaArrowUp className="text-green-500" /> : 
                                <FaArrowDown className="text-red-500" />
                            }
                            <p className="text-sm font-black text-slate-900 uppercase italic tracking-tight">
                                {data.trend === 'up' ? 'Écart Positif' : 'Écart Négatif'}
                            </p>
                        </div>
                        <p className="text-xl font-black text-slate-900 italic">
                            {Math.abs(data.market - data.internal)} F <span className="text-[10px] text-slate-300 not-italic">/ kg</span>
                        </p>
                    </div>

                    {/* STRATÉGIE CONSEILLÉE */}
                    <div className="bg-slate-900 p-6 rounded-[2rem] flex items-start gap-4">
                        <FaInfoCircle className="text-indigo-400 mt-1" size={16} />
                        <div>
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Stratégie Vital</p>
                            <p className="text-xs font-black text-white uppercase italic leading-tight tracking-wide">
                                {data.advice}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* PETITE LÉGENDE */}
            <p className="mt-8 text-[8px] font-bold text-slate-300 uppercase text-center tracking-widest">
                Source : {data.marketName} • Mis à jour il y a 12min
            </p>
        </section>
    );
}