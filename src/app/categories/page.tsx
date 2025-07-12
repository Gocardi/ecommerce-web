'use client';

import React, { useEffect } from 'react';
import { useProductsStore } from '@/store/productsStore';
import { useAuthStore } from '@/store/authStore';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import { 
  Grid3X3, 
  Package, 
  ArrowRight,
  TrendingUp,
  Star
} from 'lucide-react';
import Link from 'next/link';

const CategoriesPage: React.FC = () => {
  const { categories, isLoading, fetchCategories } = useProductsStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(price);
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <Grid3X3 className="mx-auto h-12 w-12 text-blue-600 mb-4" />
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Nuestras Categorías
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Explora nuestra amplia gama de productos organizados por categorías. 
                {user?.role === 'afiliado' && ' Como afiliado, obtén precios especiales en todas las categorías.'}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Categories Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {categories.length}
              </div>
              <div className="text-gray-600">Categorías Disponibles</div>
            </Card>

            <Card className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {categories.reduce((total, cat) => total + (cat.productsCount || 0), 0)}
              </div>
              <div className="text-gray-600">Productos Totales</div>
            </Card>

            <Card className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                4.8
              </div>
              <div className="text-gray-600">Calificación Promedio</div>
            </Card>
          </div>

          {/* Categories Grid */}
          {categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <Link key={category.id} href={`/categories/${category.slug}`}>
                  <Card hover className="h-full group cursor-pointer">
                    <div className="aspect-w-16 aspect-h-9 mb-6">
                      <img
                        src={category.imageUrl || '/placeholder-category.jpg'}
                        alt={category.name}
                        className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    
                    <div className="flex flex-col flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 flex-1 line-clamp-3">
                        {category.description || `Descubre nuestra selección de productos en ${category.name.toLowerCase()}.`}
                      </p>
                      
                      <div className="space-y-3">
                        {/* Product Count */}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Productos disponibles</span>
                          <span className="font-medium text-gray-900">
                            {category.productsCount || 0}
                          </span>
                        </div>
                        
                        {/* Price Range */}
                        {category.avgPublicPrice && category.avgAffiliatePrice && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Precio promedio</span>
                              <span className="font-medium text-gray-900">
                                {formatPrice(category.avgPublicPrice)}
                              </span>
                            </div>
                            
                            {user?.role === 'afiliado' && (
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-green-600">Precio afiliado</span>
                                <span className="font-medium text-green-600">
                                  {formatPrice(category.avgAffiliatePrice)}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Action */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <span className="text-sm text-blue-600 font-medium group-hover:text-blue-700">
                            Ver productos
                          </span>
                          <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay categorías</h3>
              <p className="mt-1 text-sm text-gray-500">
                Aún no hay categorías disponibles.
              </p>
            </div>
          )}

          {/* Call to Action */}
          {!user && (
            <div className="mt-16">
              <Card className="text-center bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <h2 className="text-2xl font-bold mb-4">
                  ¿Quieres precios especiales?
                </h2>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                  Regístrate como afiliado y obtén descuentos exclusivos en todas nuestras categorías de productos.
                </p>
                <div className="space-x-4">
                  <Link href="/register">
                    <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                      Registrarse Gratis
                    </button>
                  </Link>
                  <Link href="/login">
                    <button className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors">
                      Iniciar Sesión
                    </button>
                  </Link>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CategoriesPage;