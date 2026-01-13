'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { getMyProducts, deleteProduct } from '@/services/producer.service';
import { 
  FaPlus, FaEdit, FaTrash, FaShareAlt, FaBoxOpen, FaWhatsapp, FaSearch, FaFilter
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function ProducerCatalogue() {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (user?.id) {
      loadProducts();
    }
  }, [user?.id]);

  const loadProducts = async () => {
    if (!user?.id) return;
    const res = await getMyProducts(user.id);
    if (res.success && res.data) {
      setProducts(res.data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment retirer ce produit du catalogue ?")) return;
    
    if (!user?.id) return;
    const res = await deleteProduct(id, user.id);
    if (res.success) {
      toast.success("Produit retiré");
      loadProducts();
    } else {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleShare = (product: any) => {
    const text = `Découvrez mon produit *${product.categoryLabel}* à ${product.price} FCFA sur Vital Engine !`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const filteredProducts = products.filter(p => 
    p.categoryLabel.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 bg-slate-200 rounded-full mb-4"></div>
        <div className="h-4 w-32 bg-slate-200 rounded"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-8 font-sans pb-24">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">
            Mon Catalogue
          </h1>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">
            Vos produits en vente
          </p>
        </div>

        <Link 
          href="/products/add"
          className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-4 rounded-2xl font-black uppercase text-xs hover:bg-green-700 transition-all shadow-lg shadow-green-200 hover:scale-105"
        >
          <FaPlus /> Nouveau Produit
        </Link>
      </div>

      {/* SEARCH & FILTER */}
      <div className="bg-white p-2 rounded-[1.5rem] shadow-sm border border-slate-100 mb-8 flex items-center gap-2 max-w-md">
        <div className="p-3 bg-slate-50 rounded-full text-slate-400">
            <FaSearch />
        </div>
        <input 
            type="text" 
            placeholder="Rechercher un produit..." 
            className="flex-1 bg-transparent font-bold text-slate-700 outline-none placeholder:text-slate-300"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {/* GRID */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
              
              {/* Status Badge */}
              <div className="absolute top-6 right-6 z-10">
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                    product.quantityForSale > 0 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                    {product.quantityForSale > 0 ? 'En Vente' : 'Épuisé'}
                </span>
              </div>

              {/* Image / Icon Placeholder */}
              <div className="h-40 bg-slate-50 rounded-[2rem] mb-6 flex items-center justify-center relative overflow-hidden">
                {product.images && product.images.length > 0 ? (
                    <img src={product.images[0]} alt={product.categoryLabel} className="w-full h-full object-cover" />
                ) : (
                    <FaBoxOpen className="text-6xl text-slate-200" />
                )}
                
                {/* Price Tag Overlay */}
                <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm text-white px-4 py-2 rounded-xl">
                    <span className="text-lg font-black tracking-tighter">{product.price} <span className="text-xs font-normal text-slate-300">FCFA</span></span>
                </div>
              </div>

              {/* Content */}
              <div className="mb-6">
                <h3 className="text-xl font-black text-slate-900 italic leading-tight mb-1">
                    {product.categoryLabel}
                </h3>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">
                    Stock: {product.quantityForSale} {product.unit}
                </p>
                {product.localNames && (
                    <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar">
                        {Object.entries(product.localNames).map(([lang, name]: any) => (
                            <span key={lang} className="text-[9px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md uppercase">
                                {lang}: {name}
                            </span>
                        ))}
                    </div>
                )}
              </div>

              {/* Actions */}
              <div className="grid grid-cols-3 gap-2">
                <Link 
                    href={`/products/${product.id}`}
                    className="py-3 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-colors"
                    title="Modifier"
                >
                    <FaEdit />
                </Link>
                <button 
                    onClick={() => handleShare(product)}
                    className="py-3 rounded-xl bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors"
                    title="Partager sur WhatsApp"
                >
                    <FaWhatsapp size={18} />
                </button>
                <button 
                    onClick={() => handleDelete(product.id)}
                    className="py-3 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
                    title="Supprimer"
                >
                    <FaTrash />
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-slate-300 border-2 border-dashed border-slate-200 rounded-[3rem]">
            <FaBoxOpen className="text-6xl mb-4 opacity-20" />
            <p className="text-lg font-black uppercase tracking-widest">Catalogue Vide</p>
            <p className="text-xs font-medium mt-2 mb-6">Commencez par ajouter votre premier produit</p>
            <Link 
                href="/products/add"
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs hover:bg-slate-800 transition-all"
            >
                Ajouter un produit
            </Link>
        </div>
      )}
    </div>
  );
}