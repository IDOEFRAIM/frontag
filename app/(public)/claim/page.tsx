'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// --- Styles (Cohérents avec la page d'accueil) ---
const sectionBase = { padding: '60px 24px', maxWidth: '1000px', margin: '0 auto' };
const inputStyle = { 
    width: '100%', padding: '15px', borderRadius: '4px', border: '1px solid #d1d5db', 
    backgroundColor: '#f9fafb', fontSize: '1rem', marginBottom: '20px', fontFamily: 'inherit' 
};
const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#374151' };

export default function ClaimPage() {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        // Simulation d'envoi
        setTimeout(() => setStatus('success'), 2000);
    };

    if (status === 'success') {
        return (
            <div style={{ height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🤝</div>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#064e3b' }}>Message bien reçu.</h1>
                <p style={{ maxWidth: '500px', color: '#666', fontSize: '1.2rem', lineHeight: '1.6' }}>
                    Nos équipes vont analyser votre requête. Si le produit n'était pas à la hauteur, 
                    <strong> nous vous rembourserons ou remplacerons la marchandise sous 24h.</strong>
                </p>
                <p style={{ marginTop: '20px', color: '#888' }}>Vous recevrez une notification par SMS.</p>
                <Link href="/" style={{ marginTop: '40px', color: '#10b981', textDecoration: 'underline', fontWeight: 'bold' }}>Retour à l'accueil</Link>
            </div>
        );
    }

    return (
        <div style={{ fontFamily: 'system-ui, sans-serif', color: '#333' }}>
            
            {/* 1. HEADER : La promesse de confiance */}
            <header style={{ backgroundColor: '#111827', color: 'white', padding: '80px 20px', textAlign: 'center' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '900', marginBottom: '20px' }}>
                        La confiance se prouve quand ça va mal.
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: '#9ca3af', lineHeight: '1.6' }}>
                        Le frais, c'est délicat. La logistique, c'est complexe. 
                        Si nous avons failli à notre promesse de qualité, nous réparons notre erreur. Sans discussion inutile.
                    </p>
                </div>
            </header>

            <div style={{ ...sectionBase, display: 'flex', flexWrap: 'wrap', gap: '60px' }}>
                
                {/* 2. FORMULAIRE GAUCHE */}
                <div style={{ flex: '2', minWidth: '300px' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '30px', borderBottom: '2px solid #10b981', display: 'inline-block', paddingBottom: '10px' }}>
                        Déclarer un incident
                    </h2>
                    
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label style={labelStyle}>Numéro de Commande</label>
                            <input type="text" placeholder="Ex: CMD-83920" required style={inputStyle} />
                        </div>

                        <div>
                            <label style={labelStyle}>Quel est le problème ?</label>
                            <select style={inputStyle} required defaultValue="">
                                <option value="" disabled>Sélectionnez une raison</option>
                                <option value="quality">Produit abîmé / Qualité insuffisante</option>
                                <option value="missing">Produit manquant</option>
                                <option value="delivery">Livraison en retard / Non reçu</option>
                                <option value="other">Autre souci</option>
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>Détails (Soyez précis)</label>
                            <textarea 
                                rows={5} 
                                placeholder="Dites-nous ce qui s'est passé. Nous lisons chaque message." 
                                required 
                                style={{ ...inputStyle, resize: 'vertical' }}
                            />
                        </div>

                        {/* Simulation d'upload de photo (Crucial pour l'AgriTech) */}
                        <div style={{ marginBottom: '30px' }}>
                            <label style={labelStyle}>Preuve Photo (Optionnel mais recommandé)</label>
                            <div style={{ 
                                border: '2px dashed #d1d5db', borderRadius: '4px', padding: '20px', 
                                textAlign: 'center', color: '#6b7280', cursor: 'pointer', backgroundColor: '#f9fafb'
                            }}>
                                <span>📸 Cliquez pour ajouter une photo du produit</span>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={status === 'submitting'}
                            style={{
                                width: '100%', padding: '18px', backgroundColor: status === 'submitting' ? '#9ca3af' : '#10b981',
                                color: 'white', fontWeight: 'bold', fontSize: '1.1rem', border: 'none', borderRadius: '4px',
                                cursor: status === 'submitting' ? 'wait' : 'pointer', transition: 'background-color 0.2s'
                            }}
                        >
                            {status === 'submitting' ? 'Envoi en cours...' : 'Envoyer la réclamation'}
                        </button>
                    </form>
                </div>

                {/* 3. SIDEBAR DROITE : Contact Direct & Politique */}
                <div style={{ flex: '1', minWidth: '280px' }}>
                    <div style={{ backgroundColor: '#f3f4f6', padding: '30px', borderRadius: '4px' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: 0 }}>Besoin d'une réponse immédiate ?</h3>
                        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '20px' }}>
                            Parfois, un formulaire c'est trop long. Appelez-nous directement.
                        </p>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                            <div style={{ width: '40px', height: '40px', backgroundColor: '#25D366', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                📞
                            </div>
                            <div>
                                <div style={{ fontWeight: 'bold' }}>WhatsApp / Appel</div>
                                <div style={{ color: '#10b981' }}>(+226) 70 00 00 00</div>
                            </div>
                        </div>

                        <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '20px 0' }} />

                        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Notre Politique "Zéro Risque"</h3>
                        <ul style={{ paddingLeft: '20px', color: '#4b5563', lineHeight: '1.6', fontSize: '0.9rem' }}>
                            <li style={{ marginBottom: '10px' }}>Remboursement intégral en cas de produit pourri ou avarié.</li>
                            <li style={{ marginBottom: '10px' }}>Remplacement gratuit sur la prochaine livraison.</li>
                            <li>Nous ne vous demanderons pas de renvoyer les légumes abîmés (jetez-les ou compostez-les).</li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
}