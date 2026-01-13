'use client';

import React from 'react';
import { FaBolt, FaExclamationTriangle, FaArrowRight, FaPercentage, FaTruck, FaLeaf } from 'react-icons/fa';

interface TriggerProps {
    activeUnit: string;
}

export default function OperationalTriggers({ activeUnit }: TriggerProps) {
    return (
        <section className="bg-white p-10 rounded-[3.5rem] shadow-xl shadow-slate-200/50 border border-white">
            
            {/* TITRE SECTION */}
            <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 bg-amber-400 rounded-2xl flex items-center justify-center text-slate-900 shadow-lg shadow-amber-400/20">
                    <FaBolt size={18} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Décisions.</h2>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest text-left">Actions Immédiates Requises</p>
                </div>
            </div>

            <div className="space-y-6">

                {/* DÉCISION 1 : URGENCE PÉRISSABLE (Se montre si activeUnit est 'global' ou 'tomate') */}
                {(activeUnit === 'global' || activeUnit === 'tomate') && (
                    <div className="group bg-red-50 p-8 rounded-[2.5rem] border border-red-100 transition-all hover:scale-[1.02]">
                        <div className="flex items-center gap-3 text-red-600 mb-4">
                            <FaExclamationTriangle size={14} className="animate-pulse" />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Risque de perte élevé</p>
                        </div>
                        <p className="text-sm font-black text-slate-900 italic mb-6 leading-tight uppercase">
                            850kg de Tomates Roma atteignent la limite de fraîcheur.
                        </p>
                        <button className="w-full bg-red-600 text-white py-5 rounded-2xl flex items-center justify-center gap-3 group-hover:bg-red-700 transition-colors shadow-xl shadow-red-600/20">
                            <FaPercentage />
                            <span className="text-[10px] font-black uppercase tracking-widest">Activer Braderie (-20%)</span>
                        </button>
                    </div>
                )}

                {/* DÉCISION 2 : RÉCOLTE IMMINENTE (Se montre si activeUnit est 'mais' ou 'global') */}
                {(activeUnit === 'global' || activeUnit === 'mais') && (
                    <div className="group bg-slate-900 p-8 rounded-[2.5rem] text-white transition-all hover:scale-[1.02]">
                        <div className="flex items-center gap-3 text-green-400 mb-4">
                            <FaLeaf size={14} />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Maturité Optimale</p>
                        </div>
                        <p className="text-sm font-black italic mb-6 leading-tight uppercase">
                            Parcelle Nord (Maïs) prête pour récolte massive.
                        </p>
                        <button className="w-full bg-white text-slate-900 py-5 rounded-2xl flex items-center justify-center gap-3 transition-colors">
                            <span className="text-[10px] font-black uppercase tracking-widest text-left">Mobiliser Équipe Récolte</span>
                            <FaArrowRight size={10} />
                        </button>
                    </div>
                )}

                {/* DÉCISION 3 : LOGISTIQUE / B2B */}
                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                    <div className="flex items-center gap-3 text-slate-400 mb-4">
                        <FaTruck size={14} />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Logistique</p>
                    </div>
                    <p className="text-sm font-black text-slate-900 italic mb-6 leading-tight uppercase">
                        Demande Groupée : Grossiste Dakar cherche 5T de Maïs.
                    </p>
                    <div className="flex gap-2">
                        <button className="flex-1 bg-slate-200 text-slate-900 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-300 transition-all">
                            Décliner
                        </button>
                        <button className="flex-[2] bg-green-500 text-white py-4 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-green-600 transition-all shadow-lg shadow-green-500/20">
                            Accepter Offre
                        </button>
                    </div>
                </div>

            </div>

            {/* PETIT CONSEIL "AI" EN BAS */}
            <div className="mt-10 pt-8 border-t border-slate-100">
                <p className="text-[9px] font-bold text-slate-400 uppercase italic leading-relaxed text-left">
                    <span className="text-slate-900">Astuce Vital :</span> En vendant tes tomates maintenant au grossiste, tu libères <span className="text-green-600">12%</span> de capacité de stockage pour la récolte de maïs de demain.
                </p>
            </div>
        </section>
    );
}