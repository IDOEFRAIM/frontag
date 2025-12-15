'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useNetwork } from '@/hooks/useNetwork';
import { getOfflineOrders, clearOfflineOrders } from '@/lib/db'; 

// --- THEME (Pour rester cohérent) ---
const COLORS = {
    offline: '#A63C06', // Ocre (Alerte)
    syncing: '#1A237E', // Indigo (Action)
    success: '#2E7D32', // Vert (Succès)
    bg: '#ffffff'
};

export default function SyncIndicator() {
    const isOnline = useNetwork();
    
    // États
    const [pendingCount, setPendingCount] = useState(0);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncSuccess, setSyncSuccess] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false); // Pour afficher les détails au clic

    // --- 1. VÉRIFIER LA QUEUE (Combien de commandes en attente ?) ---
    const checkQueue = useCallback(async () => {
        try {
            const orders = await getOfflineOrders();
            setPendingCount(orders.length);
        } catch (err) {
            console.error("Erreur lecture DB:", err);
        }
    }, []);

    // Vérifier la queue au chargement et à chaque changement de réseau
    useEffect(() => {
        checkQueue();
        
        // Intervalle de sécurité : vérifier toutes les 10 secondes si des données sont là
        const interval = setInterval(checkQueue, 10000);
        return () => clearInterval(interval);
    }, [checkQueue, isOnline]);

    // --- 2. MÉCANISME DE SYNCHRONISATION ---
    const processSync = useCallback(async () => {
        if (pendingCount === 0 || isSyncing) return;

        setIsSyncing(true);
        console.log("🔄 Démarrage de la synchronisation...");

        try {
            const orders = await getOfflineOrders();

            // BOUCLE D'ENVOI (Simulation API)
            for (const order of orders) {
                // ICI: Appeler votre vraie API (ex: await api.post('/orders', order))
                console.log(`📤 Envoi commande de ${order.customerName}...`);
                
                // Simulation de délai réseau
                await new Promise(r => setTimeout(r, 1000));
            }

            // Si tout s'est bien passé :
            await clearOfflineOrders(); // On vide la base locale
            setPendingCount(0);
            setSyncSuccess(true);
            
            // Masquer le message de succès après 5 secondes
            setTimeout(() => setSyncSuccess(false), 5000);

        } catch (error) {
            console.error("❌ Échec de la synchro:", error);
            // On laisse les données dans la DB pour réessayer plus tard
        } finally {
            setIsSyncing(false);
        }
    }, [pendingCount, isSyncing]);

    // --- 3. DÉCLENCHEUR AUTOMATIQUE ---
    // Dès qu'on repasse ONLINE et qu'il y a des données, on lance la synchro
    useEffect(() => {
        if (isOnline && pendingCount > 0) {
            processSync();
        }
    }, [isOnline, pendingCount, processSync]);


    // --- RENDU VISUEL ---
    
    // Cas 1 : Tout est propre (En ligne, pas d'attente, pas de message succès récent)
    if (isOnline && pendingCount === 0 && !syncSuccess && !isSyncing) return null;

    let statusColor = COLORS.offline;
    let icon = '📡';
    let message = 'Mode Hors-ligne';

    if (isSyncing) {
        statusColor = COLORS.syncing;
        icon = '🔄';
        message = 'Synchronisation...';
    } else if (syncSuccess) {
        statusColor = COLORS.success;
        icon = '✅';
        message = 'Données envoyées !';
    } else if (!isOnline) {
        statusColor = COLORS.offline;
        icon = '📡';
        message = `Hors-ligne (${pendingCount} en attente)`;
    }

    return (
        <div 
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                backgroundColor: statusColor,
                color: 'white',
                padding: '12px 20px',
                borderRadius: '30px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontFamily: 'Barlow, sans-serif',
                fontWeight: 'bold',
                cursor: 'pointer',
                zIndex: 9999, // Toujours au-dessus
                transition: 'all 0.3s ease',
                maxWidth: isExpanded ? '300px' : 'auto'
            }}
        >
            <span style={{ fontSize: '1.2rem', animation: isSyncing ? 'spin 1s linear infinite' : 'none' }}>
                {icon}
            </span>
            
            <span>{message}</span>

            {/* Détails si étendu */}
            {isExpanded && !isOnline && pendingCount > 0 && (
                <div style={{ fontSize: '0.8rem', marginLeft: '10px', paddingLeft: '10px', borderLeft: '1px solid rgba(255,255,255,0.3)' }}>
                    Vos commandes sont sauvegardées localement.
                </div>
            )}

            <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}