'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useProductsStore } from '@/store/productsStore';
import { useAuthStore } from '@/store/authStore';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  ShoppingBag, 
  Star, 
  TrendingUp, 
  Users, 
  Shield,
  Truck,
  Percent,
  ArrowRight,
  Leaf,
  Heart,
  Award,
  CheckCircle,
  Zap,
  Globe,
  Phone,
  Mail,
  MessageCircle,
  Grid3X3,
  User  // Agregado el icono User
} from 'lucide-react';

const HomePage: React.FC = () => {
  const { 
    featuredProducts, 
    discountedProducts, 
    categories,
    fetchFeaturedProducts, 
    fetchDiscountedProducts,
    fetchCategories 
  } = useProductsStore();
  
  const { isAuthenticated, user, initializeAuth, isInitialized } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (isInitialized) {
      fetchFeaturedProducts();
      fetchDiscountedProducts();
      fetchCategories();
    }
  }, [isInitialized, fetchFeaturedProducts, fetchDiscountedProducts, fetchCategories]);

  const stats = [
    { icon: Users, label: 'Clientes Satisfechos', value: '1,000+', color: 'green' },
    { icon: ShoppingBag, label: 'Productos Naturales', value: '500+', color: 'blue' },
    { icon: Star, label: 'Calificación Promedio', value: '4.8/5', color: 'yellow' },
    { icon: TrendingUp, label: 'Años de Experiencia', value: '5+', color: 'purple' },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Productos Certificados',
      description: 'Todos nuestros productos son 100% naturales con certificación de calidad internacional.',
      color: 'green'
    },
    {
      icon: Truck,
      title: 'Envío Seguro y Rápido',
      description: 'Entrega garantizada en 24-48 horas en Lima y 3-5 días a nivel nacional.',
      color: 'blue'
    },
    {
      icon: Percent,
      title: 'Precios Especiales Afiliados',
      description: 'Como afiliado obtienes descuentos exclusivos y comisiones por ventas.',
      color: 'purple'
    },
    {
      icon: Heart,
      title: 'Bienestar Integral',
      description: 'Productos diseñados para mejorar tu salud física, mental y emocional.',
      color: 'red'
    },
  ];

  const benefits = [
    { icon: Leaf, text: '100% Ingredientes Naturales' },
    { icon: Award, text: 'Certificaciones Internacionales' },
    { icon: Zap, text: 'Resultados Comprobados' },
    { icon: Globe, text: 'Envíos a Todo el Perú' },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(price);
  };

  const getRoleBasedPrice = (product: any) => {
    if (user?.role === 'afiliado') {
      return product.affiliatePrice || product.price;
    }
    return product.publicPrice || product.price;
  };

  // Show loading while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        {/* Enhanced Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600"></div>
          <div className="absolute inset-0 bg-black/10"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="text-center text-white">
              <div className="flex justify-center mb-8">
                <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                  <Leaf className="w-16 h-16" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
                Tu Bienestar es Nuestra{' '}
                <span className="text-green-200 block lg:inline">Pasión</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-4xl mx-auto leading-relaxed">
                Descubre nuestra amplia gama de suplementos naturales, vitaminas y productos 
                de bienestar. Únete a nuestra comunidad de distribuidores y obtén beneficios exclusivos.
              </p>
              
              {/* Trust Indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center justify-center space-x-2 bg-white/10 rounded-lg p-3">
                    <benefit.icon className="w-5 h-5 text-green-200" />
                    <span className="text-sm font-medium">{benefit.text}</span>
                  </div>
                ))}
              </div>
              
              {isAuthenticated ? (
                <div className="space-y-6">
                  <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm max-w-2xl mx-auto">
                    <p className="text-green-100 mb-2">
                      ¡Bienvenido de vuelta, <span className="font-bold">{user?.fullName}</span>!
                    </p>
                    <p className="text-green-200">
                      {user?.role === 'afiliado' 
                        ? '🌟 Panel de afiliado disponible con precios especiales' 
                        : user?.role === 'visitante'
                        ? 'Explora nuestros productos naturales premium'
                        : 'Panel de administración disponible'}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/products">
                      <Button size="lg" className="bg-white text-green-600 hover:bg-green-50">
                        <ShoppingBag className="mr-2 w-5 h-5" />
                        Ver Productos
                      </Button>
                    </Link>
                    {user?.role === 'afiliado' && (
                      <Link href="/affiliate/dashboard">
                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                          <TrendingUp className="mr-2 w-5 h-5" />
                          Panel Afiliado
                        </Button>
                      </Link>
                    )}
                    {(user?.role === 'admin' || user?.role === 'admin_general') && (
                      <Link href="/admin/dashboard">
                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                          <Users className="mr-2 w-5 h-5" />
                          Panel Admin
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/register">
                      <Button size="lg" className="bg-white text-green-600 hover:bg-green-50">
                        <User className="mr-2 w-5 h-5" />
                        Crear Cuenta
                      </Button>
                    </Link>
                    <Link href="/products">
                      <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                        <ShoppingBag className="mr-2 w-5 h-5" />
                        Ver Catálogo
                      </Button>
                    </Link>
                  </div>
                  <p className="text-green-100 text-lg">
                    Regístrate gratis y comienza a cuidar tu bienestar con productos naturales
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Wave separator */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1200 120" fill="none" className="w-full h-12 text-green-50">
              <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,149.3L1200,139L1200,200L0,200Z" fill="currentColor"/>
            </svg>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Confían en Nosotros
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Miles de personas han transformado su bienestar con nuestros productos naturales
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 transition-transform group-hover:scale-110 ${
                    stat.color === 'green' ? 'bg-green-100' :
                    stat.color === 'blue' ? 'bg-blue-100' :
                    stat.color === 'yellow' ? 'bg-yellow-100' :
                    'bg-purple-100'
                  }`}>
                    <stat.icon className={`w-10 h-10 ${
                      stat.color === 'green' ? 'text-green-600' :
                      stat.color === 'blue' ? 'text-blue-600' :
                      stat.color === 'yellow' ? 'text-yellow-600' :
                      'text-purple-600'
                    }`} />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                ¿Por qué elegirnos?
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Nos comprometemos con tu bienestar ofreciendo productos de la más alta calidad
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center group">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 transition-transform group-hover:scale-110 ${
                    feature.color === 'green' ? 'bg-green-100' :
                    feature.color === 'blue' ? 'bg-blue-100' :
                    feature.color === 'purple' ? 'bg-purple-100' :
                    'bg-red-100'
                  }`}>
                    <feature.icon className={`w-10 h-10 ${
                      feature.color === 'green' ? 'text-green-600' :
                      feature.color === 'blue' ? 'text-blue-600' :
                      feature.color === 'purple' ? 'text-purple-600' :
                      'text-red-600'
                    }`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                ¿Necesitas ayuda?
              </h2>
              <p className="text-gray-600 text-lg">
                Nuestro equipo está aquí para apoyarte en tu journey hacia el bienestar
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <Phone className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Teléfono</h3>
                <p className="text-gray-600">+51 999 888 777</p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">soporte@naturalsalud.pe</p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <MessageCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">WhatsApp</h3>
                <p className="text-gray-600">+51 999 888 777</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;