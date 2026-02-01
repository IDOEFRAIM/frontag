'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth'; 
import { FaLeaf, FaSpinner, FaLock, FaEnvelope } from 'react-icons/fa';
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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f7f5ee] to-[#e6f4ea] p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-[#e0e0d1]">
                <div className="text-center mb-8">
                    <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-3 shadow-sm">
                        <FaLeaf className="text-green-600 text-4xl" />
                    </span>
                    <h2 className="text-3xl font-extrabold text-green-800 mb-2">Bienvenue sur FrontAg</h2>
                    <p className="text-[#6b705c] mt-2 italic text-base font-medium">
                        Connectons producteurs et consommateurs pour bâtir l’autosuffisance alimentaire au Burkina Faso.<br/>
                        <span className="text-green-700 font-semibold">Moins de pertes, plus de solidarité.</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-[#7c795d] uppercase ml-1 mb-1">Email</label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b7b7a4]" />
                            <input
                                type="email"
                                {...register("email")}
                                disabled={isSubmitting}
                                placeholder="agriculteur@faso.com"
                                className={`w-full pl-10 pr-4 py-3 border rounded-2xl focus:ring-2 focus:ring-green-400 outline-none transition-all bg-[#f8faf7] ${errors.email ? 'border-red-400' : 'border-[#e0e0d1]'}`}
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#7c795d] uppercase ml-1 mb-1">Mot de passe</label>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b7b7a4]" />
                            <input
                                type="password"
                                {...register("password")}
                                disabled={isSubmitting}
                                placeholder="••••••••"
                                className={`w-full pl-10 pr-4 py-3 border rounded-2xl focus:ring-2 focus:ring-green-400 outline-none transition-all bg-[#f8faf7] ${errors.password ? 'border-red-400' : 'border-[#e0e0d1]'}`}
                            />
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-green-700 to-green-500 hover:from-green-800 hover:to-green-600 text-white font-bold py-3 rounded-2xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? <FaSpinner className="animate-spin" /> : "Se connecter"}
                    </button>
                </form>

                <div className="mt-7 text-center">
                    <p className="text-[#7c795d] text-sm">
                        Pas encore de compte ?{' '}
                        <Link href="/signup" className="text-green-700 font-bold hover:underline">
                            Créer un compte
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
