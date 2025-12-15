// app/page.tsx
import React from 'react';
import Link from 'next/link';
// 👇 ARCHITECTURE : Connexion au Cœur du Système (Service Layer)
import { getProducts } from '@/services/catalogue.service';
import { Product } from '@/types/market';

export const metadata = {
    title: 'AgriConnect | Le Marché Résilient',
    description: "Connecter le Sahel. Sans intermédiaire.",
};

// --- DESIGN SYSTEM : "SAHEL FUTURISTE" ---
const THEME = {
    ocre: '#A63C06',    // La Terre, La Fondation
    green: '#2E7D32',   // Le Sorgho, Le Succès (Plus profond que le vert signal)
    indigo: '#1A237E',  // Le Ciel, Le Faso Dan Fani (Confiance)
    sand: '#F9F9F7',    // Fond doux (Moins agressif que le blanc pur)
    textMain: '#2D2D2D',
    textSub: '#5D4037', // Marron très foncé pour les sous-titres
    white: '#FFFFFF',
    fontHead: 'Oswald, sans-serif', // Police "Affiche", forte pour l'oralité écrite
    fontBody: 'Barlow, sans-serif', // Très lisible sur petits écrans
};

// --- COMPOSANTS UI "RESILIENCE" ---

// Indicateur Audio (Pour le Voice-Commerce)
const VoiceBadge = () => (
    <div style={{ 
        display: 'inline-flex', alignItems: 'center', gap: '5px',
        backgroundColor: '#E8F5E9', color: THEME.green, 
        padding: '4px 8px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold',
        border: `1px solid ${THEME.green}`
    }}>
        <span>🎤</span> <span>AUDIO DISPO</span>
    </div>
);

// Carte Produit Optimisée "Data Saver"
const ProductCardSahel = ({ product }: { product: Product }) => (
    <Link href={`/catalogue?id=${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ 
            backgroundColor: THEME.white,
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)', // Ombre légère, pas gourmande en rendu
            border: `1px solid #eee`,
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        }}>
            {/* Zone Image (Optimisée visuellement) */}
            <div style={{ height: '180px', position: 'relative', backgroundColor: '#ddd' }}>
                <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <div style={{ 
                    position: 'absolute', top: '10px', left: '10px',
                    backgroundColor: THEME.ocre, color: THEME.white,
                    padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                     📍 {(product as any).regionId === 'hauts-bassins' ? 'BOBO' : 
                         (product as any).regionId === 'centre' ? 'OUAGA' : 
                         (product as any).regionId?.toUpperCase() || 'LOCAL'}
                </div>
            </div>

            {/* Zone Info "Orale" et Directe */}
            <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ marginBottom: '8px' }}>
                    <VoiceBadge />
                </div>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: THEME.textMain, fontWeight: '700' }}>
                    {product.name}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#666', margin: '0 0 15px 0', lineHeight: '1.4', flex: 1 }}>
                    {product.description.substring(0, 50)}...
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #ddd', paddingTop: '10px' }}>
                    <div>
                        <span style={{ fontSize: '0.8rem', color: THEME.textSub }}>Prix Producteur</span>
                        <div style={{ color: THEME.ocre, fontWeight: 'bold', fontSize: '1.2rem' }}>
                            {product.price.toLocaleString()} CFA
                        </div>
                    </div>
                    <div style={{ fontSize: '0.8rem', backgroundColor: THEME.sand, padding: '5px', borderRadius: '4px' }}>
                        /{product.unit}
                    </div>
                </div>
            </div>
        </div>
    </Link>
);

