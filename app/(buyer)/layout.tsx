'use client';

import React from 'react';
import BuyerNavbar from '@/components/utils/BuyerNavbar';
import CartFloatingIcon from '@/components/utils/CartFloating';
import SyncProvider from '@/services/syncProvider';

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SyncProvider />
      <BuyerNavbar />
      <main className="flex-grow p-4 md:p-6 bg-gray-50 min-h-[calc(100vh-64px)]">
        {children}
      </main>
      <CartFloatingIcon />
    </>
  );
}
