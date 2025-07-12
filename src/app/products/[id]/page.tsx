'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProductsStore } from '@/store/productsStore';
import { useAuthStore } from '@/store/authStore';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Star, 
  Truck, 
  Shield, 
  ArrowLeft,
  Plus,
  Minus,
  Package,
  Clock
} from 'lucide-react';
import Link from 'next/link';

const ProductDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id as string);
  
  const { currentProduct, isLoading, fetchProductById } = useProductsStore();
  const { user, isAuthenticated } = useAuthStore();
  
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (productId) {
      fetchProductById(productId);
    }
  }, [productId, fetchProductById]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (currentProduct?.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // TODO: Implement add to cart functionality
    console.log('Adding to cart:', { productId, quantity });
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // TODO: Implement buy now functionality
    console.log('Buy now:', { productId, quantity });
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

  const getRoleBasedPrice = () => {
    if (!currentProduct) return 0;
    
    if (user?.role === 'afiliado') {
      return currentProduct.affiliatePrice;
    }
    return currentProduct.originalPrice;
  };

  const getCurrentPrice = () => {
    if (!currentProduct) return 0;
    return currentProduct.price;
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

  if (!currentProduct) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Producto no encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">El producto que buscas no existe.</p>
            <div className="mt-6">
              <Link href="/products">
                <Button>Ver todos los productos</Button>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-blue-600">Inicio</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-blue-600">Productos</Link>
            <span>/</span>
            <Link 
              href={`/categories/${currentProduct.category.slug}`} 
              className="hover:text-blue-600"
            >
              {currentProduct.category.name}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{currentProduct.name}</span>
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

          <div className="lg:grid lg:grid-cols-2 lg:gap-12">
            {/* Product Images */}
            <div className="mb-8 lg:mb-0">
              <Card padding="none" className="overflow-hidden">
                <div className="aspect-w-1 aspect-h-1">
                  <img
                    src={currentProduct.imageUrl || '/placeholder-product.jpg'}
                    alt={currentProduct.name}
                    className="w-full h-96 object-cover"
                  />
                </div>
                
                {/* Discount Badge */}
                {currentProduct.discountPercentage && currentProduct.discountPercentage > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{currentProduct.discountPercentage}%
                  </div>
                )}
                
                {/* Stock Status */}
                {!currentProduct.isAvailable && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white text-xl font-medium">Producto Agotado</span>
                  </div>
                )}
              </Card>
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-600 font-medium">
                    {currentProduct.category.name}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className={`p-2 rounded-full ${isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                    >
                      <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-2 rounded-full text-gray-400 hover:text-blue-500">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {currentProduct.name}
                </h1>
                
                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">(4.8) • 124 reseñas</span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl font-bold text-blue-600">
                      {formatPrice(getCurrentPrice())}
                    </span>
                    
                    {currentProduct.originalPrice !== getCurrentPrice() && (
                      <>
                        <span className="text-xl text-gray-500 line-through">
                          {formatPrice(currentProduct.originalPrice)}
                        </span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                          {getSavingsPercentage(currentProduct.originalPrice, getCurrentPrice())}% OFF
                        </span>
                      </>
                    )}
                  </div>
                  
                  {user?.role === 'afiliado' && (
                    <p className="text-sm text-green-600 mt-2">
                      ✨ Precio especial para afiliados
                    </p>
                  )}
                  
                  {!isAuthenticated && (
                    <p className="text-sm text-blue-600 mt-2">
                      <Link href="/register" className="underline">
                        Regístrate como afiliado
                      </Link> para obtener precios especiales
                    </p>
                  )}
                </div>

                {/* Stock & SKU */}
                <div className="flex items-center space-x-6 mb-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Package className="w-4 h-4 mr-1" />
                    <span>Stock: {currentProduct.stock} unidades</span>
                  </div>
                  {currentProduct.sku && (
                    <div>
                      <span>SKU: {currentProduct.sku}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {currentProduct.description && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Descripción</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {currentProduct.description}
                  </p>
                </div>
              )}

              {/* Quantity & Actions */}
              {currentProduct.isAvailable && (
                <div className="mb-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cantidad
                      </label>
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          onClick={() => handleQuantityChange(quantity - 1)}
                          disabled={quantity <= 1}
                          className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 text-gray-900 min-w-[3rem] text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(quantity + 1)}
                          disabled={quantity >= currentProduct.stock}
                          className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subtotal
                      </label>
                      <div className="text-2xl font-bold text-blue-600">
                        {formatPrice(getCurrentPrice() * quantity)}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      onClick={handleAddToCart}
                      variant="outline"
                      className="flex-1"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Agregar al Carrito
                    </Button>
                    <Button
                      onClick={handleBuyNow}
                      className="flex-1"
                    >
                      Comprar Ahora
                    </Button>
                  </div>
                </div>
              )}

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                  <Truck className="w-6 h-6 text-green-600" />
                  <div>
                    <div className="font-medium text-green-900">Envío Gratis</div>
                    <div className="text-sm text-green-700">En pedidos +S/100</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-900">Garantía</div>
                    <div className="text-sm text-blue-700">Producto original</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                  <div>
                    <div className="font-medium text-orange-900">Entrega</div>
                    <div className="text-sm text-orange-700">24-48 horas</div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <Card>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Producto</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Categoría:</span>
                    <span className="text-gray-900">{currentProduct.category.name}</span>
                  </div>
                  {currentProduct.weight && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Peso:</span>
                      <span className="text-gray-900">{currentProduct.weight}g</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Disponibilidad:</span>
                    <span className={currentProduct.isAvailable ? 'text-green-600' : 'text-red-600'}>
                      {currentProduct.isAvailable ? 'En stock' : 'Agotado'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha de registro:</span>
                    <span className="text-gray-900">
                      {new Date(currentProduct.createdAt).toLocaleDateString('es-PE')}
                    </span>
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

export default ProductDetailPage;