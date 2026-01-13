'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FaPhone, FaCheckCircle, FaTimesCircle, FaClock, 
  FaMapMarkerAlt, FaBox, FaChevronRight, FaMotorcycle, FaShoppingBasket 
} from 'react-icons/fa';

// --- TYPES (Identiques) ---
type OrderStatus = 'pending' | 'confirmed' | 'delivering' | 'delivered' | 'cancelled';
type OrderItem = { name: string; quantity: number; unit: string; price: number; };
type Order = { id: string; customerName: string; customerPhone: string; location: string; date: string; total: number; status: OrderStatus; items: OrderItem[]; };

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');

  // ... (Tes données orders restent les mêmes)
  const [orders] = useState<Order[]>([
    { id: 'CMD-001', customerName: 'Moussa Diop', customerPhone: '+221 77 000 00 00', location: 'Marché central, Stand 42', date: 'Aujourd\'hui, 10:30', total: 25000, status: 'pending', items: [{ name: 'Sacs de Maïs', quantity: 2, unit: 'sac', price: 12500 }] },
    { id: 'CMD-002', customerName: 'Amina Sow', customerPhone: '+221 77 111 11 11', location: 'Restaurant "Chez Tanty"', date: 'Hier, 16:45', total: 5000, status: 'confirmed', items: [{ name: 'Tomates', quantity: 10, unit: 'kg', price: 500 }] },
    { id: 'CMD-004', customerName: 'Fatou N.', customerPhone: '+221 77 333 33 33', location: 'Dakar Plateau', date: 'Aujourd\'hui, 11:15', total: 1500, status: 'delivering', items: [{ name: 'Mangues', quantity: 5, unit: 'unite', price: 300 }] }
  ]);

  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'delivering': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  const filteredOrders = orders.filter(o => activeTab === 'current' ? ['pending', 'confirmed', 'delivering'].includes(o.status) : ['delivered', 'cancelled'].includes(o.status));

  return (
    <div className="min-h-screen bg-slate-50 pb-28 font-sans">
      
      {/* 1. HEADER VITAL */}
      <div className="bg-white p-6 sticky top-0 z-30 shadow-sm border-b border-slate-100">
        <div className="flex justify-between items-end mb-6">
            <div>
                <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                    Commandes
                </h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Flux de vente direct</p>
            </div>
            <div className="bg-green-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200">
                <FaShoppingBasket size={20} />
            </div>
        </div>

        {/* ONGLETS STYLISÉS */}
        <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] gap-1">
          {['current', 'history'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-[1.2rem] transition-all ${
                activeTab === tab ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab === 'current' ? `En cours (${filteredOrders.length})` : 'Historique'}
            </button>
          ))}
        </div>
      </div>

      {/* 2. LISTE DES COMMANDES */}
      <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <FaBox className="text-slate-300 text-2xl" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Aucun mouvement détecté</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <Link 
              key={order.id} 
              href={`/sales/${order.id}`} 
              className="block bg-white rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100 active:scale-[0.97] transition-all duration-200 relative overflow-hidden"
            >
              {/* Statut flottant */}
              <div className={`absolute top-0 right-8 px-4 py-2 rounded-b-2xl border-x border-b text-[9px] font-black uppercase tracking-tighter ${getStatusStyle(order.status)}`}>
                {order.status === 'pending' && 'En attente'}
                {order.status === 'confirmed' && 'Validée'}
                {order.status === 'delivering' && 'En route'}
                {order.status === 'delivered' && 'Terminée'}
              </div>

              {/* En-tête : ID & Prix */}
              <div className="mb-6">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-1">#{order.id}</span>
                <div className="flex justify-between items-end">
                    <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter">
                        {order.total.toLocaleString()}<span className="text-sm not-italic ml-1">FCFA</span>
                    </h2>
                    <span className="text-[10px] font-bold text-slate-400 mb-1">{order.date}</span>
                </div>
              </div>

              {/* Info Client (Card interne) */}
              <div className="bg-slate-50 rounded-[1.8rem] p-4 flex items-center justify-between mb-6 border border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-green-600 border border-slate-100">
                        <FaMapMarkerAlt size={16} />
                    </div>
                    <div>
                        <p className="font-black text-slate-800 text-sm uppercase tracking-tight italic">{order.customerName}</p>
                        <p className="text-[10px] font-bold text-slate-400 truncate w-40">{order.location}</p>
                    </div>
                </div>
                <FaChevronRight className="text-slate-300" size={12} />
              </div>

              {/* Footer de carte : Articles & Bouton Appel */}
              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wide">
                        {order.items[0].name} {order.items.length > 1 && `+ ${order.items.length - 1}`}
                    </span>
                </div>

                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = `tel:${order.customerPhone}`;
                  }}
                  className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] flex items-center gap-2 shadow-lg active:bg-green-600 transition-colors"
                >
                  <FaPhone size={10} className="rotate-3" /> Appeler
                </button>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
