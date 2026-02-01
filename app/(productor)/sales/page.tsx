'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FaPhone, FaCheckCircle, FaTimesCircle, FaClock, 
  FaMapMarkerAlt, FaBox, FaChevronRight, FaMotorcycle, FaShoppingBasket 
} from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';

// --- TYPES (Identiques) ---
type OrderStatus = 'pending' | 'confirmed' | 'delivering' | 'delivered' | 'cancelled';
type OrderItem = { name: string; quantity: number; unit: string; price: number; };
type Order = { id: string; customerName: string; customerPhone: string; location: string; date: string; total: number; status: OrderStatus; items: OrderItem[]; };

export default function OrdersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');

  // FETCH REAL DATA
  useEffect(() => {
    const fetchOrders = async () => {
        if (!user?.id) return;
        try {
            const res = await fetch(`/api/orders?userId=${user.id}`);
            if (res.ok) {
                const data = await res.json();
                // Formater la date pour l'affichage
                const formattedData = data.map((o: any) => ({
                    ...o,
                    date: new Date(o.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                }));
                setOrders(formattedData);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingData(false);
        }
    };

    if (!authLoading && user) {
        fetchOrders();
    }
  }, [user, authLoading]);

  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'delivering': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const filteredOrders = orders.filter(o => activeTab === 'current' ? ['pending', 'confirmed', 'delivering'].includes(o.status) : ['delivered', 'cancelled'].includes(o.status));

  if (authLoading || isLoadingData) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-[#F7F5EE]">
              <div className="w-10 h-10 border-4 border-[#497A3A] border-t-transparent rounded-full animate-spin"></div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#F7F5EE] pb-28 font-sans">
      
      {/* 1. HEADER VITAL */}
      <div className="bg-white p-6 sticky top-0 z-30 shadow-sm border-b border-[#E0E0D1]">
        <div className="flex justify-between items-end mb-6">
            <div>
                <h1 className="text-3xl font-black text-[#5B4636] tracking-tight leading-none">
                    Commandes
                </h1>
                <p className="text-[10px] font-bold text-[#7C795D] uppercase tracking-wider mt-2">Flux de vente direct</p>
            </div>
            <div className="bg-[#497A3A] text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/10">
                <FaShoppingBasket size={20} />
            </div>
        </div>

        {/* ONGLETS STYLISÉS */}
        <div className="flex bg-[#F7F5EE] p-1.5 rounded-2xl gap-1 border border-[#E0E0D1]">
          {['current', 'history'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${
                activeTab === tab ? 'bg-white text-[#497A3A] shadow-sm border border-[#E0E0D1]' : 'text-[#A4A291] hover:text-[#5B4636]'
              }`}
            >
              {tab === 'current' ? `En cours (${filteredOrders.length})` : 'Historique'}
            </button>
          ))}
        </div>
      </div>

      {/* 2. LISTE DES COMMANDES */}
      <div className="p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-[#E6F4EA] rounded-full flex items-center justify-center mb-4 text-[#497A3A]">
                <FaBox className="text-2xl" />
            </div>
            <p className="text-xs font-bold text-[#7C795D] uppercase tracking-wider text-center">Aucune commande pour le moment</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <Link 
              key={order.id} 
              href={`/sales/${order.id}`} 
              className="block bg-white rounded-3xl p-6 shadow-sm border border-[#E0E0D1] active:scale-[0.98] transition-all duration-200 relative overflow-hidden group hover:border-[#497A3A]"
            >
              {/* Statut flottant */}
              <div className={`absolute top-0 right-6 px-3 py-1.5 rounded-b-xl border-x border-b text-[9px] font-black uppercase tracking-wider ${getStatusStyle(order.status)}`}>
                {order.status === 'pending' && 'En attente'}
                {order.status === 'confirmed' && 'Validée'}
                {order.status === 'delivering' && 'En route'}
                {order.status === 'delivered' && 'Terminée'}
              </div>

              {/* En-tête : ID & Prix */}
              <div className="mb-6">
                <span className="text-[10px] font-bold text-[#A4A291] uppercase tracking-wider block mb-1">#{order.id.substring(0, 8)}...</span>
                <div className="flex justify-between items-end">
                    <h2 className="text-2xl font-black text-[#2D3436] tracking-tight">
                        {order.total.toLocaleString()}<span className="text-sm font-bold text-[#7C795D] ml-1">FCFA</span>
                    </h2>
                    <span className="text-[10px] font-bold text-[#7C795D] mb-1">{order.date}</span>
                </div>
              </div>

              {/* Info Client (Card interne) */}
              <div className="bg-[#F8FAF7] rounded-2xl p-4 flex items-center justify-between mb-6 border border-[#E0E0D1]">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-[#497A3A] border border-[#E0E0D1]">
                        <FaMapMarkerAlt size={14} />
                    </div>
                    <div>
                        <p className="font-bold text-[#5B4636] text-sm uppercase tracking-tight">{order.customerName}</p>
                        <p className="text-[10px] font-bold text-[#A4A291] truncate w-40">{order.location}</p>
                    </div>
                </div>
                <FaChevronRight className="text-[#D0CEBA]" size={12} />
              </div>

              {/* Footer de carte : Articles & Bouton Appel */}
              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#497A3A] animate-pulse" />
                    <span className="text-[10px] font-bold text-[#7C795D] uppercase tracking-wide">
                        {order.items[0]?.name} {order.items.length > 1 && `+ ${order.items.length - 1} autres`}
                    </span>
                </div>

                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = `tel:${order.customerPhone}`;
                  }}
                  className="bg-[#2D3436] text-white px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm hover:bg-[#497A3A] transition-colors"
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
