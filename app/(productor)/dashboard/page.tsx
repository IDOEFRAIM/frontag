'use client';

import React, { useState } from 'react';

// Import des composants de structure
import DashboardHeader from '@/components/productorDashboard/dashboardHeader';
import AssetInventory from '@/components/productorDashboard/AssetInventory';
import ProductionPipeline from '@/components/productorDashboard/productionPipeline';
import OperationalTriggers from '@/components/productorDashboard/operationTrigger';
import MarketArbitrage from '@/components/productorDashboard/marketArbitrage';

// Import de la logique et des types
import { useInventory } from '@/hooks/useInventory';
import { AgrobusinessAsset } from '@/types/dashboard.index';

// --- MOCK DATA (Données réelles simulées pour le Sahel) ---
const MOCK_ASSETS: AgrobusinessAsset[] = [
    {
        id: '1', unitId: 'mais', nature: 'CROP', lifecycle: 'DORMANT',
        name: 'Maïs Jaune (Sacs 100kg)', quantity: 12500, unit: 'KG',
        purchasePrice: 150, marketPrice: 190, entryDate: '2023-11-01',
        isPerishable: false, storage: 'VENTILÉ'
    },
    {
        id: '2', unitId: 'tomate', nature: 'CROP', lifecycle: 'DORMANT',
        name: 'Tomates Roma', quantity: 850, unit: 'KG',
        purchasePrice: 400, marketPrice: 350, entryDate: '2023-12-15',
        isPerishable: true, storage: 'PLEIN_AIR'
    },
    {
        id: '3', unitId: 'mais', nature: 'CROP', lifecycle: 'LIVE',
        name: 'Parcelle Nord (Maïs)', quantity: 5, unit: 'TONNE',
        purchasePrice: 100, marketPrice: 190, entryDate: '2023-10-10',
        expectedHarvestDate: '2024-01-15', isPerishable: false
    }
];

export default function DashboardPage() {
    // 1. État de l'unité active (Global, Maïs, Tomate...)
    const [activeUnit, setActiveUnit] = useState('global');
    
    // 2. Utilisation du hook moteur (On simule une chaleur sahélienne de 39°C)
    const { 
        totalValue, 
        criticalCount, 
        marketStrategy, 
        healthScore 
    } = useInventory(MOCK_ASSETS, activeUnit, 39);

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-12 pb-40 font-sans">
            
            {/* --- HEADER DYNAMIQUE --- */}
            <DashboardHeader 
                activeUnit={activeUnit} 
                onUnitChange={setActiveUnit} 
            />

            {/* --- GRILLE OPÉRATIONNELLE --- */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                
                {/* COLONNE GAUCHE (7/12) : INVENTAIRE ET PRODUCTION */}
                <div className="xl:col-span-7 space-y-12">
                    
                    {/* Indicateur de Santé Globale (Burkina Context) */}
                    <div className="flex items-center gap-6 px-10 py-6 bg-white rounded-[2.5rem] border border-white shadow-sm">
                        <div className="relative w-16 h-16 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="32" cy="32" r="28" fill="none" stroke="#F1F5F9" strokeWidth="8" />
                                <circle cx="32" cy="32" r="28" fill="none" stroke="#22C55E" strokeWidth="8" 
                                    strokeDasharray={175} strokeDashoffset={175 - (175 * healthScore) / 100} 
                                    strokeLinecap="round" className="transition-all duration-1000" />
                            </svg>
                            <span className="absolute text-[10px] font-black italic">{healthScore}%</span>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Santé des Actifs</p>
                            <p className="text-sm font-black text-slate-900 uppercase italic leading-tight">
                                {marketStrategy}
                            </p>
                        </div>
                    </div>

                    {/* Les Composants Métier */}
                    <AssetInventory activeUnit={activeUnit} />
                    <ProductionPipeline activeUnit={activeUnit} />
                </div>

                {/* COLONNE DROITE (5/12) : DÉCISIONS ET MARCHÉ */}
                <div className="xl:col-span-5 space-y-12">
                    <OperationalTriggers activeUnit={activeUnit} />
                    <MarketArbitrage activeUnit={activeUnit} />
                    
                    {/* Résumé de Trésorerie Rapide */}
                    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-4">Valeur de l'Empire</p>
                        <h3 className="text-5xl font-black italic tracking-tighter text-green-400">
                            {totalValue.toLocaleString()} <span className="text-sm not-italic opacity-50">FCFA</span>
                        </h3>
                        <div className="mt-8 pt-8 border-t border-white/10 flex justify-between">
                            <div>
                                <p className="text-[8px] font-bold uppercase text-white/30">Alertes</p>
                                <p className="text-xl font-black text-red-400">{criticalCount}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[8px] font-bold uppercase text-white/30">Localisation</p>
                                <p className="text-sm font-black italic">BOBO-DIOULASSO, BF</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* BARRE D'ACTION FLOTTANTE (Mobile Ready) */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/80 backdrop-blur-xl border border-white p-4 rounded-[2.5rem] shadow-2xl flex justify-around items-center z-50">
                <button className="flex flex-col items-center gap-1 group">
                    <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center group-active:scale-90 transition-all">
                        <span className="text-xs">+</span>
                    </div>
                    <span className="text-[8px] font-black uppercase">Entrée</span>
                </button>
                <div className="h-8 w-[1px] bg-slate-100" />
                <button className="flex flex-col items-center gap-1 group">
                    <div className="w-10 h-10 rounded-2xl bg-green-500 text-white flex items-center justify-center group-active:scale-90 transition-all">
                        <span className="text-xs">$</span>
                    </div>
                    <span className="text-[8px] font-black uppercase">Vendre</span>
                </button>
            </div>
        </div>
    );
}