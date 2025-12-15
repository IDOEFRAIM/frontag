'use client';

import React from 'react';
import { 
    FaChartLine, FaBoxOpen, FaSyncAlt, FaDollarSign, 
    FaUsers, FaMotorcycle, FaClock, FaCheckCircle, 
    FaChevronRight, FaArrowUp, FaArrowDown 
} from 'react-icons/fa';
import Link from 'next/link';

// --- TYPES (Pour la cohérence avec les autres pages) ---
type OrderStatus = 'pending' | 'confirmed' | 'delivering' | 'delivered' | 'cancelled';
type Order = {
  id: string;
  customerName: string;
  total: number;
  status: OrderStatus;
};

// --- DONNÉES FICTIVES DU DASHBOARD ---
const mockData = {
    // 1. STATISTIQUES GLOBALES
    sales: {
        totalRevenue: 1575000, // Total en Francs CFA
        ordersCount: 345,
        newCustomers: 28,
        growthPercentage: 12, // Croissance par rapport au mois précédent
    },
    // 2. STATISTIQUES PAR STATUT
    ordersSummary: {
        pending: 5,
        confirmed: 8,
        delivering: 3,
        deliveredToday: 12,
        cancelled: 1,
    },
    // 3. COMMANDES RÉCENTES (Pour l'aperçu)
    recentOrders: [
        { id: 'CMD-005', customerName: 'Mariam D.', total: 50000, status: 'pending' as OrderStatus },
        { id: 'CMD-004', customerName: 'Fatou N.', total: 1500, status: 'delivering' as OrderStatus },
        { id: 'CMD-003', customerName: 'Jean K.', total: 10500, status: 'delivered' as OrderStatus },
    ]
};

// --- HELPERS ---

const formatCurrency = (amount: number) => {
    return amount.toLocaleString('fr-FR') + ' F';
};

const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full">En attente</span>;
      case 'confirmed':
        return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">Validée</span>;
      case 'delivering':
        return <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded-full">En livraison</span>;
      case 'delivered':
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">Livrée</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">Annulée</span>;
    }
};

// --- COMPOSANT DE LA PAGE ---

export default function DashboardPage() {
    const { sales, ordersSummary, recentOrders } = mockData;

    // Calcul du nombre total de commandes en cours
    const currentOrdersCount = ordersSummary.pending + ordersSummary.confirmed + ordersSummary.delivering;

    const GrowthIcon = sales.growthPercentage >= 0 ? FaArrowUp : FaArrowDown;
    const growthColor = sales.growthPercentage >= 0 ? 'text-green-600' : 'text-red-600';

    // Les données pour les cartes d'état des commandes
    const statusCards = [
        { 
            label: "Total Commandes", 
            value: currentOrdersCount, 
            icon: FaBoxOpen, 
            bgColor: 'bg-green-600', 
            link: '/orders',
            subText: `(${ordersSummary.pending} en attente)`,
        },
        { 
            label: "En Livraison", 
            value: ordersSummary.delivering, 
            icon: FaMotorcycle, 
            bgColor: 'bg-purple-600', 
            link: '/orders',
            subText: `Prêtes à être livrées : ${ordersSummary.confirmed}`,
        },
        { 
            label: "Livré Aujourd'hui", 
            value: ordersSummary.deliveredToday, 
            icon: FaCheckCircle, 
            bgColor: 'bg-blue-600', 
            link: '/orders',
            subText: "Voir l'historique",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            
            {/* 1. HEADER */}
            <div className="bg-white p-4 sticky top-0 z-10 shadow-sm">
                <h1 className="text-2xl font-black text-gray-900 mb-1 flex items-center gap-2">
                    <FaChartLine className="text-green-700" /> Tableau de Bord
                </h1>
                <p className="text-gray-500 text-sm">Vue d'ensemble de vos performances</p>
            </div>

            <div className="p-4 space-y-6">

                {/* 2. STATISTIQUES DE VENTE GLOBALES */}
                <div className="bg-white p-5 rounded-2xl shadow-md">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <FaDollarSign className="text-green-600" /> Performance des Ventes
                    </h2>

                    {/* Ventes Totales */}
                    <div className="mb-4 pb-4 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-500">Revenus Totaux (Cumulés)</p>
                        <span className="block text-3xl font-extrabold text-gray-900 mt-1">
                            {formatCurrency(sales.totalRevenue)}
                        </span>
                    </div>

                    {/* Comparaison et Commandes */}
                    <div className="flex justify-between items-center text-sm">
                        
                        {/* Croissance */}
                        <div className="flex flex-col">
                            <p className="text-gray-500">Vs Mois précédent</p>
                            <div className={`flex items-center font-bold mt-0.5 ${growthColor}`}>
                                <GrowthIcon className="mr-1" /> 
                                {sales.growthPercentage}%
                            </div>
                        </div>

                        {/* Clients et Commandes */}
                        <div className="text-right space-y-1">
                            <p className="text-gray-800 font-bold">
                                {sales.ordersCount} <span className="text-gray-500 font-normal">Commandes totales</span>
                            </p>
                            <p className="text-gray-800 font-bold">
                                {sales.newCustomers} <span className="text-gray-500 font-normal">Nouveaux clients (ce mois)</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* 3. CARTES STATUT DES COMMANDES (ACTIONS RAPIDES) */}
                <div className="grid grid-cols-3 gap-3">
                    {statusCards.map((card) => (
                        <Link 
                            key={card.label} 
                            href={card.link}
                            className={`flex flex-col justify-between p-3 rounded-xl shadow-md h-32 text-white transition-transform active:scale-[0.98] ${card.bgColor}`}
                        >
                            <card.icon className="text-2xl" />
                            <div className="mt-auto">
                                <span className="block text-2xl font-black">{card.value}</span>
                                <span className="text-xs font-medium opacity-80">{card.label}</span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* 4. COMMANDES RÉCENTES / NOUVELLES COMMANDES */}
                <div className="bg-white p-5 rounded-2xl shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <FaSyncAlt className="text-green-600" /> Activité Récente
                        </h2>
                        <Link href="/orders" className="text-sm text-green-700 font-medium flex items-center">
                            Voir tout <FaChevronRight className="text-xs ml-1" />
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {recentOrders.map((order) => (
                            <Link 
                                key={order.id} 
                                href={`/orders/${order.id}`}
                                className="flex justify-between items-center p-3 -mx-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-gray-800">{order.customerName}</span>
                                    <span className="text-xs text-gray-500">#{order.id}</span>
                                </div>

                                <div className="text-right">
                                    <span className="block text-sm font-bold text-gray-800">{formatCurrency(order.total)}</span>
                                    {getStatusBadge(order.status)}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* 5. ESPACE POUR GRAPHIQUES (Futur) */}
                <div className="p-5 rounded-2xl border-2 border-dashed border-gray-300 text-center text-gray-500">
                    <p className="font-medium">Espace Graphiques</p>
                    <p className="text-sm mt-1">Intégrez ici des graphiques de tendance de vente (Semaine/Mois)</p>
                </div>

            </div>
        </div>
    );
}