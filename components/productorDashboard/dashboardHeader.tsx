'use client';

import React from 'react';

// On définit les cultures possibles (ceci viendra sûrement d'une API plus tard)
const CROP_UNITS = [
    { id: 'global', label: 'Vue Globale', color: 'bg-green-500' },
    { id: 'mais', label: 'Maïs Local', color: 'bg-amber-400' },
    { id: 'tomate', label: 'Tomates', color: 'bg-red-500' },
    { id: 'elevage', label: 'Volaille', color: 'bg-slate-400' },
];

interface HeaderProps {
    activeUnit: string;
    onUnitChange: (id: string) => void;
}

export default function DashboardHeader({ activeUnit, onUnitChange }: HeaderProps) {
    // On trouve la culture active pour le titre dynamique
    const currentUnit = CROP_UNITS.find(u => u.id === activeUnit);

    return (
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
            
            {/* TITRE DYNAMIQUE */}
            <div className="space-y-1">
                <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full animate-pulse ${currentUnit?.color || 'bg-green-500'}`} />
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
                        Operational Unit / {currentUnit?.label}
                    </p>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-slate-900 uppercase italic tracking-tighter leading-[0.8] mt-2">
                    {activeUnit === 'global' ? 'Vital Unit' : currentUnit?.label}
                    <span className="text-green-500 not-italic">.</span>
                </h1>
            </div>

            {/* SÉLECTEUR DE CULTURE (TACTIQUE) */}
            <div className="flex flex-wrap gap-2 p-2 bg-slate-100/50 rounded-[2rem] border border-slate-100 backdrop-blur-sm">
                {CROP_UNITS.map((unit) => {
                    const isActive = activeUnit === unit.id;
                    return (
                        <button
                            key={unit.id}
                            onClick={() => onUnitChange(unit.id)}
                            className={`
                                px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest italic transition-all duration-300
                                ${isActive 
                                    ? 'bg-slate-900 text-white shadow-xl scale-105' 
                                    : 'text-slate-400 hover:text-slate-900 hover:bg-white'}
                            `}
                        >
                            {unit.label}
                        </button>
                    );
                })}
            </div>

        </header>
    );
}