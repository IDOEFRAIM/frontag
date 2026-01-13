'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth'; 
import type { Role } from "@prisma/client";
import { useForm } from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { 
  FaUserPlus, FaSpinner, FaSeedling, FaShoppingCart, 
  FaEnvelope, FaLock, FaUser, FaShieldAlt 
} from 'react-icons/fa';

const signupSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  role: z.enum(['USER', 'PRODUCER', 'ADMIN']),
  adminSecret: z.string().optional(),
}).refine((data) => {
    if (data.role === 'ADMIN' && !data.adminSecret) {
        return false;
    }
    return true;
}, {
    message: "Code secret requis pour les administrateurs",
    path: ["adminSecret"],
});

type SignupFormInputs = z.infer<typeof signupSchema>;

export default function SignupPage() {
    const { register: registerUser, isAuthenticated, isLoading, userRole } = useAuth();
    const router = useRouter();

    const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<SignupFormInputs>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            role: 'USER',
            name: '',
            email: '',
            password: '',
            adminSecret: ''
        }
    });

    const selectedRole = watch('role');

    // Redirection automatique si déjà authentifié
    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            const r = userRole?.toUpperCase();
            if (r === 'ADMIN') router.replace('/admin');
            else if (r === 'PRODUCER') router.replace('/productor/dashboard');
            else router.replace('/market');
        }
    }, [isAuthenticated, isLoading, userRole, router]);

    const onSubmit = async (data: SignupFormInputs) => {
        const result = await registerUser({ 
            email: data.email, 
            password: data.password, 
            role: data.role as Role, 
            name: data.name, 
            adminSecret: data.adminSecret 
        });

        if (result?.success) {
            toast.success("Inscription réussie ! Redirection...");
            // Redirection is handled by useAuth or useEffect, but we can force it here if needed.
            // Since useAuth updates state, the useEffect above might trigger.
            // But let's wait a bit or let the useEffect handle it.
            // Actually, useAuth sets user and role, so useEffect will trigger.
        } else {
            toast.error(result?.error || "Échec de l'inscription");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <FaSpinner className="animate-spin text-4xl text-green-600 mb-4" />
                <p className="text-lg font-medium text-gray-700">Préparation de votre espace...</p>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-gray-100 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
                
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-green-700 flex items-center justify-center gap-2">
                        <FaSeedling className="text-green-500" /> AgriConnect
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Rejoignez la révolution agricole</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    
                    {/* SÉLECTEUR DE RÔLE */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Type de compte</label>
                        <div className="flex gap-2">
                            <RoleCard 
                                selected={selectedRole === 'USER'} 
                                onClick={() => setValue('role', 'USER')} 
                                icon={FaShoppingCart} 
                                label="Acheteur" 
                            />
                            <RoleCard 
                                selected={selectedRole === 'PRODUCER'} 
                                onClick={() => setValue('role', 'PRODUCER')} 
                                icon={FaSeedling} 
                                label="Producteur" 
                            />
                            <RoleCard 
                                selected={selectedRole === 'ADMIN'} 
                                onClick={() => setValue('role', 'ADMIN')} 
                                icon={FaShieldAlt} 
                                label="Staff" 
                            />
                        </div>
                    </div>

                    {/* CHAMP NOM */}
                    <div>
                        <div className="relative">
                            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                {...register("name")}
                                disabled={isSubmitting}
                                placeholder="Nom complet ou Coopérative"
                                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
                            />
                        </div>
                        {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name.message}</p>}
                    </div>

                    {/* CHAMP EMAIL */}
                    <div>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                {...register("email")}
                                disabled={isSubmitting}
                                placeholder="Email"
                                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>}
                    </div>

                    {/* CHAMP MOT DE PASSE */}
                    <div>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                {...register("password")}
                                disabled={isSubmitting}
                                placeholder="Mot de passe"
                                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
                            />
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>}
                    </div>

                    {/* CHAMP CODE SECRET ADMIN (Conditionnel) */}
                    {selectedRole === 'ADMIN' && (
                        <div className="relative animate-in slide-in-from-top-2 duration-300">
                            <FaShieldAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500" />
                            <input
                                type="password"
                                {...register("adminSecret")}
                                disabled={isSubmitting}
                                placeholder="Code de sécurité Administrateur"
                                className={`w-full pl-10 pr-4 py-3 border-2 bg-red-50 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all ${errors.adminSecret ? 'border-red-500' : 'border-red-100'}`}
                            />
                            <p className="text-[10px] text-red-500 mt-1 ml-2 font-bold uppercase tracking-wider">Zone réservée au staff</p>
                            {errors.adminSecret && <p className="text-red-500 text-xs mt-1 ml-1">{errors.adminSecret.message}</p>}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-4 text-white font-bold rounded-xl shadow-lg transition-all transform active:scale-95 disabled:bg-gray-400 flex items-center justify-center gap-2 ${
                            selectedRole === 'ADMIN' ? 'bg-red-600 hover:bg-red-700 shadow-red-100' : 'bg-green-600 hover:bg-green-700 shadow-green-100'
                        }`}
                    >
                        {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaUserPlus />}
                        {isSubmitting ? 'Création...' : selectedRole === 'ADMIN' ? 'Créer compte Admin' : 'Créer mon compte'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-600 text-sm">
                        Déjà membre ?{' '}
                        <Link href="/login" className="text-green-600 font-bold hover:text-green-800 transition-colors">
                            Connectez-vous ici
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

// Composant Interne pour les cartes de rôle
function RoleCard({ selected, onClick, icon: Icon, label }: { selected: boolean, onClick: () => void, icon: any, label: string }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex-1 flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-300 ${
                selected 
                ? 'border-green-600 bg-green-50 text-green-700 shadow-sm scale-105' 
                : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
            }`}
        >
            <Icon size={20} className={`mb-1 ${selected ? 'text-green-600' : 'text-gray-300'}`} />
            <span className="text-[9px] font-black uppercase tracking-tighter">{label}</span>
        </button>
    );
}
