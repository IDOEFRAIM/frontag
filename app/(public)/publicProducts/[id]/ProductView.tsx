'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/market';
import { useCart } from '@/context/CartContext';
import { 
    ArrowLeft, 
    ShieldCheck, 
    MapPin, 
    Volume2, 
    VolumeX, 
    ShoppingCart, 
    Info,
    ChevronRight,
    Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const THEME = {
    bg: '#FDFCFB',        // Sable clair
    surface: '#FFFFFF',   // Blanc
    accent: '#E65100',    // Terre cuite
    secondary: '#2D3436', // Anthracite
    muted: '#7F8C8D',     // Gris doux
    border: '#EEEAE5',    // Beige fin
    active: '#FFF3E0'     // Fond accentué léger
};

export default function ProductClientView({ product }: { product: Product }) {
    const router = useRouter();
    const { addToCart } = useCart();
    
    // États
    const [quantity, setQuantity] = useState<number>(1);
    const [mainImage, setMainImage] = useState<string>(product?.images?.[0] || '/placeholder-agri.jpg');
    const [isPlaying, setIsPlaying] = useState(false);

    // Sécurité prix
    const unitPrice = product?.price || 0;
    const totalPrice = unitPrice * quantity;

    const handleAddToCart = () => {
        if (quantity > 0 && quantity <= product.quantity) {
            addToCart(product, quantity);
            router.push('/checkout');
        }
    };

    return (
        <div style={{ backgroundColor: THEME.bg, color: THEME.secondary, minHeight: '100vh', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            
            {/* Barre de Navigation Contextuelle */}
            <nav style={{ borderBottom: `1px solid ${THEME.border}`, padding: '20px 5%', backgroundColor: THEME.surface }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', fontWeight: 600 }}>
                    <button 
                        onClick={() => router.back()}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: THEME.accent }}
                    >
                        <ArrowLeft size={16} /> RETOUR
                    </button>
                    <span style={{ color: THEME.border }}>|</span>
                    <span style={{ color: THEME.muted }}>MARCHÉ</span>
                    <ChevronRight size={14} color={THEME.muted} />
                    <span style={{ color: THEME.muted }}>{product.category.toUpperCase()}</span>
                    <ChevronRight size={14} color={THEME.muted} />
                    <span style={{ color: THEME.secondary }}>{product.name}</span>
                </div>
            </nav>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', maxWidth: '1440px', margin: '0 auto', gap: '40px', padding: '40px 5%' }}>
                
                {/* --- BLOC VISUEL (GAUCHE) --- */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ position: 'relative', borderRadius: '30px', overflow: 'hidden', border: `1px solid ${THEME.border}`, boxShadow: '0 15px 35px rgba(0,0,0,0.05)' }}
                    >
                        <img 
                            src={`/uploads/products/${mainImage}` } 
                            alt={product?.name || 'Product main image'}
                            style={{ width: '100%', height: '550px', objectFit: 'cover' }}
                        />
                        <div style={{ 
                            position: 'absolute', top: '20px', left: '20px',
                            backgroundColor: 'rgba(255,255,255,0.9)', padding: '10px 18px',
                            borderRadius: '15px', border: `1px solid ${THEME.border}`,
                            display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 700
                        }}>
                            <ShieldCheck size={16} color={THEME.accent} />
                            ORIGINE CERTIFIÉE : {product?.location?.address.split(',')[0].toUpperCase()}
                        </div>
                    </motion.div>

                    {/* Galerie Miniatures */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {product.images?.map((img, i) => (
                            <img 
                                key={i}
                                 src={`/uploads/products/${img}`}
                                onClick={() => setMainImage(img)}
                                style={{ 
                                    width: '80px', height: '80px', borderRadius: '15px', objectFit: 'cover', cursor: 'pointer',
                                    border: mainImage === img ? `3px solid ${THEME.accent}` : `1px solid ${THEME.border}`,
                                    transition: '0.2s'
                                }}
                            />
                        ))}
                    </div>

                    {/* Modèle de répartition (Analytics) */}
                    <div style={{ marginTop: '20px', padding: '25px', backgroundColor: THEME.surface, borderRadius: '24px', border: `1px solid ${THEME.border}` }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: THEME.muted, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Info size={14} /> RÉPARTITION DE LA VALEUR
                        </div>
                        <div style={{ display: 'flex', height: '10px', gap: '4px', marginBottom: '15px', borderRadius: '5px', overflow: 'hidden' }}>
                            <div style={{ flex: 7.5, backgroundColor: THEME.accent }} title="Producteur" />
                            <div style={{ flex: 1.5, backgroundColor: THEME.secondary }} title="Logistique" />
                            <div style={{ flex: 1, backgroundColor: THEME.border }} title="Frais" />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', fontSize: '0.7rem', fontWeight: 700 }}>
                            <div style={{ color: THEME.accent }}>AGRICULTEUR 75%</div>
                            <div style={{ textAlign: 'center', color: THEME.secondary }}>LOGISTIQUE 15%</div>
                            <div style={{ textAlign: 'right', color: THEME.muted }}>SERVICES 10%</div>
                        </div>
                    </div>
                </div>

                {/* --- PANNEAU DE CONTRÔLE (DROITE) --- */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    
                    <div>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '10px', letterSpacing: '-0.04em', color: THEME.secondary }}>
                            {product.name}
                        </h1>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{unitPrice.toLocaleString()}</span>
                            <span style={{ fontSize: '1.1rem', fontWeight: 600, color: THEME.accent }}>CFA / {product.unit}</span>
                        </div>
                    </div>

                    {/* Message Audio du Producteur */}
                    <div style={{ 
                        padding: '24px', backgroundColor: THEME.active, borderRadius: '24px', 
                        display: 'flex', alignItems: 'center', gap: '20px', border: `1px solid ${THEME.accent}33`
                    }}>
                        <div style={{ 
                            width: '50px', height: '50px', borderRadius: '50%', backgroundColor: THEME.accent,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                        }}>
                            {isPlaying ? <Volume2 /> : <VolumeX />}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: THEME.accent }}>MESSAGE DU PRODUCTEUR</div>
                            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>M. KONE (BOBO-DIOULASSO)</div>
                        </div>
                        <button 
                            onClick={() => setIsPlaying(!isPlaying)}
                            style={{ 
                                backgroundColor: THEME.secondary, color: 'white', border: 'none', 
                                padding: '10px 20px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' 
                            }}
                        >
                            {isPlaying ? 'PAUSE' : 'ÉCOUTER'}
                        </button>
                    </div>

                    <p style={{ color: THEME.muted, lineHeight: '1.8', fontSize: '1.05rem' }}>
                        {product.description || "Aucune description supplémentaire fournie pour ce lot agricole."}
                    </p>

                    {/* BOÎTE DE TRANSACTION */}
                    <div style={{ 
                        padding: '30px', borderRadius: '28px', backgroundColor: THEME.surface, 
                        border: `1px solid ${THEME.border}`, boxShadow: '0 10px 30px rgba(0,0,0,0.02)' 
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontWeight: 700 }}>
                            <span style={{ color: THEME.muted }}>QUANTITÉ SOUHAITÉE</span>
                            <span style={{ color: product.quantity > 0 ? '#10B981' : THEME.accent }}>
                                {product.quantity > 0 ? `EN quantity: ${product.quantity}` : 'RUPTURE'}
                            </span>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${THEME.border}`, borderRadius: '15px', padding: '5px' }}>
                                <input
                                    type="number"
                                    min="1"
                                    max={product.quantity}
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                                    style={{ 
                                        border: 'none', width: '80px', padding: '10px', fontSize: '1.5rem', 
                                        fontWeight: 800, textAlign: 'center', outline: 'none', background: 'transparent'
                                    }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: THEME.muted }}>ESTIMATION TOTALE</div>
                                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: THEME.secondary }}>
                                    {totalPrice.toLocaleString()} <small style={{ fontSize: '0.9rem' }}>CFA</small>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={product.quantity === 0}
                            style={{
                                width: '100%', padding: '22px', borderRadius: '18px',
                                backgroundColor: product.quantity > 0 ? THEME.accent : THEME.muted,
                                color: 'white', border: 'none',
                                fontSize: '1.1rem', fontWeight: 800,
                                cursor: product.quantity > 0 ? 'pointer' : 'not-allowed',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                                transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        >
                            <ShoppingCart size={20} />
                            {product.quantity > 0 ? 'RÉSERVER CE LOT' : 'LOT INDISPONIBLE'}
                        </button>
                        
                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '15px', color: THEME.muted, fontSize: '0.75rem', fontWeight: 700 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Package size={14} /> PAIEMENT SÉCURISÉ</span>
                            <span>•</span>
                            <span>SANS FRAIS DE RÉSERVATION</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}