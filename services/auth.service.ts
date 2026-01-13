'use server';

import { prisma } from "@/lib/prisma"; 
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { Role } from "@prisma/client";

/**
 * INSCRIPTION
 */
export async function registerUser(data: { 
    email: string; 
    password: string; 
    name: string; 
    role: Role; 
    phone?: string;
    adminSecret?: string; // Ajout du champ secret
}) {
    try {
        const { email, password, name, role, phone, adminSecret } = data;

        // 1. Sécurité Admin : Vérification du code secret
        if (role === 'ADMIN') {
            const MASTER_ADMIN_SECRET = "ADMIN123"; // 👈 CHANGE CE CODE POUR TES 3 COMPTES
            if (adminSecret !== MASTER_ADMIN_SECRET) {
                return { success: false, error: "Code d'autorisation Admin incorrect." };
            }
        }

        // 2. Vérification d'existence
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return { success: false, error: "Cet email est déjà utilisé." };
        }

        // 3. Hashage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Création atomique
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role,
                phone: phone || undefined, // Use phone if provided
                // On crée le profil producteur UNIQUEMENT si le rôle est PRODUCER
                ...(role === 'PRODUCER' ? {
                    producer: {
                        create: {
                            businessName: name || "Nouveau Producteur",
                            status: "PENDING",
                            region: "À préciser",
                            province: "À préciser",
                            commune: "À préciser"
                        }
                    }
                } : {})
            }
        });

        // 5. Gestion du Cookie
        const cookieStore = await cookies();
        cookieStore.set("user-role", newUser.role, { 
            httpOnly: false, 
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7 // 7 jours
        });

        return { success: true, user: { id: newUser.id, role: newUser.role } };

    } catch (error: any) {
        console.error("❌ Erreur Inscription Action:", error);
        
        if (error.code === 'P2002') {
            return { success: false, error: "L'email ou le numéro de téléphone est déjà utilisé." };
        }
        return { success: false, error: "Erreur lors de la création du compte." };
    }
}

/**
 * CONNEXION
 */
export async function loginUser(credentials: any) {
    try {
        const { email, password } = credentials;
        
        const user = await prisma.user.findUnique({ 
            where: { email },
            include: { producer: true } 
        });

        if (!user || !user.password) {
            return { success: false, error: "Identifiants invalides" };
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return { success: false, error: "Identifiants invalides" };
        }

        const cookieStore = await cookies();
        cookieStore.set("user-role", user.role, { 
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7
        });

        return { 
            success: true, 
            user: { 
                id: user.id, 
                role: user.role,
                name: user.name,
                producerStatus: user.producer?.status || null 
            } 
        };

    } catch (error) {
        console.error("❌ Erreur Login Action:", error);
        return { success: false, error: "Une erreur est survenue lors de la connexion" };
    }
}

/**
 * DÉCONNEXION
 */
export async function logoutUser() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete("user-role");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Erreur lors de la déconnexion" };
    }
}