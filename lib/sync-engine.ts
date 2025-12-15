// lib/syncService.ts
import { db, OfflineOrder } from './db';

/**
 * Tente d'envoyer une commande unique au serveur
 */
async function syncSingleOrder(order: OfflineOrder): Promise<boolean> {
  try {
    const formData = new FormData();

    // 1. On sépare les données texte du fichier audio
    const orderMetadata = {
      productIds: order.productIds,
      totalAmount: order.totalAmount,
      customer: {
        name: order.customerName,
        phone: order.customerPhone,
        city: order?.city || 'Non spécifié'
      },
      delivery: {
        lat: order.gpsLat,
        lng: order.gpsLng,
        text: order.deliveryDesc
      },
      createdAt: order.createdAt
    };

    // 2. On ajoute le JSON
    formData.append('data', JSON.stringify(orderMetadata));

    // 3. On ajoute le fichier Audio (si présent)
    if (order.voiceNoteBlob) {
      // On donne un nom unique au fichier : "voice_ID_TIMESTAMP.webm"
      const fileName = `voice_${order.id || 'new'}_${Date.now()}.webm`;
      formData.append('voiceNote', order.voiceNoteBlob, fileName);
    }

    // 4. Envoi au serveur (Adapter l'URL selon ton API)
    const response = await fetch('/api/orders/sync', {
      method: 'POST',
      body: formData, // Pas de Header 'Content-Type', le navigateur le gère pour FormData
    });

    if (!response.ok) {
      throw new Error(`Erreur serveur: ${response.statusText}`);
    }

    return true; // Succès

  } catch (error) {
    console.error("Échec sync commande:", error);
    return false; // Échec
  }
}

/**
 * Fonction principale : Traite toute la file d'attente
 */
export async function processSyncQueue() {
  // 1. Récupérer toutes les commandes NON synchronisées
  const pendingOrders = await db.offlineOrders
    .filter(order => !order.synced)
    .toArray();

  if (pendingOrders.length === 0) return { syncedCount: 0, errors: 0 };

  console.log(`🔄 Démarrage synchro : ${pendingOrders.length} commandes en attente.`);

  let syncedCount = 0;
  let errors = 0;

  // 2. Traiter les commandes une par une (séquentiel pour éviter de surcharger le réseau mobile)
  for (const order of pendingOrders) {
    const success = await syncSingleOrder(order);

    if (success && order.id) {
      // 3. Marquer comme synchronisé dans Dexie
      // On ne supprime pas tout de suite pour garder un historique local
      await db.offlineOrders.update(order.id, { synced: true });
      syncedCount++;
    } else {
      errors++;
    }
  }

  return { syncedCount, errors };
}