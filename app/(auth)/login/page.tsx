'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth'; 
import { FaSignInAlt, FaSpinner, FaLock, FaEnvelope } from 'react-icons/fa';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const { login, isAuthenticated, isLoading, userRole } = useAuth();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema)
    });

    // Fonction utilitaire pour centraliser les chemins de redirection
    const redirectUserByRole = (role: string) => {
        const normalizedRole = role?.toUpperCase();
        switch (normalizedRole) {
            case 'ADMIN':
                router.push('/admin');
                break;
            case 'PRODUCER':
                router.push('/dashboard');
                break;
            case 'USER':
                router.push('/market');
                break;
            default:
                router.push('/');
        }
    };

    // 1. Redirection SI déjà connecté à l'arrivée sur la page
    useEffect(() => {
        if (!isLoading && isAuthenticated && userRole) {
            redirectUserByRole(userRole);
        }
    }, [isAuthenticated, isLoading, userRole]);

    // 2. Gestion du formulaire
    const onSubmit = async (data: LoginFormInputs) => {
        const result = await login(data.email, data.password);
        if (result?.success) {
            toast.success("Connexion réussie !");
            if (result.user?.role) {
                redirectUserByRole(result.user.role);
            }
        } else {
            toast.error(result?.error || "Échec de la connexion");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <FaSpinner className="animate-spin text-4xl text-green-600 mb-4" />
                <p className="text-lg font-medium text-gray-700">Vérification de vos accès...</p>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-gray-100 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-green-700 flex items-center justify-center gap-2">
                        <FaSignInAlt className="text-green-500" /> Connexion
                    </h2>
                    <p className="text-gray-500 mt-2 italic text-sm">"Le succès est au bout de l'effort."</p>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase ml-1 mb-1">Email</label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                {...register("email")}
                                disabled={isSubmitting}
                                placeholder="agriculteur@faso.com"
                                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase ml-1 mb-1">Mot de passe</label>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                {...register("password")}
                                disabled={isSubmitting}
                                placeholder="••••••••"
                                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
                            />
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? <FaSpinner className="animate-spin" /> : "Se connecter"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm">
                        Pas encore de compte ?{' '}
                        <Link href="/signup" className="text-green-600 font-bold hover:underline">
                            Créer un compte
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
