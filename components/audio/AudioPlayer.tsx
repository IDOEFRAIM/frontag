'use client';

import React, { useState, useRef, useEffect } from 'react';

const THEME = {
    play: '#1A237E',   // Indigo
    pause: '#A63C06',  // Ocre
    bg: '#F5F5F5',
    progress: '#2E7D32', // Vert
    text: '#333'
};

interface AudioPlayerProps {
    src: string | Blob; // Accepte une URL ou un fichier brut (Blob)
    onDelete?: () => void; // Optionnel : bouton supprimer
}

export default function AudioPlayer({ src, onDelete }: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    
    // Convertir le Blob en URL si nécessaire
    const audioSrc = typeof src === 'string' ? src : URL.createObjectURL(src);

    useEffect(() => {
        // Nettoyage de l'URL objet si c'était un Blob (pour la mémoire)
        return () => {
            if (typeof src !== 'string') {
                URL.revokeObjectURL(audioSrc);
            }
        };
    }, [src, audioSrc]);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            const total = audioRef.current.duration;
            setCurrentTime(current);
            setDuration(total);
            if (total > 0) {
                setProgress((current / total) * 100);
            }
        }
    };

    const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
        if (audioRef.current) audioRef.current.currentTime = 0;
    };

    // Permet de cliquer sur la barre pour avancer
    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!audioRef.current) return;
        const width = e.currentTarget.clientWidth;
        const clickX = e.nativeEvent.offsetX;
        const newTime = (clickX / width) * audioRef.current.duration;
        
        audioRef.current.currentTime = newTime;
        setProgress((clickX / width) * 100);
    };

    const formatTime = (time: number) => {
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '15px', 
            backgroundColor: 'white', 
            padding: '10px 15px', 
            borderRadius: '30px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            width: '100%',
            maxWidth: '400px',
            border: '1px solid #eee'
        }}>
            {/* ÉLÉMENT AUDIO CACHÉ */}
            <audio 
                ref={audioRef} 
                src={audioSrc} 
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleTimeUpdate}
                onEnded={handleEnded}
            />

            {/* BOUTON PLAY/PAUSE */}
            <button 
                type="button"
                onClick={togglePlay}
                style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: isPlaying ? THEME.pause : THEME.play,
                    color: 'white',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                }}
            >
                {isPlaying ? '⏸' : '▶'}
            </button>

            {/* BARRE DE PROGRESSION & TEMPS */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div 
                    onClick={handleSeek}
                    style={{ 
                        height: '8px', 
                        backgroundColor: '#e0e0e0', 
                        borderRadius: '4px', 
                        cursor: 'pointer', 
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{ 
                        width: `${progress}%`, 
                        height: '100%', 
                        backgroundColor: THEME.progress,
                        transition: 'width 0.1s linear'
                    }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#666' }}>
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration || 0)}</span>
                </div>
            </div>

            {/* BOUTON SUPPRIMER (OPTIONNEL) */}
            {onDelete && (
                <button
                    type="button"
                    onClick={onDelete}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#999',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        padding: '5px'
                    }}
                    title="Supprimer la note"
                >
                    ❌
                </button>
            )}
        </div>
    );
}