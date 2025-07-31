'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProductsStore } from '@/store/productsStore';
import { useAuthStore } from '@/store/authStore';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { 
  Grid3X3, 
  List, 
  Filter, 
  ArrowLeft,
  Package,
  X,
  Tag,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

const CategoryProductsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const categorySlug = params.slug as string;
  
  const { 
    products, 
    pagination, 
    filters, 
    isLoading, 
    fetchCategoryBySlug, 
    fetchProductsByCategory,
    updateFilter 
  } = useProductsStore();
  
  const { user } = useAuthStore();
  
  const [category, setCategory] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  useEffect(() => {
    const loadCategoryData = async () => {
      const categoryData = await fetchCategoryBySlug(categorySlug);
      if (categoryData) {
        setCategory(categoryData);
        fetchProductsByCategory(categoryData.id);
      } else {
        router.push('/categories');
      }
    };

    loadCategoryData();
  }, [categorySlug, fetchCategoryBySlug, fetchProductsByCategory, router]);

  const handleFilterChange = (key: string, value: string) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    // Apply filters logic here
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setLocalFilters({
      search: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  const handlePageChange = (page: number) => {
    updateFilter('page', page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(price);
  };

  const getSavingsPercentage = (originalPrice: number, currentPrice: number) => {
    if (originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  if (isLoading && !category) {
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
        {/* Category Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-blue-600">Inicio</Link>
              <span>/</span>
              <Link href="/categories" className="hover:text-blue-600">Categorías</Link>
              <span>/</span>
              <span className="text-gray-900">{category?.name}</span>
            </nav>

            {/* Back Button */}
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>

            {/* Category Info */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <Tag className="w-6 h-6 text-blue-600 mr-2" />
                  <h1 className="text-3xl font-bold text-gray-900">{category?.name}</h1>
                </div>
                
                <p className="text-gray-600 mb-4 max-w-3xl">
                  {category?.description || `Explora nuestra selección de productos en ${category?.name?.toLowerCase()}.`}
                </p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Package className="w-4 h-4 mr-1" />
                    <span>{category?.productsCount || 0} productos</span>
                  </div>
                  
                  {user?.role === 'afiliado' && category?.avgAffiliatePrice && (
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span>Precio promedio afiliado: {formatPrice(category.avgAffiliatePrice)}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Category Image */}
              {category?.imageUrl && (
                <div className="mt-6 md:mt-0 md:ml-8">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-32 h-32 object-cover rounded-lg shadow-md"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Filters Sidebar */}
            <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <Card className="sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Buscar en {category?.name}
                    </label>
                    <Input
                      type="text"
                      placeholder="Nombre del producto..."
                      value={localFilters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rango de Precio
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={localFilters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={localFilters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ordenar por
                    </label>
                    <select
                      value={`${localFilters.sortBy}-${localFilters.sortOrder}`}
                      onChange={(e) => {
                        const [sortBy, sortOrder] = e.target.value.split('-');
                        handleFilterChange('sortBy', sortBy);
                        handleFilterChange('sortOrder', sortOrder);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="createdAt-desc">Más recientes</option>
                      <option value="createdAt-asc">Más antiguos</option>
                      <option value="name-asc">Nombre A-Z</option>
                      <option value="name-desc">Nombre Z-A</option>
                      <option value="price-asc">Precio menor</option>
                      <option value="price-desc">Precio mayor</option>
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button onClick={applyFilters} fullWidth>
                      Aplicar Filtros
                    </Button>
                    <Button onClick={handleClearFilters} variant="outline" fullWidth>
                      Limpiar Filtros
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* Controls */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-600">
                    {pagination?.totalItems ? (
                      <>
                        Mostrando {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} - {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} de {pagination.totalItems} productos
                      </>
                    ) : (
                      'No se encontraron productos'
                    )}
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* View Toggle */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Filter Toggle - Mobile */}
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros
                  </Button>
                </div>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              )}

              {/* Products */}
              {!isLoading && products.length > 0 && (
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'space-y-4'
                }>
                  {products.map((product) => (
                    <Link key={product.id} href={`/products/${product.id}`}>
                      <Card hover className={`group cursor-pointer h-full ${viewMode === 'list' ? 'flex' : ''}`}>
                        {viewMode === 'grid' ? (
                          <>
                            <div className="aspect-w-1 aspect-h-1 mb-4 relative">
                              <img
                                src={product.imageUrl || '/placeholder-product.jpg'}
                                alt={product.name}
                                className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                              />
                              {product.discountPercentage && product.discountPercentage > 0 && (
                                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                  -{product.discountPercentage}%
                                </div>
                              )}
                              {!product.isAvailable && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                                  <span className="text-white font-medium">Agotado</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-col flex-1">
                              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                {product.name}
                              </h3>
                              
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
                                {product.description}
                              </p>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                  <span className="text-lg font-bold text-blue-600">
                                    {formatPrice(product.price)}
                                  </span>
                                  {product.originalPrice !== product.price && (
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm text-gray-500 line-through">
                                        {formatPrice(product.originalPrice)}
                                      </span>
                                      <span className="text-xs text-green-600 font-medium">
                                        {getSavingsPercentage(product.originalPrice, product.price)}% off
                                      </span>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="text-right">
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    product.isAvailable 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {product.isAvailable ? 'Disponible' : 'Agotado'}
                                  </span>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Stock: {product.stock}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          // List view
                          <div className="flex">
                            <div className="w-32 h-32 flex-shrink-0 relative">
                              <img
                                src={product.imageUrl || '/placeholder-product.jpg'}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                            <div className="ml-4 flex-1 flex flex-col justify-between">
                              <div>
                                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {product.name}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                  {product.description}
                                </p>
                              </div>
                              <div className="flex items-center justify-between mt-4">
                                <div>
                                  <span className="text-lg font-bold text-blue-600">
                                    {formatPrice(product.price)}
                                  </span>
                                  {product.originalPrice !== product.price && (
                                    <span className="text-sm text-gray-500 line-through ml-2">
                                      {formatPrice(product.originalPrice)}
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
                            </div>
                          </div>
                        )}
                      </Card>
                    </Link>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!isLoading && products.length === 0 && (
                <div className="text-center py-12">
                  <Package className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No hay productos en esta categoría
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Aún no hay productos disponibles en {category?.name}.
                  </p>
                  <div className="mt-6">
                    <Link href="/categories">
                      <Button variant="outline">
                        Ver otras categorías
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center space-x-2">
                  <Button
                    variant="outline"
                    disabled={!pagination.hasPrevPage}
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                  >
                    Anterior
                  </Button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 text-sm rounded-md ${
                            page === pagination.currentPage
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    disabled={!pagination.hasNextPage}
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                  >
                    Siguiente
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryProductsPage;