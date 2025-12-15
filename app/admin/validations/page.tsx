'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
    FaCheckCircle, FaFilter, FaUserPlus, FaBoxOpen, 
    FaSortAmountDownAlt, FaArrowUp, FaArrowDown, FaEye,
    FaSyncAlt
} from 'react-icons/fa';

// --- TYPES ---
type ValidationType = 'producer' | 'product' | 'update';

type ValidationItem = {
    id: string; // ID unique de la tâche de validation
    entityId: string; // ID de l'entité concernée (PROD-002 ou ITM-004)
    type: ValidationType;
    title: string; // Nom de l'entité
    producerName: string; // Nom du producteur impliqué
    submissionDate: string;
    priority: 'high' | 'medium' | 'low'; // Basé sur l'urgence ou le type
    status: 'pending' | 'resolved';
};

// --- DONNÉES FICTIVES ---
const mockValidations: ValidationItem[] = [
    {
        id: 'VAL-001',
        entityId: 'PROD-002',
        type: 'producer',
        title: 'Coopérative Niayes',
        producerName: 'Coopérative Niayes',
        submissionDate: '2025-12-15T10:00:00Z',
        priority: 'high',
        status: 'pending',
    },
    {
        id: 'VAL-002',
        entityId: 'ITM-004',
        type: 'product',
        title: 'Mangues Séchées',
        producerName: 'AgriTech X',
        submissionDate: '2025-12-14T15:30:00Z',
        priority: 'medium',
        status: 'pending',
    },
    {
        id: 'VAL-003',
        entityId: 'PROD-001',
        type: 'update',
        title: 'Mise à jour coordonnées bancaires',
        producerName: 'Ferme Bio Alpha',
        submissionDate: '2025-12-13T09:15:00Z',
        priority: 'high',
        status: 'pending',
    },
    {
        id: 'VAL-004',
        entityId: 'ITM-001',
        type: 'product',
        title: 'Tomates Fraîches',
        producerName: 'Ferme Bio Alpha',
        submissionDate: '2025-12-12T08:00:00Z',
        priority: 'low',
        status: 'resolved', // Exemple de tâche résolue
    },
];

// --- TYPES DE FILTRE ---
type SortKey = 'priority' | 'date';

// --- HELPERS ---

const getPriorityBadge = (priority: ValidationItem['priority']) => {
    switch (priority) {
        case 'high':
            return <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">URGENT</span>;
        case 'medium':
            return <span className="text-xs font-bold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded">MOYENNE</span>;
        case 'low':
            return <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">BASSE</span>;
    }
};

const getIconForType = (type: ValidationType) => {
    switch (type) {
        case 'producer':
            return <FaUserPlus className="text-blue-600 text-xl" />;
        case 'product':
            return <FaBoxOpen className="text-green-600 text-xl" />;
        case 'update':
            return <FaSyncAlt className="text-orange-600 text-xl" />;
    }
};

const getDestinationLink = (item: ValidationItem) => {
    switch (item.type) {
        case 'producer':
            return `/admin/producers/${item.entityId}`;
        case 'product':
            return `/admin/stock/${item.entityId}`;
        case 'update':
            // Pour l'exemple, on redirige vers le producteur pour vérifier la mise à jour
            return `/admin/producers/${item.entityId}`; 
    }
};

// --- COMPOSANT DE LA PAGE ---

