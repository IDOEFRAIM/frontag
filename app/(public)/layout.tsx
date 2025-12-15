import React from 'react';
// IMPORTANT : Nous réutilisons la Navbar qui utilise useCart(), car le CartProvider est dans RootLayout
import Navbar from '@/components/utils/Navbar'; 
// Assurez-vous d'avoir ce composant de panier flottant
import CartFloatingIcon from '@/components/utils/CartFloating'; 

/**
 * PublicLayout englobe toutes les routes destinées aux clients (acheteurs).
 * Il fournit la structure visuelle standard du site e-commerce :
 * 1. La Navbar en haut.
 * 2. L'icône de panier flottante.
 * 3. Le contenu principal.
 * * NOTE : Ce layout n'inclut PAS les balises <html> ou <body>,
 * car elles sont définies uniquement dans app/layout.tsx (le Root Layout).
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Utilisation d'un Fragment (<>) pour englober les composants sans introduire de div inutile
    <> 
      {/* 1. Navbar : Visible en haut de toutes les pages publiques */}
      <Navbar /> 

      {/* 2. Contenu Principal de la Page */}
      <main 
        // flex-grow pour utiliser l'espace disponible
        className="flex-grow p-4 md:p-6" 
        // Ajuste la hauteur pour que le contenu s'étende sans être coupé par la Navbar fixe (h-16 = 64px)
        style={{ minHeight: 'calc(100vh - 64px)' }} 
      > 
        {children}
      </main>
      
      {/* 3. Bouton Panier Flottant : Visible sur les pages d'achat */}
      <CartFloatingIcon /> 
    </>
  );
}