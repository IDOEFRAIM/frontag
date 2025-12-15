'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// --- CONTEXT & HOOKS ---
import { useCart } from '@/context/CartContext';
import { useNetwork } from '@/hooks/useNetwork';

// --- COMPOSANTS SAHEL ---
import LastMileGuide, { DeliveryLocationData } from '@/components/geo/LastMileGuide'; 
import { queueOfflineOrder } from '@/lib/db'; 

// --- DESIGN SYSTEM ---
const THEME = {
    ocre: '#A63C06',
    green: '#2E7D32',
    indigo: '#1A237E',
    sand: '#F9F9F7',
    text: '#2D2D2D',
};

export default function CheckoutPage() {
    const { items, cartTotal, clearCart } = useCart();
    const router = useRouter();
    const isOnline = useNetwork(); 
    const [isProcessing, setIsProcessing] = useState(false);

    // État du formulaire
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        city: 'Ouagadougou',
        paymentMethod: 'mobile_money'
    });

    // État de la géolocalisation + AUDIO
    const [geoData, setGeoData] = useState<{
        lat: number, 
        lng: number, 
        desc: string, 
        audioBlob?: Blob | null // <--- AJOUTÉ ICI
    } | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- GESTION DE LA LOCALISATION ET DE L'AUDIO ---
    const handleGeoUpdate = useCallback((data: DeliveryLocationData | null) => {
        if (!data) {
            setGeoData(prev => (prev === null ? null : null));
            return;
        }

        setGeoData(prev => {
            // Vérification stricte pour éviter les re-rendus infinis
            if (prev && 
                prev.lat === data.lat && 
                prev.lng === data.lng && 
                prev.desc === data.description &&
                prev.audioBlob === data.audioBlob // On vérifie aussi l'audio
            ) {
                return prev;
            }
            
            // Mise à jour si quelque chose a changé
            return { 
                lat: data.lat, 
                lng: data.lng, 
                desc: data.description || '',
                audioBlob: data.audioBlob // <--- On stocke le fichier audio
            };
        });
    }, []); 

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!geoData && formData.city !== 'Agence') {
            alert("⚠️ La géolocalisation est obligatoire pour la livraison à domicile.");
            return;
        }

        setIsProcessing(true);

        // Préparation des données
        const orderPayload = {
            productIds: items.map(i => i.id), // Juste les IDs pour alléger
            totalAmount: cartTotal,
            customerPhone: formData.phone,
            customerName: formData.name,
            gpsLat: geoData?.lat,
            gpsLng: geoData?.lng,
            deliveryDesc: geoData?.desc,      // Description texte
            voiceNoteBlob: geoData?.audioBlob, // <--- Description Audio
            city: formData.city,
            paymentMethod: formData.paymentMethod
        };

        try {
            if (isOnline) {
                // --- MODE EN LIGNE ---
                console.log("🚀 Envoi au serveur...", orderPayload);
                
                // ICI: Il faudrait utiliser FormData pour envoyer le Blob au serveur
                // const formData = new FormData();
                // formData.append('audio', geoData?.audioBlob);
                // ...
                
                await new Promise(resolve => setTimeout(resolve, 1500)); // Simu API
                router.push('/checkout/success?mode=live');
            } else {
                // --- MODE HORS-LIGNE ---
                console.log("💾 Sauvegarde locale (Outbox)...");
                
                // On passe tout à IndexedDB (qui accepte les Blobs)
                await queueOfflineOrder({
                    productIds: items.map(i => ({ id: i.id, qty: i.quantity })), // On garde les détails pour le local
                    totalAmount: orderPayload.totalAmount,
                    customerPhone: orderPayload.customerPhone,
                    customerName: orderPayload.customerName,
                    gpsLat: orderPayload.gpsLat,
                    gpsLng: orderPayload.gpsLng,
                    deliveryDesc: orderPayload.deliveryDesc,
                    voiceNoteBlob: orderPayload.voiceNoteBlob // <--- Sauvegarde du fichier audio
                });

                router.push('/checkout/success?mode=offline');
            }
            clearCart();
        } catch (error) {
            console.error("Erreur commande:", error);
            alert("Une erreur est survenue. Réessayez.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (items.length === 0) {
        return (
            <div style={{ padding: '80px 20px', textAlign: 'center', backgroundColor: THEME.sand, minHeight: '60vh' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🛒</div>
                <h2 style={{ fontFamily: 'Oswald, sans-serif', color: THEME.text }}>Votre calebasse est vide.</h2>
                <Link href="/market" style={{ display: 'inline-block', marginTop: '20px', color: THEME.ocre, fontWeight: 'bold', textDecoration: 'underline' }}>
                    Retourner au marché
                </Link>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: THEME.sand, minHeight: '100vh', padding: '40px 20px', fontFamily: 'Barlow, sans-serif' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                
                <h1 style={{ fontFamily: 'Oswald, sans-serif', fontSize: '2rem', color: THEME.indigo, marginBottom: '30px', borderLeft: `6px solid ${THEME.ocre}`, paddingLeft: '15px' }}>
                    FINALISER L'ACHAT
                </h1>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                    
                    {/* COLONNE GAUCHE : INFO + GEO */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <section style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ marginTop: 0, color: THEME.text, borderBottom: '1px solid #eee', paddingBottom: '10px' }}>1. Qui récupère ?</h3>
                            <div style={{ display: 'grid', gap: '15px', marginTop: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '5px' }}>Nom Complet</label>
                                    <input 
                                        required name="name" type="text" placeholder="Ex: Moussa Koné"
                                        value={formData.name} onChange={handleInputChange}
                                        style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '5px' }}>Téléphone</label>
                                    <input 
                                        required name="phone" type="tel" placeholder="Ex: 70 20 30 40"
                                        value={formData.phone} onChange={handleInputChange}
                                        style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' }}
                                    />
                                </div>
                            </div>
                        </section>

                        <section>
                            {/* Le composant qui gère GPS + Carte + Audio */}
                            <LastMileGuide onChange={handleGeoUpdate}/> 
                        </section>
                    </div>

                    {/* COLONNE DROITE : PAIEMENT + TOTAL */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <section style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ marginTop: 0, color: THEME.text, borderBottom: '1px solid #eee', paddingBottom: '10px' }}>2. Paiement</h3>
                            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', border: formData.paymentMethod === 'mobile_money' ? `2px solid ${THEME.ocre}` : '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', backgroundColor: formData.paymentMethod === 'mobile_money' ? '#FFF3E0' : '#fff' }}>
                                    <input type="radio" name="paymentMethod" value="mobile_money" checked={formData.paymentMethod === 'mobile_money'} onChange={handleInputChange} />
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>Mobile Money</div>
                                        <div style={{ fontSize: '0.85rem', color: '#666' }}>Orange / Moov</div>
                                    </div>
                                    <div style={{ marginLeft: 'auto', fontSize: '1.2rem' }}>📲</div>
                                </label>

                                <label style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', border: formData.paymentMethod === 'cash' ? `2px solid ${THEME.ocre}` : '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}>
                                    <input type="radio" name="paymentMethod" value="cash" checked={formData.paymentMethod === 'cash'} onChange={handleInputChange} />
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>Cash à la livraison</div>
                                    </div>
                                    <div style={{ marginLeft: 'auto', fontSize: '1.2rem' }}>💵</div>
                                </label>
                            </div>
                        </section>

                        <section style={{ backgroundColor: THEME.indigo, color: '#fff', padding: '25px', borderRadius: '8px' }}>
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'Oswald, sans-serif' }}>
                                <span>TOTAL</span>
                                <span>{cartTotal.toLocaleString()} CFA</span>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isProcessing}
                                style={{
                                    width: '100%',
                                    marginTop: '25px',
                                    padding: '18px',
                                    backgroundColor: isProcessing ? '#999' : THEME.ocre,
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    cursor: isProcessing ? 'wait' : 'pointer',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                                }}
                            >
                                {isProcessing ? 'Traitement...' : isOnline ? 'COMMANDER MAINTENANT' : 'ENREGISTRER HORS-LIGNE 📡'}
                            </button>
                        </section>
                    </div>
                </form>
            </div>
        </div>
    );
}