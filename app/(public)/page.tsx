// app/page.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Mic, Zap, ShieldCheck, ArrowUpRight, Cpu, Globe, Target, CheckCircle2, ChevronDown, Truck, Database, Smartphone, HelpCircle
} from 'lucide-react';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
};

const BentoCard = ({ icon: Icon, colSpan, title, desc, highlight = false }: any) => (
    <motion.div 
        whileHover={{ y: -5 }}
        style={{ 
            gridColumn: colSpan, 
            backgroundColor: highlight ? '#e6f4ea' : '#ffffff', 
            borderColor: highlight ? '#b6d7a8' : '#e0e0d1',
            borderRadius: '24px',
            padding: '32px',
            borderWidth: '1px',
            borderStyle: 'solid',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}
    >
        <div style={{ 
            width: '48px', height: '48px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px',
            backgroundColor: highlight ? '#ffffff' : '#f8faf7',
            color: highlight ? '#497a3a' : '#e65100'
        }}>
            <Icon size={24} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#5b4636', marginBottom: '12px' }}>{title}</h3>
        <p style={{ color: '#7c795d', lineHeight: '1.6', fontSize: '0.95rem' }}>{desc}</p>
    </motion.div>
);

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div style={{ borderBottom: '1px solid #e0e0d1', marginBottom: '16px' }}>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >
                <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#5b4636' }}>{question}</span>
                <ChevronDown size={20} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s', color: '#e65100' }} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: 'auto', opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <p style={{ paddingBottom: '24px', color: '#7c795d', lineHeight: '1.6' }}>{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function HomePage() {
    return (
        <div style={{ background: 'linear-gradient(120deg, #f7f5ee 70%, #e6f4ea 100%)', color: '#5b4636', minHeight: '100vh', fontFamily: '"Plus Jakarta Sans", sans-serif', display: 'flex', flexDirection: 'column' }}>
            {/* --- HERO SECTION --- */}
            <header style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 6% 30px', background: 'none' }}>
                <div style={{ maxWidth: '950px', width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '48px' }}>
                    {/* Illustration agricole simple (champ, soleil, main, etc.) */}
                    <div style={{ flex: '0 0 200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="160" height="160" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <ellipse cx="90" cy="140" rx="60" ry="18" fill="#d9ead3" />
                            <ellipse cx="90" cy="150" rx="40" ry="8" fill="#b6d7a8" />
                            <rect x="65" y="90" width="50" height="35" rx="17" fill="#ffe599" />
                            <path d="M65 125 Q90 110 115 125" stroke="#b6d7a8" strokeWidth="5" fill="none" />
                            <circle cx="90" cy="70" r="32" fill="#f9cb9c" />
                            <circle cx="90" cy="70" r="24" fill="#fff2cc" />
                            <rect x="85" y="38" width="8" height="22" rx="4" fill="#93c47d" />
                        </svg>
                    </div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ flex: 1 }}>
                        <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', lineHeight: 1.1, fontWeight: 900, margin: 0, letterSpacing: '-0.03em', color: '#497a3a' }}>
                            Bienvenue sur <span style={{ color: '#e65100' }}>FrontAg</span>
                        </h1>
                        <p style={{ maxWidth: '600px', fontSize: '1.2rem', marginTop: '28px', color: '#6b705c', lineHeight: '1.7', fontWeight: 500 }}>
                            Ici, producteurs et consommateurs du Burkina Faso se rencontrent pour bâtir ensemble l’autosuffisance alimentaire.<br/>
                            <span style={{ color: '#497a3a', fontWeight: 700 }}>Moins de pertes, plus de solidarité, plus de prospérité pour tous.</span>
                        </p>
                        <div style={{ marginTop: '38px' }}>
                            <button style={{ backgroundColor: '#497a3a', color: 'white', padding: '18px 40px', borderRadius: '16px', fontWeight: 700, cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.05rem', boxShadow: '0 4px 16px -4px #497a3a33', transition: 'background 0.2s' }}>
                                Découvrir le marché agricole <ArrowUpRight size={20} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* --- BENTO GRID (Architecture Technique) --- */}
            <section style={{ padding: '0 6% 80px' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#497a3a' }}>Moteur de Croissance Locale</h2>
                    <p style={{ color: '#7c795d', fontSize: '1.1rem', marginTop: '10px' }}>Une architecture robuste pour des enjeux réels.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '28px' }}>
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
            <section style={{ padding: '80px 6%', backgroundColor: '#f8faf7', borderTop: '1px solid #e0e0d1' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
                    <motion.div {...fadeInUp}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '28px', color: '#497a3a' }}>Transformer la terre par la <span style={{ color: '#e65100' }}>Data</span>.</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {[
                                { t: "L'Asymétrie d'Information", d: "Le producteur accède enfin au prix réel du marché mondial en temps réel.", icon: <Target size={22}/> },
                                { t: "Souveraineté des Données", d: "Les données agricoles appartiennent au pays. Nous sécurisons ce patrimoine numérique.", icon: <ShieldCheck size={22}/> }
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ color: '#e65100' }}>{item.icon}</div>
                                    <div>
                                        <h4 style={{ fontWeight: 700, fontSize: '1.08rem', color: '#5b4636' }}>{item.t}</h4>
                                        <p style={{ color: '#7c795d', fontSize: '0.98rem' }}>{item.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                    <motion.div {...fadeInUp} style={{ backgroundColor: '#e6f4ea', borderRadius: '36px', padding: '48px', border: '1px solid #b6d7a8', textAlign: 'center' }}>
                        <CheckCircle2 color="#e65100" size={54} style={{ margin: '0 auto 24px' }} />
                        <div style={{ fontSize: '3.2rem', fontWeight: 900, color: '#e65100', lineHeight: 1 }}>+25%</div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '16px', color: '#497a3a' }}>Revenus Directs</h3>
                        <p style={{ color: '#7c795d', marginTop: '10px', fontSize: '0.98rem' }}>Impact net mesuré pour les coopératives rurales partenaires.</p>
                    </motion.div>
                </div>
            </section>

            {/* --- L'ÉQUIPE --- */}
            <section style={{ padding: '80px 6%' }}>
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#497a3a' }}>L'Équipe engagée</h2>
                    <p style={{ color: '#7c795d', fontSize: '1.05rem' }}>L'alliance de la diaspora et du génie local pour le Burkina.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                    {[
                        { name: "Dr. Issa Traoré", role: "CTO - MIT / Ouaga" },
                        { name: "Mariam Sawadogo", role: "Impact Communautaire" },
                        { name: "Ousmane Ouédraogo", role: "Architecture Cloud" },
                        { name: "Sarah Koné", role: "Expertise Logistique" }
                    ].map((member, i) => (
                        <motion.div key={i} whileHover={{ y: -8 }} style={{ textAlign: 'center', backgroundColor: '#f8faf7', padding: '32px 12px', borderRadius: '24px', border: '1px solid #e0e0d1', transition: 'box-shadow 0.2s' }}>
                            <div style={{ width: 80, height: 80, backgroundColor: '#e6f4ea', borderRadius: '50%', margin: '0 auto 18px' }} />
                            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#497a3a' }}>{member.name}</h4>
                            <p style={{ color: '#e65100', fontSize: '0.92rem', fontWeight: 700, marginTop: '6px' }}>{member.role}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* --- FAQ --- */}
            <section style={{ padding: '60px 6%', borderTop: '1px solid #e0e0d1', background: '#f7f5ee' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '60px' }}>
                    <div>
                        <HelpCircle size={38} color="#e65100" />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '18px', color: '#497a3a' }}>Questions fréquentes</h2>
                    </div>
                    <div>
                        <FAQItem question="Comment garantissez-vous la qualité ?" answer="Chaque lot est inspecté physiquement et les données (humidité, calibre) sont inscrites sur le registre numérique immuable." />
                        <FAQItem question="Fonctionnement sans internet ?" answer="Notre protocole USSD/SMS permet de passer des commandes et certifier des lots en zone blanche, avec synchronisation automatique au retour réseau." />
                        <FAQItem question="Quels sont les frais ?" answer="Nous prélevons 3% sur les transactions réussies, dont 1% alimente un fonds de garantie pour les aléas climatiques." />
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer style={{ padding: '60px 6% 28px', background: 'linear-gradient(120deg, #e6f4ea 60%, #f7f5ee 100%)', color: '#5b4636' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '60px', marginBottom: '36px' }}>
                    <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#497a3a' }}>FRONT<span style={{ color: '#e65100' }}>AG</span></h3>
                        <p style={{ opacity: 0.8, marginTop: '18px', maxWidth: '320px', color: '#7c795d', fontSize: '0.98rem' }}>Indépendance alimentaire et excellence technologique au Burkina Faso.</p>
                    </div>
                    <div>
                        <h5 style={{ fontWeight: 700, marginBottom: '12px', color: '#497a3a', fontSize: '1rem' }}>Contact</h5>
                        <p style={{ opacity: 0.8, color: '#7c795d', fontSize: '0.97rem' }}>Ouagadougou, Zone d'Innovation</p>
                        <p style={{ opacity: 0.8, color: '#7c795d', fontSize: '0.97rem' }}>contact@frontag.bf</p>
                    </div>
                    <div>
                        <h5 style={{ fontWeight: 700, marginBottom: '12px', color: '#497a3a', fontSize: '1rem' }}>Souveraineté</h5>
                        <p style={{ opacity: 0.8, color: '#7c795d', fontSize: '0.97rem' }}>Burkina Faso</p>
                        <p style={{ opacity: 0.8, color: '#7c795d', fontSize: '0.97rem' }}>© 2025</p>
                    </div>
                </div>
                <div style={{ borderTop: '1px solid #b6d7a8', paddingTop: '18px', textAlign: 'center', opacity: 0.7, fontSize: '0.93rem', color: '#7c795d' }}>
                    LA PATRIE OU LA MORT, NOUS VAINCRONS.
                </div>
            </footer>
        </div>
    );
}