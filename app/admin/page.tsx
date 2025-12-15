'use client';

import React from 'react';
import Link from 'next/link';
import { 
    FaTachometerAlt, FaUsers, FaWarehouse, 
    FaCheckCircle, FaChartLine, FaEnvelopeOpenText,
    FaArrowUp, FaSyncAlt, FaChevronRight 
} from 'react-icons/fa';
import AdminNavbar from '@/components/utils/adminNavbar'; // Assurez-vous que le chemin est correct

// --- DONNÉES FICTIVES ADMIN ---
const mockAdminData = {
    // Métriques clés
    globalMetrics: {
        totalProducers: 85,
        activeProducers: 78,
        totalProducts: 1240,
        pendingValidations: 15, // Comptes ou produits en attente de vérification
    },
    // Croissance sur le dernier mois
    monthlyGrowth: {
        newProducers: 5,
        productsAdded: 150,
        producerGrowthRate: 6.2, // % de croissance
    },
    // Activité récente
    recentActivity: [
        { type: 'product', title: 'Nouvelle Tomate Bio', producer: 'Ferme Alpha', status: 'pending' },
        { type: 'producer', title: 'Jardin de Mariama', producer: null, status: 'pending' },
        { type: 'product', title: 'Sac de Maïs', producer: 'Coopérative Sud', status: 'approved' },
        { type: 'product', title: 'Mangues Séchées', producer: 'Producteur Ouest', status: 'pending' },
    ]
};

// --- HELPERS ---

// Composant pour les cartes d'état (KPI)
const KpiCard = ({ title, value, icon: Icon, link, bgColor = 'bg-green-600' }: {
    title: string;
    value: number | string;
    icon: React.ElementType;
    link: string;
    bgColor?: string;
}) => (
    <Link href={link} className={`flex flex-col justify-between p-4 rounded-xl shadow-md h-32 text-white transition-transform active:scale-[0.98] ${bgColor}`}>
        <Icon className="text-3xl" />
        <div className="mt-auto">
            <span className="block text-3xl font-black">{value}</span>
            <span className="text-xs font-medium opacity-80">{title}</span>
        </div>
    </Link>
);

// --- COMPOSANT DE LA PAGE ---

export default function AdminDashboardPage() {
    const { globalMetrics, monthlyGrowth, recentActivity } = mockAdminData;

    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">

            <div className="p-4">
                <h1 className="text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
                    <FaTachometerAlt className="text-green-700" /> Tableau de Bord Admin
                </h1>
                
                <div className="space-y-8">
                    
                    {/* 2. METRIQUES CLÉS */}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <KpiCard 
                            title="Producteurs Actifs" 
                            value={globalMetrics.activeProducers} 
                            icon={FaUsers} 
                            link="/admin/producers"
                        />
                        <KpiCard 
                            title="Produits Totaux" 
                            value={globalMetrics.totalProducts.toLocaleString()} 
                            icon={FaWarehouse} 
                            link="/admin/stock"
                            bgColor="bg-blue-600"
                        />
                        <KpiCard 
                            title="Validations en Attente" 
                            value={globalMetrics.pendingValidations} 
                            icon={FaCheckCircle} 
                            link="/admin/validations"
                            bgColor="bg-red-600" // Urgent
                        />
                         <KpiCard 
                            title="Nouveaux Producteurs" 
                            value={monthlyGrowth.newProducers} 
                            icon={FaEnvelopeOpenText} 
                            link="/admin/producers"
                            bgColor="bg-yellow-600"
                        />
                    </div>

                    {/* 3. SECTION CROISSANCE */}
                    <div className="bg-white p-5 rounded-2xl shadow-md">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FaChartLine className="text-green-600" /> Croissance Mensuelle
                        </h2>
                        
                        <div className="flex justify-between items-center text-sm border-b pb-3 mb-3 border-gray-100">
                            <p className="text-gray-500">Taux de croissance Producteurs</p>
                            <div className="flex items-center font-bold text-green-600">
                                <FaArrowUp className="mr-1" /> {monthlyGrowth.producerGrowthRate}%
                            </div>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                            <p className="text-gray-500">Nouveaux produits ajoutés</p>
                            <span className="font-bold text-gray-800">{monthlyGrowth.productsAdded}</span>
                        </div>
                    </div>

                    {/* 4. ACTIVITÉ RÉCENTE (VALIDATIONS/MISES À JOUR) */}
                    <div className="bg-white p-5 rounded-2xl shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <FaSyncAlt className="text-green-600" /> Dernières Activités
                            </h2>
                            <Link href="/admin/validations" className="text-sm text-green-700 font-medium flex items-center">
                                Voir les validations <FaChevronRight className="text-xs ml-1" />
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {recentActivity.slice(0, 5).map((activity, index) => (
                                <div 
                                    key={index}
                                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-gray-800">
                                            {activity.title}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {activity.type === 'producer' ? 'Nouveau Producteur' : `Par ${activity.producer}`}
                                        </span>
                                    </div>
                                    <span 
                                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                            activity.status === 'pending' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                        }`}
                                    >
                                        {activity.status === 'pending' ? 'À Valider' : 'Approuvé'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
            
            {/* 5. BARRE DE NAVIGATION ADMIN (Fixe pour mobile) */}
            <div className="md:hidden">
                <AdminNavbar />
            </div>

        </div>
    );
}