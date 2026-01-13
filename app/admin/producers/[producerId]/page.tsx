'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
    FaChevronLeft, FaUserShield, FaPhone, FaMapMarkerAlt, 
    FaEnvelope, FaCalendarAlt, FaWarehouse, FaShoppingCart,
    FaCheckCircle, FaTimesCircle, FaTrashAlt, FaChartLine, 
    FaChevronRight, FaLockOpen, FaReceipt, FaMoneyBillWave, 
    FaHistory, FaShieldAlt, FaEye, FaEyeSlash, FaClock, FaExclamationCircle
} from 'react-icons/fa';

// --- 1. DONNÉES FICTIVES (Mocks) ---
const mockProducers = [
    {
        id: 'PROD-001',
        name: 'Ferme Bio Alpha',
        location: 'Thiès, Zone Agricole, Lot 10',
        email: 'alpha@ferme.com',
        phone: '+221 77 987 65 43',
        status: 'active',
        productsCount: 15,
        totalOrders: 120,
        registrationDate: '12/01/2024',
        lastProfileUpdate: '10/12/2025',
        totalRevenue: 5250000,
        bankInfoMasked: 'RIB: **** 1234 5678',
    },
    {
        id: 'PROD-002',
        name: 'Coopérative Niayes',
        location: 'Dakar, Grande Niaye',
        email: 'niayes@coop.org',
        phone: '+221 70 123 45 67',
        status: 'pending',
        productsCount: 0,
        totalOrders: 0,
        registrationDate: '25/11/2025',
        lastProfileUpdate: '25/11/2025',
        totalRevenue: 0,
        bankInfoMasked: 'RIB: **** 9012 3456',
    }
];

const mockProducts = [
    { id: 'ITM-01', name: 'Tomates Fraîches', stock: 150, price: 500 },
    { id: 'ITM-02', name: 'Sacs de Maïs', stock: 50, price: 12500 },
];

const mockAudit = [
    { action: 'Création du compte', admin: 'Système', date: '12/01/2024' },
    { action: 'Validation administrative', admin: 'Admin Alpha', date: '15/01/2024' },
    { action: 'Mise à jour RIB', admin: 'Ferme Bio Alpha', date: '01/12/2025' },
];

// --- 2. STYLES RÉUTILISABLES ---
const CARD_STYLE = "bg-white rounded-[2rem] p-6 shadow-sm border border-orange-50/50 transition-all hover:shadow-md";

