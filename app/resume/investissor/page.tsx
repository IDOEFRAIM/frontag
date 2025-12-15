'use client';

import React from 'react';
import { 
  FaMicrophone, FaServer, FaMobileAlt, FaDatabase, 
  FaUserAstronaut, FaTractor, FaArrowRight, FaShieldAlt, FaCogs, FaChartLine 
} from 'react-icons/fa';

export default function InvestorDeckPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      
      {/* 1. HERO SECTION : La Proposition de Valeur */}
      <header className="bg-slate-900 text-white pt-20 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="inline-block bg-green-600 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
            Architecture & Vision
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            Le "Pont Numérique" Agricole
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl leading-relaxed">
            Comment notre architecture transforme la voix d'un producteur analphabète en une donnée e-commerce structurée et vendable instantanément.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 -mt-10">

        {/* 2. LE CŒUR DU SYSTÈME : THE "MAGIC" FLOW */}
        {/* C'est ici qu'on montre le lien entre les composants */}
        <section className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-slate-200">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <FaCogs className="text-blue-600" />
            La Mécanique : De la Voix au Panier
          </h2>

          <div className="grid md:grid-cols-4 gap-4 relative">
            {/* ÉTAPE 1 : INPUT */}
            <div className="bg-green-50 p-6 rounded-xl border border-green-100 flex flex-col items-center text-center relative z-10">
              <div className="bg-green-600 text-white p-4 rounded-full mb-4 shadow-lg">
                <FaTractor size={24} />
              </div>
              <h3 className="font-bold text-slate-900">1. Producteur</h3>
              <p className="text-xs text-slate-500 mt-2 mb-3">Interface Simplifiée</p>
              <div className="bg-white px-3 py-2 rounded text-xs font-mono text-green-700 w-full border border-green-200">
                &lt;VoiceRecorder /&gt;
              </div>
              <p className="text-xs mt-2 leading-tight text-slate-600">
                Capture un <strong>Blob Audio</strong> (La description) + Photo. Zéro texte requis.
              </p>
            </div>

            {/* FLÈCHE DE TRANSITION */}
            <div className="hidden md:flex absolute top-1/2 left-[22%] right-[25%] h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
            
            {/* ÉTAPE 2 : PROCESSING (BACKEND) */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex flex-col items-center text-center relative z-10">
              <div className="bg-blue-600 text-white p-4 rounded-full mb-4 shadow-lg">
                <FaServer size={24} />
              </div>
              <h3 className="font-bold text-slate-900">2. Moteur Next.js</h3>
              <p className="text-xs text-slate-500 mt-2 mb-3">API & Normalisation</p>
              <div className="bg-white px-3 py-2 rounded text-xs font-mono text-blue-700 w-full border border-blue-200">
                POST /api/products
              </div>
              <p className="text-xs mt-2 leading-tight text-slate-600">
                Reçoit l'audio & l'image. Crée une entrée Base de Données "Produit".
              </p>
            </div>

            {/* FLÈCHE DE TRANSITION */}
            <div className="hidden md:flex absolute top-1/2 left-[50%] right-[25%] h-1 bg-gray-200 -translate-y-1/2 z-0"></div>

            {/* ÉTAPE 3 : OUTPUT (PUBLIC) */}
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 flex flex-col items-center text-center relative z-10">
              <div className="bg-purple-600 text-white p-4 rounded-full mb-4 shadow-lg">
                <FaUserAstronaut size={24} />
              </div>
              <h3 className="font-bold text-slate-900">3. Acheteur</h3>
              <p className="text-xs text-slate-500 mt-2 mb-3">Marketplace Public</p>
              <div className="bg-white px-3 py-2 rounded text-xs font-mono text-purple-700 w-full border border-purple-200">
                &lt;ProductCard /&gt;
              </div>
              <p className="text-xs mt-2 leading-tight text-slate-600">
                Le fichier Audio devient un <strong>Player</strong>. Le produit est achetable.
              </p>
            </div>

            {/* ÉTAPE 4 : CONVERSION */}
            <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100 flex flex-col items-center text-center relative z-10">
                <div className="bg-yellow-500 text-white p-4 rounded-full mb-4 shadow-lg">
                    <FaMobileAlt size={24} />
                </div>
                <h3 className="font-bold text-slate-900">4. Transaction</h3>
                <p className="text-xs text-slate-500 mt-2 mb-3">Conversion</p>
                <div className="bg-white px-3 py-2 rounded text-xs font-mono text-yellow-700 w-full border border-yellow-200">
                    WhatsApp API
                </div>
                <p className="text-xs mt-2 leading-tight text-slate-600">
                    Mise en relation directe pour sécuriser la vente.
                </p>
            </div>

          </div>
        </section>

        {/* 3. PHILOSOPHIE TECHNIQUE (POURQUOI ÇA MARCHE) */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
            
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <FaMicrophone className="text-green-600" />
                    Philosophie "Voice First"
                </h3>
                <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                    Contrairement aux plateformes classiques (Amazon, Jumia) qui exigent du texte, notre architecture traite <strong>le fichier audio comme une donnée de première classe</strong> (First-Class Citizen).
                </p>
                <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs mt-0.5">1</div>
                        <span className="text-slate-700">Le composant <code className="bg-slate-100 px-1 rounded">AudioRecorder</code> supprime la barrière de l'illettrisme.</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs mt-0.5">2</div>
                        <span className="text-slate-700">L'audio est stocké et streamé directement sur la carte produit de l'acheteur.</span>
                    </li>
                </ul>
            </section>

            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <FaShieldAlt className="text-blue-600" />
                    Architecture Unifiée (Monolith)
                </h3>
                <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                    Nous utilisons une seule instance Next.js pour gérer trois écosystèmes distincts. Cela réduit les coûts de maintenance par 3.
                </p>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-4 mb-2">
                        <span className="text-xs font-bold text-slate-400 w-16">SHARED</span>
                        <div className="h-2 bg-blue-500 rounded flex-1 opacity-20"></div>
                        <span className="text-xs text-slate-500">Base de Données, Types, Authentification</span>
                    </div>
                    <div className="flex items-center gap-4 mb-2">
                        <span className="text-xs font-bold text-slate-400 w-16">UI KIT</span>
                        <div className="h-2 bg-green-500 rounded flex-1 opacity-20"></div>
                        <span className="text-xs text-slate-500">Boutons, Cartes, Inputs (Réutilisables)</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-slate-400 w-16">LOGIC</span>
                        <div className="h-2 bg-purple-500 rounded flex-1 opacity-20"></div>
                        <span className="text-xs text-slate-500">Middleware de Sécurité</span>
                    </div>
                </div>
            </section>
        </div>

        {/* 4. SCALABILITÉ & AVENIR */}
        <section className="bg-slate-900 text-slate-300 p-8 rounded-2xl relative overflow-hidden">
            <div className="relative z-10">
                <h2 className="text-2xl text-white font-bold mb-4 flex items-center gap-3">
                    <FaChartLine />
                    Scalabilité & IA (Roadmap)
                </h2>
                <p className="mb-6 max-w-2xl">
                    L'architecture actuelle est prête pour l'intégration de l'Intelligence Artificielle sans refonte majeure.
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                        <h4 className="text-white font-bold mb-2">Speech-to-Text</h4>
                        <p className="text-sm text-slate-400">
                            Transformation automatique de l'audio du producteur en texte pour le SEO (Référencement).
                        </p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                        <h4 className="text-white font-bold mb-2">Classification Auto</h4>
                        <p className="text-sm text-slate-400">
                            Analyse de l'image pour suggérer la catégorie (Tomate vs Maïs) automatiquement.
                        </p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                        <h4 className="text-white font-bold mb-2">Agrégation</h4>
                        <p className="text-sm text-slate-400">
                            Regroupement intelligent des petits stocks pour vendre aux grossistes (B2B).
                        </p>
                    </div>
                </div>
            </div>
            {/* Décoration d'arrière-plan */}
            <div className="absolute -right-10 -bottom-20 opacity-10 text-white">
                <FaDatabase size={300} />
            </div>
        </section>

      </main>
    </div>
  );
}