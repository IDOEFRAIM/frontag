'use client';

import React, { useState, useEffect } from 'react';

// Import des composants de structure
import DashboardHeader from '@/components/productorDashboard/dashboardHeader';
import AssetInventory from '@/components/productorDashboard/AssetInventory';
import OperationalTriggers from '@/components/productorDashboard/operationTrigger';
import MarketArbitrage from '@/components/productorDashboard/marketArbitrage';

// Import de la logique et des types
import { useInventory } from '@/hooks/useInventory';
import { AgrobusinessAsset } from '@/types/dashboard.index';
import { FaHeartbeat, FaLeaf, FaPlus } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();

    // 1. Gestion des données réelles
    const [assets, setAssets] = useState<AgrobusinessAsset[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // 2. État de l'unité active (Global, Maïs, Tomate...)
    const [activeUnit, setActiveUnit] = useState('global');

    // CHARGEMENT DES DONNÉES DEPUIS L'API
    useEffect(() => {
        const fetchAssets = async () => {
            if (!user?.id) return;
            try {
                const res = await fetch(`/api/dashboard/inventory?userId=${user.id}`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    setAssets(data);
                }
            } catch (err) {
                console.error("Erreur chargement dashboard:", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (!authLoading && user) {
            fetchAssets();
        } else if (!authLoading && !user) {
            // Pas user -> Loading fini (mais vide)
            setIsLoading(false);
        }
    }, [user, authLoading]);
    
    // 3. Utilisation du hook moteur
    const { 
        totalValue, 
        healthScore 
    } = useInventory(assets, activeUnit, 39);

    // --- EMPTY STATE SI AUCUNE DONNÉE ---
    if (!isLoading && assets.length === 0) {
        return (
            <div className="min-h-screen bg-[#f7f5ee] p-6 flex flex-col items-center justify-center text-center font-sans">
                <div className="bg-white p-12 rounded-[3rem] shadow-xl max-w-2xl border border-[#e0e0d1] animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-[#e6f4ea] rounded-full flex items-center justify-center mx-auto mb-8 text-[#497a3a]">
                        <FaLeaf size={40} />
                    </div>
                    <h1 className="text-4xl font-black text-[#5b4636] mb-4 tracking-tight">Bienvenue sur FrontAg, {user?.name || 'Producteur'} !</h1>
                    <p className="text-lg text-[#7c795d] mb-10 max-w-md mx-auto leading-relaxed">
                        Votre tableau de bord est vide pour le moment. Commencez par déclarer vos premiers produits ou stocks pour activer l'intelligence de votre ferme.
                    </p>
                    <button 
                        onClick={() => router.push('/products/add')}
                        className="bg-[#497a3a] text-white px-10 py-5 rounded-3xl font-bold text-lg shadow-lg shadow-green-900/10 hover:scale-105 transition-transform flex items-center gap-3 mx-auto"
                    >
                        <FaPlus />
                        Ajouter mon premier produit
                    </button>
                    <p className="mt-8 text-xs font-bold text-[#b6d7a8] uppercase tracking-widest">
                        Configuration en 2 minutes
                    </p>
                </div>
            </div>
        );
    }

    if (isLoading || authLoading) {
        return (
            <div className="min-h-screen bg-[#f7f5ee] flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-[#497a3a] border-t-transparent rounded-full animate-spin mb-4"/>
                    <p className="text-[#5b4636] font-bold text-sm tracking-widest uppercase">Chargement de votre exploitation...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f5ee] p-6 lg:p-12 pb-40 font-[family-name:var(--font-geist-sans)]">
            
            {/* --- HEADER DYNAMIQUE --- */}
            <DashboardHeader 
                activeUnit={activeUnit} 
                onUnitChange={setActiveUnit} 
            />

            {/* --- GRILLE OPÉRATIONNELLE --- */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                
                {/* COLONNE GAUCHE (Main) : INVENTAIRE ET SANTÉ */}
                <div className="xl:col-span-3 space-y-8">
                    
                    {/* Indicateur de Santé Globale (Burkina Context) */}
                    <div className="flex items-center gap-6 px-8 py-6 bg-[#e6f4ea] rounded-3xl border border-[#b6d7a8] shadow-sm">
                        <div className="relative w-14 h-14 flex items-center justify-center">
                            <FaHeartbeat className="text-[#497a3a]" size={28} />
                            <span className="absolute -top-1 -right-1 bg-white text-[10px] font-bold text-[#497a3a] px-1.5 py-0.5 rounded-full border border-[#b6d7a8] shadow-sm">
                                {healthScore}%
                            </span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#7c795d] uppercase tracking-wider mb-1">État de votre exploitation</p>
                            <p className="text-lg font-bold text-[#2d3436]">
                                {healthScore > 80 ? "Excellente santé opérationnelle" : "Attention requise sur certains stocks"}
                            </p>
                        </div>
                    </div>

                    {/* Les Composants Métier */}
                    <AssetInventory activeUnit={activeUnit} />
                </div>

                {/* COLONNE DROITE (Side) : DÉCISIONS ET MARCHÉ */}
                <div className="xl:col-span-1 space-y-8">
                    
                    {/* Chiffre d'Affaires Potentiel (Simplifié) */}
                    <div className="bg-[#497a3a] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-[11px] font-medium text-[#e6f4ea] uppercase tracking-widest mb-3">Chiffre d'Affaires Potentiel</p>
                            <h3 className="text-4xl font-bold tracking-tight text-white mb-1">
                                {totalValue.toLocaleString()} <span className="text-lg opacity-70 font-normal">FCFA</span>
                            </h3>
                            <p className="text-xs text-[#b6d7a8] mt-2 font-medium">Basé sur les prix du marché actuels</p>
                        </div>
                        {/* Motif de fond subtil */}
                        <FaLeaf className="absolute -bottom-4 -right-4 text-white opacity-10 rotate-12" size={120} />
                    </div>

                    <OperationalTriggers activeUnit={activeUnit} />
                    <MarketArbitrage activeUnit={activeUnit} />
                    
                </div>
            </div>
        </div>
    );
}