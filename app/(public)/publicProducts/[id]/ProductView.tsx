'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/market'; 
import { useCart } from '@/context/CartContext'; 

// --- THEME TERROIR ---
const THEME = {
    ocre: '#A63C06',
    green: '#2E7D32',
    indigo: '#1A237E',
    sand: '#F9F9F7',
    white: '#FFFFFF',
    textMain: '#2D2D2D',
    textSub: '#5D4037',
    border: '2px solid #E0E0E0',
    borderThick: '3px solid #2D2D2D', // Pour l'aspect robuste
};

interface ProductClientViewProps {
    product: Product;
}

export default function ProductClientView({ product }: ProductClientViewProps) {
    const router = useRouter();
    const { addToCart } = useCart();
    
    const [quantity, setQuantity] = useState<number>(1);
    const [mainImage, setMainImage] = useState<string>(
        (product.images && product.images.length > 0) ? product.images[0] : '/placeholder.jpg'
    );
    // Simuler l'état de lecture audio (si tu n'as pas encore le fichier, ça montre l'intention)
    const [isPlaying, setIsPlaying] = useState(false);

    const handleAddToCart = () => {
        if (quantity > 0 && quantity <= product.stock) {
            addToCart(product, quantity);
            router.push('/checkout');
        } else {
            alert(`Stock disponible : ${product.stock}`);
        }
    };

    // Calcul du prix total dynamique
    const totalPrice = product.price * quantity;

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', backgroundColor: THEME.sand, fontFamily: 'Barlow, sans-serif' }}>
            
            {/* Fil d'Ariane "Brut" */}
            <div style={{ marginBottom: '20px', fontSize: '0.9rem', color: THEME.textSub, textTransform: 'uppercase' }}>
                <span style={{ cursor: 'pointer' }} onClick={() => router.back()}>← Retour aux Terres</span> 
                {' '}/ {product.category} / <span style={{ fontWeight: 'bold', color: THEME.ocre }}>{product.name}</span>
            </div>

            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                
                {/* --- COLONNE GAUCHE : VISUEL --- */}
                <div style={{ flex: '1 1 400px', maxWidth: '100%' }}>
                    {/* Image Principale avec Cadre Robuste */}
                    <div style={{ 
                        height: '400px', 
                        backgroundColor: 'white', 
                        border: THEME.borderThick, // Cadre noir épais
                        marginBottom: '15px', 
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        <img 
                            src={mainImage} 
                            alt={product.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {/* Badge de Fraîcheur */}
                        <div style={{ 
                            position: 'absolute', top: '10px', left: '10px', 
                            backgroundColor: THEME.green, color: 'white', 
                            padding: '5px 10px', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem'
                        }}>
                            Récolte J-1
                        </div>
                    </div>

                    {/* Galerie tactile */}
                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                        {product.images.map((img, index) => (
                            <img 
                                key={index}
                                src={img}
                                alt={`Vue ${index + 1}`}
                                onClick={() => setMainImage(img)}
                                style={{ 
                                    width: '80px', height: '80px', objectFit: 'cover', 
                                    border: img === mainImage ? `3px solid ${THEME.ocre}` : '1px solid #ccc',
                                    cursor: 'pointer'
                                }}
                            />
                        ))}
                    </div>

                    {/* --- INNOVATION : TRANSPARENCE DES PRIX --- */}
                    <div style={{ marginTop: '30px', padding: '20px', backgroundColor: 'white', border: THEME.border }}>
                        <h4 style={{ margin: '0 0 15px 0', fontSize: '0.9rem', textTransform: 'uppercase', color: THEME.textSub }}>
                            📊 Où va votre argent ?
                        </h4>
                        <div style={{ display: 'flex', height: '20px', width: '100%', marginBottom: '10px' }}>
                            <div style={{ width: '75%', backgroundColor: THEME.green }} title="Producteur (75%)"></div>
                            <div style={{ width: '15%', backgroundColor: THEME.ocre }} title="Transport (15%)"></div>
                            <div style={{ width: '10%', backgroundColor: THEME.indigo }} title="AgriConnect (10%)"></div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 'bold' }}>
                            <span style={{ color: THEME.green }}>● 75% Producteur</span>
                            <span style={{ color: THEME.ocre }}>● 15% Logistique</span>
                            <span style={{ color: THEME.indigo }}>● 10% Service</span>
                        </div>
                    </div>
                </div>

                {/* --- COLONNE DROITE : INFO & ACTION --- */}
                <div style={{ flex: '1 1 400px', minWidth: '300px' }}>
                    
                    {/* Titre Massif */}
                    <h1 style={{ 
                        fontFamily: 'Oswald, sans-serif', 
                        fontSize: 'clamp(2rem, 4vw, 3rem)', 
                        margin: '0 0 10px 0', 
                        color: THEME.textMain, 
                        lineHeight: 1 
                    }}>
                        {product.name}
                    </h1>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                        <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: THEME.ocre }}>
                            {product.price.toLocaleString('fr-FR')} FCFA <small style={{ fontSize: '1rem', color: THEME.textSub }}>/ {product.unit}</small>
                        </span>
                        <span style={{ padding: '5px 10px', backgroundColor: '#E0F2F1', color: THEME.green, fontWeight: 'bold', fontSize: '0.9rem', borderRadius: '4px' }}>
                           ✅ En Stock: {product.stock}
                        </span>
                    </div>

                    {/* --- INNOVATION : LE MESSAGE DU PRODUCTEUR (Oralité) --- */}
                    <div style={{ 
                        backgroundColor: THEME.indigo, 
                        color: 'white', 
                        padding: '15px', 
                        borderRadius: '0px', 
                        marginBottom: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        boxShadow: '4px 4px 0 rgba(0,0,0,0.2)'
                    }}>
                        <div style={{ 
                            width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#fff', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' 
                        }}>
                            👨🏾‍🌾
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Message du producteur</div>
                            <div style={{ fontWeight: 'bold' }}>Moussa Koné (Bobo-Sect 24)</div>
                        </div>
                        <button 
                            onClick={() => setIsPlaying(!isPlaying)}
                            style={{ 
                                background: 'white', color: THEME.indigo, border: 'none', 
                                padding: '8px 15px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' 
                            }}
                        >
                            {isPlaying ? '⏸ PAUSE' : '▶ ÉCOUTER'}
                        </button>
                    </div>

                    {/* Description Textuelle */}
                    <p style={{ lineHeight: '1.6', marginBottom: '30px', color: '#444', fontSize: '1.1rem' }}>
                        {product.description}
                    </p>
                    
                    {/* Zone d'Action Massive */}
                    <div style={{ 
                        padding: '25px', 
                        border: THEME.border, 
                        backgroundColor: 'white',
                        position: 'sticky', // Reste visible au scroll sur mobile
                        bottom: '0',
                        zIndex: 10
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                             <label style={{ fontWeight: 'bold' }}>Quantité souhaitée ({product.unit})</label>
                             <div style={{ fontWeight: 'bold', color: THEME.textMain }}>Total: {totalPrice.toLocaleString()} FCFA</div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                min="1"
                                max={product.stock}
                                style={{ 
                                    padding: '15px', width: '80px', 
                                    border: '2px solid #333', fontSize: '1.2rem', fontWeight: 'bold', textAlign: 'center' 
                                }}
                            />
                            
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                style={{
                                    flex: 1,
                                    padding: '15px',
                                    backgroundColor: product.stock > 0 ? THEME.green : '#ccc',
                                    color: 'white',
                                    border: 'none',
                                    fontSize: '1.1rem',
                                    fontWeight: '900',
                                    textTransform: 'uppercase',
                                    cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                                    boxShadow: product.stock > 0 ? '0 4px 0 #1B5E20' : 'none', // Effet bouton 3D pressable
                                    transform: 'translateY(0)',
                                    transition: 'all 0.1s'
                                }}
                                onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(4px)'}
                                onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                {product.stock > 0 ? '🛒 SÉCURISER CE STOCK' : 'INDISPONIBLE'}
                            </button>
                        </div>
                        <div style={{ marginTop: '10px', textAlign: 'center', fontSize: '0.8rem', color: THEME.textSub }}>
                            🔒 Paiement bloqué jusqu'à la livraison (Escrow)
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}