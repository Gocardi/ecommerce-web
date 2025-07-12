'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { UserPlus, Eye, EyeOff } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const { register, isLoading, isAuthenticated } = useAuthStore();
  
  const [formData, setFormData] = useState({
    dni: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    region: '',
    city: '',
    address: '',
    reference: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // DNI validation
    if (!formData.dni.trim()) {
      newErrors.dni = 'El DNI es requerido';
    } else if (formData.dni.length !== 8 || !/^\d+$/.test(formData.dni)) {
      newErrors.dni = 'El DNI debe tener 8 dígitos numéricos';
    }

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es requerido';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'El nombre debe tener al menos 3 caracteres';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Phone validation (optional but if provided, should be valid)
    if (formData.phone && (formData.phone.length < 9 || !/^\d+$/.test(formData.phone))) {
      newErrors.phone = 'El teléfono debe tener al menos 9 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const { confirmPassword, ...registerData } = formData;
    const success = await register(registerData);
    
    if (success) {
      router.push('/');
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
            <UserPlus className="mx-auto h-12 w-12 text-blue-600" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Crear Cuenta
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Required Fields */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Información Básica</h3>
                
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

                <Input
                  label="Nombre Completo"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Juan Pérez García"
                  error={errors.fullName}
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="juan@ejemplo.com"
                  error={errors.email}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña *
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar Contraseña *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Optional Fields */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Información de Contacto (Opcional)</h3>
                
                <Input
                  label="Teléfono"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="987654321"
                  error={errors.phone}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Región"
                    type="text"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    placeholder="Lima"
                  />
                  
                  <Input
                    label="Ciudad"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="San Isidro"
                  />
                </div>

                <Input
                  label="Dirección"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Av. Principal 123"
                />

                <Input
                  label="Referencia"
                  type="text"
                  name="reference"
                  value={formData.reference}
                  onChange={handleChange}
                  placeholder="Frente al parque"
                />
              </div>

              <Button
                type="submit"
                fullWidth
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </Button>
            </form>

            <div className="mt-6">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Beneficios de ser afiliado:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Precios especiales en todos los productos</li>
                    <li>Descuentos exclusivos y promociones</li>
                    <li>Acceso prioritario a nuevos productos</li>
                    <li>Soporte personalizado</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;