export default function ProducerDetailPage({ params }: { params: Promise<{ producerId: string }> }) {
    const router = useRouter();
    const { producerId } = use(params);
    const [isBankVisible, setIsBankVisible] = useState(false);

    // Récupération sécurisée du producteur
    const producer = mockProducers.find(p => p.id === producerId) || mockProducers[0]; 

    return (
        <div className="min-h-screen bg-[#FDFCFB] pb-20">
            
            {/* 1. HEADER DYNAMIQUE (top-16 pour ne pas cacher la Navbar) */}
            <header className="bg-white border-b border-orange-100/50 px-6 py-8 sticky top-16 z-30 shadow-sm">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => router.back()}
                            className="p-3 rounded-full bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                        >
                            <FaChevronLeft />
                        </button>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">Détails Partenaire</span>
                                <StatusBadge status={producer.status} />
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{producer.name}</h1>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button className="flex-1 md:flex-none px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all active:scale-95">
                            Activer
                        </button>
                        <button className="flex-1 md:flex-none px-6 py-3 bg-white border border-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-all">
                            Suspendre
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto p-6 space-y-8 mt-4">

                {/* 2. STATS CLÉS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatBox 
                        icon={<FaMoneyBillWave />} 
                        label="Revenu Total" 
                        value={`${producer.totalRevenue.toLocaleString()} FCFA`}
                        color="emerald"
                    />
                    <StatBox 
                        icon={<FaShoppingCart />} 
                        label="Commandes" 
                        value={producer.totalOrders}
                        color="orange"
                    />
                    <StatBox 
                        icon={<FaWarehouse />} 
                        label="Produits" 
                        value={producer.productsCount}
                        color="blue"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* 3. INFOS DE CONTACT */}
                    <div className="lg:col-span-2 space-y-6">
                        <section className={CARD_STYLE}>
                            <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-tight">
                                <FaUserShield className="text-emerald-500" /> Profil Administrateur
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <InfoItem icon={<FaPhone />} label="Ligne Directe" value={producer.phone} />
                                <InfoItem icon={<FaEnvelope />} label="Email" value={producer.email} />
                                <InfoItem icon={<FaMapMarkerAlt />} label="Localisation" value={producer.location} />
                                <InfoItem icon={<FaCalendarAlt />} label="Inscription" value={producer.registrationDate} />
                            </div>
                        </section>

                        {/* 4. PRODUITS RÉCENTS */}
                        <section className={CARD_STYLE}>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Catalogue Récent</h2>
                                <Link href="#" className="text-xs font-bold text-emerald-600 hover:underline">Voir tout</Link>
                            </div>
                            <div className="space-y-4">
                                {mockProducts.map(product => (
                                    <div key={product.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-emerald-100 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-black text-slate-400">
                                                {product.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{product.name}</p>
                                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Stock: {product.stock}</p>
                                            </div>
                                        </div>
                                        <p className="font-black text-emerald-600">{product.price.toLocaleString()} F</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* 5. SÉCURITÉ & AUDIT */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl shadow-slate-200">
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2 text-emerald-400">
                                <FaShieldAlt /> Sécurité Bancaire
                            </h2>
                            <div className="bg-white/5 p-4 rounded-2xl mb-4 border border-white/10">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">RIB</p>
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-sm tracking-widest font-bold">
                                        {isBankVisible ? producer.bankInfoMasked : "**** **** **** 5678"}
                                    </span>
                                    <button onClick={() => setIsBankVisible(!isBankVisible)} className="text-emerald-400">
                                        {isBankVisible ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                            <button className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-[10px] font-black uppercase transition-all">
                                Editer RIB
                            </button>
                        </div>

                        <section className={CARD_STYLE}>
                            <h2 className="text-xs font-black text-slate-900 mb-4 uppercase tracking-widest flex items-center gap-2 text-orange-400">
                                <FaHistory /> Audit Trail
                            </h2>
                            <div className="space-y-4">
                                {mockAudit.map((log, i) => (
                                    <div key={i} className="relative pl-4 border-l-2 border-slate-100 pb-2">
                                        <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-emerald-500" />
                                        <p className="text-[10px] font-black text-slate-900 leading-tight">{log.action}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">{log.date}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <button className="w-full py-4 text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-50 rounded-2xl transition-colors flex items-center justify-center gap-2">
                            <FaTrashAlt /> Supprimer le compte
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

// --- SOUS-COMPOSANTS ---

function StatBox({ icon, label, value, color }: any) {
    const colors: any = {
        emerald: "bg-emerald-50 text-emerald-600",
        orange: "bg-orange-50 text-orange-600",
        blue: "bg-blue-50 text-blue-600",
    };
    return (
        <div className="bg-white p-6 rounded-[2rem] border border-orange-50/50 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg ${colors[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
                <p className="text-xl font-black text-slate-900">{value}</p>
            </div>
        </div>
    );
}

function InfoItem({ icon, label, value }: any) {
    return (
        <div className="flex items-start gap-4">
            <div className="text-slate-300 mt-1">{icon}</div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="font-bold text-slate-900">{value}</p>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        active: "bg-emerald-50 text-emerald-600",
        pending: "bg-amber-50 text-amber-600",
        suspended: "bg-red-50 text-red-600",
    };
    return (
        <span className={`${styles[status] || styles.pending} text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg`}>
            {status}
        </span>
    );
}