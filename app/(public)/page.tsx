// app/page.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, Zap, ShieldCheck, ArrowUpRight, Cpu, Globe, 
  Target, CheckCircle2, ChevronDown, Truck, Database, Smartphone,
  HelpCircle
} from 'lucide-react';

const THEME = {
    background: '#F9F7F2',
    surface: '#FFFFFF',
    primary: '#E65100', 
    accent: '#2E5BFF',
    text: '#0F172A',
    muted: '#64748B',
    border: '#EDEAE4',
    shadow: '0 4px 20px -4px rgba(0,0,0,0.05)',
};

// --- COMPOSANTS INTERACTIFS ---

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

const BentoCard = ({ icon: Icon, title, desc, colSpan, highlight = false }) => (
    <motion.div 
        variants={fadeInUp}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
        whileHover={{ y: -8, boxShadow: '0 20px 40px -12px rgba(0,0,0,0.08)' }}
        style={{ 
            gridColumn: colSpan, 
            backgroundColor: highlight ? THEME.text : THEME.surface, 
            borderRadius: '32px', 
            padding: '48px', 
            border: `1px solid ${THEME.border}`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            boxShadow: THEME.shadow,
            color: highlight ? 'white' : THEME.text,
            minHeight: '340px'
        }}
    >
        <div style={{ 
            width: '64px', height: '64px', 
            backgroundColor: highlight ? 'rgba(255,255,255,0.1)' : '#F1F5F9', 
            borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' 
        }}>
            <Icon color={highlight ? 'white' : THEME.primary} size={30} />
        </div>
        <div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.03em' }}>{title}</h3>
            <p style={{ color: highlight ? 'rgba(255,255,255,0.7)' : THEME.muted, fontSize: '1.1rem', lineHeight: '1.6' }}>{desc}</p>
        </div>
    </motion.div>
);

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div style={{ borderBottom: `1px solid ${THEME.border}`, padding: '24px 0' }}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}
            >
                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: THEME.text }}>{question}</span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }}><ChevronDown size={20} color={THEME.muted} /></motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.p 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ marginTop: '16px', color: THEME.muted, lineHeight: '1.6', overflow: 'hidden' }}
                    >
                        {answer}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function HomePage() {
    return (
        <div style={{ backgroundColor: THEME.background, color: THEME.text, minHeight: '100vh', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            
            {/* --- HERO SECTION --- */}
            <header style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', padding: '120px 8% 60px' }}>
                <div style={{ maxWidth: '900px' }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: '100px', marginBottom: '32px' }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10B981' }} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Standard National V2.6</span>
                        </div>
                        <h1 style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)', lineHeight: 1, fontWeight: 900, margin: 0, letterSpacing: '-0.04em' }}>
                            PILIER DE <span style={{ color: THEME.primary }}>CONFIANCE</span> <br/>
                            NUMÉRIQUE DU SAHEL.
                        </h1>
                        <p style={{ maxWidth: '600px', fontSize: '1.3rem', marginTop: '40px', color: THEME.muted, lineHeight: '1.7' }}>
                            Infrastructure de marché souveraine garantissant la traçabilité et la prospérité des récoltes du Burkina Faso.
                        </p>
                        <div style={{ marginTop: '56px' }}>
                            <button style={{ backgroundColor: THEME.text, color: 'white', padding: '24px 48px', borderRadius: '18px', fontWeight: 700, cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.1rem' }}>
                                Déployer le catalogue <ArrowUpRight size={22} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* --- BENTO GRID (Architecture Technique) --- */}
            <section style={{ padding: '0 8% 120px' }}>
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <h2 style={{ fontSize: '2.8rem', fontWeight: 800 }}>Moteur de Croissance Locale</h2>
                    <p style={{ color: THEME.muted, fontSize: '1.2rem', marginTop: '12px' }}>Une architecture technique robuste pour des enjeux réels.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '32px' }}>
                    <BentoCard 
                        icon={Truck} colSpan="span 8"
                        title="Algorithme de Collecte"
                        desc="Optimisation dynamique des routes pour les producteurs ruraux. Réduction de 40% des pertes post-récolte via le routage prédictif."
                    />
                    <BentoCard 
                        icon={Mic} colSpan="span 4" highlight={true}
                        title="Inclusion Vocale"
                        desc="Interface certifiée en Mooré, Dioula et Fulfuldé pour une accessibilité totale sans barrière d'alphabétisation."
                    />
                    <BentoCard 
                        icon={Database} colSpan="span 5"
                        title="Edge Ledger"
                        desc="Registre décentralisé capable de certifier chaque sac de récolte même sans connexion internet stable."
                    />
                    <BentoCard 
                        icon={Smartphone} colSpan="span 7"
                        title="Micro-Crédit Instantané"
                        desc="Accès au financement basé sur l'identité numérique agricole et l'historique de production certifié."
                    />
                </div>
            </section>

            {/* --- VISION & IMPACT --- */}
            <section style={{ padding: '120px 8%', backgroundColor: THEME.surface, borderTop: `1px solid ${THEME.border}` }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '100px', alignItems: 'center' }}>
                    <motion.div {...fadeInUp}>
                        <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '40px' }}>Transformer la terre par la <span style={{ color: THEME.primary }}>Data</span>.</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            {[
                                { t: "L'Asymétrie d'Information", d: "Le producteur accède enfin au prix réel du marché mondial en temps réel.", icon: <Target size={24}/> },
                                { t: "Souveraineté des Données", d: "Les données agricoles appartiennent au pays. Nous sécurisons ce patrimoine numérique.", icon: <ShieldCheck size={24}/> }
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', gap: '20px' }}>
                                    <div style={{ color: THEME.primary }}>{item.icon}</div>
                                    <div>
                                        <h4 style={{ fontWeight: 700, fontSize: '1.2rem' }}>{item.t}</h4>
                                        <p style={{ color: THEME.muted, fontSize: '1rem' }}>{item.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                    <motion.div {...fadeInUp} style={{ backgroundColor: THEME.background, borderRadius: '48px', padding: '80px', border: `1px solid ${THEME.border}`, textAlign: 'center' }}>
                        <CheckCircle2 color={THEME.primary} size={64} style={{ margin: '0 auto 32px' }} />
                        <div style={{ fontSize: '5rem', fontWeight: 900, color: THEME.primary, lineHeight: 1 }}>+25%</div>
                        <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '20px' }}>Revenus Directs</h3>
                        <p style={{ color: THEME.muted, marginTop: '16px' }}>Impact net mesuré pour les coopératives ruraux partenaires.</p>
                    </motion.div>
                </div>
            </section>

            {/* --- L'ÉQUIPE --- */}
            <section style={{ padding: '120px 8%' }}>
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>L'Élite au service du Sillon</h2>
                    <p style={{ color: THEME.muted }}>L'alliance de la diaspora et du génie local pour le Burkina.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px' }}>
                    {[
                        { name: "Dr. Issa Traoré", role: "CTO - MIT / Ouaga" },
                        { name: "Mariam Sawadogo", role: "Impact Communautaire" },
                        { name: "Ousmane Ouédraogo", role: "Architecture Cloud" },
                        { name: "Sarah Koné", role: "Expertise Logistique" }
                    ].map((member, i) => (
                        <motion.div key={i} whileHover={{ y: -10 }} style={{ textAlign: 'center', backgroundColor: THEME.surface, padding: '40px 20px', borderRadius: '32px', border: `1px solid ${THEME.border}` }}>
                            <div style={{ width: 100, height: 100, backgroundColor: THEME.background, borderRadius: '50%', margin: '0 auto 24px' }} />
                            <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{member.name}</h4>
                            <p style={{ color: THEME.primary, fontSize: '0.9rem', fontWeight: 700, marginTop: '8px' }}>{member.role}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* --- FAQ --- */}
            <section style={{ padding: '100px 8%', borderTop: `1px solid ${THEME.border}` }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '100px' }}>
                    <div>
                        <HelpCircle size={48} color={THEME.primary} />
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '24px' }}>Questions <br/> Fréquentes</h2>
                    </div>
                    <div>
                        <FAQItem question="Comment garantissez-vous la qualité ?" answer="Chaque lot est inspecté physiquement et les données (humidité, calibre) sont inscrites sur le registre numérique immuable." />
                        <FAQItem question="Fonctionnement sans internet ?" answer="Notre protocole USSD/SMS permet de passer des commandes et certifier des lots en zone blanche, avec synchronisation automatique au retour réseau." />
                        <FAQItem question="Quels sont les frais ?" answer="Nous prélevons 3% sur les transactions réussies, dont 1% alimente un fonds de garantie pour les aléas climatiques." />
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer style={{ padding: '100px 8% 60px', backgroundColor: THEME.text, color: 'white' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '80px', marginBottom: '80px' }}>
                    <div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>AGRI<span style={{ color: THEME.primary }}>CONNECT</span></h3>
                        <p style={{ opacity: 0.6, marginTop: '24px', maxWidth: '300px' }}>Indépendance alimentaire et excellence technologique au Burkina Faso.</p>
                    </div>
                    <div>
                        <h5 style={{ fontWeight: 700, marginBottom: '20px' }}>Contact</h5>
                        <p style={{ opacity: 0.6 }}>Ouagadougou, Zone d'Innovation</p>
                        <p style={{ opacity: 0.6 }}>contact@agriconnect.bf</p>
                    </div>
                    <div>
                        <h5 style={{ fontWeight: 700, marginBottom: '20px' }}>Souveraineté</h5>
                        <p style={{ opacity: 0.6 }}>Burkina Faso</p>
                        <p style={{ opacity: 0.6 }}>© 2025</p>
                    </div>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '40px', textAlign: 'center', opacity: 0.4, fontSize: '0.85rem' }}>
                    LA PATRIE OU LA MORT, NOUS VAINCRONS.
                </div>
            </footer>
        </div>
    );
}