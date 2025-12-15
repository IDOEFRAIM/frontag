'use client';

import React, { useRef, useEffect } from 'react';

// COULEURS DU THÈME
const THEME = {
    barBase: '#1A237E',   // Indigo (sons faibles)
    barPeak: '#A63C06',   // Ocre (sons forts)
};

interface WaveformProps {
    analyser: AnalyserNode | null; // Le nœud d'analyse audio qui fournit les données
    isRecording: boolean;         // Pour savoir quand démarrer/arrêter l'animation
}

export default function Waveform({ analyser, isRecording }: WaveformProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !analyser || !isRecording) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Configuration de l'analyseur
        analyser.fftSize = 64; // Nombre de barres (plus petit = barres plus larges. 32, 64, 128...)
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        // Fonction pour adapter la taille du canvas à son conteneur CSS
        const resizeCanvas = () => {
            canvas.width = canvas.clientWidth * window.devicePixelRatio; // Gestion écrans retina
            canvas.height = canvas.clientHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);


        // --- BOUCLE DE DESSIN (60fps) ---
        const draw = () => {
            if (!isRecording) return;

            animationRef.current = requestAnimationFrame(draw);

            // Récupérer les données de fréquence actuelles (0 à 255 pour chaque fréquence)
            analyser.getByteFrequencyData(dataArray);

            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            const barWidth = (width / bufferLength) * 2.5; // Facteur 2.5 pour l'espacement
            let x = 0;

            ctx.clearRect(0, 0, width, height); // Nettoyer le canvas

            // Dessiner chaque barre
            for (let i = 0; i < bufferLength; i++) {
                const barHeight = (dataArray[i] / 255) * height; // Hauteur normalisée

                // Création d'un dégradé Indigo -> Ocre selon la hauteur
                const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
                gradient.addColorStop(0, THEME.barPeak);
                gradient.addColorStop(1, THEME.barBase);

                ctx.fillStyle = gradient;

                // On dessine des barres arrondies pour un look moderne
                // x, y, largeur, hauteur, rayon
                roundRect(ctx, x, height - barHeight, barWidth - 2, barHeight, 5);

                x += barWidth + 1; // Espacement
            }
        };

        draw(); // Lancer l'animation

        // NETTOYAGE
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [analyser, isRecording]);

    // Fonction utilitaire pour dessiner des rectangles arrondis sur Canvas
    function roundRect(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number
    ) {
        if (width < 2 * radius) radius = width / 2;
        if (height < 2 * radius) radius = height / 2;
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + width, y, x + width, y + height, radius);
        ctx.arcTo(x + width, y + height, x, y + height, radius);
        ctx.arcTo(x, y + height, x, y, radius);
        ctx.arcTo(x, y, x + width, y, radius);
        ctx.closePath();
        ctx.fill();
    }

    return (
        <canvas 
            ref={canvasRef} 
            style={{ 
                width: '100%', 
                height: '60px', // Hauteur fixe pour le composant visuel
                display: 'block',
                // Background subtil pour délimiter la zone
                backgroundColor: isRecording ? 'rgba(26, 35, 126, 0.05)' : 'transparent', 
                borderRadius: '8px',
                transition: 'background-color 0.3s ease'
            }} 
        />
    );
}