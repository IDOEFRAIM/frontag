'use client';

import React from 'react';
import Navbar from '@/components/utils/Navbar'; 
import CartFloatingIcon from '@/components/utils/CartFloating'; 
// Importation du surveillant de synchronisation
import SyncProvider from '@/services/syncProvider'; 

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <> 
      {/* 1. Surveillance de la synchronisation (Invisible à l'écran) */}
      <SyncProvider />

      {/* 2. Navbar : Visible en haut de toutes les pages publiques */}
      <Navbar /> 

      {/* 3. Contenu Principal de la Page */}
      <main 
        className="flex-grow p-4 md:p-6" 
        style={{ minHeight: 'calc(100vh - 64px)' }} 
      > 
        {children}
      </main>
      
      {/* 4. Bouton Panier Flottant : Visible sur les pages d'achat */}
      <CartFloatingIcon /> 
    </>
  );
}