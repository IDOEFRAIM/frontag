'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause, FaTrash } from 'react-icons/fa';

interface AudioPlayerProps {
    src: string | Blob;
    onDelete?: () => void;
}

export default function AudioPlayer({ src, onDelete }: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    
    const audioSrc = typeof src === 'string' ? src : URL.createObjectURL(src);

    useEffect(() => {
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
        <div className="flex items-center gap-4 bg-white p-3 rounded-[2rem] shadow-sm border border-slate-100 w-full max-w-md">
            {/* AUDIO CACHÉ */}
            <audio 
                ref={audioRef} 
                src={audioSrc} 
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                onLoadedMetadata={handleTimeUpdate}
            />

            {/* BOUTON PLAY/PAUSE (Indigo pour la tech) */}
            <button 
                onClick={togglePlay}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-md shrink-0"
            >
                {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} className="ml-1" />}
            </button>

            {/* BARRE DE PROGRESSION (Organique) */}
            <div className="flex-1 flex flex-col justify-center gap-1">
                <div 
                    className="h-2 bg-slate-100 rounded-full cursor-pointer overflow-hidden relative"
                    onClick={handleSeek}
                >
                    <div 
                        className="h-full bg-green-500 rounded-full transition-all duration-100 ease-linear"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration || 0)}</span>
                </div>
            </div>

            {/* BOUTON SUPPRIMER (Optionnel) */}
            {onDelete && (
                <button 
                    onClick={onDelete}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                >
                    <FaTrash size={14} />
                </button>
            )}
        </div>
    );
}