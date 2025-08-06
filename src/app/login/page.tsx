'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Eye, EyeOff, Leaf, LogIn } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading, isAuthenticated, user, isInitialized } = useAuthStore();
  
  const [formData, setFormData] = useState({
    dni: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);

  // Redirect if authenticated - SOLO UNA VEZ
  useEffect(() => {
    if (isInitialized && isAuthenticated && user && !hasRedirected) {
      setHasRedirected(true);
      const redirectTo = searchParams.get('redirect') || '/';
      console.log('Redirecting authenticated user to:', redirectTo);
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, user, isInitialized, searchParams, hasRedirected]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.dni.trim() || !formData.password.trim()) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    try {
      const result = await login(formData.dni.trim(), formData.password);
      
      if (result.success) {
        console.log('Login successful, redirecting...');
        // Dar tiempo para que el state se actualice
        setTimeout(() => {
          const redirectTo = searchParams.get('redirect') || '/';
          window.location.href = redirectTo;
        }, 100);
      }
      
    } catch (error) {
      // Error is handled in the store
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Show loading SOLO si no está inicializado O si está autenticado pero no ha redirigido
  if (!isInitialized || (isAuthenticated && user && !hasRedirected)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">
            {!isInitialized ? 'Inicializando...' : 'Redirigiendo...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-green-100 rounded-full">
                <Leaf className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Iniciar Sesión</h2>
            <p className="mt-2 text-gray-600">
              Accede a tu cuenta en Natural Salud
            </p>
          </div>

          {/* Form */}
          <Card className="bg-white/80 backdrop-blur-sm border-green-200 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  DNI
                </label>
                <Input
                  type="text"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  placeholder="Ingresa tu DNI"
                  maxLength={8}
                  className="border-green-200 focus:border-green-500 focus:ring-green-500"
                  autoComplete="username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Ingresa tu contraseña"
                    className="border-green-200 focus:border-green-500 focus:ring-green-500 pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                fullWidth
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 py-3 text-lg font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <LogIn className="w-5 h-5 mr-2" />
                    Iniciar Sesión
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes una cuenta?{' '}
                <Link href="/register" className="font-medium text-green-600 hover:text-green-500">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </Card>

          {/* Test credentials for development */}
          {process.env.NODE_ENV === 'development' && (
            <Card className="bg-yellow-50 border-yellow-200">
              <div className="text-center">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">Credenciales de Prueba</h3>
                <div className="text-xs text-yellow-700 space-y-1">
                  <p>Admin General: DNI: 12345678 | Pass: 123456</p>
                  <p>Admin: DNI: 87654321 | Pass: 123456</p>
                  <p>Afiliado: DNI: 11111111 | Pass: 123456</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default LoginPage;