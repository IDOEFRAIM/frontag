// components/Market/ProductCard.tsx

import React from 'react';
import { Product } from '@/types/market';
import { useRouter } from 'next/navigation';
import { FaLeaf, FaMapMarkerAlt, FaPlay } from 'react-icons/fa';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const router = useRouter();

    const handleViewProduct = () => {
        router.push(`/product/${product.id}`);
    };

    const isLowStock = product.stock < 100;

    return (
        <div 
            onClick={handleViewProduct}
            className="group relative bg-white rounded-[2rem] p-4 border border-slate-100 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col h-full"
        >
            {/* 1. IMAGE / VISUEL (Organique) */}
            <div className="relative h-48 bg-slate-50 rounded-[1.5rem] mb-4 overflow-hidden flex items-center justify-center group-hover:bg-green-50 transition-colors">
                {product.images && product.images.length > 0 ? (
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                    <FaLeaf className="text-4xl text-slate-200 group-hover:text-green-400 transition-colors" />
                )}
                
                {/* Badge Audio (Vocal-First) */}
                {product.audioUrl && (
                    <div className="absolute bottom-3 right-3 bg-indigo-600 text-white p-2 rounded-full shadow-lg animate-bounce-slow">
                        <FaPlay size={10} />
                    </div>
                )}
            </div>

            {/* 2. CONTENU (Industriel) */}
            <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-tight">
                        {product.name}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${isLowStock ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                        {product.stock} {product.unit}
                    </span>
                </div>

                <div className="flex items-center gap-1 text-slate-400 mb-3">
                    <FaMapMarkerAlt size={10} />
                    <p className="text-xs font-medium uppercase tracking-wide">
                        {product.location || 'Origine inconnue'}
                    </p>
                </div>
                
                <p className="text-2xl font-black text-green-600 mb-4">
                    {product.price.toLocaleString('fr-FR')} <span className="text-xs text-slate-400 font-medium align-top">XOF</span>
                </p>

                {/* 3. ACTION (Thumb-First) */}
                <button 
                    className="mt-auto w-full bg-slate-900 text-white py-3 rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-green-600 transition-colors"
                >
                    Commander
                </button>
            </div>
        </div>
    );
}