'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
    FaWarehouse, FaSearch, FaFilter, FaArrowUp, 
    FaArrowDown, FaSort, FaBoxOpen, FaUser
} from 'react-icons/fa';

// --- TYPES ---
type ProductStatus = 'live' | 'archived' | 'draft' | 'pending';

type ProductItem = {
    id: string;
    name: string;
    producerId: string;
    producerName: string;
    stockLevel: number; // Quantité en stock
    price: number;
    unit: string;
    status: ProductStatus;
    lastUpdate: string;
};

// --- DONNÉES FICTIVES ---
const mockProducts: ProductItem[] = [
    {
        id: 'ITM-001',
        name: 'Tomates Fraîches',
        producerId: 'PROD-001',
        producerName: 'Ferme Bio Alpha',
        stockLevel: 150,
        price: 500,
        unit: 'Kg',
        status: 'live',
        lastUpdate: 'Aujourd\'hui',
    },
    {
        id: 'ITM-002',
        name: 'Sacs de Maïs',
        producerId: 'PROD-001',
        producerName: 'Ferme Bio Alpha',
        stockLevel: 50,
        price: 12500,
        unit: 'Sac',
        status: 'live',
        lastUpdate: 'Hier',
    },
    {
        id: 'ITM-003',
        name: 'Oignons Rouges (Gros)',
        producerId: 'PROD-003',
        producerName: 'Jardin de Mariama',
        stockLevel: 0, // Épuisé
        price: 600,
        unit: 'Kg',
        status: 'archived',
        lastUpdate: '01/12/2025',
    },
    {
        id: 'ITM-004',
        name: 'Mangues Séchées',
        producerId: 'PROD-004',
        producerName: 'AgriTech X',
        stockLevel: 20,
        price: 1500,
        unit: 'sachet',
        status: 'pending', // En attente de validation
        lastUpdate: '05/12/2025',
    },
    {
        id: 'ITM-005',
        name: 'Piment du Sahel',
        producerId: 'PROD-003',
        producerName: 'Jardin de Mariama',
        stockLevel: 5,
        price: 1000,
        unit: 'Kg',
        status: 'live',
        lastUpdate: 'Aujourd\'hui',
    },
];

// --- TYPES DE FILTRE ---
type SortKey = 'name' | 'stock' | 'price' | 'update';
type FilterStatus = 'all' | ProductStatus;

// --- HELPERS ---
const formatCurrency = (amount: number) => amount.toLocaleString('fr-FR') + ' F';

const getStatusBadge = (status: ProductStatus) => {
    switch (status) {
        case 'live':
            return <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">En Ligne</span>;
        case 'pending':
            return <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">À Valider</span>;
        case 'archived':
            return <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">Épuisé/Archivé</span>;
        case 'draft':
            return <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">Brouillon</span>;
    }
};

// --- COMPOSANT DE LA PAGE ---

