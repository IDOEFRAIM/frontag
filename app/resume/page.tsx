'use client';

import React from 'react';
import { 
  FaSitemap, FaShieldAlt, FaLayerGroup, FaExclamationTriangle, 
  FaCheckCircle, FaCodeBranch, FaUserTie, FaTractor, FaShoppingBasket 
} from 'react-icons/fa';

export default function ProjectSummaryPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-800">
      
      {/* HEADER */}
      <header className="max-w-5xl mx-auto mb-12 border-b border-slate-200 pb-6">
        <h1 className="text-4xl font-black text-slate-900 mb-2 flex items-center gap-3">
          <FaSitemap className="text-blue-600" />
          Architecture & Vision du Projet
        </h1>
        <p className="text-lg text-slate-500">
          Résumé technique de l'application Agri-App (Producteurs & Vente Directe).
        </p>
      </header>

      <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-2">

        {/* 1. ARCHITECTURE GLOBALE */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 col-span-2">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-700">
            <FaLayerGroup /> Choix Structurel : Monolithe Next.js
          </h2>
          <p className="text-slate-600 mb-4">
            Nous avons décidé de garder **une seule application** pour gérer à la fois le site public, le dashboard producteur et l'administration.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h3 className="font-bold text-blue-800 mb-1">1. Public (Clients)</h3>
              <p className="text-xs text-blue-600">Site vitrine, catalogue produits, panier.</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <h3 className="font-bold text-green-800 mb-1">2. Producteurs</h3>
              <p className="text-xs text-green-600">Dashboard, Stocks, Ajout vocal, Commandes.</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
              <h3 className="font-bold text-purple-800 mb-1">3. Admin</h3>
              <p className="text-xs text-purple-600">Validation comptes, vue globale, litiges.</p>
            </div>
          </div>
        </section>

        {/* 2. STRUCTURE DES DOSSIERS (CRITIQUE) */}
        <section className="bg-slate-900 text-slate-300 p-6 rounded-2xl shadow-lg font-mono text-sm overflow-x-auto">
          <h2 className="text-white font-bold mb-4 flex items-center gap-2 text-lg">
            <FaCodeBranch /> Structure des Dossiers (Validée)
          </h2>
          <pre className="leading-relaxed">
{`app/
├── (public)/           --> Zone Publique (Invisible URL)
│   ├── page.tsx        --> Accueil (/)
│   └── products/       --> Catalogue Acheteur (/products)
│       └── [id]/
│
├── productor/          --> Zone Producteur (Visible URL)
│   ├── layout.tsx      --> Sidebar / Menu Mobile
│   ├── dashboard/      --> Stats (/productor/dashboard)
│   ├── products/       --> Gestion Stocks (/productor/products)
│   │   ├── add/        --> Formulaire Ajout
│   │   └── page.tsx    --> Liste Stocks
│   └── orders/         --> Gestion Commandes
│
├── admin/              --> Zone Admin (/admin)
│
├── api/                --> Backend (Partagé)
├── components/         --> UI Kit (Boutons, Cards...)
└── middleware.ts       --> SÉCURITÉ (Douane) 👮‍♂️`}
          </pre>
        </section>

        {/* 3. RÈGLES DE ROUTAGE & SÉCURITÉ */}
        <div className="space-y-8">
            {/* Conflits URL */}
            <section className="bg-amber-50 p-6 rounded-2xl border border-amber-200">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2 text-amber-700">
                <FaExclamationTriangle /> Règle Anti-Conflit
            </h2>
            <p className="text-sm text-amber-800 mb-2">
                <strong>Problème :</strong> Si on utilise <code className="bg-amber-100 px-1 rounded">(productor)</code> et <code className="bg-amber-100 px-1 rounded">(public)</code>, les deux dossiers essaient de s'approprier l'URL <code className="font-bold">/products</code>.
            </p>
            <p className="text-sm text-amber-800">
                <strong>Solution :</strong> On enlève les parenthèses du dossier producteur.
                <br />
                <span className="block mt-2 font-mono bg-white p-2 rounded border border-amber-200 text-xs">
                Public : monsite.com/products<br/>
                Producteur : monsite.com/productor/products
                </span>
            </p>
            </section>

            {/* Middleware */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2 text-slate-700">
                <FaShieldAlt className="text-red-500" /> Sécurité (Middleware)
            </h2>
            <ul className="text-sm space-y-2 text-slate-600">
                <li className="flex gap-2">
                    <FaCheckCircle className="text-green-500 mt-0.5" />
                    <span>Bloque l'accès à <strong>/admin</strong> si pas admin.</span>
                </li>
                <li className="flex gap-2">
                    <FaCheckCircle className="text-green-500 mt-0.5" />
                    <span>Bloque l'accès à <strong>/productor</strong> si pas connecté.</span>
                </li>
                <li className="flex gap-2">
                    <FaCheckCircle className="text-green-500 mt-0.5" />
                    <span>Redirige vers /login ou /register automatiquement.</span>
                </li>
            </ul>
            </section>
        </div>

        {/* 4. FONCTIONNALITÉS CLÉS PAR RÔLE */}
        <section className="col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold mb-6 text-slate-800">Fonctionnalités Implémentées / Prévues</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* PUBLIC */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-700 pb-2 border-b">
                    <FaShoppingBasket className="text-blue-500" /> Acheteur
                </div>
                <ul className="text-sm text-slate-500 space-y-2">
                    <li>• Landing Page (Hero, Catégories)</li>
                    <li>• Recherche & Filtres produits</li>
                    <li>• Panier & Checkout (WhatsApp)</li>
                    <li>• Historique achats (si compte créé)</li>
                </ul>
            </div>

            {/* PRODUCTEUR */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-700 pb-2 border-b">
                    <FaTractor className="text-green-500" /> Producteur
                </div>
                <ul className="text-sm text-slate-500 space-y-2">
                    <li className="flex items-center gap-2 text-green-700 font-medium">
                        <FaCheckCircle /> Ajout Produit (Dictaphone/Vocal)
                    </li>
                    <li className="flex items-center gap-2 text-green-700 font-medium">
                        <FaCheckCircle /> Gestion Stocks (Liste & Edit)
                    </li>
                    <li className="flex items-center gap-2 text-green-700 font-medium">
                        <FaCheckCircle /> Gestion Commandes (Workflow)
                    </li>
                    <li>• Profil & Localisation</li>
                </ul>
            </div>

            {/* ADMIN */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-700 pb-2 border-b">
                    <FaUserTie className="text-purple-500" /> Admin
                </div>
                <ul className="text-sm text-slate-500 space-y-2">
                    <li>• Validation des nouveaux producteurs</li>
                    <li>• Vue d'ensemble des ventes</li>
                    <li>• Gestion des catégories</li>
                    <li>• Modération des contenus</li>
                </ul>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}