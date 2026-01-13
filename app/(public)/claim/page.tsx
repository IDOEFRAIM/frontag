'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { 
    AlertCircle, Camera, ChevronLeft, Phone, 
    ShieldCheck, Truck, RefreshCcw, CheckCircle2, 
    HeartHandshake, X, Image as ImageIcon 
} from 'lucide-react';

const THEME = {
    primary: '#A63C06',    // Ocre Terre
    secondary: '#2E7D32',  // Vert Feuille
    bg: '#FDFCFB',         // Sable très clair
    surface: '#FFFFFF',
    border: '#F1EDE9',     // Bordure beige
    muted: '#7F8C8D',
    text: '#2D3436'
};

const inputStyle = { 
    width: '100%', 
    padding: '14px 16px', 
    borderRadius: '12px', 
    border: `1.5px solid ${THEME.border}`, 
    backgroundColor: '#FFF', 
    fontSize: '0.95rem', 
    color: THEME.text,
    outline: 'none',
    transition: 'border-color 0.2s ease'
};

type ClaimFormData = {
    orderNumber: string;
    issueType: string;
    details: string;
};

export default function ClaimPage() {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const { register, handleSubmit, formState: { errors } } = useForm<ClaimFormData>();

    const onSubmit = (data: ClaimFormData) => {
        setStatus('submitting');
        console.log('Form Data:', data);
        // Simulate API call
        setTimeout(() => setStatus('success'), 2000);
    };

    // --- LOGIQUE DE SÉCURITÉ IMAGE ---
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 1. Restriction stricte du type MIME
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert("⚠️ Sécurité : Seules les images (JPG, PNG, WEBP) sont acceptées.");
            return;
        }

        // 2. Limitation de taille (5 Mo)
        if (file.size > 5 * 1024 * 1024) {
            alert("Fichier trop lourd (max 5 Mo).");
            return;
        }

        setPreviewUrl(URL.createObjectURL(file));
    };

    const removeImage = () => {
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    if (status === 'success') {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px', backgroundColor: THEME.bg }}>
                <CheckCircle2 size={64} color={THEME.secondary} style={{ marginBottom: '24px' }} />
                <h1 style={{ fontSize: '2.2rem', fontWeight: '900', color: THEME.primary, marginBottom: '12px' }}>Requête enregistrée.</h1>
                <p style={{ maxWidth: '450px', color: THEME.muted, fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '40px' }}>
                    Nos équipes analysent vos photos. Une solution de remplacement ou de remboursement vous sera envoyée par SMS sous 24h.
                </p>
                <Link href="/market" style={{ backgroundColor: THEME.primary, color: 'white', padding: '18px 40px', borderRadius: '16px', textDecoration: 'none', fontWeight: '900' }}>
                    Retour au Marché
                </Link>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: THEME.bg, minHeight: '100vh', paddingBottom: '60px' }}>
            
            {/* HEADER ALIGNÉ */}
            <header style={{ 
                background: `linear-gradient(135deg, #FDFCFB 0%, #F1EDE9 100%)`, 
                padding: '60px 24px', textAlign: 'center', borderBottom: `1px solid ${THEME.border}` 
            }}>
                <Link href="/market" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: THEME.primary, textDecoration: 'none', fontWeight: '800', fontSize: '0.9rem', marginBottom: '20px' }}>
                    <ChevronLeft size={18} /> Retour au marché
                </Link>
                <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                    <div style={{ 
                        display: 'inline-flex', padding: '8px 16px', backgroundColor: '#FFF', 
                        borderRadius: '30px', border: `1px solid ${THEME.border}`, 
                        marginBottom: '16px', color: THEME.primary, fontWeight: 'bold', fontSize: '0.8rem', gap: '8px', alignItems: 'center' 
                    }}>
                        <HeartHandshake size={16} /> SERVICE CLIENTS PRIVILÈGE
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: THEME.text, marginBottom: '15px', letterSpacing: '-0.02em' }}>
                        Zéro risque, 100% confiance.
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: THEME.muted, lineHeight: '1.5' }}>
                        Si un produit ne vous satisfait pas, nous le remplaçons. C'est notre contrat de confiance.
                    </p>
                </div>
            </header>

            <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px', display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
                
                {/* BLOC FORMULAIRE */}
                <div style={{ flex: '1.5', minWidth: '320px', backgroundColor: '#FFF', padding: '40px', borderRadius: '28px', border: `1px solid ${THEME.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: '900', marginBottom: '30px', color: THEME.primary, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <AlertCircle size={24} /> Déclarer un incident
                    </h2>
                    
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>NUMÉRO DE COMMANDE</label>
                            <input 
                                {...register('orderNumber', { required: true })}
                                type="text" 
                                placeholder="CMD-XXXXX" 
                                style={inputStyle} 
                            />
                            {errors.orderNumber && <span style={{ color: 'red', fontSize: '0.8rem' }}>Ce champ est requis</span>}
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>TYPE DE PROBLÈME</label>
                            <select {...register('issueType', { required: true })} style={inputStyle}>
                                <option value="">Sélectionnez une raison</option>
                                <option value="quality">Produit abîmé ou non conforme</option>
                                <option value="missing">Article manquant</option>
                                <option value="delivery">Problème de livraison</option>
                            </select>
                            {errors.issueType && <span style={{ color: 'red', fontSize: '0.8rem' }}>Ce champ est requis</span>}
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>DÉTAILS (SOYEZ PRÉCIS)</label>
                            <textarea 
                                {...register('details', { required: true })}
                                rows={3} 
                                placeholder="Expliquez-nous le souci..." 
                                style={{ ...inputStyle, resize: 'none' }} 
                            />
                            {errors.details && <span style={{ color: 'red', fontSize: '0.8rem' }}>Ce champ est requis</span>}
                        </div>

                        {/* SECTION PHOTO SÉCURISÉE */}
                        <div style={{ marginBottom: '30px' }}>
                            <label style={labelStyle}>PREUVE PHOTO (OBLIGATOIRE)</label>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileChange} 
                                accept="image/jpeg,image/png,image/webp" 
                                style={{ display: 'none' }} 
                            />

                            {!previewUrl ? (
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{ 
                                        border: `2px dashed ${THEME.border}`, borderRadius: '18px', padding: '30px', 
                                        textAlign: 'center', cursor: 'pointer', backgroundColor: THEME.bg,
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                                        transition: 'background 0.2s'
                                    }}
                                >
                                    <Camera size={32} color={THEME.primary} />
                                    <div>
                                        <div style={{ fontWeight: '800', fontSize: '0.9rem', color: THEME.primary }}>Prendre une photo du produit</div>
                                        <div style={{ fontSize: '0.75rem', color: THEME.muted, marginTop: '4px' }}>Uniquement JPG, PNG, WEBP (Max 5Mo)</div>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ position: 'relative', borderRadius: '18px', overflow: 'hidden', border: `2px solid ${THEME.secondary}` }}>
                                    <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                                    <button 
                                        type="button" 
                                        onClick={removeImage}
                                        style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <X size={18} />
                                    </button>
                                    <div style={{ backgroundColor: '#F6FBF7', padding: '10px', fontSize: '0.85rem', color: THEME.secondary, fontWeight: '800', textAlign: 'center' }}>
                                        Image prête pour analyse sécurisée
                                    </div>
                                </div>
                            )}
                        </div>

                        <button type="submit" style={{
                            width: '100%', padding: '20px', backgroundColor: THEME.primary,
                            color: 'white', fontWeight: '900', fontSize: '1.1rem', border: 'none', borderRadius: '18px',
                            cursor: 'pointer', boxShadow: '0 6px 20px rgba(166, 60, 6, 0.15)'
                        }}>
                            {status === 'submitting' ? 'ENVOI EN COURS...' : 'ENVOYER MA RÉCLAMATION'}
                        </button>
                    </form>
                </div>

                {/* SIDEBAR D'ASSURANCE */}
                <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ backgroundColor: '#F6FBF7', padding: '30px', borderRadius: '24px', border: '1px solid #E1EFE3' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '900', color: THEME.secondary, marginBottom: '20px' }}>Aide immédiate</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ width: '45px', height: '45px', backgroundColor: THEME.secondary, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                <Phone size={20} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: THEME.muted, fontWeight: 'bold' }}>WHATSAPP / APPEL</div>
                                <div style={{ fontWeight: '900', fontSize: '1rem' }}>+226 70 00 00 00</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '24px', border: `1px solid ${THEME.border}` }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '900', marginBottom: '20px' }}>Garanties AgriConnect</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            <Commitment icon={<RefreshCcw size={18} />} text="Remplacement sans frais sur votre prochaine commande." />
                            <Commitment icon={<ShieldCheck size={18} />} text="Remboursement garanti si le produit est avarié." />
                            <Commitment icon={<Truck size={18} />} text="Pas besoin de renvoyer le produit défectueux." />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: '800', fontSize: '0.8rem', color: THEME.muted };

const Commitment = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <div style={{ color: THEME.primary, marginTop: '2px' }}>{icon}</div>
        <p style={{ margin: 0, fontSize: '0.85rem', color: THEME.muted, fontWeight: '600', lineHeight: '1.4' }}>{text}</p>
    </div>
);