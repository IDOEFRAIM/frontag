'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth'; // 👈 Importation du hook d'authentification
import { Role } from '@/types/auth'; // Utilisation du type Role
import { FaUserPlus, FaSpinner, FaSeedling, FaShoppingCart } from 'react-icons/fa';

export default function SignupPage() {
    // 1. UTILISATION DU HOOK useAuth
    const { register, isAuthenticated, isLoading: authLoading, error: authError, userRole } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState<Role>('buyer'); 

    // Gérer la redirection si l'utilisateur est déjà connecté
    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            if (userRole === 'admin') router.replace('/admin');
            else if (userRole === 'producer') router.replace('/producer/dashboard');
            else router.replace('/market');
        }
    }, [isAuthenticated, authLoading, userRole, router]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            // 2. APPEL DE LA FONCTION REGISTER DU CONTEXTE
            // Le hook useAuth gère l'appel au service, le stockage de l'état/token, et la redirection.
            await register(email, password, role, name);
            
        } catch (err: any) {
            // L'erreur est gérée et affichée via l'état 'authError' du hook.
        }
    };
    
    // Afficher un spinner si le hook est en train de vérifier la session initiale
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <FaSpinner className="animate-spin text-4xl text-green-600" />
                <p className="ml-3 text-lg font-medium text-gray-700">Vérification de la session...</p>
            </div>
        );
    }

    // Si l'utilisateur est déjà connecté, ne rien afficher, la redirection est gérée par useEffect.
    if (isAuthenticated) return null;


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <form 
                onSubmit={handleSubmit} 
                className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg"
            >
                <h2 className="text-3xl font-black text-center text-green-700 mb-8 flex items-center justify-center gap-3">
                    <FaUserPlus /> Créer votre compte
                </h2>
                
                {/* Afficher l'erreur du Context */}
                {authError && (
                    <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm mb-4">
                        {authError}
                    </div>
                )}

                <div className="space-y-4">
                    {/* Champ Nom/Entreprise */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nom / Nom de l'entreprise</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={authLoading}
                            placeholder="Ex: Coopérative Faso-Kaba ou Ali Dupont"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                        />
                    </div>

                    {/* Champ Rôle (Sélection) */}
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Je suis...</label>
                        <div className="flex gap-4">
                            <RoleRadio roleValue="buyer" currentRole={role} setRole={setRole} icon={FaShoppingCart} label="Acheteur" disabled={authLoading} />
                            <RoleRadio roleValue="producer" currentRole={role} setRole={setRole} icon={FaSeedling} label="Producteur" disabled={authLoading} />
                        </div>
                    </div>
                    
                    {/* Champ Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={authLoading}
                            placeholder="Votre email"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                        />
                    </div>

                    {/* Champ Mot de passe */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={authLoading}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full mt-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {authLoading ? (
                        <>
                            <FaSpinner className="animate-spin" /> Enregistrement en cours...
                        </>
                    ) : (
                        "S'inscrire"
                    )}
                </button>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Déjà un compte ? <Link href="/login" className="text-green-600 hover:underline font-medium">Se connecter</Link>
                </p>
            </form>
        </div>
    );
}

// Composant utilitaire pour la sélection du rôle par radio/carte
const RoleRadio: React.FC<{
    roleValue: Role,
    currentRole: Role,
    setRole: (role: Role) => void,
    icon: React.ElementType,
    label: string,
    disabled: boolean
}> = ({ roleValue, currentRole, setRole, icon: Icon, label, disabled }) => {
    const isSelected = roleValue === currentRole;

    return (
        <div 
            className={`flex-1 p-4 border rounded-lg cursor-pointer transition-colors ${
                isSelected 
                    ? 'border-green-600 bg-green-50 shadow-md' 
                    : 'border-gray-300 bg-white hover:bg-gray-50'
            } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            onClick={() => !disabled && setRole(roleValue)}
        >
            <div className="flex items-center gap-2">
                <Icon className={`text-xl ${isSelected ? 'text-green-600' : 'text-gray-500'}`} />
                <span className={`font-semibold text-sm ${isSelected ? 'text-green-700' : 'text-gray-800'}`}>{label}</span>
            </div>
        </div>
    );
};