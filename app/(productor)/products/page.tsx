'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  FaBox, 
  FaPlus, 
  FaEdit, 
  FaTrash,
  FaSearch,
  FaFilter,
  FaChevronLeft,
  FaChevronRight 
} from 'react-icons/fa';
import Image from 'next/image';

// --- Types de Données Simples ---
interface Product {
  id: string;
  name: string;
  category: 'Légumes' | 'Fruits' | 'Épicerie' | 'Boulangerie';
  image: string;
  stock: number;
  price: number;
  status: 'Actif' | 'Inactif' | 'Épuisé';
  updatedAt: string;
}

// --- Données Simples (À remplacer par l'API) ---
const mockProducts: Product[] = [
  { id: 'p001', name: 'Tomates Anciennes', category: 'Légumes', image: '/images/tomates.jpg', stock: 55, price: 3.50, status: 'Actif', updatedAt: '2025-12-14' },
  { id: 'p002', name: 'Miel de Lavande Bio', category: 'Épicerie', image: '/images/miel.jpg', stock: 12, price: 9.90, status: 'Actif', updatedAt: '2025-12-10' },
  { id: 'p003', name: 'Oeufs de Ferme (x6)', category: 'Épicerie', image: '/images/oeufs.jpg', stock: 0, price: 4.20, status: 'Épuisé', updatedAt: '2025-12-15' },
  { id: 'p004', name: 'Pommes Golden', category: 'Fruits', image: '/images/pommes.jpg', stock: 210, price: 2.10, status: 'Actif', updatedAt: '2025-12-08' },
  { id: 'p005', name: 'Pain au Levain', category: 'Boulangerie', image: '/images/pain.jpg', stock: 4, price: 5.50, status: 'Inactif', updatedAt: '2025-12-01' },
];

const ITEMS_PER_PAGE = 5;

// --- Composant Principal ---
export default function ProductorProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const categories = useMemo(() => {
    const cats = new Set(mockProducts.map(p => p.category));
    return ['Toutes', ...Array.from(cats)];
  }, []);

  // Logique de filtrage et recherche
  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => {
      // 1. Recherche par nom
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 2. Filtrage par catégorie
      const matchesCategory = filterCategory === '' || filterCategory === 'Toutes' || product.category === filterCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, filterCategory]);

  // Logique de pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, currentPage]);

  // --- Fonctions d'Action ---
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le produit : ${name} ? Cette action est irréversible.`)) {
      console.log(`Suppression du produit ${id}`);
      // Logique API ici
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* En-tête de la Page */}
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <FaBox className="text-green-600"/> Mes Produits
        </h1>
        <Link 
          href="/products/add" 
          className="flex items-center gap-2 bg-green-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-md"
        >
          <FaPlus /> Ajouter un Produit
        </Link>
      </div>

      {/* Barre de Filtre et Recherche */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        
        {/* Recherche */}
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Réinitialiser la page à la recherche
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        {/* Filtre Catégorie */}
        <div className="relative">
          <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value);
              setCurrentPage(1); // Réinitialiser la page au changement de filtre
            }}
            className="appearance-none w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg bg-white focus:ring-green-500 focus:border-green-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat === 'Toutes' ? '' : cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tableau des Produits */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  
                  {/* Produit (Nom) */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  
                  {/* Catégorie */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.category}
                  </td>

                  {/* Prix */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                    {product.price.toFixed(2)} €
                  </td>
                  
                  {/* Stock */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.stock}
                  </td>
                  
                  {/* Statut */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.status === 'Actif' ? 'bg-green-100 text-green-800' :
                      product.status === 'Inactif' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link href={`/products/${product.id}/edit`} title="Modifier" className="text-indigo-600 hover:text-indigo-900 p-2 rounded-md hover:bg-gray-100">
                      <FaEdit size={16} />
                    </Link>
                    <button title="Supprimer" onClick={() => handleDelete(product.id, product.name)} className="text-red-600 hover:text-red-900 p-2 rounded-md hover:bg-gray-100">
                      <FaTrash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {paginatedProducts.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              Aucun produit trouvé.
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {filteredProducts.length > ITEMS_PER_PAGE && (
          <div className="px-6 py-3 bg-gray-50 flex justify-between items-center border-t border-gray-200">
            <p className="text-sm text-gray-700">
              Affichage de {((currentPage - 1) * ITEMS_PER_PAGE) + 1} à {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} sur {filteredProducts.length} résultats
            </p>
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                <FaChevronLeft size={14} />
              </button>
              
              <span className="text-sm font-medium">Page {currentPage} / {totalPages}</span>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                <FaChevronRight size={14} />
              </button>
            </nav>
          </div>
        )}

      </div>

    </div>
  );
}