import { User, Role } from '@/types/auth'; 

// --- Faux Profils pour le développement ---

export const mockAdminUser: User = { // CHANGEMENT: UserProfile devient User
    id: 'ADMIN-001',
    // Pas de 'username' dans le type User
    email: 'amadou.diagne@admin.agriconnect.org',
    role: 'admin',
    isVerified: true, // Ajout du champ isVerified
    name: 'Amadou Diagne (Console Centrale)', // Ajout du nom pour simuler
};

export const mockProducerUser: User = { // CHANGEMENT: UserProfile devient User
    id: 'PROD-007',
    // Pas de 'username' dans le type User
    email: 'fatou.ferme@producteur.com',
    role: 'producer',
    isVerified: true, // Ajout du champ isVerified
    name: 'Fatou Ferme', 
};

export const mockCustomerUser: User = { // CHANGEMENT: UserProfile devient User
    id: 'CUST-245',
    // Pas de 'username' dans le type User
    email: 'moussa.c@gmail.com',
    role: 'buyer', // CHANGEMENT: 'customer' devient 'buyer'
    isVerified: true, // Ajout du champ isVerified
    name: 'Moussa Acheteur',
};

// Fonction utilitaire pour récupérer le bon profil
// Note : Cette fonction est maintenant inutile si vous utilisez auth.service.ts
export function getMockUserByRole(role: Role): User { // CHANGEMENT: UserRole devient Role, UserProfile devient User
    switch (role) {
        case 'admin':
            return mockAdminUser;
        case 'producer':
            return mockProducerUser;
        case 'buyer': // CHANGEMENT: 'customer' devient 'buyer'
            return mockCustomerUser;
        default:
            // Ceci ne devrait jamais arriver avec le type Role
            throw new Error('Rôle invalide pour la simulation.'); 
    }
}