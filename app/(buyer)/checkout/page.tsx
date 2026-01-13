'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useNetwork } from '@/hooks/useNetwork';
import LastMileGuide from '@/components/geo/LastMileGuide'; 
import { queueOfflineOrder } from '@/lib/dexie'; 
import { MapPin, Phone, User, Wallet, CheckCircle2, WifiOff, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';

const THEME = {
    primary: '#A63C06',
    accent: '#E65100',
    bg: '#FDFCFB',
    surface: '#FFFFFF',
    border: '#F1EDE9',
    text: '#2D3436',
    muted: '#7F8C8D',
    error: '#D63031',
    success: '#2E7D32'
};

interface CheckoutFormData {
  name: string;
  phone: string;
  city: string;
  paymentMethod: string;
}

export default function CheckoutPage() {
    const { items, cartTotal, clearCart } = useCart();
    const router = useRouter();
    const isOnline = useNetwork();
    
    const [isMounted, setIsMounted] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [globalError, setGlobalError] = useState('');

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CheckoutFormData>({
        defaultValues: {
            name: '',
            phone: '',
            city: 'Ouagadougou',
            paymentMethod: 'mobile_money'
        }
    });

    const watchedPaymentMethod = watch('paymentMethod');

    const [geoData, setGeoData] = useState<{
        lat: number, 
        lng: number, 
        description: string, 
        audioBlob?: Blob | null 
    } | null>(null);

    useEffect(() => {
        setIsMounted(true);
        const savedName = localStorage.getItem('agri_customer_name');
        const savedPhone = localStorage.getItem('agri_customer_phone');
        if (savedName) setValue('name', savedName);
        if (savedPhone) setValue('phone', savedPhone);
    }, [setValue]);

    const handleGeoUpdate = useCallback((data: any) => {
        setGeoData(data);
    }, []);

    const onSubmit: SubmitHandler<CheckoutFormData> = async (data) => {
            // Validation locale rapide (Phone validation handled by regex in register or manual check)
            if (data.phone.length < 8) {
                // We can use setError from RHF, but for now let's keep it simple or rely on RHF validation
                // But I didn't add validation rules in register yet.
                // Let's add basic validation in register.
            }
            
            setIsProcessing(true);
            setGlobalError('');

            try {
                // 1. Préparation de l'objet de données (Structure alignée sur la route API)
                const metadata = {
                    customer: { 
                        name: data.name, 
                        phone: data.phone 
                    },
                    delivery: { 
                        lat: geoData?.lat || null, 
                        lng: geoData?.lng || null, 
                        description: geoData?.description || "", 
                        city: data.city 
                    },
                    totalAmount: cartTotal,
                    paymentMethod: data.paymentMethod,
                    items: items.map(i => ({ 
                        id: i.id, 
                        qty: i.quantity, 
                        price: i.price 
                    }))
                };

                // 2. Construction du FormData (Nécessaire pour le fichier audio)
                const body = new FormData();
                body.append('data', JSON.stringify(metadata));
                
                if (geoData?.audioBlob) {
                    body.append('voiceNote', geoData.audioBlob, `audio_${Date.now()}.webm`);
                }

                // 3. Choix du mode d'envoi (Online vs Offline)
                if (isOnline) {
                    // APPEL API MANUEL
                    const res = await fetch('/api/orders', { 
                        method: 'POST',
                        // Note: On ne définit PAS de Header Content-Type, le navigateur le fait pour FormData
                        body 
                    });

                    const responseData = await res.json();

                    if (!res.ok) {
                        throw new Error(responseData.error || responseData.details || "Échec de l'envoi");
                    }
                    
                    // Succès : Nettoyage et redirection
                    localStorage.setItem('agri_customer_name', data.name);
                    localStorage.setItem('agri_customer_phone', data.phone);
                    clearCart();
                    router.push(`/checkout/success?mode=live`);
                } else {
                    // MODE OFFLINE : Stockage local Dexie
                    await queueOfflineOrder(metadata, geoData?.audioBlob); 
                    clearCart();
                    router.push(`/checkout/success?mode=offline`);
                }

            } catch (error: any) {
                console.error("❌ Erreur au Checkout:", error);
                // On affiche l'erreur réelle retournée par le serveur
                setGlobalError(error.message || "Une erreur est survenue lors de la communication avec le serveur.");
            } finally {
                setIsProcessing(false);
            }
        };

    if (!isMounted) return null;

    return (
        <div style={{ backgroundColor: THEME.bg, color: THEME.text, minHeight: '100vh', padding: '20px 5%' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                
                <header style={{ marginBottom: '30px' }}>
                    <Link href="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: THEME.muted, textDecoration: 'none', fontSize: '0.9rem' }}>
                        <ArrowLeft size={16} /> Retour au panier
                    </Link>
                    <h1 style={{ marginTop: '15px', fontSize: '2rem', fontWeight: 900, color: THEME.text }}>Finaliser la commande</h1>
                </header>

                {globalError && (
                    <div style={{ backgroundColor: '#FFF5F5', color: THEME.error, padding: '16px', borderRadius: '16px', marginBottom: '24px', border: `1px solid ${THEME.error}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <AlertCircle size={22} />
                        <span style={{ fontWeight: '600' }}>{globalError}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* SECTION IDENTITÉ */}
                        <section style={{ backgroundColor: THEME.surface, padding: '25px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: `1px solid ${THEME.border}` }}>
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: THEME.primary, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '25px', fontWeight: 800 }}>
                                <User size={18} /> Vos Informations
                            </h2>
                            <div style={{ display: 'grid', gap: '20px' }}>
                                <div style={{ display: 'grid', gap: '8px' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: THEME.muted }}>Nom Complet</label>
                                    <input 
                                        type="text" placeholder="Ex: Moussa Sawadogo"
                                        {...register('name', { required: true })}
                                        style={{ width: '100%', padding: '15px', borderRadius: '14px', border: `1px solid ${THEME.border}`, backgroundColor: '#FBFBFB', fontSize: '1rem' }}
                                    />
                                </div>
                                <div style={{ display: 'grid', gap: '8px' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: THEME.muted }}>Numéro WhatsApp / Mobile</label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontWeight: '800', color: THEME.primary }}>+226</span>
                                        <input 
                                            type="tel" placeholder="70 00 00 00"
                                            {...register('phone', { 
                                                required: "Numéro requis", 
                                                minLength: { value: 8, message: "8 chiffres minimum" },
                                                pattern: { value: /^[0-9]*$/, message: "Chiffres uniquement" }
                                            })}
                                            style={{ 
                                                width: '100%', padding: '15px 15px 15px 65px', borderRadius: '14px', 
                                                border: `2px solid ${errors.phone ? THEME.error : THEME.border}`, 
                                                fontSize: '1.2rem', fontWeight: '800', letterSpacing: '1px'
                                            }}
                                        />
                                    </div>
                                    {errors.phone && <p style={{ color: THEME.error, fontSize: '0.75rem', fontWeight: '700' }}>{errors.phone.message}</p>}
                                </div>
                            </div>
                        </section>

                        {/* SECTION GUIDAGE (GPS + AUDIO) */}
                        <section style={{ backgroundColor: THEME.surface, borderRadius: '24px', border: `1px solid ${THEME.border}`, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                            <div style={{ padding: '20px 25px', borderBottom: `1px solid ${THEME.border}`, display: 'flex', alignItems: 'center', gap: '10px', color: THEME.primary }}>
                                <MapPin size={20} />
                                <span style={{ fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase' }}>Précision Livraison</span>
                            </div>
                            <LastMileGuide onChange={handleGeoUpdate} /> 
                        </section>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* SECTION PAIEMENT */}
                        <section style={{ backgroundColor: THEME.surface, padding: '25px', borderRadius: '24px', border: `1px solid ${THEME.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: THEME.primary, textTransform: 'uppercase', marginBottom: '25px', fontWeight: 800 }}>
                                <Wallet size={18} /> Mode de paiement
                            </h2>
                            <div style={{ display: 'grid', gap: '12px' }}>
                                {[
                                    { id: 'mobile_money', label: '📲 Mobile Money (Orange/Mobicash)', desc: 'Paiement à la livraison' },
                                    { id: 'cash', label: '💵 Espèces', desc: 'Main à main' }
                                ].map((method) => (
                                    <label key={method.id} style={{ 
                                        display: 'flex', alignItems: 'center', gap: '15px', padding: '18px', borderRadius: '18px', 
                                        border: watchedPaymentMethod === method.id ? `2px solid ${THEME.primary}` : `1px solid ${THEME.border}`,
                                        backgroundColor: watchedPaymentMethod === method.id ? '#FFF9F6' : 'transparent',
                                        cursor: 'pointer', transition: 'all 0.2s ease'
                                    }}>
                                        <input 
                                            type="radio" 
                                            value={method.id} 
                                            {...register('paymentMethod')}
                                            style={{ width: '20px', height: '20px', accentColor: THEME.primary }} 
                                        />
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: '800', fontSize: '1rem' }}>{method.label}</span>
                                            <span style={{ fontSize: '0.75rem', color: THEME.muted }}>{method.desc}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </section>

                        {/* RÉCAPITULATIF FINAL STICKY */}
                        <div style={{ backgroundColor: THEME.text, color: 'white', padding: '35px', borderRadius: '32px', position: 'sticky', top: '24px', boxShadow: '0 25px 50px rgba(0,0,0,0.15)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <span style={{ color: '#B2BEC3', fontWeight: '600', fontSize: '0.9rem' }}>Total à payer</span>
                                    <span style={{ color: '#00E676', fontSize: '0.75rem', fontWeight: '700' }}>TVA incluse</span>
                                </div>
                                <span style={{ fontWeight: '900', fontSize: '2.2rem', letterSpacing: '-1px' }}>{cartTotal.toLocaleString()} <small style={{ fontSize: '1rem' }}>CFA</small></span>
                            </div>

                            <div style={{ fontSize: '0.85rem', backgroundColor: 'rgba(255,255,255,0.08)', padding: '16px', borderRadius: '16px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {isOnline ? <CheckCircle2 size={18} color="#00E676" /> : <WifiOff size={18} color="#FFB300" />}
                                <span style={{ fontWeight: '500' }}>
                                    {isOnline ? 'Connexion établie : Envoi instantané' : 'Mode Offline : Votre commande sera synchronisée dès le retour du réseau'}
                                </span>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isProcessing}
                                style={{
                                    width: '100%', padding: '22px', backgroundColor: THEME.accent, color: 'white', 
                                    border: 'none', borderRadius: '20px', fontSize: '1.1rem', fontWeight: '900', 
                                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                                    boxShadow: '0 10px 20px rgba(230, 81, 0, 0.3)',
                                    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseEnter={(e) => !isProcessing && (e.currentTarget.style.transform = 'scale(1.02)')}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                            >
                                {isProcessing ? (
                                    <><Loader2 className="animate-spin" size={24} /> Enregistrement...</>
                                ) : (
                                    <>Confirmer ma commande</>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}