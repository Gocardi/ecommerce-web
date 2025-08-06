'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import Button from '@/components/ui/Button';
import { 
  Menu, 
  X, 
  ShoppingCart, 
  User, 
  LogOut, 
  Leaf,
  Search,
  Bell,
  Settings,
  TrendingUp,
  Package,
  Users
} from 'lucide-react';

const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout, isInitialized } = useAuthStore();
  const { cart, fetchCart } = useCartStore();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Debug logs - SIMPLIFIED
  useEffect(() => {
    console.log('Header render:', { 
      isAuthenticated, 
      hasUser: !!user, 
      userName: user?.fullName,
      isInitialized 
    });
  }, [isAuthenticated, user, isInitialized]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCart();
    }
  }, [isAuthenticated, user, fetchCart]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsUserMenuOpen(false);
  };

  const navItems = [
    { name: 'Inicio', href: '/', current: pathname === '/' },
    { name: 'Productos', href: '/products', current: pathname.startsWith('/products') },
    { name: 'Categorías', href: '/categories', current: pathname.startsWith('/categories') },
  ];

  const userMenuItems = user?.role === 'afiliado' ? [
    { name: 'Mi Dashboard', href: '/affiliate/dashboard', icon: TrendingUp },
    { name: 'Mi Red', href: '/affiliate/network', icon: Users },
    { name: 'Mis Pedidos', href: '/orders', icon: Package },
    { name: 'Mi Perfil', href: '/profile', icon: User },
  ] : [
    { name: 'Mis Pedidos', href: '/orders', icon: Package },
    { name: 'Mi Perfil', href: '/profile', icon: User },
  ];

  if (user?.role === 'admin' || user?.role === 'admin_general') {
    userMenuItems.unshift(
      { name: 'Panel Admin', href: '/admin/dashboard', icon: Settings }
    );
  }

  // Simple loading state
  if (!isInitialized) {
    return (
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <Link href="/" className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <Leaf className="w-6 h-6 lg:w-8 lg:h-8 text-green-600" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl lg:text-2xl font-bold text-gray-900">Natural</span>
                <span className="text-xl lg:text-2xl font-bold text-green-600">Salud</span>
              </div>
            </Link>
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-full">
              <Leaf className="w-6 h-6 lg:w-8 lg:h-8 text-green-600" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl lg:text-2xl font-bold text-gray-900">Natural</span>
              <span className="text-xl lg:text-2xl font-bold text-green-600">Salud</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-medium transition-colors ${
                  item.current
                    ? 'text-green-600 border-b-2 border-green-600 pb-1'
                    : 'text-gray-700 hover:text-green-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar productos naturales..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50"
              />
            </form>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            {isAuthenticated && user && (
              <Link href="/cart" className="relative">
                <div className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <ShoppingCart className="w-6 h-6 text-gray-700" />
                  {cart && cart.totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cart.totalItems}
                    </span>
                  )}
                </div>
              </Link>
            )}

            {/* Notifications */}
            {isAuthenticated && user && (
              <Link href="/notifications" className="relative">
                <div className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Bell className="w-6 h-6 text-gray-700" />
                </div>
              </Link>
            )}

            {/* User Menu */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="hidden lg:block text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {user.fullName?.split(' ')[0]}
                    </div>
                    <div className="text-xs text-green-600 capitalize">
                      {user.role === 'afiliado' ? 'Afiliado' : 
                       user.role === 'admin' ? 'Admin' :
                       user.role === 'admin_general' ? 'Admin General' :
                       'Usuario'}
                    </div>
                  </div>
                </button>

                {/* Enhanced User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 overflow-hidden">
                    {/* User Info Header */}
                    <div className="px-4 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{user.fullName}</div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                          <div className="flex items-center mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              user.role === 'afiliado' ? 'bg-green-100 text-green-700' :
                              user.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                              user.role === 'admin_general' ? 'bg-purple-100 text-purple-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {user.role === 'afiliado' && '⭐ Afiliado Activo'}
                              {user.role === 'admin' && '⚙️ Administrador'}
                              {user.role === 'admin_general' && '🔧 Admin General'}
                              {user.role === 'visitante' && '👤 Usuario'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="py-2">
                      {userMenuItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors group"
                        >
                          <item.icon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-green-600" />
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      ))}
                    </div>
                    
                    {/* Special Actions for Affiliates */}
                    {user.role === 'afiliado' && (
                      <div className="border-t border-gray-100 py-2">
                        <div className="px-4 py-2">
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Acciones de Afiliado
                          </div>
                        </div>
                        <Link
                          href="/affiliate/register"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center px-4 py-3 text-sm text-green-700 hover:bg-green-50 transition-colors group"
                        >
                          <Users className="w-5 h-5 mr-3 text-green-500" />
                          <span className="font-medium">Registrar Nuevo Afiliado</span>
                        </Link>
                      </div>
                    )}

                    {/* Special Actions for Admin General */}
                    {user.role === 'admin_general' && (
                      <div className="border-t border-gray-100 py-2">
                        <div className="px-4 py-2">
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Administración
                          </div>
                        </div>
                        <Link
                          href="/admin/register-admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center px-4 py-3 text-sm text-blue-700 hover:bg-blue-50 transition-colors group"
                        >
                          <Settings className="w-5 h-5 mr-3 text-blue-500" />
                          <span className="font-medium">Registrar Admin Regional</span>
                        </Link>
                      </div>
                    )}
                    
                    {/* Logout */}
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors group"
                      >
                        <LogOut className="w-5 h-5 mr-3 text-red-500" />
                        <span className="font-medium">Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-3">
                <Link href="/login">
                  <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Crear Cuenta
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden py-3 border-t border-gray-200">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </form>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-2 font-medium transition-colors ${
                  item.current ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {!isAuthenticated && (
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" fullWidth className="border-green-600 text-green-600 hover:bg-green-50">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button fullWidth className="bg-green-600 hover:bg-green-700">
                    Crear Cuenta
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overlay for mobile user menu */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;