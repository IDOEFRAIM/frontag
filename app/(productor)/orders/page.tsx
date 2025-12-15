'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FaPhone, FaCheckCircle, FaTimesCircle, FaClock, 
  FaMapMarkerAlt, FaBox, FaChevronRight, FaMotorcycle 
} from 'react-icons/fa';

// --- TYPES ---
type OrderStatus = 'pending' | 'confirmed' | 'delivering' | 'delivered' | 'cancelled';

type OrderItem = {
  name: string;
  quantity: number;
  unit: string;
  price: number;
};

type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  location: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
};

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');

  // --- DONNÉES FICTIVES (Pour la démo) ---
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'CMD-001',
      customerName: 'Moussa Diop',
      customerPhone: '+221 77 000 00 00',
      location: 'Marché central, Stand 42',
      date: 'Aujourd\'hui, 10:30',
      total: 25000,
      status: 'pending',
      items: [
        { name: 'Sacs de Maïs', quantity: 2, unit: 'sac', price: 12500 },
      ]
    },
    {
      id: 'CMD-002',
      customerName: 'Amina Sow',
      customerPhone: '+221 77 111 11 11',
      location: 'Restaurant "Chez Tanty"',
      date: 'Hier, 16:45',
      total: 5000,
      status: 'confirmed',
      items: [
        { name: 'Tomates', quantity: 10, unit: 'kg', price: 500 },
      ]
    },
    {
      id: 'CMD-003',
      customerName: 'Jean K.',
      customerPhone: '+221 77 222 22 22',
      location: 'Mermoz',
      date: '12 Déc',
      total: 10500,
      status: 'delivered',
      items: [
        { name: 'Poulets', quantity: 3, unit: 'unite', price: 3500 },
      ]
    },
    {
        id: 'CMD-004',
        customerName: 'Fatou N.',
        customerPhone: '+221 77 333 33 33',
        location: 'Dakar Plateau',
        date: 'Aujourd\'hui, 11:15',
        total: 1500,
        status: 'delivering',
        items: [
          { name: 'Mangues', quantity: 5, unit: 'unite', price: 300 },
        ]
      }
  ]);

  // --- HELPERS ---

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1"><FaClock /> En attente</span>;
      case 'confirmed':
        return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1"><FaCheckCircle /> Validée</span>;
      case 'delivering':
        return <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1"><FaMotorcycle /> En livraison</span>;
      case 'delivered':
        return <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1"><FaCheckCircle /> Livrée</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1"><FaTimesCircle /> Annulée</span>;
    }
  };

  // Filtrer les commandes selon l'onglet actif
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'current') {
      return ['pending', 'confirmed', 'delivering'].includes(order.status);
    } else {
      return ['delivered', 'cancelled'].includes(order.status);
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      
      {/* 1. HEADER */}
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-black text-gray-900 mb-1">Commandes</h1>
        <p className="text-gray-500 text-sm">Gérez vos ventes entrantes</p>

        {/* ONGLETS */}
        <div className="flex bg-gray-100 p-1 rounded-xl mt-4">
          <button 
            onClick={() => setActiveTab('current')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'current' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            En cours ({orders.filter(o => ['pending', 'confirmed', 'delivering'].includes(o.status)).length})
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'history' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Historique
          </button>
        </div>
      </div>

      {/* 2. LISTE DES COMMANDES */}
      <div className="p-4 space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <FaBox className="text-4xl mb-3 opacity-30" />
            <p>Aucune commande dans cette section.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            // Utilisation de Link pour naviguer vers la page de détails
            <Link 
              key={order.id} 
              href={`/orders/${order.id}`} 
              className="block bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:scale-[0.99] transition-transform duration-100"
            >
              
              {/* En-tête Carte */}
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-50">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-400">#{order.id}</span>
                  {getStatusBadge(order.status)}
                </div>
                <div className="text-right">
                  <span className="block text-xl font-black text-gray-800">
                    {order.total.toLocaleString()} F
                  </span>
                  <span className="text-xs text-gray-500">{order.date}</span>
                </div>
              </div>

              {/* Info Client */}
              <div className="mb-4 bg-gray-50 p-3 rounded-xl flex justify-between items-center">
                <div>
                    <p className="font-bold text-gray-800">{order.customerName}</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <FaMapMarkerAlt className="text-gray-400" /> 
                      {order.location}
                    </p>
                </div>
                <FaChevronRight className="text-gray-300 text-sm" />
              </div>

              {/* Aperçu des Articles & Action Téléphone (CORRIGÉ) */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {order.items.length > 1 
                    ? `${order.items[0].name} et ${order.items.length - 1} autre(s) article(s)`
                    : order.items[0].name
                  }
                </span>
                {/* 🛑 CORRECTION : Utilisation de <span> avec onClick au lieu de <a> */}
                <span 
                    onClick={(e) => {
                        e.preventDefault(); // Empêche le Link parent de naviguer
                        e.stopPropagation(); // Arrête la propagation d'événement
                        window.location.href = `tel:${order.customerPhone}`; // Lance l'appel
                    }}
                    className="text-green-700 font-medium flex items-center gap-1 active:scale-95 transition-transform cursor-pointer"
                >
                    <FaPhone className="text-xs" /> Appeler
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}