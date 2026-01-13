import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Récupère le rôle stocké dans les cookies au moment du login
  const userRole = request.cookies.get('user-role')?.value;
  const { pathname } = request.nextUrl;

  // 1. Protection du Dashboard Producteur
  if (pathname.startsWith('/producer') && userRole !== 'PRODUCER') {
    return NextResponse.redirect(new URL('/market', request.url));
  }

  // 2. Protection de l'Espace Admin
  if (pathname.startsWith('/admin') && userRole !== 'ADMIN') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Empêcher les utilisateurs connectés d'aller sur Signup/Login
  if ((pathname === '/signup' || pathname === '/login') && userRole) {
    const target = userRole === 'PRODUCER' ? '/productor/dashboard' : '/market';
    return NextResponse.redirect(new URL(target, request.url));
  }

  return NextResponse.next();
}

// Définir sur quelles routes le middleware s'exécute
export const config = {
  matcher: ['/productor/:path*', '/admin/:path*', '/signup', '/login'],
};