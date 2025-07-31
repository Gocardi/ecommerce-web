import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
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

  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Obtener token de las cookies o localStorage (simulado)
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '') || 
                request.cookies.get('auth-token')?.value;

  // Si es una ruta protegida y no hay token, redirigir al login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si es una ruta de auth y hay token, redirigir al home
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};