'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Shield, Eye, EyeOff } from 'lucide-react';

const AffiliateLoginPage: React.FC = () => {
  const router = useRouter();
  const { login, isLoading, isAuthenticated, user } = useAuthStore();
  
  const [formData, setFormData] = useState({
    dni: '',
    password: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirigir según el rol
      if (user.role === 'admin_general') {
        router.push('/admin/dashboard');
      } else if (user.role === 'admin') {
        router.push('/admin/orders');
      } else if (user.role === 'afiliado') {
        router.push('/affiliate/dashboard');
      } else {
        router.push('/');
      }
    }
  }, [isAuthenticated, user, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.dni.trim()) {
      newErrors.dni = 'El DNI es requerido';
    } else if (formData.dni.length !== 8) {
      newErrors.dni = 'El DNI debe tener 8 dígitos';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const success = await login(formData);
    if (success) {
      // La redirección se maneja en el useEffect
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <Shield className="mx-auto h-12 w-12 text-blue-600" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Acceso para Afiliados
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Portal exclusivo para afiliados, administradores y personal autorizado
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="DNI"
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                placeholder="12345678"
                error={errors.dni}
                required
                maxLength={8}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                fullWidth
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>

            <div className="mt-6">
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Acceso restringido:</p>
                  <p>Solo para afiliados, administradores y administrador general</p>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <Link 
                href="/login" 
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                ¿Usuario normal? Inicia sesión aquí
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AffiliateLoginPage;