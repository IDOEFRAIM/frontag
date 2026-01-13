'use client';

import React, { useState } from 'react';
import Link from 'next/link'; // 💡 Ajout de l'import Link
import { useForm } from 'react-hook-form';
import { 
    FaUsers, FaUserPlus, FaPhone, FaMapMarkerAlt, 
    FaEnvelope, FaCalendarAlt, FaDollarSign, FaSearch,
    FaPlus, FaChevronRight 
} from 'react-icons/fa';

// --- TYPES ---
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
    {
        id: 'CUST-003',
        name: 'Jean K.',
        phone: '+221 77 222 22 22',
        email: 'jean.k@client.com',
        location: 'Mermoz',
        totalOrders: 2,
        totalSpent: 21000,
        lastOrderDate: '12 Déc',
    },
];

// --- HELPERS ---
const formatCurrency = (amount: number) => {
    return amount.toLocaleString('fr-FR') + ' F';
};

// --- COMPOSANT DE LA PAGE ---

export default function ClientsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); // Pour le formulaire d'ajout

    // Logique de filtrage
    const filteredClients = mockClients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm)
    );

    // Fonction de simulation d'ajout
    const handleAddClient = (newClient: Omit<Client, 'id' | 'totalOrders' | 'totalSpent' | 'lastOrderDate'>) => {
        // En réalité, vous feriez ici un appel API POST
        alert(`Nouveau client ajouté (Simulé) : ${newClient.name}`);
        setIsModalOpen(false);
        // Dans une application réelle, mettez à jour l'état ou rechargez les données
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            
            {/* 1. HEADER */}
            <div className="bg-white p-4 sticky top-0 z-10 shadow-sm">
                <h1 className="text-2xl font-black text-gray-900 mb-1 flex items-center gap-2">
                    <FaUsers className="text-green-700" /> Gestion des Clients
                </h1>
                <p className="text-gray-500 text-sm">Base de données de vos acheteurs</p>
                
                {/* Bouton d'ajout */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-4 w-full py-3 bg-green-600 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 active:bg-green-700 transition-colors"
                >
                    <FaPlus /> Ajouter un Nouveau Client
                </button>
            </div>

            <div className="p-4 space-y-6">
                
                {/* 2. BARRE DE RECHERCHE */}
                <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher par nom, ID ou téléphone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full py-3 pl-10 pr-4 border border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500 transition-shadow"
                    />
                </div>

                {/* 3. LISTE DES CLIENTS */}
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    Clients ({filteredClients.length})
                </h2>

                <div className="space-y-4">
                    {filteredClients.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            <p>Aucun client trouvé pour "{searchTerm}".</p>
                        </div>
                    ) : (
                        filteredClients.map((client) => (
                            // 💡 Utilisation du composant Link pour la navigation
                            <Link 
                                key={client.id} 
                                href={`/clients/${client.id}`} // Lien vers la page de détails client
                                className="block bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex justify-between items-center transition-all hover:shadow-md active:scale-[0.99]"
                            >
                                <div className="flex flex-col">
                                    <span className="text-lg font-black text-gray-900">{client.name}</span>
                                    <span className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                        <FaMapMarkerAlt className="text-gray-400" /> {client.location}
                                    </span>
                                    <span className="text-xs text-green-700 mt-1 font-medium">
                                        {formatCurrency(client.totalSpent)} dépensés ({client.totalOrders} commandes)
                                    </span>
                                </div>

                                <FaChevronRight className="text-gray-300" />
                            </Link>
                        ))
                    )}
                </div>

            </div>

            {/* 4. MODALE D'AJOUT DE CLIENT */}
            {isModalOpen && (
                <ClientFormModal 
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleAddClient}
                />
            )}
        </div>
    );
}

// --- COMPOSANT MODAL DE FORMULAIRE ---

type ClientFormProps = {
    onClose: () => void;
    onSubmit: (client: Omit<Client, 'id' | 'totalOrders' | 'totalSpent' | 'lastOrderDate'>) => void;
};

type ClientFormData = {
    name: string;
    phone: string;
    email: string;
    location: string;
};

const ClientFormModal: React.FC<ClientFormProps> = ({ onClose, onSubmit }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<ClientFormData>();

    const onFormSubmit = (data: ClientFormData) => {
        onSubmit(data);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
            <div className="bg-white w-full p-6 rounded-t-2xl shadow-2xl animate-slide-up">
                
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <FaUserPlus className="text-green-600" /> Ajouter un Client
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-2xl">
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
                    
                    <InputGroup label="Nom Complet" icon={FaUsers} register={register} name="name" required error={errors.name} />
                    <InputGroup label="Téléphone" icon={FaPhone} register={register} name="phone" type="tel" required error={errors.phone} />
                    <InputGroup label="Email (Optionnel)" icon={FaEnvelope} register={register} name="email" type="email" />
                    <InputGroup label="Adresse / Localisation" icon={FaMapMarkerAlt} register={register} name="location" />
                    
                    <button 
                        type="submit" 
                        className="w-full py-3 bg-green-700 text-white font-bold rounded-xl shadow-lg mt-6 active:bg-green-800 transition-colors"
                    >
                        Enregistrer le Client
                    </button>
                </form>
            </div>
        </div>
    );
}

// Composant utilitaire pour les champs de formulaire
type InputGroupProps = {
    label: string;
    icon: React.ElementType;
    register: any;
    name: string;
    type?: string;
    required?: boolean;
    error?: any;
};

const InputGroup: React.FC<InputGroupProps> = ({ label, icon: Icon, register, name, type = 'text', required = false, error }) => (
    <div>
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
            <Icon className="text-green-600" /> {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            {...register(name, { required })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
        />
        {error && <span className="text-red-500 text-xs">Ce champ est requis</span>}
    </div>
);