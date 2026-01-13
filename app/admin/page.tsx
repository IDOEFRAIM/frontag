'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaUsers, FaWarehouse, FaTimes, FaCheck, FaMapMarkedAlt, 
    FaArrowUp, FaBolt, FaCircle, FaExchangeAlt, FaUserShield, FaBell 
} from 'react-icons/fa';

export default function AdminDashboardPage() {
    const [selectedTask, setSelectedTask] = useState<{id: string, type: 'VALIDATION' | 'STOCK' | 'CRITICAL'} | null>(null);

    return (
        <div className="min-h-screen bg-[#F1F5F9] font-sans text-slate-900 pb-20">
            
            {/* --- TOP BAR (SYSTÈME) --- */}
            <div className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <FaCheck />
                    </div>
                    <div>
                        <h1 className="text-xl font-black uppercase italic tracking-tighter">Vital Admin <span className="text-indigo-600">HQ</span></h1>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Système : Nominal</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all"><FaBell /></button>
                    <button className="flex items-center gap-3 px-5 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest italic shadow-xl shadow-slate-200">
                        <FaBolt className="text-amber-400" /> Mode Urgence
                    </button>
                </div>
            </div>

            <div className="p-8 lg:p-12 max-w-[1600px] mx-auto space-y-12">

                {/* --- 1. RADAR DE PERFORMANCE (LES CHIFFRES QUI BATTENT) --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <KpiCard label="Volume Transactions" value="4.2M" sub="FCFA / 24h" trend="+12%" />
                    <KpiCard label="Validations Pending" value="18" sub="Producteurs" isAlert />
                    <KpiCard label="Livraisons Actives" value="42" sub="Sur le terrain" icon={<FaMapMarkedAlt />} />
                    <KpiCard label="Taux de Remplissage" value="88%" sub="Entrepôts" trend="-2%" color="text-indigo-600" />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                    
                    {/* --- 2. COLONNE GAUCHE (OPÉRATIONS) --- */}
                    <div className="xl:col-span-8 space-y-10">
                        
                        {/* TERMINAL DE FLUX TEMPS RÉEL */}
                        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-white overflow-hidden">
                            <div className="p-10 border-b border-slate-50 flex justify-between items-center">
                                <h3 className="text-xl font-black italic uppercase tracking-tighter">Live System Feed</h3>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase">Ventes</span>
                                    <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-[9px] font-black uppercase">Logs</span>
                                </div>
                            </div>
                            <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
                                <FeedItem type="SALE" title="Nouvelle Vente" desc="Coopérative Bobo -> Supermarché City" time="2 min ago" amount="+45k" />
                                <FeedItem type="USER" title="Nouveau Producteur" desc="Alpha Cissé (Sénégal)" time="15 min ago" status="Wait Auth" />
                                <FeedItem type="ALERT" title="Stock Critique" desc="Oignons (Entrepôt Thiès)" time="1h ago" status="Urgent" />
                                <FeedItem type="SALE" title="Transaction Terminée" desc="Paiement validé #8821" time="2h ago" amount="+120k" />
                            </div>
                        </div>

                        {/* ANALYSE GÉOGRAPHIQUE RAPIDE */}
                        <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
                            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-10">
                                <div>
                                    <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-6">Zones Chaudes</h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center"><span className="text-sm font-black italic">Dakar, SN</span> <span className="text-green-400 font-black">45%</span></div>
                                        <div className="flex justify-between items-center"><span className="text-sm font-black italic">Ouaga, BF</span> <span className="text-amber-400 font-black">32%</span></div>
                                        <div className="flex justify-between items-center"><span className="text-sm font-black italic">Bamako, ML</span> <span className="text-white font-black">23%</span></div>
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <div className="w-full h-full bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center italic text-white/20 font-black">
                                        [ Intégration Carte Interactive ]
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- 3. COLONNE DROITE (ACTION COMMANDS) --- */}
                    <div className="xl:col-span-4 space-y-10">
                        <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-white">
                            <h3 className="text-sm font-black italic uppercase tracking-widest mb-8 flex items-center gap-2">
                                <FaExchangeAlt className="text-indigo-600" /> Commandes HQ
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                <AdminAction icon={<FaUsers />} label="Gérer Utilisateurs" count="1,240" />
                                <AdminAction icon={<FaWarehouse />} label="Audit Inventaires" count="12 Entrepôts" />
                                <AdminAction icon={<FaUserShield />} label="Security Protocol" status="Active" />
                                <button className="mt-4 w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-100 active:scale-95 transition-all">
                                    Extraire Rapport Global
                                </button>
                            </div>
                        </div>

                        {/* ALERTES CRITIQUES */}
                        <div className="space-y-4">
                             <div 
                                onClick={() => setSelectedTask({id: 'all', type: 'VALIDATION'})}
                                className="bg-white border-l-8 border-indigo-600 p-8 rounded-[2rem] shadow-lg cursor-pointer hover:translate-x-2 transition-all"
                             >
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Validation Request</p>
                                <p className="text-lg font-black italic">18 Dossiers en attente</p>
                             </div>
                             <div 
                                onClick={() => setSelectedTask({id: 'STK-99', type: 'STOCK'})}
                                className="bg-white border-l-8 border-red-500 p-8 rounded-[2rem] shadow-lg cursor-pointer hover:translate-x-2 transition-all"
                             >
                                <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1 italic">Stock Alert</p>
                                <p className="text-lg font-black italic tracking-tight italic uppercase">Rupture Maïs : Bobo-Dioulasso</p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- DRAWER (LOGIQUE EXISTANTE MAIS PLUS RICHE) --- */}
            <AnimatePresence>
                {selectedTask && (
                    <motion.div 
                        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        className="fixed top-0 right-0 w-full md:w-[500px] h-full bg-white shadow-2xl z-50 p-12 overflow-y-auto"
                    >
                        <button onClick={() => setSelectedTask(null)} className="absolute top-10 right-10 w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all"><FaTimes /></button>
                        
                        {/* Contenu conditionnel enrichi */}
                        <div className="mt-20">
                            <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-8">Central Ops<span className="text-indigo-600">.</span></h2>
                            {/* ... Tes composants de gestion ... */}
                            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 italic">Diagnostic Système</p>
                                <div className="space-y-4">
                                    <div className="bg-white p-6 rounded-2xl flex justify-between items-center shadow-sm">
                                        <span className="text-sm font-black italic">Moussa Traoré</span>
                                        <span className="text-[9px] font-black px-3 py-1 bg-green-100 text-green-600 rounded-full">DOCS OK</span>
                                    </div>
                                    <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest">Valider Profil</button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {selectedTask && <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-md z-40" onClick={() => setSelectedTask(null)} />}
        </div>
    );
}

