import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Obtener el pathname de la URL
  const { pathname } = request.nextUrl;

  // Rutas que requieren autenticación
  const protectedRoutes = [
    '/profile',
    '/admin',
    '/orders',
    '/cart/checkout'
  ];

  // Rutas solo para usuarios no autenticados
  const authRoutes = [
    '/login',
    '/register'
  ];

  // Verificar si es una ruta protegida
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Verificar si es una ruta de autenticación
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Obtener token del header Authorization o cookies
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '') || 
                request.cookies.get('auth-token')?.value;

  // Si es una ruta protegida y no hay token, redirigir al login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si es una ruta de auth y hay token, redirigir al home
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Continuar con la request normal
  return NextResponse.next();
}

// Configuración del matcher para especificar en qué rutas se ejecuta el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*$).*)',
  ],
};