'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  X, 
  Leaf,
  ArrowLeft,
  Trash2,
  Heart,
  Package,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const CartPage: React.FC = () => {
  const router = useRouter();
  const { 
    cart, 
    isLoading, 
    fetchCart, 
    updateCartItem, 
    removeCartItem, 
    clearCart,
    checkCartAvailability 
  } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  
  const [isUpdating, setIsUpdating] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?returnUrl=/cart');
      return;
    }
    fetchCart();
    checkCartAvailability();
  }, [isAuthenticated, fetchCart, checkCartAvailability, router]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(price);
  };

  const handleQuantityChange = async (itemId: number, newQuantity: number, maxStock: number) => {
    if (newQuantity <= 0) return;
    if (newQuantity > maxStock) {
      toast.error(`Solo hay ${maxStock} unidades disponibles`);
      return;
    }

    setIsUpdating(itemId);
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error) {
      toast.error('Error al actualizar cantidad');
    } finally {
      setIsUpdating(null);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeCartItem(itemId);
    } catch (error) {
      toast.error('Error al eliminar producto');
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      try {
        await clearCart();
      } catch (error) {
        toast.error('Error al vaciar carrito');
      }
    }
  };

  const getRoleBasedPrice = (item: any) => {
    if (user?.role === 'afiliado') {
      return item.product.affiliatePrice || item.product.price;
    }
    return item.product.publicPrice || item.product.price;
  };

  const calculateItemTotal = (item: any) => {
    return getRoleBasedPrice(item) * item.quantity;
  };

  const calculateCartTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  const shippingCost = 15.00; // TODO: Make this configurable
  const finalTotal = calculateCartTotal() + shippingCost;

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent"></div>
            <p className="text-gray-600">Cargando carrito...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-full">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Mi Carrito</h1>
                <p className="mt-2 text-green-100 text-lg">
                  {user?.role === 'afiliado' 
                    ? '🌟 Viendo precios especiales de afiliado' 
                    : 'Revisa tus productos seleccionados'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link href="/products" className="inline-flex items-center text-green-600 hover:text-green-700 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continuar comprando
          </Link>

          {cart?.isEmpty || !cart?.items?.length ? (
            // Empty Cart State
            <div className="text-center py-16">
              <Card className="max-w-md mx-auto">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-green-100 rounded-full">
                    <ShoppingCart className="h-12 w-12 text-green-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Tu carrito está vacío</h3>
                <p className="text-gray-600 mb-8">
                  Descubre nuestros productos naturales y comienza a llenar tu carrito
                </p>
                <div className="space-y-4">
                  <Link href="/products">
                    <Button className="bg-green-600 hover:bg-green-700" fullWidth>
                      Explorar Productos
                    </Button>
                  </Link>
                  <Link href="/categories">
                    <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50" fullWidth>
                      Ver Categorías
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          ) : (
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {/* Cart Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {cart.totalItems} {cart.totalItems === 1 ? 'producto' : 'productos'}
                  </h2>
                  {cart.items.length > 0 && (
                    <button
                      onClick={handleClearCart}
                      className="text-red-600 hover:text-red-700 transition-colors flex items-center space-x-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Vaciar carrito</span>
                    </button>
                  )}
                </div>

                {/* Cart Items List */}
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <Card key={item.id} className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={item.product.imageUrl || '/placeholder-product.jpg'}
                            alt={item.product.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                <Link href={`/products/${item.product.id}`} className="hover:text-green-600">
                                  {item.product.name}
                                </Link>
                              </h3>
                              <p className="text-sm text-green-600 font-medium">
                                {item.product.category?.name}
                              </p>
                              {user?.role === 'afiliado' && (
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                    Precio Afiliado
                                  </span>
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded-full transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>

                          {/* Stock Status */}
                          <div className="flex items-center space-x-4">
                            {item.product.isAvailable ? (
                              <div className="flex items-center space-x-1 text-green-600">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-sm">En stock ({item.product.stock} disponibles)</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-1 text-red-600">
                                <AlertCircle className="w-4 h-4" />
                                <span className="text-sm">Producto agotado</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Quantity and Price */}
                        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
                          {/* Quantity Controls */}
                          <div className="flex items-center">
                            <label className="text-sm text-gray-600 mr-3">Cantidad:</label>
                            <div className="flex items-center border border-green-200 rounded-lg">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.product.stock)}
                                disabled={item.quantity <= 1 || isUpdating === item.id}
                                className="px-3 py-2 text-green-600 hover:text-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-4 py-2 text-gray-900 font-semibold min-w-[3rem] text-center">
                                {isUpdating === item.id ? '...' : item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.product.stock)}
                                disabled={item.quantity >= item.product.stock || isUpdating === item.id}
                                className="px-3 py-2 text-green-600 hover:text-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                              {formatPrice(calculateItemTotal(item))}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatPrice(getRoleBasedPrice(item))} c/u
                            </div>
                            {user?.role === 'afiliado' && item.product.publicPrice !== item.product.affiliatePrice && (
                              <div className="text-xs text-gray-400 line-through">
                                {formatPrice(item.product.publicPrice)} público
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Resumen del Pedido</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">{formatPrice(calculateCartTotal())}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Envío</span>
                      <span className="font-medium">{formatPrice(shippingCost)}</span>
                    </div>
                    
                    {user?.role === 'afiliado' && (
                      <div className="flex justify-between text-green-600">
                        <span>Descuento Afiliado</span>
                        <span className="font-medium">Aplicado</span>
                      </div>
                    )}
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-green-600">{formatPrice(finalTotal)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Trust Indicators */}
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Package className="w-4 h-4 text-green-600" />
                      <span>Envío gratis en pedidos +S/100</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Leaf className="w-4 h-4 text-green-600" />
                      <span>Productos 100% naturales</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Entrega en 24-48 horas</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <div className="mt-8 space-y-4">
                    <Link href="/checkout">
                      <Button 
                        fullWidth 
                        className="bg-green-600 hover:bg-green-700 py-3 text-lg font-medium"
                        disabled={!cart.items.some(item => item.product.isAvailable)}
                      >
                        Proceder al Checkout
                      </Button>
                    </Link>
                    
                    <Link href="/products">
                      <Button 
                        variant="outline" 
                        fullWidth 
                        className="border-green-600 text-green-600 hover:bg-green-50"
                      >
                        Continuar Comprando
                      </Button>
                    </Link>
                  </div>

                  {/* Payment Methods */}
                  <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Métodos de Pago</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>• Código de operación BCP</div>
                      <div>• Transferencia bancaria</div>
                      <div>• Pago contra entrega</div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;
