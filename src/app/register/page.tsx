'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { 
  Eye, 
  EyeOff, 
  User, 
  Mail, 
  Lock, 
  Leaf, 
  ArrowLeft,
  CheckCircle,
  Shield,
  Heart,
  Package,
  Truck
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const { register, isLoading, error, isAuthenticated, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState({
    dni: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) clearError();
  };

  const validateForm = () => {
    if (!formData.dni.trim() || formData.dni.length !== 8) {
      toast.error('El DNI debe tener 8 dígitos');
      return false;
    }
    if (!formData.fullName.trim()) {
      toast.error('El nombre completo es requerido');
      return false;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('Ingresa un email válido');
      return false;
    }
    if (!formData.password.trim() || formData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return false;
    }
    if (!acceptTerms) {
      toast.error('Debes aceptar los términos y condiciones');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      // Register as normal user (visitante)
      const userData = {
        dni: formData.dni,
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      };
      
      await register(userData);
      toast.success('¡Registro exitoso! Ya puedes iniciar sesión');
      router.push('/login');
    } catch (error) {
      // Error is handled in the store
    }
  };

  const benefits = [
    {
      icon: Package,
      title: 'Catálogo Completo',
      description: 'Accede a toda nuestra gama de productos naturales premium'
    },
    {
      icon: Shield,
      title: 'Compras Seguras',
      description: 'Realiza pedidos con total confianza y protección de datos'
    },
    {
      icon: Truck,
      title: 'Envío Rápido',
      description: 'Recibe tus productos en 24-48 horas en Lima'
    },
    {
      icon: Heart,
      title: 'Atención Personalizada',
      description: 'Recibe recomendaciones para tu bienestar'
    }
  ];

  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* Left Side - Hero Section */}
          <div className="lg:w-2/5 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            
            <div className="relative z-10 text-white max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                  <User className="w-8 h-8" />
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold">Crea tu Cuenta</h1>
              </div>
              
              <p className="text-xl text-green-100 mb-8 leading-relaxed">
                Únete a nuestra comunidad y descubre productos naturales 
                que transformarán tu bienestar día a día.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <benefit.icon className="w-6 h-6 text-green-200 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-white mb-1">{benefit.title}</h3>
                      <p className="text-green-100 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <Leaf className="w-5 h-5 text-green-200" />
                  <span className="text-white font-semibold">100% Natural</span>
                </div>
                <p className="text-green-100 text-sm">
                  Todos nuestros productos son naturales, certificados y de la más alta calidad.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              {/* Back Button */}
              <Link 
                href="/" 
                className="inline-flex items-center text-green-600 hover:text-green-700 mb-8 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al inicio
              </Link>

              <Card className="border-green-200 shadow-xl">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <Leaf className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Registro de Usuario</h2>
                  <p className="text-gray-600">
                    Completa tus datos para crear tu cuenta gratuita
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="dni" className="block text-sm font-medium text-gray-700 mb-2">
                        DNI *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="dni"
                          name="dni"
                          type="text"
                          placeholder="12345678"
                          value={formData.dni}
                          onChange={handleInputChange}
                          maxLength={8}
                          className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre Completo *
                      </label>
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="Juan Pérez García"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="border-green-200 focus:border-green-500 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Correo Electrónico *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Contraseña *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Mínimo 6 caracteres"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="pl-10 pr-10 border-green-200 focus:border-green-500 focus:ring-green-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmar Contraseña *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Repite tu contraseña"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="pl-10 pr-10 border-green-200 focus:border-green-500 focus:ring-green-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1"
                      required
                    />
                    <label htmlFor="acceptTerms" className="text-sm text-gray-600">
                      Acepto los{' '}
                      <Link href="/terms" className="text-green-600 hover:text-green-700 underline">
                        términos y condiciones
                      </Link>
                      {' '}y la{' '}
                      <Link href="/privacy" className="text-green-600 hover:text-green-700 underline">
                        política de privacidad
                      </Link>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    fullWidth
                    className="bg-green-600 hover:bg-green-700 py-3 text-lg font-medium"
                  >
                    {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                  </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      ¿Ya tienes una cuenta?{' '}
                      <Link href="/login" className="text-green-600 hover:text-green-700 font-semibold">
                        Inicia sesión aquí
                      </Link>
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;