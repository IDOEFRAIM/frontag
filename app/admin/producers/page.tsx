'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
    FaUsers, FaSearch, FaMapMarkerAlt, FaChevronRight, FaCheckCircle, FaClock, FaExclamationCircle, FaFilter
} from 'react-icons/fa';

// --- TYPES & MOCK ---
type ProducerStatus = 'all' | 'active' | 'pending' | 'suspended';
type Producer = {
    id: string; name: string; location: string; email: string; phone: string;
    status: Exclude<ProducerStatus, 'all'>; productsCount: number; totalOrders: number; registrationDate: string;
};

const mockProducers: Producer[] = [
    { id: 'PROD-001', name: 'Ferme Bio Alpha', location: 'Thiès, Zone Agricole', email: 'alpha@ferme.com', phone: '+221 77 987 65 43', status: 'active', productsCount: 15, totalOrders: 120, registrationDate: '12/01/2024' },
    { id: 'PROD-002', name: 'Coopérative Niayes', location: 'Dakar, Grande Niaye', email: 'niayes@coop.org', phone: '+221 70 123 45 67', status: 'pending', productsCount: 0, totalOrders: 0, registrationDate: '25/11/2025' },
    { id: 'PROD-003', name: 'Maraîcher de Mbour', location: 'Mbour, Côte', email: 'mbour@prod.sn', phone: '+221 76 543 21 00', status: 'suspended', productsCount: 5, totalOrders: 12, registrationDate: '05/05/2024' },
];

export default function ProducersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<ProducerStatus>('all');

    // --- LOGIQUE DE FILTRE COMBINÉE ---
    const filtered = mockProducers.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             p.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-[#FDFCFB] pb-20">
            <header className="bg-white border-b border-orange-100/50 px-6 py-8 sticky top-16 z-30 shadow-sm">
                <div className="max-w-5xl mx-auto space-y-6">
                    {/* TITRE */}
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
                            <FaUsers size={22} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            Producteurs <span className="text-emerald-500 font-medium">& Partenaires</span>
                        </h1>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        {/* BARRE DE RECHERCHE */}
                        <div className="relative group flex-1">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Rechercher une exploitation..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium text-slate-700"
                            />
                        </div>

                        {/* FILTRES DE STATUT */}
                        <div className="flex items-center bg-slate-50 p-1.5 rounded-2xl overflow-x-auto no-scrollbar">
                            <FilterButton active={statusFilter === 'all'} label="Tous" onClick={() => setStatusFilter('all')} />
                            <FilterButton active={statusFilter === 'active'} label="Actifs" color="emerald" onClick={() => setStatusFilter('active')} />
                            <FilterButton active={statusFilter === 'pending'} label="Attente" color="amber" onClick={() => setStatusFilter('pending')} />
                            <FilterButton active={statusFilter === 'suspended'} label="Suspendus" color="red" onClick={() => setStatusFilter('suspended')} />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto p-6">
                {/* COMPTEUR DE RÉSULTATS */}
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
                    {filtered.length} Résultat{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filtered.map((producer) => (
                        <Link 
                            key={producer.id} 
                            href={`/admin/producers/${producer.id}`}
                            className="group bg-white rounded-[2.5rem] p-8 border border-orange-50/50 shadow-sm hover:shadow-xl transition-all"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-16 h-16 bg-[#F9F7F2] rounded-2xl flex items-center justify-center text-3xl group-hover:bg-emerald-500 group-hover:text-white transition-colors uppercase font-bold text-slate-400">
                                    {producer.name.charAt(0)}
                                </div>
                                <StatusBadge status={producer.status} />
                            </div>

                            <div className="mb-8">
                                <h3 className="text-2xl font-black text-slate-900 mb-2">{producer.name}</h3>
                                <p className="text-sm font-bold text-slate-400 flex items-center gap-2">
                                    <FaMapMarkerAlt /> {producer.location}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                <div className="flex gap-6">
                                    <div>
                                        <p className="text-xl font-black text-slate-900">{producer.productsCount}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Produits</p>
                                    </div>
                                    <div>
                                        <p className="text-xl font-black text-slate-900">{producer.totalOrders}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ventes</p>
                                    </div>
                                </div>
                                <FaChevronRight className="text-slate-200 group-hover:text-emerald-500 transition-colors" />
                            </div>
                        </Link>
                    ))}
                </div>

                {/* EMPTY STATE */}
                {filtered.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                        <div className="text-slate-200 text-5xl mb-4 flex justify-center"><FaSearch /></div>
                        <p className="text-slate-500 font-bold">Aucun producteur ne correspond à vos critères.</p>
                    </div>
                )}
            </main>
        </div>
    );
}

// --- SOUS-COMPOSANTS ---

function FilterButton({ active, label, onClick, color = "slate" }: { active: boolean, label: string, onClick: () => void, color?: string }) {
    const activeStyles: any = {
        emerald: "bg-emerald-500 text-white shadow-lg shadow-emerald-100",
        amber: "bg-amber-500 text-white shadow-lg shadow-amber-100",
        red: "bg-red-500 text-white shadow-lg shadow-red-100",
        slate: "bg-slate-900 text-white shadow-lg shadow-slate-100"
    };

    return (
        <button 
            onClick={onClick}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                active ? activeStyles[color] : "text-slate-400 hover:text-slate-600"
            }`}
        >
            {label}
        </button>
    );
}

function StatusBadge({ status }: { status: string }) {
    const config: any = {
        active: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: <FaCheckCircle /> },
        pending: { bg: 'bg-amber-50', text: 'text-amber-600', icon: <FaClock /> },
        suspended: { bg: 'bg-red-50', text: 'text-red-600', icon: <FaExclamationCircle /> },
    };
    const { bg, text, icon } = config[status] || config.pending;
    return (
        <span className={`${bg} ${text} text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl flex items-center gap-2 border border-current/10`}>
            {icon} {status}
        </span>
    );
}