export default function ValidationsPage() {
    const [filterType, setFilterType] = useState<ValidationType | 'all'>('all');
    const [filterStatus, setFilterStatus] = useState<'pending' | 'resolved' | 'all'>('pending');
    const [sortBy, setSortBy] = useState<SortKey>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // --- LOGIQUE DE FILTRAGE ET DE TRI ---
    const displayedValidations = useMemo(() => {
        let filtered = mockValidations;

        // 1. Filtrage par type
        if (filterType !== 'all') {
            filtered = filtered.filter(v => v.type === filterType);
        }

        // 2. Filtrage par statut de résolution
        if (filterStatus !== 'all') {
            filtered = filtered.filter(v => v.status === filterStatus);
        }

        // 3. Tri
        return filtered.sort((a, b) => {
            let comparison = 0;

            if (sortBy === 'priority') {
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
            } else if (sortBy === 'date') {
                const dateA = new Date(a.submissionDate).getTime();
                const dateB = new Date(b.submissionDate).getTime();
                comparison = dateA - dateB;
            }

            return sortOrder === 'asc' ? comparison : comparison * -1;
        });
    }, [filterType, filterStatus, sortBy, sortOrder]);


    // 4. Gestion du changement de tri
    const handleSortChange = (key: SortKey) => {
        if (sortBy === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(key);
            setSortOrder(key === 'priority' ? 'desc' : 'desc'); // Priorité par défaut: haute -> basse
        }
    };

    const SortIcon = ({ keyName }: { keyName: SortKey }) => {
        if (sortBy !== keyName) return <FaSortAmountDownAlt className="text-gray-400 text-xs" />;
        return sortOrder === 'asc' ? <FaArrowUp className="text-green-600 text-xs" /> : <FaArrowDown className="text-green-600 text-xs" />;
    };
    
    // Compte les tâches en attente
    const pendingCount = mockValidations.filter(v => v.status === 'pending').length;

    return (
        <div className="bg-gray-50 pb-6">
            
            {/* 1. HEADER */}
            <div className="bg-white p-4 sticky top-16 md:top-20 z-10 shadow-sm border-b border-gray-100">
                <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                    <FaCheckCircle className="text-red-600" /> Tâches de Validation
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    <span className="font-bold text-red-600">{pendingCount}</span> tâches en attente de votre action.
                </p>
            </div>

            <div className="p-4 space-y-6">

                {/* 2. FILTRES */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-3">
                    <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2"><FaFilter /> Filtrer par Type</h3>
                    <div className="flex space-x-2 overflow-x-auto pb-1">
                        {[
                            { value: 'all', label: 'Tout', icon: FaFilter },
                            { value: 'producer', label: 'Producteurs', icon: FaUserPlus },
                            { value: 'product', label: 'Produits', icon: FaBoxOpen },
                            { value: 'update', label: 'Mises à Jour', icon: FaSyncAlt },
                        ].map(({ value, label, icon: Icon }) => (
                            <button
                                key={value}
                                onClick={() => setFilterType(value as ValidationType | 'all')}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                                    filterType === value
                                        ? 'bg-green-700 text-white shadow-md'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                                }`}
                            >
                                <Icon className="text-xs" /> {label}
                            </button>
                        ))}
                    </div>
                    
                    <div className="flex justify-between pt-3 border-t border-gray-100">
                        {/* Filtre Statut de résolution */}
                        <div className="flex space-x-2">
                             <button
                                onClick={() => setFilterStatus('pending')}
                                className={`text-sm font-medium transition-colors ${filterStatus === 'pending' ? 'text-red-600 font-bold border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                En Attente
                            </button>
                             <button
                                onClick={() => setFilterStatus('resolved')}
                                className={`text-sm font-medium transition-colors ${filterStatus === 'resolved' ? 'text-green-600 font-bold border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Résolues
                            </button>
                             <button
                                onClick={() => setFilterStatus('all')}
                                className={`text-sm font-medium transition-colors ${filterStatus === 'all' ? 'text-blue-600 font-bold border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Toutes
                            </button>
                        </div>
                        
                        {/* Tri */}
                        <div className="flex items-center gap-3 text-xs font-medium text-gray-600">
                            <button onClick={() => handleSortChange('priority')} className="flex items-center gap-1 active:text-green-700 transition-colors">
                                Priorité <SortIcon keyName="priority" />
                            </button>
                            <button onClick={() => handleSortChange('date')} className="flex items-center gap-1 active:text-green-700 transition-colors">
                                Date <SortIcon keyName="date" />
                            </button>
                        </div>
                    </div>
                </div>


                {/* 3. LISTE DES TÂCHES */}
                <h2 className="text-lg font-bold text-gray-800">
                    Tâches affichées ({displayedValidations.length})
                </h2>

                <div className="space-y-4">
                    {displayedValidations.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            <p>Aucune tâche de validation ne correspond à ces filtres.</p>
                        </div>
                    ) : (
                        displayedValidations.map((item) => (
                            <Link 
                                key={item.id} 
                                href={getDestinationLink(item)}
                                className={`block bg-white rounded-2xl p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.99] border-l-4 ${item.status === 'pending' ? 'border-red-500' : 'border-green-500'}`}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-3">
                                        {getIconForType(item.type)}
                                        <div className="flex flex-col">
                                            <h3 className="text-base font-black text-gray-900 leading-tight">{item.title}</h3>
                                            <span className="text-xs text-gray-500">
                                                {item.type === 'producer' ? 'Nouveau compte' : `Producteur : ${item.producerName}`}
                                            </span>
                                        </div>
                                    </div>
                                    {getPriorityBadge(item.priority)}
                                </div>
                                
                                <div className="flex justify-between items-center text-xs pt-3 border-t border-gray-100 mt-2">
                                    <span className="text-gray-500">
                                        Soumis le: {new Date(item.submissionDate).toLocaleDateString('fr-FR')}
                                    </span>
                                    <span className="flex items-center text-green-700 font-bold">
                                        {item.status === 'pending' ? 'Examiner' : 'Vu'} <FaEye className="ml-1 text-sm" />
                                    </span>
                                </div>
                            </Link>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
}