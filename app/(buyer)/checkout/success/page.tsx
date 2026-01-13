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
    Download,
    Edit2,
    Check
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

// --- SOUS-COMPOSANT POUR LES ÉTAPES ---
const StepItem = ({ icon, title, desc, isLast }: { icon: React.ReactNode, title: string, desc: string, isLast: boolean }) => (
    <div style={{ display: 'flex', gap: '15px', position: 'relative' }}>
        {!isLast && (
            <div style={{ 
                position: 'absolute', left: '10px', top: '25px', bottom: '-15px', 
                width: '2px', backgroundColor: THEME.border 
            }} />
        )}
        <div style={{ 
            width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#FDFCFB',
            border: `2px solid ${THEME.primary}`, color: THEME.primary,
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1
        }}>
            {icon}
        </div>
        <div>
            <div style={{ fontWeight: '800', fontSize: '0.9rem', color: THEME.text }}>{title}</div>
            <div style={{ fontSize: '0.8rem', color: THEME.muted }}>{desc}</div>
        </div>
    </div>
);

// --- CONTENU PRINCIPAL ---
function SuccessContent() {
    const { clearCart } = useCart();
    const searchParams = useSearchParams();
    
    // Accès sécurisé aux paramètres
    const mode = searchParams ? searchParams.get('mode') : null;
    const initialPhoneFromUrl = searchParams ? searchParams.get('phone') : '';
    
    const [orderId, setOrderId] = useState<string | null>(null);
    const [phone, setPhone] = useState<string>('');
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const hasCleared = useRef(false);

    useEffect(() => {
        const newId = `AGRI-${Math.floor(Math.random() * 90000) + 10000}`;
        setOrderId(newId);
        
        const storedPhone = localStorage.getItem('agri_customer_phone') || '';
        setPhone(initialPhoneFromUrl || storedPhone);

        if (!hasCleared.current) {
            clearCart();
            hasCleared.current = true;
        }
        window.scrollTo(0, 0);
    }, [clearCart, initialPhoneFromUrl]);

    const handlePhoneUpdate = () => {
        localStorage.setItem('agri_customer_phone', phone);
        setIsEditingPhone(false);
    };

    return (
        <div style={{ backgroundColor: THEME.bg, minHeight: '100vh', padding: '40px 20px' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                
                <div style={{ 
                    width: '80px', height: '80px', backgroundColor: '#E8F5E9', color: THEME.green,
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 24px', boxShadow: '0 8px 16px rgba(46, 125, 50, 0.1)'
                }}>
                    <CheckCircle size={40} strokeWidth={2.5} />
                </div>

                <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: THEME.text, marginBottom: '10px' }}>
                    {mode === 'offline' ? 'Commande Enregistrée !' : 'Paiement Confirmé !'}
                </h1>
                
                <p style={{ color: THEME.muted, fontSize: '1rem', marginBottom: '10px' }}>
                    Référence : <strong style={{ color: THEME.text }}>#{orderId || '...'}</strong>
                </p>

                {/* --- BLOC CONTACT --- */}
                <div style={{ 
                    display: 'inline-flex', alignItems: 'center', gap: '8px', 
                    backgroundColor: '#F1EDE9', padding: '6px 14px', borderRadius: '30px', marginBottom: '30px'
                }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: THEME.muted }}>Livreur vous appelle au :</span>
                    {isEditingPhone ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <input 
                                value={phone} 
                                onChange={(e) => setPhone(e.target.value)}
                                style={{ border: '1px solid #CCC', borderRadius: '4px', padding: '2px 8px', width: '120px', fontWeight: 'bold' }}
                            />
                            <button onClick={handlePhoneUpdate} style={{ background: THEME.green, color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' }}>
                                <Check size={14} />
                            </button>
                        </div>
                    ) : (
                        <>
                            <span style={{ fontWeight: '800', color: THEME.text }}>{phone || 'Non renseigné'}</span>
                            <button onClick={() => setIsEditingPhone(true)} style={{ background: 'none', border: 'none', color: THEME.primary, cursor: 'pointer' }}>
                                <Edit2 size={14} />
                            </button>
                        </>
                    )}
                </div>

                {mode === 'offline' && (
                    <div style={{ 
                        backgroundColor: '#FFF8F1', border: `1px solid #FFE0B2`, padding: '15px', 
                        borderRadius: '16px', display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '25px', textAlign: 'left'
                    }}>
                        <Smartphone size={24} color={THEME.accent} />
                        <div>
                            <div style={{ fontWeight: '800', fontSize: '0.85rem', color: THEME.accent }}>MODE HORS-LIGNE</div>
                            <div style={{ fontSize: '0.8rem', color: '#855421' }}>Commande synchronisée dès le retour du réseau.</div>
                        </div>
                    </div>
                )}

                {/* --- ÉTAPES --- */}
                <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '24px', border: `1px solid ${THEME.border}`, textAlign: 'left', marginBottom: '30px' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: THEME.primary }}>
                        <Truck size={18} /> SUIVI DE LIVRAISON
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <StepItem icon={<PackageCheck size={14} />} title="Validation" desc="Le producteur prépare vos produits." isLast={false} />
                        <StepItem icon={<MapPin size={14} />} title="Expédition" desc="Le livreur se rend à votre position GPS." isLast={true} />
                    </div>
                </div>

                {/* --- ACTIONS --- */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <Link href="/market" prefetch={false} style={{ 
                        backgroundColor: THEME.primary, color: 'white', padding: '18px', borderRadius: '16px', 
                        textDecoration: 'none', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'
                    }}>
                        Continuer mes achats <ArrowRight size={20} />
                    </Link>
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => window.print()} style={{ 
                            flex: 1, backgroundColor: 'white', border: `1px solid ${THEME.border}`, padding: '14px', borderRadius: '14px',
                            color: THEME.text, fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                        }}>
                            <Download size={18} /> Reçu
                        </button>
                        
                        <a href={`https://wa.me/226XXXXXXXX?text=Commande ${orderId}. Contact: ${phone}`} 
                           target="_blank" rel="noopener noreferrer" 
                           style={{ 
                            flex: 1, backgroundColor: '#25D366', color: 'white', padding: '14px', borderRadius: '14px',
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

// --- EXPORT FINAL AVEC SUSPENSE ---
export default function OrderSuccessPage() {
    return (
        <Suspense fallback={
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: THEME.bg }}>
                <div style={{ color: THEME.primary, fontWeight: 'bold' }}>Chargement du reçu...</div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}