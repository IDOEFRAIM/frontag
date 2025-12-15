'use client';

import React, { useState, useEffect } from 'react';
import VoiceRecorder from '@/components/audio/voiceRecorder'; 

// --- INTERFACE EXPORTÉE ---
// Contrat de données utilisé par la page Checkout
export interface DeliveryLocationData {
    lat: number;
    lng: number;
    accuracy: number;     // Précision en mètres (très important pour la livraison)
    description: string;  // Texte (Porte bleue, etc.)
    audioBlob?: Blob | null; // Note vocale
}

interface LastMileGuideProps {
    onChange: (data: DeliveryLocationData | null) => void;
}

export default function LastMileGuide({ onChange }: LastMileGuideProps) {
    // --- ÉTATS ---
    const [status, setStatus] = useState<'idle' | 'locating' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    
    // Données principales
    const [coordinates, setCoordinates] = useState<{lat: number, lng: number, accuracy: number} | null>(null);
    const [description, setDescription] = useState('');
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

    // --- SYNCHRONISATION AVEC LE PARENT ---
    // À chaque changement local, on envoie tout au parent (CheckoutPage)
    useEffect(() => {
        if (!onChange) return;

        if (coordinates) {
            onChange({
                lat: coordinates.lat,
                lng: coordinates.lng,
                accuracy: coordinates.accuracy,
                description: description,
                audioBlob: audioBlob
            });
        } else {
            onChange(null); // Pas de coordonnées = Pas de livraison valide
        }
    }, [coordinates, description, audioBlob, onChange]);

    // --- LOGIQUE GPS RÉELLE (PRODUCTION READY) ---
    const handleLocateMe = () => {
        if (!navigator.geolocation) {
            setStatus('error');
            setErrorMessage("La géolocalisation n'est pas supportée par votre navigateur.");
            return;
        }

        setStatus('locating');
        setErrorMessage(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                // SUCCÈS
                setCoordinates({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy
                });
                setStatus('success');
            },
            (error) => {
                // ERREUR
                setStatus('error');
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        setErrorMessage("Vous avez refusé l'accès à la localisation. Veuillez l'activer dans les paramètres.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setErrorMessage("Impossible de déterminer votre position (Signal GPS faible).");
                        break;
                    case error.TIMEOUT:
                        setErrorMessage("La demande de localisation a expiré. Réessayez.");
                        break;
                    default:
                        setErrorMessage("Une erreur inconnue est survenue.");
                }
            },
            {
                enableHighAccuracy: true, // Demande le GPS précis (pas juste le Wifi)
                timeout: 15000,           // 15 secondes max
                maximumAge: 0             // Ne pas utiliser de cache, on veut la position ACTUELLE
            }
        );
    };

    return (
        <div style={{ marginTop: '20px', border: '1px solid #ddd', padding: '20px', borderRadius: '8px', backgroundColor: '#fff' }}>
            <h4 style={{ margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📍 Localisation Exacte
            </h4>
            
            {/* BOUTON D'ACTION */}
            <button 
                type="button" 
                onClick={handleLocateMe}
                disabled={status === 'locating'}
                style={{ 
                    width: '100%',
                    padding: '12px', 
                    backgroundColor: status === 'success' ? '#E8F5E9' : '#eee', 
                    color: status === 'success' ? '#2E7D32' : '#333',
                    border: status === 'success' ? '1px solid #2E7D32' : '1px solid #ccc', 
                    borderRadius: '4px',
                    cursor: status === 'locating' ? 'wait' : 'pointer', 
                    marginBottom: '15px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                }}
            >
                {status === 'locating' ? (
                    <>📡 Recherche des satellites...</>
                ) : status === 'success' ? (
                    <>✅ Position trouvée (Mettre à jour)</>
                ) : (
                    <>📍 Cliquer pour me géolocaliser</>
                )}
            </button>

            {/* MESSAGES D'ERREUR */}
            {status === 'error' && (
                <div style={{ padding: '10px', backgroundColor: '#FFEBEE', color: '#D32F2F', borderRadius: '4px', marginBottom: '15px', fontSize: '0.9rem' }}>
                    ⚠️ {errorMessage}
                </div>
            )}

            {/* FORMULAIRE DÉTAILLÉ (S'affiche uniquement si GPS trouvé) */}
            {coordinates && (
                <div style={{ animation: 'fadeIn 0.5s' }}>
                    
                    {/* INFO PRÉCISION */}
                    <div style={{ marginBottom: '15px', fontSize: '0.85rem', color: '#555', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Précision : à {Math.round(coordinates.accuracy)} mètres près</span>
                        <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: '#1A237E', textDecoration: 'underline' }}
                        >
                            Vérifier sur Google Maps
                        </a>
                    </div>
                    
                    {/* CHAMP TEXTE */}
                    <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px', color: '#333' }}>
                        Précisions écrites
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Ex: Portail noir, en face de la pharmacie, appeler à l'arrivée..."
                        style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem', fontFamily: 'inherit', marginBottom: '20px' }}
                        rows={3}
                    />

                    {/* ENREGISTREUR VOCAL */}
                    <div style={{ borderTop: '1px dashed #ddd', paddingTop: '15px' }}>
                        <VoiceRecorder onRecordingComplete={(blob) => setAudioBlob(blob)} />
                    </div>
                </div>
            )}
        </div>
    );
}