import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AuthProvider } from '@/hooks/useAuth'; // 👈 NOUVEAU: Importation du AuthProvider
import { CartProvider } from '@/context/CartContext'; 
import { NetworkStatus } from '@/components/system/networkStatus';
import SyncStatusIndicator from '@/components/system/syncStatus';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'AgriConnect',
  description: 'Application de commerce local',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AgriConnect',
  },
};

export const viewport: Viewport = {
  themeColor: '#1A237E',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr"> 
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        
        {/* LE NOUVEL AJOUT : Le AuthProvider doit être le plus haut pour que TOUS les composants 
           (y compris les Layouts et le CartProvider si nécessaire) puissent utiliser useAuth. */}
        <AuthProvider> 
          
          <CartProvider> 
            
            {/* Composants globaux système */}
            <NetworkStatus />
            <SyncStatusIndicator />

            {children}

          </CartProvider>
        
        </AuthProvider>
      </body>
    </html>
  );
}