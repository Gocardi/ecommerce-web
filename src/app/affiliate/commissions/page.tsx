'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useAffiliateStore } from '@/store/affiliateStore';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  Filter,
  Download,
  Calendar,
  ArrowLeft,
  Package,
  Users,
  Star
} from 'lucide-react';
import Link from 'next/link';

const CommissionsPage: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { 
    commissions,
    commissionSummary,
    commissionPagination,
    isLoading,
    fetchCommissions
  } = useAffiliateStore();

  const [filters, setFilters] = useState({
    type: '', // direct, referral
    status: '', // pending, approved, paid
    startDate: '',
    endDate: '',
    page: 1
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (user?.role !== 'afiliado') {
      router.push('/');
      return;
    }

    fetchCommissions(filters);
  }, [isAuthenticated, user, router, fetchCommissions, filters]);

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
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'approved': return 'Aprobada';
      case 'paid': return 'Pagada';
      default: return status;
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'direct' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
  };

  const getTypeText = (type: string) => {
    return type === 'direct' ? 'Venta Directa' : 'Referido';
  };

  if (!isAuthenticated || user?.role !== 'afiliado') {
    return null;
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
                <DollarSign className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Mis Comisiones</h1>
                <p className="mt-2 text-green-100 text-lg">
                  Historial completo de tus ganancias por ventas
                </p>
              </div>
            </div>
            
            {/* Summary Cards */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">
                  {formatPrice(commissionSummary?.allTime?.total || 0)}
                </div>
                <div className="text-green-100">Total Histórico</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">
                  {formatPrice(commissionSummary?.currentMonth?.total || 0)}
                </div>
                <div className="text-green-100">Este Mes</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold text-yellow-200">
                  {formatPrice(commissionSummary?.allTime?.pending || 0)}
                </div>
                <div className="text-green-100">Pendientes</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold text-blue-200">
                  {formatPrice(commissionSummary?.allTime?.paid || 0)}
                </div>
                <div className="text-green-100">Pagadas</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link href="/affiliate/dashboard" className="inline-flex items-center text-green-600 hover:text-green-700 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al dashboard
          </Link>

          {/* Commission Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-green-600" />
                Ventas Directas
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total histórico:</span>
                  <span className="font-semibold text-green-600">
                    {formatPrice(commissionSummary?.allTime?.direct || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Este mes:</span>
                  <span className="font-semibold">
                    {formatPrice(commissionSummary?.currentMonth?.direct || 0)}
                  </span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Comisiones de Red
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total histórico:</span>
                  <span className="font-semibold text-blue-600">
                    {formatPrice(commissionSummary?.allTime?.referral || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Este mes:</span>
                  <span className="font-semibold">
                    {formatPrice(commissionSummary?.currentMonth?.referral || 0)}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Filter className="w-5 h-5 mr-2 text-green-600" />
                Filtrar Comisiones
              </h3>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                >
                  <option value="">Todos los tipos</option>
                  <option value="direct">Ventas Directas</option>
                  <option value="referral">Comisiones de Red</option>
                </select>

                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                >
                  <option value="">Todos los estados</option>
                  <option value="pending">Pendientes</option>
                  <option value="approved">Aprobadas</option>
                  <option value="paid">Pagadas</option>
                </select>

                <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          </Card>

          {/* Commissions List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent"></div>
                <p className="text-gray-600">Cargando comisiones...</p>
              </div>
            </div>
          ) : commissions.length === 0 ? (
            <div className="text-center py-16">
              <Card className="max-w-md mx-auto">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-green-100 rounded-full">
                    <DollarSign className="h-12 w-12 text-green-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">No hay comisiones aún</h3>
                <p className="text-gray-600 mb-8">
                  Realiza ventas o refiere afiliados para comenzar a ganar comisiones
                </p>
                <div className="space-y-3">
                  <Link href="/products">
                    <Button className="bg-green-600 hover:bg-green-700" fullWidth>
                      Comprar Productos
                    </Button>
                  </Link>
                  <Link href="/affiliate/register">
                    <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50" fullWidth>
                      Registrar Afiliado
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          ) : (
            <div className="space-y-4">
              {commissions.map((commission) => (
                <Card key={commission.id} className="hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(commission.type)}`}>
                              {getTypeText(commission.type)}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(commission.status)}`}>
                              {getStatusText(commission.status)}
                            </span>
                          </div>
                          <h4 className="font-semibold text-gray-900">
                            {commission.orderItem.product.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Cantidad: {commission.orderItem.quantity} × {formatPrice(commission.orderItem.unitPrice)}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            {formatPrice(commission.amount)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {commission.percentage}% comisión
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Generada: {formatDate(commission.createdAt)}</span>
                          </div>
                          {commission.approvedAt && (
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>Aprobada: {formatDate(commission.approvedAt)}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-xs">
                          ID: #{commission.id}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {commissionPagination && commissionPagination.totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                disabled={!commissionPagination.hasPrevPage}
                onClick={() => handlePageChange(commissionPagination.currentPage - 1)}
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                Anterior
              </Button>
              
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, commissionPagination.totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm rounded-md font-medium transition-all ${
                        page === commissionPagination.currentPage
                          ? 'bg-green-600 text-white'
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
                disabled={!commissionPagination.hasNextPage}
                onClick={() => handlePageChange(commissionPagination.currentPage + 1)}
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                Siguiente
              </Button>
            </div>
          )}

          {/* Tips */}
          <Card className="mt-8 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2" />
              Maximiza tus Comisiones
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-800">
              <div>
                <h4 className="font-medium mb-2">Ventas Directas:</h4>
                <ul className="space-y-1">
                  <li>• Compra productos regularmente</li>
                  <li>• Aprovecha las promociones</li>
                  <li>• Mantén tu status activo</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Comisiones de Red:</h4>
                <ul className="space-y-1">
                  <li>• Refiere nuevos afiliados</li>
                  <li>• Capacita a tu equipo</li>
                  <li>• Motiva las ventas grupales</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CommissionsPage;
