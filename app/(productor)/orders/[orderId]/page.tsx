'use client';

import React, { use } from 'react'; // 1. Importer 'use'
import { 
  FaPhone, FaCheckCircle, FaTimesCircle, FaClock, 
  FaMapMarkerAlt, FaBox, FaChevronLeft, FaMotorcycle, FaTrashAlt, FaClipboardList 
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';

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

// --- DONNÉES FICTIVES ---
const mockOrders: Order[] = [
  {
    id: 'CMD-001',
    customerName: 'Moussa Diop',
    customerPhone: '+221 77 000 00 00',
    location: 'Marché central, Stand 42 (Zone A, Porte 3)',
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
    location: 'Restaurant "Chez Tanty", Rue 5 x Av. Bourguiba',
    date: 'Hier, 16:45',
    total: 5000,
    status: 'confirmed',
    items: [
      { name: 'Tomates fraîches', quantity: 10, unit: 'kg', price: 500 },
      { name: 'Oignons jaunes', quantity: 3, unit: 'kg', price: 300 },
      { name: 'Piments', quantity: 0.5, unit: 'kg', price: 1000 },
    ]
  },
  {
    id: 'CMD-003',
    customerName: 'Jean K.',
    customerPhone: '+221 77 222 22 22',
    location: 'Mermoz, Appartement 3B (Code: 1234)',
    date: '12 Déc, 08:00',
    total: 10500,
    status: 'delivered',
    items: [
      { name: 'Poulets fermiers', quantity: 3, unit: 'unite', price: 3500 },
    ]
  }
];

// --- COMPOSANT DE LA PAGE ---

// 2. Mise à jour du type des props : params est une Promise
export default function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const router = useRouter();
  
  // 3. Utilisation de React.use() pour déballer la Promise params
  const { orderId } = use(params);

  // Simuler la recherche de la commande par son ID
  const order = mockOrders.find(o => o.id === orderId);

  // --- HELPERS ---

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 text-sm font-bold px-3 py-1 rounded-full flex items-center gap-2"><FaClock /> EN ATTENTE</span>;
      case 'confirmed':
        return <span className="bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1 rounded-full flex items-center gap-2"><FaCheckCircle /> VALIDÉE</span>;
      case 'delivering':
        return <span className="bg-purple-100 text-purple-800 text-sm font-bold px-3 py-1 rounded-full flex items-center gap-2"><FaMotorcycle /> EN LIVRAISON</span>;
      case 'delivered':
        return <span className="bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full flex items-center gap-2"><FaCheckCircle /> LIVRÉE</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-800 text-sm font-bold px-3 py-1 rounded-full flex items-center gap-2"><FaTimesCircle /> ANNULÉE</span>;
    }
  };

  // --- LOGIQUE D'ACTION (simulée) ---
  const handleStatusChange = (newStatus: OrderStatus) => {
    if (!order) return;
    
    // Logique de mise à jour (dans un environnement réel: appel API)
    alert(`Statut de ${order.id} mis à jour : ${newStatus}`);
    
    // Simuler une redirection après annulation
    if (newStatus === 'cancelled') {
        router.push('/orders');
    }
  };

  if (!order) {
    return (
      <div className="p-6 text-center text-gray-500">
        <FaBox className="text-6xl mx-auto mb-4" />
        <h1 className="text-xl font-bold">Commande non trouvée</h1>
        <button onClick={() => router.back()} className="mt-4 text-green-700 flex items-center mx-auto">
            <FaChevronLeft className="mr-1" /> Retour aux commandes
        </button>
      </div>
    );
  }

  // Fonction pour afficher les boutons d'action
  const renderActionButtons = (currentStatus: OrderStatus) => {
    switch (currentStatus) {
      case 'pending':
        return (
          <>
            <button 
              onClick={() => handleStatusChange('cancelled')}
              className="flex-1 py-4 rounded-xl border-2 border-red-100 text-red-600 font-bold text-sm hover:bg-red-50 transition-colors"
            >
              <FaTimesCircle className="inline mr-2" /> Refuser & Annuler
            </button>
            <button 
              onClick={() => handleStatusChange('confirmed')}
              className="flex-1 py-4 rounded-xl bg-green-700 text-white font-bold text-sm shadow-md active:bg-green-800 transition-colors"
            >
              <FaCheckCircle className="inline mr-2" /> Accepter la Commande
            </button>
          </>
        );
      case 'confirmed':
        return (
          <button 
            onClick={() => handleStatusChange('delivering')}
            className="w-full py-4 rounded-xl bg-purple-600 text-white font-bold text-sm shadow-md flex justify-center items-center gap-2 active:bg-purple-700 transition-colors"
          >
            <FaMotorcycle /> Passer à la Livraison
          </button>
        );
      case 'delivering':
        return (
          <button 
            onClick={() => handleStatusChange('delivered')}
            className="w-full py-4 rounded-xl bg-gray-800 text-white font-bold text-sm shadow-md flex justify-center items-center gap-2 active:bg-black transition-colors"
          >
            <FaCheckCircle /> Confirmer comme Livrée
          </button>
        );
      default: // delivered ou cancelled
        return (
            <div className="flex justify-center items-center py-2 text-gray-500 text-sm">
                 <FaClipboardList className="mr-2" /> Statut final enregistré
            </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      
      {/* 1. HEADER & NAVIGATION */}
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm">
        <button 
          onClick={() => router.back()} 
          className="text-green-700 font-medium flex items-center mb-4 active:scale-95 transition-transform"
        >
          <FaChevronLeft className="mr-1" /> Retour
        </button>

        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-black text-gray-900 mb-1">#{order.id}</h1>
                <p className="text-gray-500 text-sm">{order.date}</p>
            </div>
            {getStatusBadge(order.status)}
        </div>
      </div>

      <div className="p-4 space-y-6">

        {/* 2. SECTION MONTANT TOTAL */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-green-600">
            <p className="text-sm font-medium text-gray-500">Montant Total de la Commande</p>
            <span className="block text-4xl font-extrabold text-gray-900 mt-1">
                {order.total.toLocaleString()} F
            </span>
        </div>

        {/* 3. DÉTAILS DU CLIENT ET LIVRAISON */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-green-600" /> Informations de Livraison
            </h2>

            <div className="space-y-4">
                {/* Client */}
                <div className="flex items-center justify-between border-b pb-3 border-gray-100">
                    <p className="text-sm text-gray-500 font-medium">Client</p>
                    <p className="text-base font-semibold text-gray-800">{order.customerName}</p>
                </div>

                {/* Téléphone */}
                <div className="flex items-center justify-between border-b pb-3 border-gray-100">
                    <p className="text-sm text-gray-500 font-medium">Téléphone</p>
                    <a 
                        href={`tel:${order.customerPhone}`} 
                        className="text-green-700 font-semibold flex items-center gap-2 active:scale-95 transition-transform"
                    >
                        {order.customerPhone} <FaPhone className="text-xs" />
                    </a>
                </div>

                {/* Adresse */}
                <div className="pt-2">
                    <p className="text-sm text-gray-500 font-medium mb-1">Adresse Complète</p>
                    <p className="text-base font-medium text-gray-800 leading-relaxed">{order.location}</p>
                </div>
            </div>
        </div>

        {/* 4. DÉTAILS DES ARTICLES */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaClipboardList className="text-green-600" /> Articles Commandés ({order.items.length})
            </h2>

            <div className="space-y-3">
                {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <div className="text-gray-900">
                            <span className="font-bold">{item.name}</span>
                            <span className="block text-xs text-gray-500">
                                {item.quantity} {item.unit} x {item.price.toLocaleString()} F
                            </span>
                        </div>
                        <span className="font-extrabold text-gray-800">
                            {(item.quantity * item.price).toLocaleString()} F
                        </span>
                    </div>
                ))}
            </div>
        </div>

        {/* 5. ZONE D'ACTION FLOTTANTE */}
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-2xl border-t border-gray-100">
            <div className={`flex gap-3 ${order.status === 'pending' ? 'justify-between' : 'justify-center'}`}>
                {renderActionButtons(order.status)}
            </div>
        </div>

      </div>
    </div>
  );
}