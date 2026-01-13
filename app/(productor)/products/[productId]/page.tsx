'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  FaArrowLeft, FaEdit, FaTrash, FaWhatsapp, FaPlay, FaPause, 
  FaSpinner, FaCheckCircle, FaTimesCircle, FaBoxOpen, FaShareAlt 
} from 'react-icons/fa';
import ProductFlow from '@/components/utils/productorProductFlow'; 
import { useAuth } from '@/hooks/useAuth';
import { deleteProduct } from '@/services/producer.service';
import { toast } from 'react-hot-toast';

export default function ProductDetailPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchRealProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error("Produit introuvable");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchRealProduct();
  }, [productId]);

  const isOwner = user?.id && product?.producer?.userId && user.id === product.producer.userId;

  const handleDelete = async () => {
    if (!confirm("Voulez-vous vraiment supprimer ce produit ?")) return;
    if (!user?.id) return;

    const res = await deleteProduct(productId, user.id);
    if (res.success) {
      toast.success("Produit supprimé");
      router.replace('/products');
    } else {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleShare = () => {
    const text = `*${product.categoryLabel}*\nPrix: ${product.price} FCFA / ${product.unit}\nStock: ${product.quantityForSale} ${product.unit}\n\nDisponible sur Vital Engine.`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
      <FaSpinner className="animate-spin text-4xl text-green-600 mb-4" />
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Chargement...</p>
    </div>
  );

  if (error || !product) return (
    <div className="h-screen flex flex-col items-center justify-center p-6 text-center bg-[#F8FAFC]">
      <FaBoxOpen className="text-6xl text-slate-200 mb-4" />
      <h2 className="text-xl font-black text-slate-800 uppercase italic mb-2">Produit Introuvable</h2>
      <button onClick={() => router.back()} className="mt-6 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs">Retour au catalogue</button>
    </div>
  );

  if (isEditing) return <ProductFlow mode="edit" initialData={product} />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      
      {/* --- HEADER IMAGE (FULL WIDTH MOBILE) --- */}
      <div className="relative h-[50vh] md:h-[60vh] w-full bg-slate-900">
        <Image 
          src={product.images && product.images.length > 0 
            ? (product.images[0].startsWith('http') ? product.images[0] : `/uploads/products/${product.images[0]}`)
            : 'https://images.unsplash.com/photo-1590251142562-b9e76100570b?q=80&w=600'
          } 
          alt={product.categoryLabel}
          fill
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent" />
        
        {/* Navigation Bar */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
          <button onClick={() => router.back()} className="w-12 h-12 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10 hover:bg-black/40 transition-all">
            <FaArrowLeft />
          </button>
          
          {isOwner && (
            <div className="flex gap-3">
                <button onClick={() => setIsEditing(true)} className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-slate-900 shadow-lg hover:scale-105 transition-all">
                    <FaEdit />
                </button>
                <button onClick={handleDelete} className="w-12 h-12 bg-red-500/90 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-lg hover:bg-red-600 transition-all">
                    <FaTrash size={14} />
                </button>
            </div>
          )}
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 pb-12">
            <div className="flex items-end justify-between gap-4">
                <div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider mb-3 ${
                        product.quantityForSale > 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                        {product.quantityForSale > 0 ? <FaCheckCircle /> : <FaTimesCircle />}
                        {product.quantityForSale > 0 ? 'Disponible' : 'Épuisé'}
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none shadow-black drop-shadow-lg">
                        {product.categoryLabel}
                    </h1>
                </div>
            </div>
        </div>
      </div>

      {/* --- CONTENT CARD --- */}
      <div className="px-4 -mt-6 relative z-30 max-w-3xl mx-auto">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-6 md:p-10 border border-slate-100">
          
          {/* Price & Stock Row */}
          <div className="flex items-stretch gap-4 mb-8">
            <div className="flex-1 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Prix Unitaire</p>
                <p className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                    {product.price} <span className="text-sm font-bold text-slate-400">FCFA</span>
                </p>
            </div>
            <div className="flex-1 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Stock</p>
                <p className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                    {product.quantityForSale} <span className="text-sm font-bold text-slate-400">{product.unit}</span>
                </p>
            </div>
          </div>

          {/* Audio Player (Prominent) */}
          {product.audioUrl && (
            <div className="mb-8">
                <audio ref={audioRef} src={`/uploads/audio/${product.audioUrl}`} onEnded={() => setIsPlaying(false)} />
                <button 
                  onClick={() => {
                    if (isPlaying) audioRef.current?.pause();
                    else audioRef.current?.play();
                    setIsPlaying(!isPlaying);
                  }}
                  className={`w-full p-6 rounded-[2rem] flex items-center gap-6 transition-all duration-300 ${
                      isPlaying 
                      ? 'bg-green-600 text-white shadow-xl shadow-green-200 scale-[1.02]' 
                      : 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                  }`}
                >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 ${
                        isPlaying ? 'bg-white text-green-600' : 'bg-white/10 text-white'
                    }`}>
                        {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} className="ml-1" />}
                    </div>
                    <div className="flex-1 text-left">
                        <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-1">Description Vocale</p>
                        <p className="text-lg font-bold leading-tight">Écouter les détails du produit</p>
                    </div>
                    {isPlaying && (
                        <div className="flex gap-1 h-8 items-end">
                            <div className="w-1 bg-white/50 animate-[bounce_1s_infinite] h-4"></div>
                            <div className="w-1 bg-white/50 animate-[bounce_1.2s_infinite] h-8"></div>
                            <div className="w-1 bg-white/50 animate-[bounce_0.8s_infinite] h-6"></div>
                        </div>
                    )}
                </button>
            </div>
          )}

          {/* Local Names / Description Placeholder */}
          <div className="mb-8">
            <h3 className="text-lg font-black text-slate-900 uppercase italic mb-4 flex items-center gap-2">
                <FaBoxOpen className="text-slate-300" /> Détails
            </h3>
            <div className="bg-slate-50 rounded-3xl p-6 text-slate-600 text-sm leading-relaxed font-medium">
                {product.description ? product.description : (
                    <p className="italic opacity-50">Aucune description textuelle disponible. Écoutez l'audio pour plus de détails.</p>
                )}
                
                {product.localNames && Object.keys(product.localNames).length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap gap-2">
                        {Object.entries(product.localNames).map(([lang, name]: any) => (
                            <span key={lang} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold uppercase text-slate-500">
                                {lang}: <span className="text-slate-900">{name}</span>
                            </span>
                        ))}
                    </div>
                )}
            </div>
          </div>

          {/* Share Action (Sticky Bottom on Mobile?) - Let's keep it inline for now but BIG */}
          <button 
            onClick={handleShare}
            className="w-full bg-[#25D366] text-white p-5 rounded-[2rem] flex items-center justify-center gap-3 shadow-xl shadow-green-100 hover:bg-[#20bd5a] transition-all active:scale-95"
          >
            <FaWhatsapp size={28} />
            <span className="text-lg font-black uppercase tracking-wider">Partager sur WhatsApp</span>
          </button>

          <div className="mt-8 text-center">
             <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Réf: {product.id.slice(-8)}</p>
          </div>

        </div>
      </div>
    </div>
  );
}