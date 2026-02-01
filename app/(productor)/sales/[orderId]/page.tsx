'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaSpinner, FaSearch, FaCheckCircle, FaTruck } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';

// Tes composants réutilisables (Vérifie bien l'orthographe des fichiers)
import { StatusBadge } from '@/components/orders/statusCard';
import { CustomerCard } from '@/components/orders/customerCard';
import { OrderSummary } from '@/components/orders/orderSummary';

export default function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const router = useRouter();
  const { user } = useAuth();

  const [order, setOrder] = useState<any>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [isUpdating, setIsUpdating] = useState(false);

  // --- CHARGEMENT DYNAMIQUE ---
  useEffect(() => {
    const fetchOrder = async () => {
        if (!user?.id) return;
        setStatus('loading');
        try {
            const res = await fetch(`/api/orders/${orderId}?userId=${user.id}`);
            if (res.ok) {
                const data = await res.json();
                // Formater la date
                data.date = new Date(data.date).toLocaleDateString('fr-FR', {
                    weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
                });
                setOrder(data);
                setStatus('ready');
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };
    
    fetchOrder();
  }, [orderId, user]);

  // --- LOGIQUE DE CHANGEMENT DE STATUT ---
  const handleNextStep = async () => {
    setIsUpdating(true);
    
    const nextMap: Record<string, string> = {
        'pending': 'confirmed',
        'confirmed': 'delivering',
        'delivering': 'delivered'
    };
    
    const nextStatus = nextMap[order.status];
    if (!nextStatus) return;

    try {
        const res = await fetch(`/api/orders/${orderId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: nextStatus })
        });

        if (res.ok) {
             setOrder({ ...order, status: nextStatus });
        }
    } catch (error) {
        console.error("Failed to update status", error);
    } finally {
        setIsUpdating(false);
    }
  };

  // --- UI : ÉCRAN DE CHARGEMENT ---
  if (status === 'loading') return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#F7F5EE]">
      <div className="relative">
        <FaSpinner className="animate-spin text-4xl text-[#497A3A]" />
      </div>
      <p className="mt-6 text-[10px] font-bold text-[#7C795D] uppercase tracking-[0.4em]">Chargement...</p>
    </div>
  );

  // --- UI : ÉCRAN D'ERREUR ---
  if (status === 'error') return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-[#F7F5EE]">
      <div className="w-20 h-20 bg-[#f9edec] rounded-[2rem] flex items-center justify-center mb-6 border border-red-100 shadow-inner">
        <FaSearch className="text-red-300 text-2xl" />
      </div>
      <h1 className="text-3xl font-black text-[#5B4636] uppercase tracking-tight leading-none mb-4">
        ID Inconnu
      </h1>
      <p className="text-[#7C795D] text-[10px] font-bold uppercase tracking-widest mb-10 leading-relaxed max-w-[200px]">
        La commande <span className="text-red-400">{orderId}</span> n'existe pas.
      </p>
      <button 
        onClick={() => router.push('/sales')}
        className="w-full max-w-xs bg-[#5B4636] text-white py-5 rounded-[2rem] font-bold text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#497A3A] transition-all"
      >
        Retour au flux global
      </button>
    </div>
  );

  // --- UI : RENDU FINAL ---
  return (
    <div className="min-h-screen bg-[#F7F5EE] pb-12">
      {/* Barre de navigation haute */}
      <div className="p-6 flex items-center justify-between sticky top-0 bg-[#F7F5EE]/90 backdrop-blur-xl z-30 border-b border-[#E0E0D1]">
        <button 
          onClick={() => router.back()} 
          className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-[#E0E0D1] shadow-sm active:scale-95 transition-all text-[#5B4636]"
        >
          <FaArrowLeft size={14} />
        </button>
        {/* Passer le status en minscule pour matcher le composant si besoin, ou s'assurer que l'API renvoie lowercase */}
        <StatusBadge status={order.status} />
      </div>

      <div className="px-6 space-y-6 pt-4">
        {/* En-tête du flux */}
        <header className="animate-in fade-in slide-in-from-top-4 duration-700">
          <p className="text-[10px] font-bold text-[#A4A291] uppercase tracking-widest mb-1">
            Commande n°{order.id.substring(0, 8)}...
          </p>
          <h1 className="text-4xl font-black text-[#5B4636] uppercase tracking-tight leading-none">
            Détails
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${order.status === 'delivered' ? 'bg-green-500' : 'bg-[#497A3A]'}`} />
            <p className="text-[10px] font-bold text-[#7C795D] uppercase tracking-tight">{order.date}</p>
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
                className={`w-full py-6 rounded-3xl font-bold text-[11px] uppercase tracking-[0.3em] shadow-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${
                    order.status === 'delivered' 
                        ? 'bg-[#E0E0D1] text-[#A4A291] cursor-not-allowed shadow-none border border-[#E0E0D1]' 
                        : 'bg-[#5B4636] text-white hover:bg-[#497A3A]'
                }`}
            >
                {isUpdating ? (
                    <FaSpinner className="animate-spin" />
                ) : (
                    <>
                        {order.status === 'pending' && <><FaCheckCircle className="text-green-200" /> Confirmer la préparation</>}
                        {order.status === 'confirmed' && <><FaTruck className="text-blue-200" /> Mettre en livraison</>}
                        {order.status === 'delivering' && <><FaCheckCircle className="text-green-200" /> Valider la remise</>}
                        {order.status === 'delivered' && 'Transaction Terminée'}
                    </>
                )}
            </button>
            
            <button className="w-full mt-6 py-2 text-[#A4A291] font-bold text-[9px] uppercase tracking-[0.2em] hover:text-[#5B4636] transition-colors">
                Générer le reçu PDF
            </button>
        </div>
      </div>
    </div>
  );
}
