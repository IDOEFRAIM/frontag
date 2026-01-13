'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaSpinner, FaSearch, FaCheckCircle, FaTruck } from 'react-icons/fa';

// Tes composants réutilisables (Vérifie bien l'orthographe des fichiers)
import { StatusBadge } from '@/components/orders/statusCard';
import { CustomerCard } from '@/components/orders/customerCard';
import { OrderSummary } from '@/components/orders/orderSummary';

// --- MOCK DATABASE (Mise à jour) ---
const ordersDb: Record<string, any> = {
  'CMD-001': {
    id: 'CMD-001',
    customerName: 'Moussa Diop',
    customerPhone: '+221 77 000 00 00',
    location: 'Marché central, Stand 42, Dakar',
    date: '12 Mars 2024 - 10:30',
    total: 25000,
    status: 'pending',
    items: [{ id: 1, name: 'Sacs de Maïs', quantity: 2, unit: 'sac', price: 12500 }],
    deliveryFee: 1500,
  },
  'CMD-002': {
    id: 'CMD-002',
    customerName: 'Amina Sow',
    customerPhone: '+221 77 111 11 11',
    location: 'Restaurant "Chez Tanty", Saint-Louis',
    date: 'Hier, 16:45',
    total: 5000,
    status: 'confirmed',
    items: [{ id: 1, name: 'Tomates Fraîches', quantity: 10, unit: 'kg', price: 500 }],
    deliveryFee: 1000,
  },
  'CMD-004': {
    id: 'CMD-004',
    customerName: 'Fatou Ndiaye',
    customerPhone: '+221 77 333 33 33',
    location: 'Dakar Plateau, Immeuble Horizon',
    date: 'Aujourd\'hui, 11:15',
    total: 1500,
    status: 'delivering',
    items: [{ id: 1, name: 'Mangues Kent', quantity: 5, unit: 'unité', price: 300 }],
    deliveryFee: 2000,
  }
};

const getOrderDetails = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 800)); // Latence réseau Vital
  return ordersDb[id] || null;
};

export default function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const router = useRouter();

  const [order, setOrder] = useState<any>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [isUpdating, setIsUpdating] = useState(false);

  // --- CHARGEMENT DYNAMIQUE ---
  useEffect(() => {
    setStatus('loading'); // Reset le loader si l'ID change
    getOrderDetails(orderId).then((data) => {
      if (!data) {
        setStatus('error');
      } else {
        setOrder(data);
        setStatus('ready');
      }
    });
  }, [orderId]);

  // --- LOGIQUE DE CHANGEMENT DE STATUT ---
  const handleNextStep = async () => {
    setIsUpdating(true);
    await new Promise(r => setTimeout(r, 1000)); // Simulation sauvegarde
    
    const nextMap: Record<string, string> = {
        'pending': 'confirmed',
        'confirmed': 'delivering',
        'delivering': 'delivered'
    };
    
    const newStatus = nextMap[order.status];
    if (newStatus) {
        setOrder({ ...order, status: newStatus });
    }
    setIsUpdating(false);
  };

  // --- UI : ÉCRAN DE CHARGEMENT ---
  if (status === 'loading') return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <div className="relative">
        <FaSpinner className="animate-spin text-4xl text-slate-900" />
        <div className="absolute inset-0 blur-xl bg-slate-400/20 animate-pulse" />
      </div>
      <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Flux en cours...</p>
    </div>
  );

  // --- UI : ÉCRAN D'ERREUR ---
  if (status === 'error') return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-white">
      <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center mb-6 border border-red-100 shadow-inner">
        <FaSearch className="text-red-200 text-2xl" />
      </div>
      <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-4">
        ID Inconnu
      </h1>
      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-10 leading-relaxed max-w-[200px]">
        La commande <span className="text-red-400">{orderId}</span> n'existe pas dans le système.
      </p>
      <button 
        onClick={() => router.push('/sales')}
        className="w-full max-w-xs bg-slate-900 text-white py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all"
      >
        Retour au flux global
      </button>
    </div>
  );

  // --- UI : RENDU FINAL ---
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* Barre de navigation haute */}
      <div className="p-6 flex items-center justify-between sticky top-0 bg-[#F8FAFC]/80 backdrop-blur-xl z-30 border-b border-slate-100">
        <button 
          onClick={() => router.back()} 
          className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm active:scale-90 transition-all"
        >
          <FaArrowLeft size={14} className="text-slate-900" />
        </button>
        <StatusBadge status={order.status} />
      </div>

      <div className="px-6 space-y-6 pt-4">
        {/* En-tête du flux */}
        <header className="animate-in fade-in slide-in-from-top-4 duration-700">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">
            Commande n°{order.id}
          </p>
          <h1 className="text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
            Bon de flux
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{order.date}</p>
          </div>
        </header>

        {/* Composants Modulaires */}
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            <CustomerCard 
              name={order.customerName} 
              location={order.location} 
              phone={order.customerPhone} 
            />
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            <OrderSummary 
              items={order.items} 
              deliveryFee={order.deliveryFee} 
            />
        </div>

        {/* Bouton d'Action Logistique */}
        <div className="pt-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
            <button 
                onClick={handleNextStep}
                disabled={isUpdating || order.status === 'delivered'}
                className={`w-full py-6 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${
                    order.status === 'delivered' 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border border-slate-200' 
                        : 'bg-[#0F172A] text-white'
                }`}
            >
                {isUpdating ? (
                    <FaSpinner className="animate-spin" />
                ) : (
                    <>
                        {order.status === 'pending' && <><FaCheckCircle className="text-green-400" /> Confirmer la préparation</>}
                        {order.status === 'confirmed' && <><FaTruck className="text-blue-400" /> Mettre en livraison</>}
                        {order.status === 'delivering' && <><FaCheckCircle className="text-green-500" /> Valider la remise</>}
                        {order.status === 'delivered' && 'Transaction Terminée'}
                    </>
                )}
            </button>
            
            <button className="w-full mt-6 py-2 text-slate-300 font-black text-[9px] uppercase tracking-[0.2em] hover:text-slate-500 transition-colors">
                Générer le reçu PDF
            </button>
        </div>
      </div>
    </div>
  );
}
