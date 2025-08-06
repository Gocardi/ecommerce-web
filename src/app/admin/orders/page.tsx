'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useAdminStore } from '@/store/adminStore';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { 
  ShoppingBag, 
  Search, 
  Filter,
  Eye,
  Edit,
  Calendar,
  MapPin,
  Phone,
  User,
  Package,
  ArrowLeft,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

const AdminOrdersPage: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { 
    orders,
    ordersPagination,
    isLoading,
    fetchOrders,
    updateOrderStatus
  } = useAdminStore();

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    startDate: '',
    endDate: '',
    page: 1
  });

  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (user?.role !== 'admin' && user?.role !== 'admin_general') {
      router.push('/');
      return;
    }

    fetchOrders(filters);
  }, [isAuthenticated, user, router, fetchOrders, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleSelectOrder = (orderId: number) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    setSelectedOrders(
      selectedOrders.length === orders.length 
        ? [] 
        : orders.map(order => order.id)
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'paid': return 'Pagado';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'paid': return CheckCircle;
      case 'shipped': return Truck;
      case 'delivered': return Package;
      case 'cancelled': return AlertCircle;
      default: return Clock;
    }
  };

  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'admin_general')) {
    return null;
  }

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-full">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Gestión de Pedidos</h1>
                <p className="mt-2 text-blue-100 text-lg">
                  Administra todos los pedidos del sistema
                </p>
              </div>
            </div>
            
            {/* Summary */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: 'Pendientes', value: orders.filter(o => o.status === 'pending').length, color: 'yellow' },
                { label: 'Pagados', value: orders.filter(o => o.status === 'paid').length, color: 'blue' },
                { label: 'Enviados', value: orders.filter(o => o.status === 'shipped').length, color: 'purple' },
                { label: 'Entregados', value: orders.filter(o => o.status === 'delivered').length, color: 'green' },
                { label: 'Total', value: orders.length, color: 'white' }
              ].map((stat, index) => (
                <div key={index} className={`bg-white/10 rounded-lg p-4 backdrop-blur-sm`}>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-blue-100 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link href="/admin/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al dashboard
          </Link>

          {/* Filters */}
          <Card className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Filter className="w-5 h-5 mr-2 text-blue-600" />
                Filtrar Pedidos
              </h3>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Buscar por ID o cliente..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Todos los estados</option>
                  <option value="pending">Pendientes</option>
                  <option value="paid">Pagados</option>
                  <option value="shipped">Enviados</option>
                  <option value="delivered">Entregados</option>
                  <option value="cancelled">Cancelados</option>
                </select>

                {/* Date Filters */}
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </Card>

          {/* Orders List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
                <p className="text-gray-600">Cargando pedidos...</p>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <Card className="max-w-md mx-auto">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-blue-100 rounded-full">
                    <ShoppingBag className="h-12 w-12 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">No se encontraron pedidos</h3>
                <p className="text-gray-600">
                  No hay pedidos que coincidan con los filtros seleccionados
                </p>
              </Card>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Bulk Actions */}
              {selectedOrders.length > 0 && (
                <Card className="bg-blue-50 border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-800 font-medium">
                      {selectedOrders.length} pedidos seleccionados
                    </span>
                    <div className="space-x-2">
                      <Button size="sm" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                        Actualizar Estado
                      </Button>
                      <Button size="sm" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                        Exportar
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Orders Table Header */}
              <Card padding="none">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectedOrders.length === orders.length && orders.length > 0}
                            onChange={handleSelectAll}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pedido
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cliente
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => {
                        const StatusIcon = getStatusIcon(order.status);
                        return (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={selectedOrders.includes(order.id)}
                                onChange={() => handleSelectOrder(order.id)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <StatusIcon className={`w-5 h-5 ${
                                  order.status === 'pending' ? 'text-yellow-600' :
                                  order.status === 'paid' ? 'text-blue-600' :
                                  order.status === 'shipped' ? 'text-purple-600' :
                                  order.status === 'delivered' ? 'text-green-600' :
                                  'text-red-600'
                                }`} />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    #{order.id}
                                  </div>
                                  {order.trackingCode && (
                                    <div className="text-xs text-gray-500">
                                      {order.trackingCode}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  <User className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    Cliente #{order.userId}
                                  </div>
                                  {order.shippingAddress && (
                                    <div className="text-xs text-gray-500 flex items-center">
                                      <MapPin className="w-3 h-3 mr-1" />
                                      {order.shippingAddress.city}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(order.status)}`}
                              >
                                <option value="pending">Pendiente</option>
                                <option value="paid">Pagado</option>
                                <option value="shipped">Enviado</option>
                                <option value="delivered">Entregado</option>
                                <option value="cancelled">Cancelado</option>
                              </select>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">
                                {formatPrice(order.totalAmount)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {order.orderItems?.length || 0} items
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">
                                {formatDate(order.createdAt)}
                              </div>
                              {order.deliveredAt && (
                                <div className="text-xs text-green-600">
                                  Entregado: {formatDate(order.deliveredAt)}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <Link href={`/admin/orders/${order.id}`}>
                                  <Button size="sm" variant="outline">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </Link>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => {/* Open edit modal */}}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* Pagination */}
          {ordersPagination && ordersPagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                disabled={!ordersPagination.hasPrevPage}
                onClick={() => handlePageChange(ordersPagination.currentPage - 1)}
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Anterior
              </Button>
              
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, ordersPagination.totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm rounded-md font-medium transition-all ${
                        page === ordersPagination.currentPage
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                disabled={!ordersPagination.hasNextPage}
                onClick={() => handlePageChange(ordersPagination.currentPage + 1)}
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Siguiente
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminOrdersPage;
