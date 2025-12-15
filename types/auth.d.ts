/**
 * Définit les rôles utilisateurs principaux dans la plateforme.
 */
export type Role = 'buyer' | 'producer' | 'admin';

/**
 * Interface pour les données de géolocalisation (utilisée par plusieurs services).
 */
export interface Location {
    lat: number;
    lng: number;
    address: string;
}

/**
 * Interface complète pour un utilisateur AgriConnect.
 */
export interface User {
    id: string; // Utilisé comme _id MongoDB ou UUID PostgreSQL
    email: string;
    role: Role;
    name?: string;
    phone?: string;
    location?: Location;
    isVerified: boolean;
    
    // Champs spécifiques au Producteur
    producerProfile?: {
        farmName: string;
        certifications: string[];
        score: number; // Score de crédibilité/performance
    };
}

/**
 * Définit la structure des données et des fonctions exposées par le Contexte d'Authentification.
 * Cette interface est requise par le hook useAuth.
 */
export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    userRole: Role | 'guest'; // 'guest' pour les utilisateurs non connectés
    
    // Fonctions du service
    login: (email: string, password: string) => Promise<void>; 
    register: (email: string, password: string, role: Role, name: string) => Promise<void>;
    logout: () => void;
    
    // État du contexte
    isLoading: boolean;
    error: string | null;
}