// --- SOUS-COMPOSANTS ---

function KpiCard({ label, value, sub, trend, isAlert, icon, color = "text-slate-900" }: any) {
    return (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-white relative overflow-hidden group hover:scale-[1.02] transition-all">
            <div className="flex justify-between items-start mb-6">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] italic leading-tight">{label}</p>
                {icon ? <div className="text-slate-200">{icon}</div> : (trend && <span className={`text-[10px] font-black ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{trend}</span>)}
            </div>
            <div className="flex items-end gap-3">
                <span className={`text-5xl font-black ${color} italic tracking-tighter leading-none`}>{value}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase mb-1">{sub}</span>
            </div>
            {isAlert && <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 animate-ping m-8" />}
        </div>
    );
}

function FeedItem({ type, title, desc, time, amount, status }: any) {
    return (
        <div className="flex justify-between items-center p-6 bg-slate-50/50 hover:bg-white rounded-[2rem] transition-all cursor-pointer border border-transparent hover:border-slate-100">
            <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${type === 'SALE' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : type === 'ALERT' ? 'bg-red-500 animate-pulse' : 'bg-indigo-500'}`} />
                <div>
                    <p className="text-xs font-black italic uppercase leading-none">{title}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1">{desc}</p>
                </div>
            </div>
            <div className="text-right">
                {amount && <p className="text-sm font-black text-green-600 italic tracking-tighter">{amount}</p>}
                {status && <p className="text-[9px] font-black uppercase text-slate-300">{status}</p>}
                <p className="text-[8px] font-bold text-slate-300 uppercase">{time}</p>
            </div>
        </div>
    );
}

function AdminAction({ icon, label, count, status }: any) {
    return (
        <div className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all cursor-pointer">
            <div className="flex items-center gap-4">
                <div className="text-slate-400 text-sm">{icon}</div>
                <p className="text-[10px] font-black uppercase text-slate-600 tracking-wider italic">{label}</p>
            </div>
            {count && <span className="text-[10px] font-black text-slate-900">{count}</span>}
            {status && <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">{status}</span>}
        </div>
    );
}