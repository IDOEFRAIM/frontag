'use client'

import { localDb, OfflineOrder } from './dexie';
import { syncOrderWithServer } from '@/services/orders.service';

async function syncSingleOrder(order: OfflineOrder): Promise<boolean> {
  if (!localDb) return false;
  
  try {
    const formData = new FormData();

    // On prépare les données pour qu'elles correspondent aux attentes de Prisma
    const orderData = {
      productIds: order.productIds, // Doit contenir { productId, quantity, price }
      totalAmount: order.totalAmount,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      deliveryDesc: order.deliveryDesc,
      gpsLat: order.gpsLat,
      gpsLng: order.gpsLng,
      createdAt: order.createdAt
    };

    formData.append('data', JSON.stringify(orderData));

    if (order.voiceNoteBlob) {
      formData.append('voiceNote', order.voiceNoteBlob, `voice_${Date.now()}.webm`);
    }

    const result = await syncOrderWithServer(formData);
    return result.success;
  } catch (error) {
    console.error("❌ Échec de la synchronisation individuelle:", error);
    return false;
  }
}

export async function processSyncQueue() {
  if (!localDb) return { syncedCount: 0, errors: 0 };

  // On récupère les commandes non synchronisées
  const pendingOrders = await localDb.offlineOrders
    .where('synced')
    .equals(0) // 0 représente false dans l'index Dexie
    .toArray();

  if (pendingOrders.length === 0) return { syncedCount: 0, errors: 0 };

  console.log(`🔄 Synchro en cours : ${pendingOrders.length} commandes...`);

  let syncedCount = 0;
  let errors = 0;

  for (const order of pendingOrders) {
    const success = await syncSingleOrder(order);

    if (success && order.id) {
      // Marquer comme synchronisé en local pour éviter les doublons
      await localDb.offlineOrders.update(order.id, { synced: true }); // 1 pour true
      syncedCount++;
    } else {
      errors++;
    }
  }

  return { syncedCount, errors };
}