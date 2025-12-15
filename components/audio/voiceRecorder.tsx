'use client';

import React, { useState, useRef, useEffect } from 'react';
import AudioPlayer from './AudioPlayer';
// 1. IMPORT DU WAVEFORM
import Waveform from './waveForm'; 

const THEME = {
    record: '#D32F2F',
    stop: '#333333',
    bg: '#F5F5F5'
};

interface VoiceRecorderProps {
    onRecordingComplete: (audioBlob: Blob | null) => void;
}

export default function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState<string | null>(null);
    const [timer, setTimer] = useState(0);
    
    // 2. NOUVEAUX ÉTATS POUR L'AUDIO VISUALIZER
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
    const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const streamRef = useRef<MediaStream | null>(null); // Référence au flux global
    const chunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        return () => {
            if (audioURL) URL.revokeObjectURL(audioURL);
            // Nettoyage du contexte audio à la fermeture du composant
            if (audioContext && audioContext.state !== 'closed') {
                audioContext.close();
            }
        };
    }, [audioURL, audioContext]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream; // On garde une ref pour couper le micro plus tard

            // --- A. CONFIGURATION DE L'ENREGISTREUR (Comme avant) ---
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                setAudioURL(url);
                onRecordingComplete(blob);
                
                // Couper le micro PHYSIQUEMENT
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop());
                    streamRef.current = null;
                }

                // Fermer le contexte audio visuel
                if (audioContext) {
                   audioContext.suspend();
                }
            };

            // --- B. CONFIGURATION DU VISUALISEUR (Nouveau) ---
            // On crée un contexte audio. Important : le faire après une interaction utilisateur (le clic)
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const source = ctx.createMediaStreamSource(stream);
            const analyser = ctx.createAnalyser();
            source.connect(analyser);
            
            setAudioContext(ctx);
            setAnalyserNode(analyser);


            // --- C. DÉMARRAGE ---
            mediaRecorder.start();
            setIsRecording(true);
            
            setTimer(0);
            timerIntervalRef.current = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);

        } catch (err) {
            console.error("Erreur accès micro:", err);
            alert("Impossible d'accéder au micro. Vérifiez vos permissions.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            // L'arrêt du micro et du contexte se fait dans mediaRecorder.onstop
        }
    };

    const deleteRecording = () => {
        setAudioURL(null);
        onRecordingComplete(null);
        setTimer(0);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div style={{ 
            marginTop: '15px', 
            padding: '15px', 
            backgroundColor: THEME.bg, 
            borderRadius: '8px',
            border: '1px dashed #ccc',
            textAlign: 'center'
        }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px', fontSize: '0.9rem', color: '#555' }}>
                🎤 Ajouter une note vocale
            </label>

            {!audioURL ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                    
                    {/* 3. INSERTION DU WAVEFORM ICI */}
                    {/* Il prend toute la largeur et s'anime si isRecording est true */}
                    <div style={{ width: '100%', maxWidth: '300px' }}>
                        <Waveform analyser={analyserNode} isRecording={isRecording} />
                    </div>

                    {isRecording ? (
                         <div style={{ color: THEME.record, fontWeight: 'bold' }}>
                            ENREGISTREMENT EN COURS... {formatTime(timer)}
                        </div>
                    ) : (
                        <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '-10px' }}>
                            (Appuyez pour commencer)
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={isRecording ? stopRecording : startRecording}
                        style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            backgroundColor: isRecording ? THEME.stop : THEME.record,
                            border: 'none',
                            color: 'white',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                            transition: 'background 0.3s, transform 0.1s',
                            transform: isRecording ? 'scale(1.1)' : 'scale(1)'
                        }}
                    >
                        {isRecording ? '⏹' : '🎙'}
                    </button>
                </div>
            ) : (
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <AudioPlayer src={audioURL} onDelete={deleteRecording} />
                </div>
            )}
        </div>
    );
}