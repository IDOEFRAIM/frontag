'use client'

import { localDb, type OfflineOrder } from './dexie';
import { syncOrderWithServer } from '@/services/orders.service';

async function syncSingleOrder(order: OfflineOrder): Promise<boolean> {
  if (!localDb) return false;
  
  try {
    const formData = new FormData();

    // On s'assure que les données envoyées correspondent à ce que Prisma attend
    const orderMetadata = {
      productIds: order.productIds,
      totalAmount: order.totalAmount,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      deliveryDesc: order.deliveryDesc,
      gpsLat: order.gpsLat,
      gpsLng: order.gpsLng,
      createdAt: order.createdAt
    };

    formData.append('data', JSON.stringify(orderMetadata));

    if (order.voiceNoteBlob) {
      // Conversion sécurisée pour l'envoi multipart
      formData.append('voiceNote', order.voiceNoteBlob, `voice_${Date.now()}.webm`);
    }

    // Server Action
    const result = await syncOrderWithServer(formData);
    return result.success;
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi au serveur:", error);
    return false;
  }
}

export async function processSyncQueue() {
  if (!localDb) return { syncedCount: 0, errors: 0 };

  // Dexie 7 : Utilise 0 pour false si tu as indexé comme un entier, 
  // ou false si c'est un booléen. 
  const pendingOrders = await localDb.offlineOrders
    .where('synced')
    .equals(0) // On assume 0 = non synchronisé
    .toArray();

  if (pendingOrders.length === 0) return { syncedCount: 0, errors: 0 };

  let syncedCount = 0;
  let errors = 0;

  // Utilisation de for...of pour garantir l'ordre et la gestion des erreurs
  for (const order of pendingOrders) {
    const success = await syncSingleOrder(order);

    if (success && order.id) {
      // IMPORTANT : Mettre à jour l'ID local pour marquer le succès
      await localDb.offlineOrders.update(order.id, { synced: true });
      syncedCount++;
    } else {
      errors++;
    }
  }

  return { syncedCount, errors };
}