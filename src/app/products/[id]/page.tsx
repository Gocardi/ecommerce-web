'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProductsStore } from '@/store/productsStore';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
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
  Clock,
  Leaf,
  Award,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const ProductDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id as string);
  
  const { currentProduct, isLoading, fetchProductById } = useProductsStore();
  const { user, isAuthenticated } = useAuthStore();
  const { addToCart, isLoading: cartLoading } = useCartStore();
  
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

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

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para agregar productos al carrito');
      router.push('/login');
      return;
    }
    
    if (!currentProduct) return;
    
    try {
      await addToCart(currentProduct.id, quantity);
      toast.success(`${currentProduct.name} agregado al carrito`);
    } catch (error) {
      toast.error('Error al agregar al carrito');
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para comprar');
      router.push('/login');
      return;
    }
    
    await handleAddToCart();
    router.push('/cart');
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
      return currentProduct.affiliatePrice || currentProduct.price;
    }
    return currentProduct.publicPrice || currentProduct.price;
  };

  const getOriginalPrice = () => {
    if (!currentProduct) return 0;
    return currentProduct.publicPrice || currentProduct.price;
  };

  const showPriceComparison = () => {
    return user?.role === 'afiliado' && 
           currentProduct?.affiliatePrice && 
           currentProduct?.publicPrice && 
           currentProduct.affiliatePrice < currentProduct.publicPrice;
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent"></div>
            <p className="text-gray-600">Cargando producto...</p>
          </div>
        </div>
      </>
    );
  }

  if (!currentProduct) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-red-100 rounded-full">
                <Package className="h-12 w-12 text-red-600" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Producto no encontrado</h3>
            <p className="text-gray-600 mb-8">El producto que buscas no existe o ha sido removido de nuestro catálogo.</p>
            <div className="space-x-4">
              <Button onClick={() => router.back()} variant="outline">
                Volver atrás
              </Button>
              <Link href="/products">
                <Button className="bg-green-600 hover:bg-green-700">Ver todos los productos</Button>
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
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-green-600 transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-green-600 transition-colors">Productos</Link>
            <span>/</span>
            <Link 
              href={`/categories/${currentProduct.category?.slug}`} 
              className="hover:text-green-600 transition-colors"
            >
              {currentProduct.category?.name}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{currentProduct.name}</span>
          </nav>

          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-6 border-green-600 text-green-600 hover:bg-green-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          <div className="lg:grid lg:grid-cols-2 lg:gap-12">
            {/* Enhanced Product Images */}
            <div className="mb-8 lg:mb-0">
              <Card padding="none" className="overflow-hidden shadow-xl border-green-200">
                <div className="aspect-w-1 aspect-h-1 relative">
                  <img
                    src={currentProduct.imageUrl || '/placeholder-product.jpg'}
                    alt={currentProduct.name}
                    className="w-full h-96 object-cover"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 space-y-2">
                    {currentProduct.discountPercentage && currentProduct.discountPercentage > 0 && (
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        -{currentProduct.discountPercentage}% OFF
                      </div>
                    )}
                    {user?.role === 'afiliado' && (
                      <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        Precio Afiliado
                      </div>
                    )}
                    <div className="bg-white/90 backdrop-blur text-green-600 px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center">
                      <Leaf className="w-4 h-4 mr-1" />
                      100% Natural
                    </div>
                  </div>
                  
                  {/* Stock Status */}
                  {!currentProduct.isAvailable && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                      <div className="text-center text-white">
                        <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                        <span className="text-xl font-semibold">Producto Agotado</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Trust Indicators */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="flex flex-col items-center">
                      <Shield className="w-6 h-6 text-green-600 mb-1" />
                      <span className="text-xs text-green-700 font-medium">Calidad Garantizada</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Award className="w-6 h-6 text-green-600 mb-1" />
                      <span className="text-xs text-green-700 font-medium">Certificado</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Enhanced Product Info */}
            <div>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <Leaf className="w-4 h-4 mr-1" />
                    {currentProduct.category?.name}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className={`p-2 rounded-full transition-colors ${
                        isWishlisted 
                          ? 'text-red-500 bg-red-50' 
                          : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                      }`}
                    >
                      <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-2 rounded-full text-gray-400 hover:text-green-500 hover:bg-green-50 transition-colors">
                      <Share2 className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {currentProduct.name}
                </h1>
                
                {/* Rating */}
                <div className="flex items-center mb-6">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">(4.8) • 124 reseñas</span>
                </div>

                {/* Price Section */}
                <Card className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4">
                      <span className="text-4xl font-bold text-green-600">
                        {formatPrice(getRoleBasedPrice())}
                      </span>
                      
                      {user?.role === 'afiliado' && getOriginalPrice() !== getRoleBasedPrice() && (
                        <>
                          <span className="text-xl text-gray-500 line-through">
                            {formatPrice(getOriginalPrice())}
                          </span>
                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            {getSavingsPercentage(getOriginalPrice(), getRoleBasedPrice())}% AHORRO
                          </span>
                        </>
                      )}
                    </div>
                    
                    {user?.role === 'afiliado' && (
                      <div className="flex items-center text-green-700 bg-green-100 rounded-lg p-3">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span className="font-medium">Precio especial para afiliados activo</span>
                      </div>
                    )}
                    
                    {!isAuthenticated && (
                      <div className="flex items-center text-blue-700 bg-blue-100 rounded-lg p-3">
                        <Award className="w-5 h-5 mr-2" />
                        <span>
                          <Link href="/register" className="font-medium underline hover:text-blue-800">
                            Regístrate como afiliado
                          </Link> para obtener precios especiales
                        </span>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Stock & SKU */}
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-green-600" />
                    <span className="text-gray-600">Stock:</span>
                    <span className={`font-medium ${
                      currentProduct.stock > 10 ? 'text-green-600' : 
                      currentProduct.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {currentProduct.stock} unidades
                    </span>
                  </div>
                  {currentProduct.sku && (
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">SKU:</span>
                      <span className="font-mono text-gray-900">{currentProduct.sku}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tabs for Description and Details */}
              <Card className="mb-8">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    {['description', 'benefits', 'ingredients'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === tab
                            ? 'border-green-500 text-green-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {tab === 'description' && 'Descripción'}
                        {tab === 'benefits' && 'Beneficios'}
                        {tab === 'ingredients' && 'Ingredientes'}
                      </button>
                    ))}
                  </nav>
                </div>
                
                <div className="pt-4">
                  {activeTab === 'description' && (
                    <div>
                      <p className="text-gray-700 leading-relaxed">
                        {currentProduct.description || 'Descripción no disponible.'}
                      </p>
                    </div>
                  )}
                  {activeTab === 'benefits' && (
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <span className="text-gray-700">Mejora el rendimiento físico y mental</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <span className="text-gray-700">Fortalece el sistema inmunológico</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <span className="text-gray-700">Ingredientes 100% naturales y certificados</span>
                      </div>
                    </div>
                  )}
                  {activeTab === 'ingredients' && (
                    <div>
                      <p className="text-gray-700 mb-3">Ingredientes principales:</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        <li>Extracto natural concentrado</li>
                        <li>Vitaminas esenciales</li>
                        <li>Minerales biodisponibles</li>
                        <li>Sin aditivos artificiales</li>
                      </ul>
                    </div>
                  )}
                </div>
              </Card>

              {/* Quantity & Actions */}
              {currentProduct.isAvailable && (
                <Card className="mb-8">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cantidad
                        </label>
                        <div className="flex items-center border-2 border-green-200 rounded-lg">
                          <button
                            onClick={() => handleQuantityChange(quantity - 1)}
                            disabled={quantity <= 1}
                            className="px-4 py-3 text-green-600 hover:text-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-6 py-3 text-gray-900 font-semibold text-lg min-w-[4rem] text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(quantity + 1)}
                            disabled={quantity >= currentProduct.stock}
                            className="px-4 py-3 text-green-600 hover:text-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subtotal
                        </label>
                        <div className="text-3xl font-bold text-green-600">
                          {formatPrice(getRoleBasedPrice() * quantity)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button
                        onClick={handleAddToCart}
                        variant="outline"
                        disabled={cartLoading}
                        className="border-green-600 text-green-600 hover:bg-green-50 py-4 text-lg font-medium"
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        {cartLoading ? 'Agregando...' : 'Agregar al Carrito'}
                      </Button>
                      <Button
                        onClick={handleBuyNow}
                        disabled={cartLoading}
                        className="bg-green-600 hover:bg-green-700 py-4 text-lg font-medium"
                      >
                        Comprar Ahora
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <Truck className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-green-900">Envío Gratis</div>
                    <div className="text-sm text-green-700">En pedidos +S/100</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Shield className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-blue-900">Garantía</div>
                    <div className="text-sm text-blue-700">Producto original</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <Clock className="w-6 h-6 text-orange-600 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-orange-900">Entrega</div>
                    <div className="text-sm text-orange-700">24-48 horas</div>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-green-600" />
                  Información del Producto
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Categoría:</span>
                    <span className="text-gray-900 font-medium">{currentProduct.category?.name}</span>
                  </div>
                  {currentProduct.weight && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Peso:</span>
                      <span className="text-gray-900 font-medium">{currentProduct.weight}g</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Disponibilidad:</span>
                    <span className={`font-medium ${
                      currentProduct.isAvailable ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {currentProduct.isAvailable ? '✓ En stock' : '✗ Agotado'}
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