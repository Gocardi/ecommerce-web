'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Settings, Shield, UserPlus, ArrowLeft, MapPin } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';

const RegisterAdminPage: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    dni: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    region: '',
  });

  // Verificar que el usuario sea admin general
  if (!isAuthenticated || user?.role !== 'admin_general') {
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
            <p className="text-gray-600 mb-8">Solo el administrador general puede registrar administradores regionales.</p>
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
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/auth/register/admin', {
        dni: formData.dni,
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        region: formData.region,
      });
      
      if (response.data.success) {
        toast.success('¡Administrador regional registrado exitosamente!');
        
        // Resetear formulario
        setFormData({
          dni: '',
          fullName: '',
          email: '',
          password: '',
          confirmPassword: '',
          region: '',
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al registrar administrador';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const regions = [
    'Lima', 'Arequipa', 'Cusco', 'La Libertad', 'Piura', 'Lambayeque', 'Junín',
    'Áncash', 'Ica', 'Cajamarca', 'Loreto', 'Huánuco', 'San Martín', 'Tacna',
    'Ayacucho', 'Ucayali', 'Apurímac', 'Huancavelica', 'Pasco', 'Tumbes',
    'Amazonas', 'Moquegua', 'Puno', 'Madre de Dios'
  ];

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/admin/dashboard">
              <Button variant="outline" className="mb-4 border-blue-600 text-blue-600 hover:bg-blue-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Dashboard
              </Button>
            </Link>
            
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-full">
                  <UserPlus className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Registrar Administrador Regional</h1>
                  <p className="mt-2 text-blue-100">
                    Crear nuevo administrador para gestionar una región específica
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información Personal */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-blue-600" />
                  Información del Administrador
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
                      className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
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
                      placeholder="María González López"
                      required
                      className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="admin@naturalsalud.com"
                      required
                      className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Credenciales */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Credenciales de Acceso
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña *
                    </label>
                    <Input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Mínimo 6 caracteres"
                      required
                      className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Contraseña *
                    </label>
                    <Input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repetir contraseña"
                      required
                      className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Asignación Regional */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  Asignación Regional
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Región a Administrar *
                  </label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">Seleccionar región...</option>
                    {regions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Información de Permisos */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">🔐 Permisos del Administrador Regional</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Gestionar pedidos y usuarios de su región asignada</li>
                  <li>• Aprobar comisiones de afiliados de su región</li>
                  <li>• Ver reportes y estadísticas regionales</li>
                  <li>• Actualizar estado de pedidos y seguimiento</li>
                  <li>• No puede crear otros administradores</li>
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
                  className="bg-blue-600 hover:bg-blue-700 px-8"
                >
                  {isLoading ? 'Registrando...' : 'Registrar Administrador'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
};

export default RegisterAdminPage;
