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
  ArrowRight
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
  
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    fetchFeaturedProducts();
    fetchDiscountedProducts();
    fetchCategories();
  }, [fetchFeaturedProducts, fetchDiscountedProducts, fetchCategories]);

  const stats = [
    { icon: Users, label: 'Clientes Satisfechos', value: '1,000+' },
    { icon: ShoppingBag, label: 'Productos', value: '500+' },
    { icon: Star, label: 'Calificación', value: '4.8/5' },
    { icon: TrendingUp, label: 'Años de Experiencia', value: '5+' },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Productos Garantizados',
      description: 'Todos nuestros productos son originales y cuentan con garantía de calidad.'
    },
    {
      icon: Truck,
      title: 'Envío Rápido',
      description: 'Entrega en 24-48 horas en Lima y 3-5 días a provincias.'
    },
    {
      icon: Percent,
      title: 'Precios Especiales',
      description: 'Como afiliado obtienes descuentos exclusivos en todos los productos.'
    },
  ];

  return (
    <div>
      <Header />
      
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Tu Bienestar es Nuestra{' '}
                <span className="text-blue-200">Prioridad</span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Descubre nuestra amplia gama de suplementos, vitaminas y productos 
                de bienestar con precios especiales para afiliados.
              </p>
              
              {isAuthenticated ? (
                <div className="space-y-4">
                  <p className="text-blue-200">
                    ¡Bienvenido {user?.fullName}! Como {user?.role === 'afiliado' ? 'afiliado' : 'usuario'} 
                    tienes acceso a precios especiales.
                  </p>
                  <Link href="/products">
                    <Button size="lg" variant="secondary">
                      Ver Productos
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-x-4">
                  <Link href="/register">
                    <Button size="lg" variant="secondary">
                      Únete Ahora
                    </Button>
                  </Link>
                  <Link href="/products">
                    <Button size="lg" variant="outline">
                      Ver Catálogo
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <stat.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        {categories.length > 0 && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Nuestras Categorías
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Explora nuestra amplia variedad de productos organizados por categorías
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {categories.slice(0, 3).map((category) => (
                  <Link key={category.id} href={`/categories/${category.slug}`}>
                    <Card hover className="h-full group cursor-pointer">
                      <div className="aspect-w-16 aspect-h-9 mb-4">
                        <img
                          src={category.imageUrl || '/placeholder-category.jpg'}
                          alt={category.name}
                          className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {category.productsCount} productos
                        </span>
                        <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-8">
                <Link href="/categories">
                  <Button variant="outline">
                    Ver Todas las Categorías
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Productos Destacados
                </h2>
                <p className="text-gray-600">
                  Los productos más populares y mejor valorados
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.slice(0, 4).map((product) => (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <Card hover className="group cursor-pointer">
                      <div className="aspect-w-1 aspect-h-1 mb-4">
                        <img
                          src={product.imageUrl || '/placeholder-product.jpg'}
                          alt={product.name}
                          className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-blue-600">
                            S/ {product.price.toFixed(2)}
                          </span>
                          {product.originalPrice !== product.price && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              S/ {product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          product.isAvailable 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.isAvailable ? 'Disponible' : 'Agotado'}
                        </span>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-8">
                <Link href="/products">
                  <Button>
                    Ver Todos los Productos
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Discounted Products */}
        {discountedProducts.length > 0 && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Ofertas Especiales
                </h2>
                <p className="text-gray-600">
                  Productos con descuentos por tiempo limitado
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {discountedProducts.slice(0, 3).map((product) => (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <Card hover className="group cursor-pointer relative">
                      {product.discountPercentage && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold z-10">
                          -{product.discountPercentage}%
                        </div>
                      )}
                      <div className="aspect-w-16 aspect-h-9 mb-4">
                        <img
                          src={product.imageUrl || '/placeholder-product.jpg'}
                          alt={product.name}
                          className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-red-600">
                            S/ {product.finalPrice?.toFixed(2) || product.price.toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500 line-through ml-2">
                            S/ {product.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                ¿Por qué elegirnos?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                    <feature.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {!isAuthenticated && (
          <section className="py-16 bg-blue-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                ¿Listo para comenzar?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Únete a nuestra comunidad y obtén acceso a precios especiales 
                en todos nuestros productos.
              </p>
              <div className="space-x-4">
                <Link href="/register">
                  <Button size="lg" variant="secondary">
                    Registrarse Gratis
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline">
                    Iniciar Sesión
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default HomePage;