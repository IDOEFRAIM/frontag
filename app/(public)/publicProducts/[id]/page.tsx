import React from 'react';
import Link from 'next/link';
import { getProductById } from '@/services/catalogue.service';
import { Product } from '@/types/market'; // Attention: utilise ton type standardisé
import ProductClientView from './ProductView'; // Ton composant vue client

// --- THEME ---
const THEME = {
    ocre: '#A63C06',
    sand: '#F9F9F7',
    textMain: '#2D2D2D',
    textSub: '#5D4037',
    border: '2px solid #E0E0E0',
    fontHead: 'Oswald, sans-serif',
};

interface ProductDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProductDetailPage(props: ProductDetailPageProps) {
    const params = await props.params;
    const id = params.id;

    let product: Product | undefined | null = null;
    let error: string | null = null;

    try {
        product = await getProductById(id);
        if (!product) {
            error = 'Lot non trouvé.';
        }
    } catch (err: any) {
        error = 'Impossible de synchroniser les données du stock.';
    }

    // --- GESTION "STOCK INTROUVABLE" (Style Résilient) ---
    if (error || !product) {
        return (
            <div style={{ 
                minHeight: '80vh', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                textAlign: 'center',
                padding: '20px',
                backgroundColor: THEME.sand,
                fontFamily: 'Barlow, sans-serif'
            }}>
                
                {/* Bloc central rigide */}
                <div style={{ 
                    maxWidth: '600px', 
                    padding: '40px', 
                    border: `4px solid ${THEME.ocre}`, // Cadre épais couleur terre
                    backgroundColor: 'white',
                    boxShadow: '10px 10px 0 rgba(0,0,0,0.1)' // Ombre dure
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📉</div>

                    <h1 style={{ 
                        fontFamily: THEME.fontHead, 
                        fontSize: '2rem', 
                        color: THEME.textMain, 
                        margin: '0 0 20px 0',
                        textTransform: 'uppercase'
                    }}>
                        Lot non localisé
                    </h1>
                    
                    <div style={{ 
                        backgroundColor: '#FFF3E0', 
                        padding: '15px', 
                        borderLeft: `4px solid ${THEME.ocre}`,
                        marginBottom: '30px',
                        textAlign: 'left'
                    }}>
                        <p style={{ margin: 0, color: THEME.textSub, fontWeight: 'bold' }}>
                            Détail technique (ID: {id})
                        </p>
                        <p style={{ margin: '5px 0 0 0', color: '#444' }}>
                            Ce stock a peut-être été entièrement vendu, retiré par la coopérative, ou le lien est expiré.
                        </p>
                    </div>

                    {/* Boutons d'action "Industriels" */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <Link 
                            href="/catalogue" 
                            style={{
                                display: 'block',
                                padding: '15px 30px',
                                backgroundColor: THEME.ocre,
                                color: 'white',
                                textDecoration: 'none',
                                fontWeight: '900',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                border: 'none',
                                transition: 'all 0.2s'
                            }}
                        >
                            ← Retour aux Arrivages
                        </Link>

                        <Link 
                            href="/" 
                            style={{
                                display: 'block',
                                padding: '15px 30px',
                                backgroundColor: 'transparent',
                                color: THEME.textMain,
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                border: `2px solid ${THEME.textMain}`,
                                textTransform: 'uppercase'
                            }}
                        >
                            Contacter le support
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Si tout va bien, on passe le relais au composant client
    return <ProductClientView product={product} />;
}