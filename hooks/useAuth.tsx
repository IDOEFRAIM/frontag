'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Role, AuthContextType } from '@/types/auth'; // Utilisation des types User et Role
import { loginUser, registerUser, storeAuthToken } from '@/services/auth.service'; // Utilisation du service API
import { useRouter } from 'next/navigation';

// Clés de stockage local pour la persistance de l'état
const USER_STORAGE_KEY = 'agriconnect_user';
const TOKEN_STORAGE_KEY = 'agriconnect_token'; // Utilisé pour stocker le token JWT

// --- CONTEXTE D'AUTHENTIFICATION ---
// On utilise une valeur par défaut 'undefined' pour détecter si le hook est mal utilisé
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- FOURNISSEUR DE CONTEXTE (AuthProvider) ---

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * 1. Initialisation : Chargement de l'utilisateur depuis le stockage local
     * (Simule la re-connexion après un rafraîchissement de page)
     */
    useEffect(() => {
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        // Le token est stocké séparément, mais on ne le lit pas ici directement pour des raisons de simplicité de mock
        
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed parsing stored user:", e);
                // Si la donnée est corrompue, on efface et on force la déconnexion
                localStorage.removeItem(USER_STORAGE_KEY);
            }
        }
        setIsLoading(false);
    }, []);

    /**
     * 2. Connexion : Appel au service API
     */
    const login = useCallback(async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const { user: loggedInUser, token } = await loginUser(email, password);
            
            // Mise à jour de l'état et du stockage local
            setUser(loggedInUser);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedInUser));
            storeAuthToken(token);
            
            // Redirection conditionnelle basée sur le rôle
            if (loggedInUser.role === 'admin') router.push('/admin');
            else if (loggedInUser.role === 'producer') router.push('/producer/dashboard');
            else router.push('/market'); // Acheteur (buyer)

        } catch (err) {
            setError((err as Error).message || "Erreur de connexion.");
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, [router]);
    
    /**
     * 3. Enregistrement : Appel au service API
     */
    const register = useCallback(async (email: string, password: string, role: Role, name: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const { user: registeredUser, token } = await registerUser(email, password, role, name);

            setUser(registeredUser);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(registeredUser));
            storeAuthToken(token); 
            
            alert(`Compte ${role} créé. Veuillez vérifier votre email !`);
            router.push('/login'); 

        } catch (err) {
            setError((err as Error).message || "Erreur d'enregistrement.");
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, [router]);


    /**
     * 4. Déconnexion : Nettoyage de l'état
     */
    const logout = useCallback(() => {
        setIsLoading(true);
        setTimeout(() => { 
            setUser(null);
            localStorage.removeItem(USER_STORAGE_KEY);
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            setIsLoading(false);
            router.push('/login');
        }, 300);
    }, [router]);

    // Valeurs exposées par le contexte
    const contextValue: AuthContextType = {
        user,
        isAuthenticated: !!user,
        userRole: user ? user.role : 'guest',
        login,
        register,
        logout,
        isLoading,
        error
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// --- HOOK UTILISATEUR (useAuth) ---

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        // Alerte si le hook est appelé en dehors du Provider (erreur de développeur)
        throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
    }
    return context;
};