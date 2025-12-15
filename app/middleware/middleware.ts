// Exemple de middleware.ts (avec une librairie d'auth comme NextAuth/Clerk)
import { NextResponse, type NextRequest } from 'next/server';

// 1. Définition des chemins d'accès
const adminPaths = ['/admin', '/admin/producers', '/admin/stock', '/admin/validations', '/admin/settings'];
const producerPaths = ['/app/(productor)', '/app/(productor)/dashboard', '/app/(productor)/settings']; // Utilisez le groupe de layout

// 2. Fonction de vérification du rôle (simulée)
function getUserRole(token: string | undefined): 'admin' | 'producer' | 'customer' | null {
    // LOGIQUE RÉELLE : Décrypter le JWT du token pour obtenir le rôle et l'ID
    if (!token) return null;
    
    // Simplification pour l'exemple
    if (token.includes('admin_token')) return 'admin';
    if (token.includes('producer_token')) return 'producer';
    
    return 'customer';
}

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Récupérer le token d'authentification (souvent dans un cookie)
    const token = request.cookies.get('auth_token')?.value;
    const userRole = getUserRole(token);

    // --- LOGIQUE D'ACCÈS PROTÉGÉ ---

    // A. Protéger l'accès Admin
    if (adminPaths.some(path => pathname.startsWith(path))) {
        if (userRole !== 'admin') {
            console.warn(`Accès Admin non autorisé pour le rôle: ${userRole}`);
            // Rediriger vers le dashboard approprié ou la page de connexion
            return NextResponse.redirect(new URL('/login?error=unauthorized', request.url));
        }
    }

    // B. Protéger l'accès Producteur
    if (pathname.includes('/app/(productor)')) {
        if (userRole !== 'producer') {
            console.warn(`Accès Producteur non autorisé pour le rôle: ${userRole}`);
            return NextResponse.redirect(new URL('/login?error=unauthorized', request.url));
        }
    }
    
    // C. Si la personne est sur /login ou /register mais déjà connectée
    if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
        if (userRole === 'admin') {
            return NextResponse.redirect(new URL('/admin', request.url));
        }
        if (userRole === 'producer') {
            return NextResponse.redirect(new URL('/app/(productor)/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

// 3. Configuration (Définir les routes que le middleware doit intercepter)
export const config = {
  matcher: [
    /*
     * Match toutes les routes sauf :
     * - _next/static (fichiers statiques)
     * - _next/image (optimisation d'image)
     * - favicon.ico
     * - Les fichiers dans /public (sw.js, manifest.json, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sw.js|manifest.json|.*\\..*).*)',
  ],
};