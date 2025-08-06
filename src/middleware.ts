import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  const { pathname } = request.nextUrl

  // Rutas que SIEMPRE son públicas
  const alwaysPublicPaths = ['/login', '/register', '/']
  const isAlwaysPublic = alwaysPublicPaths.includes(pathname)
  
  // Rutas que no necesitan middleware
  const skipPaths = pathname.startsWith('/api') || 
                    pathname.startsWith('/_next') || 
                    pathname.startsWith('/favicon.ico') ||
                    pathname.includes('.') // archivos estáticos

  if (skipPaths) {
    return NextResponse.next()
  }

  // Si tiene token y está en login, redirigir al home
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Si no tiene token y NO es ruta pública, redirigir a login
  if (!token && !isAlwaysPublic) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}