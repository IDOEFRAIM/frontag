import { User, Role } from '@/types/auth';

// La BASE_URL pointera vers l'API Gateway ou directement vers le microservice Utilisateurs
const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:3002/api/v1/auth';

/**
 * Simule la connexion d'un utilisateur au backend.
 * En production, cela ferait un appel POST à /login
 */
export const loginUser = async (email: string, password: string): Promise<{ user: User, token: string }> => {
    console.log(`[API CALL] Attempting login for: ${email}`);
    
    // 1. Simuler l'appel API
    try {
        // Simulation d'un délai réseau
        await new Promise(resolve => setTimeout(resolve, 800));

        // 2. Logique de Mocking
        let role: Role;
        if (email.includes('prod')) {
            role = 'producer';
        } else if (email.includes('admin')) {
            role = 'admin';
        } else {
            role = 'buyer';
        }

        const mockUser: User = {
            id: 'u-' + Math.random().toString(36).substring(2, 9),
            email: email,
            role: role,
            isVerified: true,
            // name n'est pas requis ici pour la connexion mockée
        };

        const mockToken = `jwt-token-for-${role}-${mockUser.id}`;
        
        console.log(`Login successful. User Role: ${role}`);
        return { user: mockUser, token: mockToken };

    } catch (error) {
        console.error("Login Error:", error);
        throw new Error("Identifiants incorrects ou erreur réseau.");
    }
};

/**
 * En production, vous ajouteriez une fonction pour stocker le token
 * (ex: dans les cookies sécurisés ou le localStorage)
 */
export const storeAuthToken = (token: string) => {
    // Dans un projet réel Next.js, on utiliserait un cookie sécurisé (HttpOnly)
    localStorage.setItem('agriconnect_token', token); 
};

/**
 * Simule l'enregistrement d'un nouvel utilisateur au backend.
 * En production, cela ferait un appel POST à /register
 */
export const registerUser = async (email: string, password: string, role: Role, name: string): Promise<{ user: User, token: string }> => {
    console.log(`[API CALL] Attempting registration for: ${email} with role: ${role}`);
    
    // 1. Simuler l'appel API (POST /register)
    try {
        // Simulation d'un délai réseau
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 2. Logique de Mocking (simuler la création)
        if (email.includes('error')) {
            throw new Error("L'email est déjà utilisé.");
        }

        const mockUser: User = {
            id: 'u-' + Math.random().toString(36).substring(2, 9),
            email: email,
            role: role,
            isVerified: false,
            name: name, // Ajout du nom pour le mock
        };

        const mockToken = `jwt-token-for-${role}-${mockUser.id}`;
        
        console.log(`Registration successful. User Role: ${role}`);
        return { user: mockUser, token: mockToken };

    } catch (error) {
        console.error("Registration Error:", error);
        throw new Error((error as Error).message || "Échec de l'enregistrement. Veuillez réessayer.");
    }
};