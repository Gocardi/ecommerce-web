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
  ShoppingCart,
  Leaf,
  Heart,
  Shield
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

  const getRoleBasedPrice = (product: any) => {
    if (user?.role === 'afiliado') {
      return product.affiliatePrice || product.price;
    }
    return product.publicPrice || product.price;
  };

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        {/* Page Header with Natural Health Theme */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-full">
                  <Leaf className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">Productos Naturales</h1>
                  <p className="mt-2 text-green-100 text-lg">
                    {isAuthenticated && user?.role === 'afiliado' 
                      ? '🌟 Precios especiales para afiliados' 
                      : 'Tu bienestar, nuestra pasión'}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 md:mt-0 flex items-center space-x-4">
                {/* View Toggle */}
                <div className="flex items-center bg-white/20 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 rounded-lg transition-all ${
                      viewMode === 'grid' ? 'bg-white text-green-600 shadow-sm' : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 rounded-lg transition-all ${
                      viewMode === 'list' ? 'bg-white text-green-600 shadow-sm' : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Filter Toggle for Mobile */}
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-4">
                <Shield className="w-6 h-6 text-green-200" />
                <div>
                  <div className="font-semibold">100% Natural</div>
                  <div className="text-sm text-green-100">Productos certificados</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-4">
                <Heart className="w-6 h-6 text-green-200" />
                <div>
                  <div className="font-semibold">Calidad Premium</div>
                  <div className="text-sm text-green-100">Ingredientes seleccionados</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-4">
                <Star className="w-6 h-6 text-green-200" />
                <div>
                  <div className="font-semibold">+1000 Clientes</div>
                  <div className="text-sm text-green-100">Satisfechos y saludables</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Enhanced Filters Sidebar */}
            <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <Card className="sticky top-24 bg-white/80 backdrop-blur-sm border-green-200 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Filter className="w-5 h-5 mr-2 text-green-600" />
                    Filtros
                  </h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Buscar productos
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="text"
                        placeholder="Proteína, vitaminas..."
                        value={localFilters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría
                    </label>
                    <select
                      value={localFilters.categoryId}
                      onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                      className="w-full px-3 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                    >
                      <option value="">Todas las categorías</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name} ({category.productsCount || 0})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rango de Precio (PEN)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Input
                          type="number"
                          placeholder="Mínimo"
                          value={localFilters.minPrice}
                          onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                          className="border-green-200 focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          placeholder="Máximo"
                          value={localFilters.maxPrice}
                          onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                          className="border-green-200 focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
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
                      className="w-full px-3 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
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
                  <div className="space-y-3">
                    <Button 
                      onClick={applyFilters} 
                      fullWidth 
                      className="bg-green-600 hover:bg-green-700 text-white font-medium py-3"
                    >
                      Aplicar Filtros
                    </Button>
                    <Button 
                      onClick={handleClearFilters} 
                      variant="outline" 
                      fullWidth
                      className="border-green-600 text-green-600 hover:bg-green-50 py-3"
                    >
                      Limpiar Filtros
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6 bg-white rounded-lg p-4 shadow-sm border border-green-100">
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
                  {isAuthenticated && user?.role === 'afiliado' && (
                    <p className="text-xs text-green-600 font-medium mt-1">
                      ✨ Viendo precios de afiliado
                    </p>
                  )}
                </div>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-20">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent"></div>
                    <p className="text-gray-600">Cargando productos naturales...</p>
                  </div>
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
                      <Card hover className={`group cursor-pointer h-full transition-all duration-300 hover:shadow-xl border-green-100 hover:border-green-300 ${viewMode === 'list' ? 'flex' : ''}`}>
                        {viewMode === 'grid' ? (
                          <>
                            <div className="aspect-w-1 aspect-h-1 mb-4 relative overflow-hidden rounded-lg">
                              <img
                                src={product.imageUrl || '/placeholder-product.jpg'}
                                alt={product.name}
                                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                              {product.discountPercentage && product.discountPercentage > 0 && (
                                <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                  -{product.discountPercentage}%
                                </div>
                              )}
                              {user?.role === 'afiliado' && (
                                <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                  Precio Especial
                                </div>
                              )}
                              {!product.isAvailable && (
                                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg">
                                  <span className="text-white font-medium bg-red-600 px-4 py-2 rounded-lg">Agotado</span>
                                </div>
                              )}
                              <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ShoppingCart className="w-4 h-4 text-green-600" />
                              </div>
                            </div>
                            
                            <div className="flex flex-col flex-1 p-2">
                              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                                {product.name}
                              </h3>
                              
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
                                {product.description}
                              </p>
                              
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex flex-col">
                                    <span className="text-xl font-bold text-green-600">
                                      {formatPrice(getRoleBasedPrice(product))}
                                    </span>
                                    {user?.role === 'afiliado' && product.publicPrice !== product.affiliatePrice && (
                                      <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-500 line-through">
                                          {formatPrice(product.publicPrice)}
                                        </span>
                                        <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">
                                          {getSavingsPercentage(product.publicPrice, product.affiliatePrice)}% off
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                                    product.isAvailable 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {product.isAvailable ? '✓ Disponible' : '✗ Agotado'}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    Stock: {product.stock}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          // List view with enhanced layout
                          <div className="flex p-4">
                            <div className="w-24 h-24 flex-shrink-0 relative rounded-lg overflow-hidden">
                              <img
                                src={product.imageUrl || '/placeholder-product.jpg'}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                              {user?.role === 'afiliado' && (
                                <div className="absolute top-1 right-1 bg-green-500 text-white px-1 py-0.5 rounded text-xs font-bold">
                                  AF
                                </div>
                              )}
                            </div>
                            <div className="ml-4 flex-1 flex flex-col justify-between">
                              <div>
                                <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                                  {product.name}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                  {product.description}
                                </p>
                                <p className="text-xs text-green-600 mt-1 font-medium">
                                  {product.category?.name}
                                </p>
                              </div>
                              <div className="flex items-center justify-between mt-3">
                                <div>
                                  <span className="text-lg font-bold text-green-600">
                                    {formatPrice(getRoleBasedPrice(product))}
                                  </span>
                                  {user?.role === 'afiliado' && product.publicPrice !== product.affiliatePrice && (
                                    <span className="text-sm text-gray-500 line-through ml-2">
                                      {formatPrice(product.publicPrice)}
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

              {/* Enhanced Empty State */}
              {!isLoading && products.length === 0 && (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-green-100">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-green-100 rounded-full">
                      <Package className="h-12 w-12 text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay productos disponibles</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    No se encontraron productos que coincidan con tus filtros. 
                    Intenta ajustar los criterios de búsqueda.
                  </p>
                  <div className="space-x-4">
                    <Button onClick={handleClearFilters} variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                      Limpiar filtros
                    </Button>
                    <Link href="/categories">
                      <Button className="bg-green-600 hover:bg-green-700">
                        Ver categorías
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Enhanced Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-12 bg-white rounded-lg p-6 shadow-sm border border-green-100">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      disabled={!pagination.hasPrevPage}
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      className="border-green-600 text-green-600 hover:bg-green-50 disabled:opacity-50"
                    >
                      ← Anterior
                    </Button>
                    
                    <div className="flex space-x-2">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        let page;
                        if (pagination.totalPages <= 5) {
                          page = i + 1;
                        } else {
                          const current = pagination.currentPage;
                          if (current <= 3) {
                            page = i + 1;
                          } else if (current >= pagination.totalPages - 2) {
                            page = pagination.totalPages - 4 + i;
                          } else {
                            page = current - 2 + i;
                          }
                        }
                        
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${
                              page === pagination.currentPage
                                ? 'bg-green-600 text-white shadow-md'
                                : 'bg-white text-gray-700 hover:bg-green-50 border border-gray-300 hover:border-green-300'
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
                      className="border-green-600 text-green-600 hover:bg-green-50 disabled:opacity-50"
                    >
                      Siguiente →
                    </Button>
                  </div>
                  
                  <div className="mt-4 text-center text-sm text-gray-600">
                    Página {pagination.currentPage} de {pagination.totalPages}
                  </div>
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