// --- PAGE PRINCIPALE (SERVER COMPONENT) ---
export default async function HomePage() {
    
    // 1. CHARGEMENT DES DONNÉES (Simulation Latence Réseau)
    // On récupère les produits pour montrer que le catalogue est "Offline-Ready" (conceptuel)
    const products = await getProducts({ category: 'all' });
    const localStars = products.slice(0, 4); 

    return (
        <div style={{ fontFamily: THEME.fontBody, backgroundColor: THEME.sand, color: THEME.textMain, minHeight: '100vh' }}>
            
            {/* --- HERO SECTION : L'APPEL --- */}
            <header style={{ 
                backgroundColor: THEME.indigo, 
                color: THEME.white, 
                padding: '40px 20px 80px 20px', // Padding bas large pour l'effet de superposition
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Motif de fond abstrait (évoquant le textile ou les ondes) */}
                <div style={{ 
                    position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', 
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                    borderRadius: '50%', transform: 'translate(30%, -30%)'
                }}></div>

                <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
                    <div style={{ display: 'inline-block', backgroundColor: THEME.green, padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '20px' }}>
                        ⚡️ PWA ACTIVE • MODE HORS-LIGNE DISPO
                    </div>
                    
                    <h1 style={{ 
                        fontFamily: THEME.fontHead, 
                        fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', 
                        lineHeight: 1.1, 
                        maxWidth: '800px',
                        margin: '0 0 30px 0'
                    }}>
                        ICI, C'EST LA TERRE<br/>
                        <span style={{ color: '#FFAB91' }}>QUI COMMANDE.</span>
                    </h1>
                    
                    <p style={{ fontSize: '1.2rem', maxWidth: '600px', marginBottom: '40px', opacity: 0.9 }}>
                        Pas de carte Visa ? Pas de problème.<br/>
                        Pas d'adresse précise ? On se repère à la voix.<br/>
                        AgriConnect, c'est le marché qui s'adapte à vous.
                    </p>

                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        <Link href="/catalogue" style={{ 
                            backgroundColor: THEME.ocre, color: THEME.white, 
                            padding: '18px 35px', borderRadius: '4px', fontWeight: 'bold', textDecoration: 'none',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '10px'
                        }}>
                            <span>📦</span> VOIR LES STOCKS
                        </Link>
                        <button style={{ 
                            backgroundColor: 'rgba(255,255,255,0.1)', color: THEME.white, border: '2px solid rgba(255,255,255,0.3)',
                            padding: '18px 35px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer'
                        }}>
                            🎤 COMMENT ÇA MARCHE ?
                        </button>
                    </div>
                </div>
            </header>

            {/* --- SECTION "LE GROUPAGE" (L'Algorithme Communautaire) --- */}
            {/* Cette section "flotte" sur le header pour créer de la profondeur */}
            <div style={{ maxWidth: '1200px', margin: '-40px auto 60px auto', padding: '0 20px', position: 'relative', zIndex: 3 }}>
                <div style={{ 
                    backgroundColor: THEME.white, 
                    borderRadius: '8px', 
                    padding: '30px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                    borderLeft: `6px solid ${THEME.green}`,
                    display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '30px'
                }}>
                    <div style={{ flex: '1 1 300px' }}>
                        <h3 style={{ margin: '0 0 10px 0', color: THEME.green, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px' }}>
                            👥 LA FORCE DU NOMBRE
                        </h3>
                        <h2 style={{ margin: 0, fontFamily: THEME.fontHead, fontSize: '1.8rem', color: THEME.textMain }}>
                            Il y a 5 voisins à Patte d'Oie qui veulent des Oignons.
                        </h2>
                        <p style={{ color: '#666', marginTop: '10px' }}>
                            Commandez ensemble. Le camion ne s'arrête qu'une fois. La livraison devient gratuite.
                        </p>
                    </div>
                    <div style={{ flex: '0 0 auto' }}>
                        <button style={{ 
                            backgroundColor: THEME.textMain, color: THEME.white, 
                            padding: '12px 25px', borderRadius: '30px', border: 'none', fontWeight: 'bold', cursor: 'pointer'
                        }}>
                            REJOINDRE LE GROUPE "OUAGA-SUD" →
                        </button>
                    </div>
                </div>
            </div>

            {/* --- SECTION CATALOGUE (La Preuve par la Data) --- */}
            <section style={{ maxWidth: '1200px', margin: '0 auto 80px auto', padding: '0 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '30px' }}>
                    <div>
                        <h2 style={{ margin: 0, fontFamily: THEME.fontHead, fontSize: '2.5rem', color: THEME.ocre }}>
                            DIRECT DU CHAMP
                        </h2>
                        <p style={{ margin: '5px 0 0 0', color: THEME.textSub }}>
                            Prix fixés par le producteur. Argent sécurisé jusqu'à la livraison.
                        </p>
                    </div>
                    {/* Filtre Rapide Visuel */}
                    <div style={{ display: 'none', md: 'flex', gap: '10px' }}> 
                        {/* Note: Pour simplifier ici, masqué sur mobile, mais idéalement un scroll horizontal */}
                    </div>
                </div>

                {/* Grille de Produits */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '25px' }}>
                    {localStars.map(product => (
                        <ProductCardSahel key={product.id} product={product} />
                    ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <Link href="/catalogue" style={{ 
                        display: 'inline-block', padding: '15px 40px', 
                        border: `2px solid ${THEME.ocre}`, color: THEME.ocre, 
                        fontWeight: 'bold', borderRadius: '4px', textDecoration: 'none',
                        textTransform: 'uppercase', letterSpacing: '1px'
                    }}>
                        Explorer tout le catalogue
                    </Link>
                </div>
            </section>

            {/* --- SECTION CONFIANCE (Mobile Money & Escrow) --- */}
            <section style={{ backgroundColor: '#fff', borderTop: `1px solid #eee`, padding: '80px 20px' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontFamily: THEME.fontHead, fontSize: '2.5rem', marginBottom: '50px' }}>
                        LA CONFIANCE, C'EST TECHNIQUE.
                    </h2>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
                        <div>
                            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🔒</div>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>Coffre-Fort Mobile</h4>
                            <p style={{ color: '#666', fontSize: '0.95rem' }}>
                                Vous payez par Orange/Moov Money. L'argent est bloqué. Le producteur ne touche rien tant que vous n'avez pas validé.
                            </p>
                        </div>
                        <div>
                            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📍</div>
                            <div style={{ display: 'inline-block', backgroundColor: '#E1F5FE', color: '#0288D1', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '10px' }}>NOUVEAU</div>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>Guidage Vocal</h4>
                            <p style={{ color: '#666', fontSize: '0.95rem' }}>
                                Pas d'adresse ? Envoyez un vocal au livreur : <em>"C'est la porte bleue après le maquis."</em>
                            </p>
                        </div>
                        <div>
                            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>⚖️</div>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>Qualité Garantie</h4>
                            <p style={{ color: '#666', fontSize: '0.95rem' }}>
                                Produit gâté ? Photo immédiate, remboursement automatique en 15 minutes.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FOOTER SIMPLE & LÉGER --- */}
            <footer style={{ backgroundColor: THEME.indigo, color: 'rgba(255,255,255,0.7)', padding: '60px 20px', fontSize: '0.9rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ color: THEME.white, fontSize: '1.5rem', fontFamily: THEME.fontHead, marginBottom: '20px' }}>
                        AgriConnect.
                    </div>
                    <p style={{ textAlign: 'center', maxWidth: '500px', marginBottom: '30px' }}>
                        Une infrastructure développée à Ouagadougou pour le Sahel.<br/>
                        Optimisée pour Edge Network (2G/3G).
                    </p>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <span>© 2025 AgriConnect</span>
                        <span>•</span>
                        <a href="#" style={{ color: THEME.white, textDecoration: 'none' }}>Connexion Producteur</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}