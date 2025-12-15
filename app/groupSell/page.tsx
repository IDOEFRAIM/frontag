'use client';

import React, { useState } from 'react';
import Image from 'next/image'; // Assure-toi d'avoir configuré next/image
import { FaPlay, FaPause, FaUsers, FaMapMarkerAlt, FaClock, FaCheckCircle } from 'react-icons/fa';

// --- TYPES (À déplacer plus tard dans types/community.ts) ---
interface Deal {
  id: string;
  title: string;
  organizer: {
    name: string;
    avatar: string; // URL image
    role: string;   // ex: "Ambassadeur AgriConnect"
  };
  productImage: string;
  target: number;
  current: number;
  oldPrice: number;
  newPrice: number;
  location: string;
  timeLeft: string; // ex: "2 jours"
}

// --- DONNÉES DE TEST (MOCK) ---
const MOCK_DEALS: Deal[] = [
  {
    id: '1',
    title: 'Engrais NPK 15-15-15 (Sac 50kg)',
    organizer: {
      name: 'Moussa Koné',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      role: 'Chef de Zone'
    },
    productImage: 'https://images.unsplash.com/photo-1622289694738-4e8979e2c65f?auto=format&fit=crop&w=500&q=60', // Image générique sac
    target: 50,
    current: 42,
    oldPrice: 25000,
    newPrice: 21500,
    location: 'Magasin Central, Ziniare',
    timeLeft: '2 jours'
  },
  {
    id: '2',
    title: 'Semences Maïs Hybride (Boîte)',
    organizer: {
      name: 'Fatou Ouédraogo',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      role: 'Vendeuse Certifiée'
    },
    productImage: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=500&q=60',
    target: 20,
    current: 5,
    oldPrice: 3500,
    newPrice: 2800,
    location: 'Marché de Ségou',
    timeLeft: '5 jours'
  }
];

// --- COMPOSANT CARTE (DealCard) ---
const DealCard = ({ deal }: { deal: Deal }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Calcul du pourcentage pour la barre de progression
  const percentage = Math.min(100, Math.round((deal.current / deal.target) * 100));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col mb-4">
      
      {/* 1. HEADER : L'Organisateur (Confiance) */}
      <div className="p-3 bg-green-50 flex items-center gap-3 border-b border-green-100">
        <div className="relative">
             {/* Avatar rond */}
            <img 
              src={deal.organizer.avatar} 
              alt={deal.organizer.name} 
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
            />
            {/* Badge de vérification */}
            <FaCheckCircle className="absolute -bottom-1 -right-1 text-green-600 bg-white rounded-full text-xs" />
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium">Organisé par</p>
          <p className="text-sm font-bold text-gray-800 leading-tight">{deal.organizer.name}</p>
        </div>
      </div>

      <div className="p-4">
        {/* 2. PRODUIT & PRIX */}
        <div className="flex gap-4 mb-4">
          <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 relative">
             <img src={deal.productImage} alt={deal.title} className="object-cover w-full h-full" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">{deal.title}</h3>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm line-through decoration-red-500">{deal.oldPrice.toLocaleString()} F</span>
              <span className="text-green-700 font-bold text-xl">{deal.newPrice.toLocaleString()} F</span>
            </div>
            <div className="inline-block bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded mt-1">
              Économisez {deal.oldPrice - deal.newPrice} F
            </div>
          </div>
        </div>

        {/* 3. AUDIO PLAYER (Simulation) */}
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className={`w-full mb-4 py-2 px-4 rounded-full flex items-center justify-center gap-2 transition-colors ${
            isPlaying ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'
          } border`}
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
          <span className="font-medium text-sm">
            {isPlaying ? "En lecture..." : `Écouter ${deal.organizer.name.split(' ')[0]} expliquer`}
          </span>
        </button>

        {/* 4. PROGRESSION (Social Proof) */}
        <div className="mb-2">
          <div className="flex justify-between text-xs mb-1 font-medium">
            <span className="text-green-700 flex items-center gap-1">
                <FaUsers /> {deal.current} participants
            </span>
            <span className="text-gray-500">Objectif: {deal.target}</span>
          </div>
          {/* Barre grise */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            {/* Barre verte animée */}
            <div 
              className="bg-green-600 h-full rounded-full transition-all duration-500" 
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-right text-gray-400 mt-1">
            Plus que {deal.target - deal.current} pour valider !
          </p>
        </div>

        {/* 5. INFO LOGISTIQUE */}
        <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-3 mt-3 border-dashed">
            <div className="flex items-center gap-1">
                <FaMapMarkerAlt className="text-gray-400"/> {deal.location}
            </div>
            <div className="flex items-center gap-1 text-orange-600 font-medium">
                <FaClock /> Fin dans {deal.timeLeft}
            </div>
        </div>

        {/* 6. ACTION BUTTON */}
        <button className="w-full mt-4 bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-xl shadow-md active:scale-[0.98] transition-transform">
          Rejoindre le groupe
        </button>

      </div>
    </div>
  );
};

// --- PAGE PRINCIPALE ---
export default function GroupBuyingPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      
      {/* HEADER DE LA PAGE */}
      <header className="bg-white p-5 sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-black text-green-900">La Cour 🌳</h1>
        <p className="text-gray-500 text-sm">
          Achetez ensemble, payez moins cher.
        </p>
      </header>

      {/* LISTE DES DEALS */}
      <main className="p-4">
        {MOCK_DEALS.map(deal => (
          <DealCard key={deal.id} deal={deal} />
        ))}

        {/* Empty State (si pas de deals) */}
        {MOCK_DEALS.length === 0 && (
            <div className="text-center py-10 text-gray-400">
                <p>Aucun achat groupé en cours dans votre zone.</p>
            </div>
        )}
      </main>

    </div>
  );
}