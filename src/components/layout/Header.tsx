'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useProductsStore } from '@/store/productsStore';
import Button from '@/components/ui/Button';
import { 
  ShoppingCart, 
  User, 
  Search, 
  Menu, 
  X,
  LogOut,
  Settings,
  Package
} from 'lucide-react';

const Header: React.FC = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { user, isAuthenticated, logout, isAdmin, getDisplayName, getRoleLabel } = useAuthStore();
  const { searchProducts, categories } = useProductsStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchProducts(searchTerm);
      router.push('/products');
    }
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    router.push('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">xddddd</span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </form>
          </div>

          {/* Navigation & Actions */}
          <div className="flex items-center space-x-4">
            {/* Categories - Desktop */}
            <nav className="hidden lg:flex space-x-6">
              <Link 
                href="/products" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Productos
              </Link>
              <Link 
                href="/categories" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Categorías
              </Link>
            </nav>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-blue-600">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                >
                  <User className="w-6 h-6" />
                  <span className="hidden md:block text-sm">{getDisplayName()}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{getDisplayName()}</p>
                      <p className="text-xs text-gray-500">{getRoleLabel()}</p>
                    </div>
                    
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Mi Perfil
                    </Link>

                    {isAdmin() && (
                      <Link
                        href="/admin"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Administración
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/login')}
                >
                  Iniciar Sesión
                </Button>
                <Button
                  size="sm"
                  onClick={() => router.push('/register')}
                >
                  Registrarse
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="space-y-2">
              <Link
                href="/products"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Productos
              </Link>
              <Link
                href="/categories"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Categorías
              </Link>
              {isAdmin() && (
                <Link
                  href="/admin"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Administración
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;