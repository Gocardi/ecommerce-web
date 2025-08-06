'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useAddressStore } from '@/store/addressStore';
import { useOrderStore } from '@/store/orderStore';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import AddressModal from '@/components/checkout/AddressModal';
import { 
  ShoppingCart, 
  MapPin, 
  CreditCard, 
  Shield, 
  ArrowLeft,
  Plus,
  Edit,
  Check,
  Leaf,
  Package,
  Truck,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { cart, getCartSummary } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const { addresses, defaultAddress, fetchAddresses, fetchDefaultAddress } = useAddressStore();
  const { createOrder, confirmPayment, isLoading: orderLoading } = useOrderStore();
  
  const [cartSummary, setCartSummary] = useState<any>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('BCP_code');
  const [bcpCode, setBcpCode] = useState('');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?returnUrl=/checkout');
      return;
    }
    
    if (!cart || cart.isEmpty) {
      router.push('/cart');
      return;
    }

    fetchAddresses();
    fetchDefaultAddress();
    loadCartSummary();
  }, [isAuthenticated, cart, fetchAddresses, fetchDefaultAddress, router]);

  useEffect(() => {
    if (defaultAddress) {
      setSelectedAddressId(defaultAddress.id);
    }
  }, [defaultAddress]);

  const loadCartSummary = async () => {
    try {
      const summary = await getCartSummary();
      setCartSummary(summary);
    } catch (error) {
      console.error('Error loading cart summary:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(price);
  };

  const handleCreateOrder = async () => {
    if (!selectedAddressId) {
      toast.error('Por favor selecciona una dirección de envío');
      return;
    }

    try {
      const orderData = {
        shippingAddress: addresses.find(addr => addr.id === selectedAddressId),
        paymentMethod,
        useStoredAddress: true,
        addressId: selectedAddressId
      };

      const order = await createOrder(orderData);
      setCreatedOrder(order);
      setCurrentStep(2);
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const handleConfirmPayment = async () => {
    if (!createdOrder) return;

    if (paymentMethod === 'BCP_code' && !bcpCode.trim()) {
      toast.error('Por favor ingresa el código de operación BCP');
      return;
    }

    try {
      const paymentData = {
        method: paymentMethod,
        amount: cartSummary?.finalTotal || 0,
        reference: bcpCode,
        ...(paymentMethod === 'BCP_code' && { bcpCode })
      };

      await confirmPayment(createdOrder.id, paymentData);
      setCurrentStep(3);
    } catch (error) {
      console.error('Error confirming payment:', error);
    }
  };

  const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);

  if (!isAuthenticated || !cart || cart.isEmpty) {
    return null; // Will redirect in useEffect
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
                <CreditCard className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Checkout</h1>
                <p className="mt-2 text-green-100 text-lg">
                  Completa tu pedido de productos naturales
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link href="/cart" className="inline-flex items-center text-green-600 hover:text-green-700 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al carrito
          </Link>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4 md:space-x-8">
              {[
                { step: 1, title: 'Dirección y Pago', icon: MapPin },
                { step: 2, title: 'Confirmar Pago', icon: CreditCard },
                { step: 3, title: 'Confirmación', icon: CheckCircle }
              ].map(({ step, title, icon: Icon }) => (
                <div key={step} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step 
                      ? 'bg-green-600 border-green-600 text-white' 
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    {currentStep > step ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium hidden md:block ${
                    currentStep >= step ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {title}
                  </span>
                  {step < 3 && (
                    <div className={`w-8 md:w-16 h-0.5 ml-4 ${
                      currentStep > step ? 'bg-green-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {currentStep === 1 && (
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
              {/* Shipping Address and Payment */}
              <div className="lg:col-span-2 space-y-8">
                {/* Shipping Address */}
                <Card>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-green-600" />
                      Dirección de Envío
                    </h3>
                    <Button
                      onClick={() => setIsAddressModalOpen(true)}
                      variant="outline"
                      className="border-green-600 text-green-600 hover:bg-green-50"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Nueva Dirección
                    </Button>
                  </div>

                  {addresses.length === 0 ? (
                    <div className="text-center py-8">
                      <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes direcciones guardadas</h3>
                      <p className="text-gray-600 mb-4">Agrega una dirección para continuar con tu pedido</p>
                      <Button
                        onClick={() => setIsAddressModalOpen(true)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Agregar Dirección
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedAddressId === address.id
                              ? 'border-green-600 bg-green-50'
                              : 'border-gray-200 hover:border-green-300'
                          }`}
                          onClick={() => setSelectedAddressId(address.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <input
                                  type="radio"
                                  checked={selectedAddressId === address.id}
                                  onChange={() => setSelectedAddressId(address.id)}
                                  className="text-green-600 focus:ring-green-500"
                                />
                                <span className="font-medium text-gray-900">{address.name}</span>
                                {address.isDefault && (
                                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                    Principal
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-600 ml-6">
                                <p>{address.address}</p>
                                <p>{address.city}, {address.region}</p>
                                {address.reference && <p>Ref: {address.reference}</p>}
                                <p>Tel: {address.phone}</p>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // TODO: Open edit modal
                              }}
                              className="text-green-600 hover:text-green-700 p-1"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Payment Method */}
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                    Método de Pago
                  </h3>

                  <div className="space-y-4">
                    <div
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === 'BCP_code'
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                      onClick={() => setPaymentMethod('BCP_code')}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          checked={paymentMethod === 'BCP_code'}
                          onChange={() => setPaymentMethod('BCP_code')}
                          className="text-green-600 focus:ring-green-500"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Código de Operación BCP</div>
                          <div className="text-sm text-gray-600">Realiza la transferencia y proporciona el código</div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === 'bank_transfer'
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                      onClick={() => setPaymentMethod('bank_transfer')}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          checked={paymentMethod === 'bank_transfer'}
                          onChange={() => setPaymentMethod('bank_transfer')}
                          className="text-green-600 focus:ring-green-500"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Transferencia Bancaria</div>
                          <div className="text-sm text-gray-600">Transferencia directa a nuestra cuenta</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bank Information */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Datos Bancarios</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div><strong>Banco:</strong> Banco de Crédito del Perú (BCP)</div>
                      <div><strong>Cuenta:</strong> 123-456789-0-12</div>
                      <div><strong>Titular:</strong> NATURAL SALUD SAC</div>
                      <div><strong>CCI:</strong> 002-123-456789012-34</div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Resumen del Pedido</h3>
                  
                  {/* Products */}
                  <div className="space-y-4 mb-6">
                    {cart?.items?.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <img
                          src={item.product.imageUrl || '/placeholder-product.jpg'}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                            {item.product.name}
                          </h4>
                          <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatPrice(item.totalPrice)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-3 border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">{formatPrice(cartSummary?.totalPrice || 0)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Envío</span>
                      <span className="font-medium">{formatPrice(cartSummary?.shippingCost || 0)}</span>
                    </div>
                    
                    <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
                      <span>Total</span>
                      <span className="text-green-600">{formatPrice(cartSummary?.finalTotal || 0)}</span>
                    </div>
                  </div>

                  {/* Security Features */}
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span>Pago 100% seguro</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Package className="w-4 h-4 text-green-600" />
                      <span>Productos garantizados</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Truck className="w-4 h-4 text-green-600" />
                      <span>Entrega en 24-48 horas</span>
                    </div>
                  </div>

                  {/* Order Button */}
                  <Button
                    onClick={handleCreateOrder}
                    disabled={!selectedAddressId || orderLoading}
                    fullWidth
                    className="mt-6 bg-green-600 hover:bg-green-700 py-3 text-lg font-medium"
                  >
                    {orderLoading ? 'Procesando...' : 'Crear Pedido'}
                  </Button>
                </Card>
              </div>
            </div>
          )}

          {currentStep === 2 && createdOrder && (
            <div className="max-w-2xl mx-auto">
              <Card>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <CreditCard className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirmar Pago</h2>
                  <p className="text-gray-600">
                    Tu pedido #{createdOrder.id} ha sido creado. Confirma tu pago para procesarlo.
                  </p>
                </div>

                {paymentMethod === 'BCP_code' && (
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">Instrucciones de Pago</h3>
                      <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                        <li>Realiza la transferencia por {formatPrice(cartSummary?.finalTotal || 0)} a la cuenta BCP</li>
                        <li>Anota el código de operación que te proporciona el banco</li>
                        <li>Ingresa el código en el campo de abajo</li>
                        <li>Confirma el pago para que podamos procesar tu pedido</li>
                      </ol>
                    </div>

                    <div>
                      <label htmlFor="bcpCode" className="block text-sm font-medium text-gray-700 mb-2">
                        Código de Operación BCP *
                      </label>
                      <Input
                        id="bcpCode"
                        type="text"
                        placeholder="Ej: 001234567890"
                        value={bcpCode}
                        onChange={(e) => setBcpCode(e.target.value)}
                        className="border-green-200 focus:border-green-500 focus:ring-green-500"
                        required
                      />
                    </div>

                    <Button
                      onClick={handleConfirmPayment}
                      disabled={!bcpCode.trim() || orderLoading}
                      fullWidth
                      className="bg-green-600 hover:bg-green-700 py-3 text-lg font-medium"
                    >
                      {orderLoading ? 'Confirmando...' : 'Confirmar Pago'}
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          )}

          {currentStep === 3 && (
            <div className="max-w-2xl mx-auto text-center">
              <Card>
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">¡Pedido Confirmado!</h2>
                <p className="text-gray-600 mb-8">
                  Tu pedido #{createdOrder?.id} ha sido confirmado y está siendo procesado. 
                  Recibirás una notificación cuando sea enviado.
                </p>
                
                <div className="space-y-4">
                  <Link href={`/orders/${createdOrder?.id}`}>
                    <Button className="bg-green-600 hover:bg-green-700" fullWidth>
                      Ver Detalles del Pedido
                    </Button>
                  </Link>
                  <Link href="/products">
                    <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50" fullWidth>
                      Continuar Comprando
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Address Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSuccess={() => {
          setIsAddressModalOpen(false);
          fetchAddresses();
        }}
      />
    </>
  );
};

export default CheckoutPage;
