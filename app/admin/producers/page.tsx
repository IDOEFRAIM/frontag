'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
    FaUsers, FaUserCheck, FaUserTimes, FaSearch, 
    FaEye, FaMapMarkerAlt, FaPhone, FaChevronRight,
    FaArrowUp, FaArrowDown, FaSort
} from 'react-icons/fa';

// --- TYPES ---
type ProducerStatus = 'active' | 'pending' | 'suspended';

type Producer = {
    id: string;
    name: string;
    location: string;
    email: string;
    phone: string;
    status: ProducerStatus;
    productsCount: number;
    totalOrders: number;
    registrationDate: string;
};

// --- DONNÉES FICTIVES ---
const mockProducers: Producer[] = [
    {
        id: 'PROD-001',
        name: 'Ferme Bio Alpha',
        location: 'Thiès, Zone Agricole',
        email: 'alpha@ferme.com',
        phone: '+221 77 987 65 43',
        status: 'active',
        productsCount: 15,
        totalOrders: 120,
        registrationDate: '12/01/2024',
    },
    {
        id: 'PROD-002',
        name: 'Coopérative Niayes',
        location: 'Dakar, Grande Niaye',
        email: 'niayes@coop.org',
        phone: '+221 70 123 45 67',
        status: 'pending',
        productsCount: 0,
        totalOrders: 0,
        registrationDate: '25/11/2025',
    },
    {
        id: 'PROD-003',
        name: 'Jardin de Mariama',
        location: 'Mbour, Quartier Sud',
        email: 'mariama@jardin.net',
        phone: '+221 77 555 55 55',
        status: 'active',
        productsCount: 8,
        totalOrders: 55,
        registrationDate: '01/08/2025',
    },
    {
        id: 'PROD-004',
        name: 'AgriTech X',
        location: 'Rufisque, Pépinière',
        email: 'agritechx@prod.com',
        phone: '+221 77 999 99 99',
        status: 'suspended',
        productsCount: 2,
        totalOrders: 1,
        registrationDate: '15/03/2024',
    },
];

// --- HELPERS ---

const getStatusBadge = (status: ProducerStatus) => {
    switch (status) {
        case 'active':
            return <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1"><FaUserCheck /> Actif</span>;
        case 'pending':
            return <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1"><FaEye /> En Attente</span>;
        case 'suspended':
            return <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1"><FaUserTimes /> Suspendu</span>;
    }
};

// --- COMPOSANT DE LA PAGE ---

export default function ProducersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'orders' | 'date'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // 1. Logique de Filtrage
    const filteredProducers = mockProducers.filter(producer =>
        producer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producer.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 2. Logique de Tri
    const sortedProducers = [...filteredProducers].sort((a, b) => {
        let comparison = 0;

        if (sortBy === 'name') {
            comparison = a.name.localeCompare(b.name);
        } else if (sortBy === 'orders') {
            comparison = a.totalOrders - b.totalOrders;
        } else if (sortBy === 'date') {
            // Conversion simple de date pour le tri
            const dateA = new Date(a.registrationDate.split('/').reverse().join('-')).getTime();
            const dateB = new Date(b.registrationDate.split('/').reverse().join('-')).getTime();
            comparison = dateA - dateB;
        }

        return sortOrder === 'asc' ? comparison : comparison * -1;
    });

    // 3. Gestion du changement de tri
    const handleSortChange = (key: 'name' | 'orders' | 'date') => {
        if (sortBy === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(key);
            setSortOrder('desc'); // Par défaut, trier les noms en A-Z, les chiffres en plus grand d'abord.
        }
    };

    const SortIcon = ({ keyName }: { keyName: 'name' | 'orders' | 'date' }) => {
        if (sortBy !== keyName) return <FaSort className="text-gray-400 text-xs" />;
        return sortOrder === 'asc' ? <FaArrowUp className="text-green-600 text-xs" /> : <FaArrowDown className="text-green-600 text-xs" />;
    };

    return (
        <div className="bg-gray-50 pb-6">
            
            {/* 1. HEADER */}
            <div className="bg-white p-4 sticky top-16 md:top-0 z-10 shadow-sm border-b border-gray-100">
                <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                    <FaUsers className="text-green-700" /> Gestion des Producteurs
                </h1>
                <p className="text-gray-500 text-sm mt-1">Total: {mockProducers.length} comptes</p>
                
                {/* Barre de Recherche */}
                <div className="relative mt-4">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher par nom, ID ou localisation..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full py-3 pl-10 pr-4 border border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500 transition-shadow"
                    />
                </div>
            </div>

            <div className="p-4 space-y-6">

                {/* 2. BARRE DE TRI (Mobile - Affiché en haut de la liste) */}
                <div className="flex justify-around bg-white p-3 rounded-xl shadow-sm text-xs font-medium text-gray-600">
                    <button onClick={() => handleSortChange('name')} className="flex items-center gap-1 active:text-green-700 transition-colors">
                        Nom <SortIcon keyName="name" />
                    </button>
                    <button onClick={() => handleSortChange('orders')} className="flex items-center gap-1 active:text-green-700 transition-colors">
                        Commandes <SortIcon keyName="orders" />
                    </button>
                    <button onClick={() => handleSortChange('date')} className="flex items-center gap-1 active:text-green-700 transition-colors">
                        Inscription <SortIcon keyName="date" />
                    </button>
                </div>

                {/* 3. LISTE DES PRODUCTEURS */}
                <h2 className="text-lg font-bold text-gray-800">
                    Résultats ({sortedProducers.length})
                </h2>

                <div className="space-y-4">
                    {sortedProducers.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            <p>Aucun producteur trouvé pour "{searchTerm}".</p>
                        </div>
                    ) : (
                        sortedProducers.map((producer) => (
                            // Idéalement, ceci devrait naviguer vers /admin/producers/[producerId]
                            <Link 
                                key={producer.id} 
                                href={`/admin/producers/${producer.id}`}
                                className="block bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transition-all hover:shadow-md active:scale-[0.99]"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-black text-gray-900">{producer.name}</h3>
                                    {getStatusBadge(producer.status)}
                                </div>
                                
                                <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                                    <FaMapMarkerAlt className="text-gray-400" /> {producer.location}
                                </p>
                                <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                                    <FaPhone className="text-gray-400" /> {producer.phone}
                                </p>

                                <div className="flex justify-between items-center text-sm pt-3 border-t border-gray-100">
                                    <div>
                                        <p className="text-gray-800 font-bold">{producer.productsCount}</p>
                                        <span className="text-xs text-gray-500">Produits en stock</span>
                                    </div>
                                    <div>
                                        <p className="text-gray-800 font-bold">{producer.totalOrders}</p>
                                        <span className="text-xs text-gray-500">Commandes gérées</span>
                                    </div>
                                    <FaChevronRight className="text-gray-300" />
                                </div>
                            </Link>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
}