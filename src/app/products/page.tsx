'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
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
  Search,
  ChevronDown,
  X,
  Package,
  Star,
  ShoppingCart
} from 'lucide-react';
import Link from 'next/link';

const ProductsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuthStore();
  
  const {
    products,
    categories,
    pagination,
    filters,
    isLoading,
    fetchProducts,
    fetchCategories,
    setFilters,
    updateFilter,
    clearFilters,
  } = useProductsStore();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    search: '',
    categoryId: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Initialize from URL params
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId') || '';
    
    if (search || categoryId) {
      setLocalFilters(prev => ({
        ...prev,
        search,
        categoryId,
      }));
      
      setFilters({
        ...filters,
        search: search || undefined,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
      });
    } else {
      fetchProducts();
    }
    
    fetchCategories();
  }, [searchParams]);

  const handleFilterChange = (key: string, value: string) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const newFilters = {
      ...filters,
      search: localFilters.search || undefined,
      categoryId: localFilters.categoryId ? parseInt(localFilters.categoryId) : undefined,
      minPrice: localFilters.minPrice ? parseFloat(localFilters.minPrice) : undefined,
      maxPrice: localFilters.maxPrice ? parseFloat(localFilters.maxPrice) : undefined,
      sortBy: localFilters.sortBy as any,
      sortOrder: localFilters.sortOrder as any,
      page: 1,
    };
    
    setFilters(newFilters);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setLocalFilters({
      search: '',
      categoryId: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    clearFilters();
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

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
                <p className="mt-2 text-gray-600">
                  {isAuthenticated && user?.role === 'afiliado' 
                    ? 'Precios especiales para afiliados' 
                    : 'Descubre nuestra amplia gama de productos'}
                </p>
              </div>
              
              <div className="mt-4 md:mt-0 flex items-center space-x-4">
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
                
                {/* Filter Toggle */}
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </div>
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
                      Buscar
                    </label>
                    <Input
                      type="text"
                      placeholder="Nombre del producto..."
                      value={localFilters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría
                    </label>
                    <select
                      value={localFilters.categoryId}
                      onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Todas las categorías</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name} ({category.productsCount})
                        </option>
                      ))}
                    </select>
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
              {/* Results Header */}
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
                                <p className="text-sm text-gray-500 mt-1">
                                  {product.category.name}
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
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No hay productos</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No se encontraron productos con los filtros seleccionados.
                  </p>
                  <div className="mt-6">
                    <Button onClick={handleClearFilters} variant="outline">
                      Limpiar filtros
                    </Button>
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

export default ProductsPage;