'use client';

import Dexie, { Table } from 'dexie';

// Interfaces
export interface OfflineOrder {
  id?: number;
  productIds: { productId: string; quantity: number }[];
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  deliveryDesc?: string;
  voiceNoteBlob?: Blob | null;
  gpsLat?: number;
  gpsLng?: number;
  createdAt: Date;
  synced: number; 
}

export interface CartItem {
  id?: number;
  productId: string;
  quantity: number;
  addedAt: Date;
}

// Instance Dexie
class AgriConnectOfflineDB extends Dexie {
  // On définit les tables pour le typage
  products!: Table<any, string>; 
  offlineOrders!: Table<OfflineOrder, number>;
  cart!: Table<CartItem, number>;

  constructor() {
    super('AgriConnectOffline');
    
    this.version(1).stores({
      products: 'id, category, status, producerId', 
      offlineOrders: '++id, synced, createdAt',
      cart: '++id, productId'
    });
  }
}

// Initialisation sécurisée
export const db = new AgriConnectOfflineDB(); // On exporte 'db' pour matcher ton repository