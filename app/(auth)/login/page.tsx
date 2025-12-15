'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // 👈 Correction 1: Import de useRouter
import { useAuth } from '@/hooks/useAuth'; 
import { FaSignInAlt, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';

export default function LoginPage() {
    // Initialisation du router
    const router = useRouter(); // 👈 Correction 2: Initialisation de l'objet router
    
    // 1. UTILISATION DU HOOK useAuth
    const { login, isAuthenticated, isLoading, error: authError, userRole } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [pageError, setPageError] = useState<string | null>(null);

    // Redirection si l'utilisateur est déjà connecté et que la vérification est terminée
    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            // Gérer la redirection si l'utilisateur est déjà connecté
            if (userRole === 'admin') router.replace('/admin');
            else if (userRole === 'producer') router.replace('/dashboard');
            else if (userRole === 'buyer') router.replace('/market');
            // Si le rôle n'est pas défini (par exemple, si le token est corrompu mais isAuthenticated est vrai), rediriger vers une page par défaut ou se déconnecter
            else router.replace('/'); 
        }
    }, [isAuthenticated, isLoading, userRole, router]); // Dépendances importantes

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPageError(null); 
        
        try {
            await login(email, password); 
            // NOTE : La redirection après succès se produit dans l'useEffect ci-dessus 
            // ou idéalement DANS le hook useAuth pour découpler la page de la logique de routage.
            
        } catch (err: any) {
            // L'erreur est gérée et affichée via l'état 'authError' du hook.
        }
    };

    // Afficher un spinner si le hook est en train de vérifier la session initiale
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <FaSpinner className="animate-spin text-4xl text-green-600" />
                <p className="ml-3 text-lg font-medium text-gray-700">Vérification de la session...</p>
            </div>
        );
    }
    
    // Si l'utilisateur est déjà connecté, on n'affiche rien, la redirection est gérée par useEffect.
    if (isAuthenticated) return null;


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-black text-center text-green-700 mb-6 flex items-center justify-center gap-2">
                    <FaSignInAlt /> Connexion AgriConnect
                </h2>
                
                {/* Afficher l'erreur du Context ou de la page */}
                {(authError || pageError) && (
                    <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm mb-4">
                        {authError || pageError}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                            placeholder="Ex: producteur@test.com"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <FaSpinner className="animate-spin" /> Connexion en cours...
                        </>
                    ) : (
                        'Se connecter'
                    )}
                </button>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Pas encore de compte ? <Link href="/register" className="text-green-600 hover:underline font-medium">S'inscrire</Link>
                </p>
            </form>
        </div>
    );
}