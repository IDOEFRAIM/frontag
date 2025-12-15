'use client';

import React, { use } from 'react'; // 1. Import de 'use'
import { useRouter } from 'next/navigation';
import { 
    FaUserCircle, FaPhone, FaMapMarkerAlt, FaEnvelope, 
    FaShoppingCart, FaHistory, FaCalendarAlt, FaDollarSign,
    FaChevronLeft, FaTrashAlt
} from 'react-icons/fa';

// --- TYPES (Cohérence) ---
type Client = {
    id: string;
    name: string;
    phone: string;
    email: string;
    location: string;
    totalOrders: number;
    totalSpent: number;
    lastOrderDate: string;
};

type ClientOrder = {
    id: string;
    date: string;
    total: number;
    status: 'delivered' | 'cancelled';
};

// --- DONNÉES FICTIVES ---
const mockClients: Client[] = [
    {
        id: 'CUST-001',
        name: 'Moussa Diop',
        phone: '+221 77 000 00 00',
        email: 'moussa.d@email.com',
        location: 'Marché central, Stand 42',
        totalOrders: 5,
        totalSpent: 125000,
        lastOrderDate: 'Aujourd\'hui',
    },
    {
        id: 'CUST-002',
        name: 'Amina Sow',
        phone: '+221 77 111 11 11',
        email: 'amina.sow@resto.net',
        location: 'Restaurant "Chez Tanty"',
        totalOrders: 18,
        totalSpent: 450000,
        lastOrderDate: 'Hier',
    },
];

// Historique simulé pour le client 002 (Amina Sow)
const mockClientOrders: ClientOrder[] = [
    { id: 'CMD-003', date: '12 Déc 2025', total: 10500, status: 'delivered' },
    { id: 'CMD-004', date: '10 Déc 2025', total: 5000, status: 'delivered' },
    { id: 'CMD-005', date: '05 Déc 2025', total: 25000, status: 'cancelled' },
];

// --- HELPERS ---
const formatCurrency = (amount: number) => {
    return amount.toLocaleString('fr-FR') + ' F';
};

// --- COMPOSANT DE LA PAGE ---

// 2. Mise à jour du type des props : params est une Promise
export default function ClientDetailPage({ params }: { params: Promise<{ clientId: string }> }) {
    const router = useRouter();
    
    // 3. Utilisation de React.use() pour déballer la Promise params
    const { clientId } = use(params);

    // Simuler la recherche du client
    const client = mockClients.find(c => c.id === clientId);

    // Fonction de simulation de suppression
    const handleDeleteClient = () => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer le client ${client?.name} ? Cette action est irréversible.`)) {
            // Logique de suppression (Appel API DELETE)
            alert(`Client ${client?.name} (ID: ${clientId}) supprimé (Simulé).`);
            router.push('/clients');
        }
    };

    if (!client) {
        return (
            <div className="p-6 text-center text-gray-500">
                <FaUserCircle className="text-6xl mx-auto mb-4" />
                <h1 className="text-xl font-bold">Client non trouvé</h1>
                <button onClick={() => router.back()} className="mt-4 text-green-700 flex items-center mx-auto">
                    <FaChevronLeft className="mr-1" /> Retour à la liste
                </button>
            </div>
        );
    }

    // Données réelles des commandes (simulées par l'ID)
    const clientOrders = clientId === 'CUST-002' ? mockClientOrders : [];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            
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
                        <h1 className="text-3xl font-black text-gray-900">{client.name}</h1>
                        <p className="text-gray-500 text-sm">ID: {client.id}</p>
                    </div>
                    
                    {/* Bouton de Suppression */}
                    <button 
                        onClick={handleDeleteClient}
                        className="bg-red-100 text-red-600 p-3 rounded-full hover:bg-red-200 transition-colors active:scale-95"
                        aria-label="Supprimer le client"
                    >
                        <FaTrashAlt />
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-6">

                {/* 2. STATISTIQUES CLÉS */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                        <FaShoppingCart className="text-2xl text-green-600 mx-auto mb-1" />
                        <span className="block text-2xl font-black text-gray-900">{client.totalOrders}</span>
                        <p className="text-xs text-gray-500">Commandes</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                        <FaDollarSign className="text-2xl text-green-600 mx-auto mb-1" />
                        <span className="block text-2xl font-black text-gray-900">{formatCurrency(client.totalSpent)}</span>
                        <p className="text-xs text-gray-500">Dépensé au total</p>
                    </div>
                </div>

                {/* 3. COORDONNÉES ET INFOS */}
                <div className="bg-white p-5 rounded-2xl shadow-sm space-y-4">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <FaUserCircle className="text-green-600" /> Coordonnées
                    </h2>
                    
                    <InfoRow icon={FaPhone} label="Téléphone" value={client.phone} isLink={`tel:${client.phone}`} />
                    <InfoRow icon={FaEnvelope} label="Email" value={client.email || 'Non renseigné'} isLink={`mailto:${client.email}`} />
                    <InfoRow icon={FaMapMarkerAlt} label="Localisation" value={client.location} />
                    <InfoRow icon={FaCalendarAlt} label="Dernière commande" value={client.lastOrderDate} />
                </div>

                {/* 4. HISTORIQUE DES COMMANDES */}
                <div className="bg-white p-5 rounded-2xl shadow-sm">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <FaHistory className="text-green-600" /> Historique ({clientOrders.length})
                        </span>
                    </h2>

                    <div className="space-y-3">
                        {clientOrders.length > 0 ? (
                            clientOrders.map((order) => (
                                <div key={order.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                                    <div className="text-gray-900">
                                        <span className="font-bold">Commande #{order.id}</span>
                                        <span className="block text-xs text-gray-500">{order.date}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-bold text-gray-800 block">{formatCurrency(order.total)}</span>
                                        <span className={`text-xs font-medium ${order.status === 'cancelled' ? 'text-red-500' : 'text-green-500'}`}>
                                            {order.status === 'cancelled' ? 'Annulée' : 'Livrée'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-5 text-gray-500 text-sm">
                                Aucune commande livrée enregistrée pour ce client.
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

// Composant utilitaire pour afficher les informations de ligne
type InfoRowProps = {
    icon: React.ElementType;
    label: string;
    value: string;
    isLink?: string;
};

const InfoRow: React.FC<InfoRowProps> = ({ icon: Icon, label, value, isLink }) => (
    <div className="flex items-center border-b pb-3 border-gray-100 last:border-b-0">
        <Icon className="text-lg text-gray-400 w-8" />
        <div className="flex-1">
            <p className="text-sm text-gray-500">{label}</p>
            {isLink ? (
                <a 
                    href={isLink} 
                    className="text-base font-semibold text-green-700 hover:underline"
                >
                    {value}
                </a>
            ) : (
                <p className="text-base font-semibold text-gray-800">{value}</p>
            )}
        </div>
    </div>
);