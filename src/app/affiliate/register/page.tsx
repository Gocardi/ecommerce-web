```tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Users, Shield, UserPlus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';

const RegisterAffiliatePage: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    dni: '',
    fullName: '',
    email: '',
    phone: '',
    region: '',
    city: '',
    address: '',
    reference: '',
  });

  // Verificar que el usuario sea afiliado
  if (!isAuthenticated || user?.role !== 'afiliado') {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-red-100 rounded-full">
                <Shield className="h-12 w-12 text-red-600" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Acceso Restringido</h3>
            <p className="text-gray-600 mb-8">Solo los afiliados pueden registrar nuevos afiliados.</p>
            <Link href="/">
              <Button className="bg-green-600 hover:bg-green-700">Ir al Inicio</Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post('/auth/register/affiliate', formData);
      
      if (response.data.success) {
        const tempPassword = response.data.data.user.tempPassword;
        toast.success(`¡Afiliado registrado exitosamente! Contraseña temporal: ${tempPassword}`, {
          duration: 10000,
        });
        
        // Resetear formulario
        setFormData({
          dni: '',
          fullName: '',
          email: '',
          phone: '',
          region: '',
          city: '',
          address: '',
          reference: '',
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al registrar afiliado';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/affiliate/dashboard">
              <Button variant="outline" className="mb-4 border-green-600 text-green-600 hover:bg-green-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Dashboard
              </Button>
            </Link>
            
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-full">
                  <UserPlus className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Registrar Nuevo Afiliado</h1>
                  <p className="mt-2 text-green-100">
                    Expande tu red y genera más comisiones
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <Card className="bg-white/80 backdrop-blur-sm border-green-200 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información Personal */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-green-600" />
                  Información Personal
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      DNI *
                    </label>
                    <Input
                      type="text"
                      name="dni"
                      value={formData.dni}
                      onChange={handleChange}
                      placeholder="12345678"
                      maxLength={8}
                      required
                      className="border-green-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo *
                    </label>
                    <Input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Juan Pérez García"
                      required
                      className="border-green-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="juan@example.com"
                      required
                      className="border-green-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono *
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="987654321"
                      required
                      className="border-green-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Información de Ubicación */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Información de Ubicación
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Región *
                    </label>
                    <Input
                      type="text"
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      placeholder="Lima"
                      required
                      className="border-green-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ciudad *
                    </label>
                    <Input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="San Isidro"
                      required
                      className="border-green-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección Completa *
                    </label>
                    <Input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Av. Larco 123, San Isidro"
                      required
                      className="border-green-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Referencia (Opcional)
                    </label>
                    <Input
                      type="text"
                      name="reference"
                      value={formData.reference}
                      onChange={handleChange}
                      placeholder="Frente al parque, casa de dos pisos"
                      className="border-green-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Información Importante */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">📋 Información Importante</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Se generará una contraseña temporal automáticamente</li>
                  <li>• El nuevo afiliado recibirá sus credenciales para acceder</li>
                  <li>• Podrá cambiar su contraseña al iniciar sesión por primera vez</li>
                  <li>• Tendrá acceso a precios especiales y podrá generar su propia red</li>
                </ul>
              </div>

              {/* Botón de Envío */}
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 px-8"
                >
                  {isLoading ? 'Registrando...' : 'Registrar Afiliado'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
};

export default RegisterAffiliatePage;
```