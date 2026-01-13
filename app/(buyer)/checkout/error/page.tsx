'use client';

import React, { useEffect, useState, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { 
    CheckCircle, 
    Truck, 
    PackageCheck, 
    Smartphone, 
    MapPin, 
    ArrowRight, 
    MessageCircle,
    Download
} from 'lucide-react';

const THEME = {
    primary: '#A63C06',
    accent: '#E65100',
    bg: '#FDFCFB',
    green: '#2E7D32',
    text: '#2D3436',
    border: '#F1EDE9',
    muted: '#7F8C8D'
};

function SuccessContent() {
    const { clearCart } = useCart();
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode'); 
    
    // CORRECTION HYDRATATION : On initialise à null
    const [orderId, setOrderId] = useState<string | null>(null);
    const hasCleared = useRef(false);

    useEffect(() => {
        // On génère l'ID uniquement sur le client
        const generatedId = `AGRI-${Math.floor(Math.random() * 90000) + 10000}`;
        setOrderId(generatedId);

        if (!hasCleared.current) {
            clearCart();
            hasCleared.current = true;
        }
        window.scrollTo(0, 0);
    }, [clearCart]);

    return (
        <div style={{ backgroundColor: THEME.bg, minHeight: '100vh', padding: '40px 20px' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                
                {/* Icône de Succès */}
                <div style={{ 
                    width: '90px', height: '90px', backgroundColor: '#E8F5E9', color: THEME.green,
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 24px', boxShadow: '0 10px 20px rgba(46, 125, 50, 0.1)'
                }}>
                    <CheckCircle size={48} strokeWidth={2.5} />
                </div>

                <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: THEME.text, marginBottom: '12px', letterSpacing: '-0.02em' }}>
                    {mode === 'offline' ? 'Commande Enregistrée !' : 'Paiement Confirmé !'}
                </h1>
                
                <p style={{ color: THEME.muted, fontSize: '1.1rem', marginBottom: '35px', lineHeight: '1.5' }}>
                    Votre commande <strong style={{ color: THEME.text }}>#{orderId || '...'}</strong> a été transmise. 
                    {mode === 'offline' ? " Elle sera synchronisée dès votre retour en ligne." : " Nous préparons vos produits."}
                </p>

                {/* Status Card : Mode Hors-ligne */}
                {mode === 'offline' && (
                    <div style={{ 
                        backgroundColor: '#FFF8F1', border: `1px solid #FFE0B2`, padding: '20px', 
                        borderRadius: '20px', display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '30px', textAlign: 'left'
                    }}>
                        <div style={{ backgroundColor: THEME.accent, padding: '10px', borderRadius: '12px' }}>
                            <Smartphone size={24} color="white" />
                        </div>
                        <div>
                            <div style={{ fontWeight: '800', fontSize: '0.9rem', color: THEME.accent, textTransform: 'uppercase' }}>Mode Sans Connexion</div>
                            <div style={{ fontSize: '0.85rem', color: '#855421' }}>Votre commande est sauvegardée localement sur ce téléphone.</div>
                        </div>
                    </div>
                )}

                {/* Timeline de livraison */}
                <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '28px', border: `1px solid ${THEME.border}`, textAlign: 'left', marginBottom: '35px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px', color: THEME.primary }}>
                        <Truck size={20} /> PROCHAINES ÉTAPES
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        <StepItem icon={<PackageCheck size={20} />} title="Préparation Fraîcheur" desc="Le producteur emballe vos produits ce matin." isLast={false} />
                        <StepItem icon={<MapPin size={20} />} title="Livraison Géo-guidée" desc="Le livreur utilisera vos coordonnées GPS exactes." isLast={true} />
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <Link href="/catalogue" style={{ 
                        backgroundColor: THEME.primary, color: 'white', padding: '20px', borderRadius: '18px', 
                        textDecoration: 'none', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'
                    }}>
                        Continuer mes achats <ArrowRight size={20} />
                    </Link>
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => window.print()} style={{ 
                            flex: 1, backgroundColor: 'white', border: `1px solid ${THEME.border}`, padding: '15px', borderRadius: '16px',
                            color: THEME.text, fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                        }}>
                            <Download size={18} /> Reçu PDF
                        </button>
                        
                        <a href={`https://wa.me/226XXXXXXXX?text=Bonjour, suivi commande ${orderId}`} target="_blank" rel="noopener noreferrer" style={{ 
                            flex: 1, backgroundColor: '#25D366', color: 'white', padding: '15px', borderRadius: '16px',
                            textDecoration: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                        }}>
                            <MessageCircle size={18} /> WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StepItem({ icon, title, desc, isLast }: { icon: any, title: string, desc: string, isLast: boolean }) {
    return (
        <div style={{ display: 'flex', gap: '20px', position: 'relative' }}>
            {!isLast && <div style={{ position: 'absolute', left: '19px', top: '40px', bottom: '-15px', width: '2px', backgroundColor: THEME.border }} />}
            <div style={{ width: '40px', height: '40px', backgroundColor: '#FDFCFB', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: THEME.primary, border: `1px solid ${THEME.border}`, zIndex: 1 }}>
                {icon}
            </div>
            <div>
                <div style={{ fontWeight: '800', fontSize: '1rem', color: THEME.text, marginBottom: '4px' }}>{title}</div>
                <div style={{ fontSize: '0.85rem', color: THEME.muted, lineHeight: '1.4' }}>{desc}</div>
            </div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div style={{ padding: '100px', textAlign: 'center' }}>Vérification de la commande...</div>}>
            <SuccessContent />
        </Suspense>
    );
}