export default function StockPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    const [sortBy, setSortBy] = useState<SortKey>('update');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // --- LOGIQUE DE FILTRAGE ET DE TRI ---
    const displayedProducts = useMemo(() => {
        let filtered = mockProducts;

        // 1. Filtrage par terme de recherche
        if (searchTerm) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.producerName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // 2. Filtrage par statut
        if (filterStatus !== 'all') {
            filtered = filtered.filter(p => p.status === filterStatus);
        }

        // 3. Tri
        return filtered.sort((a, b) => {
            let comparison = 0;

            if (sortBy === 'name') {
                comparison = a.name.localeCompare(b.name);
            } else if (sortBy === 'stock') {
                comparison = a.stockLevel - b.stockLevel;
            } else if (sortBy === 'price') {
                comparison = a.price - b.price;
            } 
            // Tri par date simple (ici, on ne gère pas la date, on se base sur l'ID pour simuler)
            else if (sortBy === 'update') { 
                comparison = a.id.localeCompare(b.id);
            }

            return sortOrder === 'asc' ? comparison : comparison * -1;
        });
    }, [searchTerm, filterStatus, sortBy, sortOrder]);


    // 4. Gestion du changement de tri
    const handleSortChange = (key: SortKey) => {
        if (sortBy === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(key);
            setSortOrder('desc'); 
        }
    };

    const SortIcon = ({ keyName }: { keyName: SortKey }) => {
        if (sortBy !== keyName) return <FaSort className="text-gray-400 text-xs" />;
        return sortOrder === 'asc' ? <FaArrowUp className="text-green-600 text-xs" /> : <FaArrowDown className="text-green-600 text-xs" />;
    };


    return (
        <div className="bg-gray-50 pb-6">
            
            {/* 1. HEADER & RECHERCHE */}
            <div className="bg-white p-4 sticky top-16 md:top-20 z-10 shadow-sm border-b border-gray-100">
                <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                    <FaWarehouse className="text-green-700" /> Gestion des Stocks
                </h1>
                <p className="text-gray-500 text-sm mt-1">Supervision du catalogue et des niveaux de stock.</p>
                
                {/* Barre de Recherche */}
                <div className="relative mt-4">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher produit ou producteur..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full py-3 pl-10 pr-4 border border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500 transition-shadow"
                    />
                </div>
            </div>

            <div className="p-4 space-y-6">

                {/* 2. FILTRES STATUT ET TRI */}
                <div className="space-y-4">
                    
                    {/* Filtre par statut */}
                    <div className="flex space-x-2 overflow-x-auto pb-1">
                        {[
                            { value: 'all', label: 'Tous', icon: FaBoxOpen },
                            { value: 'live', label: 'En Ligne', icon: FaArrowUp },
                            { value: 'pending', label: 'À Valider', icon: FaFilter },
                            { value: 'archived', label: 'Épuisé/Archivé', icon: FaBoxOpen },
                        ].map(({ value, label, icon: Icon }) => (
                            <button
                                key={value}
                                onClick={() => setFilterStatus(value as FilterStatus)}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                                    filterStatus === value
                                        ? 'bg-green-700 text-white shadow-md'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                                }`}
                            >
                                <Icon className="text-xs" /> {label}
                            </button>
                        ))}
                    </div>

                    {/* Barre de Tri */}
                    <div className="flex justify-around bg-white p-3 rounded-xl shadow-sm text-xs font-medium text-gray-600 border border-gray-100">
                        <button onClick={() => handleSortChange('name')} className="flex items-center gap-1 active:text-green-700 transition-colors">
                            Produit <SortIcon keyName="name" />
                        </button>
                        <button onClick={() => handleSortChange('stock')} className="flex items-center gap-1 active:text-green-700 transition-colors">
                            Stock <SortIcon keyName="stock" />
                        </button>
                        <button onClick={() => handleSortChange('price')} className="flex items-center gap-1 active:text-green-700 transition-colors">
                            Prix <SortIcon keyName="price" />
                        </button>
                    </div>
                </div>

                {/* 3. LISTE DES PRODUITS */}
                <h2 className="text-lg font-bold text-gray-800">
                    Résultats ({displayedProducts.length})
                </h2>

                <div className="space-y-4">
                    {displayedProducts.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            <p>Aucun produit ne correspond à ces critères de recherche/filtre.</p>
                        </div>
                    ) : (
                        displayedProducts.map((item) => (
                            // Lien vers les détails du produit
                            <Link 
                                key={item.id} 
                                href={`/admin/stock/${item.id}`} 
                                className="block bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transition-all hover:shadow-md active:scale-[0.99]"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-lg font-black text-gray-900">{item.name}</h3>
                                    {getStatusBadge(item.status)}
                                </div>
                                
                                <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100">
                                    {/* Info Producteur */}
                                    <div className="flex items-center text-gray-600">
                                        <FaUser className="text-xs mr-2" />
                                        <Link href={`/admin/producers/${item.producerId}`} className="text-green-700 hover:underline font-medium text-xs">
                                            {item.producerName}
                                        </Link>
                                    </div>

                                    {/* Stock et Prix */}
                                    <div className="text-right space-y-1">
                                        <p className="text-gray-800 font-bold">
                                            {item.stockLevel} {item.unit}
                                        </p>
                                        <span className={`text-xs ${item.stockLevel === 0 ? 'text-red-500' : 'text-gray-500'}`}>
                                            {formatCurrency(item.price)}/{item.unit}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
}