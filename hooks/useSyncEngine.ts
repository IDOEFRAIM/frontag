// hooks/useSyncEngine.ts
import { useEffect, useState } from 'react';
import { useNetwork } from './useNetwork'; // Ton hook existant
import { processSyncQueue } from '@/lib/sync-engine';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';

export function useSyncEngine() {
  const isOnline = useNetwork();
  const [isSyncing, setIsSyncing] = useState(false);

  // Surveille le nombre de commandes en attente (Juste pour l'info UI)
  const pendingCount = useLiveQuery(
    () => db.offlineOrders.where('synced').equals(0).count()
  ) || 0;

  useEffect(() => {
    // Si on est HORS LIGNE, on ne fait rien
    if (!isOnline) return;

    // Si on est DÉJÀ en train de sync, on évite les doublons
    if (isSyncing) return;

    const runSync = async () => {
      // On vérifie s'il y a quelque chose à envoyer
      const count = await db.offlineOrders.where('synced').equals(0).count();
      
      if (count > 0) {
        setIsSyncing(true);
        try {
            // Lancer la synchro
            const result = await processSyncQueue();
            
            if (result.syncedCount > 0) {
                // Ici tu pourrais mettre un Toast / Notification
                console.log(`✅ Succès : ${result.syncedCount} commandes envoyées !`);
                // alert(`Connexion retrouvée : ${result.syncedCount} commandes envoyées au serveur.`);
            }
        } finally {
            setIsSyncing(false);
        }
      }
    };

    runSync();

    // On déclenche l'effet quand : 
    // 1. Le statut "isOnline" passe à true
    // 2. Ou quand le nombre de pendingCount change (ex: l'utilisateur ajoute une commande alors qu'il est déjà online)
  }, [isOnline, pendingCount]); 

  return { isSyncing, pendingCount };
}