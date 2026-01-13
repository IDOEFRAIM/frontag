'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getFarms, getStocks } from '@/services/inventory.service';
import FarmList from '@/components/productorDashboard/inventory/FarmList';
import StockBoard from '@/components/productorDashboard/inventory/StockBoard';
import { FaWarehouse } from 'react-icons/fa';

export default function InventoryPage() {
    const { user } = useAuth();
    const [farms, setFarms] = useState<any[]>([]);
    const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);
    const [stocks, setStocks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load Farms on Mount
    useEffect(() => {
        if (user?.id) {
            loadFarms();
        }
    }, [user?.id]);

    // Load Stocks when Farm Selected
    useEffect(() => {
        if (selectedFarmId) {
            loadStocks(selectedFarmId);
        } else {
            setStocks([]);
        }
    }, [selectedFarmId]);

    const loadFarms = async () => {
        if (!user?.id) return;
        const res = await getFarms(user.id);
        if (res.success && res.data) {
            setFarms(res.data);
            // Auto-select first farm if none selected
            if (res.data.length > 0 && !selectedFarmId) {
                setSelectedFarmId(res.data[0].id);
            }
        }
        setIsLoading(false);
    };

    const loadStocks = async (farmId: string) => {
        const res = await getStocks(farmId);
        if (res.success && res.data) {
            setStocks(res.data);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 bg-slate-200 rounded-full mb-4"></div>
                    <div className="h-4 w-32 bg-slate-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-[#F8FAFC] p-6 lg:p-8 font-sans flex flex-col lg:flex-row gap-8 overflow-hidden">
            
            {/* LEFT SIDEBAR: FARM LIST (30%) */}
            <div className="w-full lg:w-1/3 xl:w-1/4 h-[40vh] lg:h-full shrink-0">
                <FarmList 
                    farms={farms} 
                    selectedFarmId={selectedFarmId} 
                    onSelectFarm={setSelectedFarmId}
                    onFarmCreated={loadFarms}
                />
            </div>

            {/* MAIN CONTENT: STOCK BOARD (70%) */}
            <div className="flex-1 h-full flex flex-col">
                {selectedFarmId ? (
                    <>
                        {/* Header Info */}
                        <div className="mb-6">
                            <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">
                                {farms.find(f => f.id === selectedFarmId)?.name}
                            </h1>
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
                                Gestion des stocks & mouvements
                            </p>
                        </div>

                        {/* Board */}
                        <div className="flex-1 min-h-0"> {/* min-h-0 is crucial for nested flex scroll */}
                            <StockBoard 
                                farmId={selectedFarmId} 
                                stocks={stocks} 
                                onRefresh={() => loadStocks(selectedFarmId)} 
                            />
                        </div>
                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 rounded-[3rem]">
                        <FaWarehouse className="text-6xl mb-4 opacity-20" />
                        <p className="text-lg font-black uppercase tracking-widest">Sélectionnez une ferme</p>
                        <p className="text-xs font-medium mt-2">ou créez-en une nouvelle pour commencer</p>
                    </div>
                )}
            </div>
        </div>
    );
}
