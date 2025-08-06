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
  Users, 
  Search, 
  Filter,
  Plus,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Calendar,
  Phone,
  MapPin,
  Star,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

const AffiliateNetworkPage: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { 
    network,
    networkSummary,
    networkPagination,
    isLoading,
    fetchNetwork
  } = useAffiliateStore();

  const [filters, setFilters] = useState({
    search: '',
    status: '',
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

    fetchNetwork(filters);
  }, [isAuthenticated, user, router, fetchNetwork, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset page when filters change
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

  if (!isAuthenticated || user?.role !== 'afiliado') {
    return null;
  }

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Mi Red de Afiliados</h1>
                <p className="mt-2 text-blue-100 text-lg">
                  Gestiona y hace crecer tu equipo de distribuidores
                </p>
              </div>
            </div>
            
            {/* Summary Cards */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">{networkSummary?.totalAffiliates || 0}</div>
                <div className="text-blue-100">Total Afiliados</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold text-green-200">{networkSummary?.activeAffiliates || 0}</div>
                <div className="text-blue-100">Activos</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">
                  {formatPrice(networkSummary?.totalCommissionsGenerated || 0)}
                </div>
                <div className="text-blue-100">Comisiones Generadas</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">
                  {formatPrice(networkSummary?.monthlyCommissionsGenerated || 0)}
                </div>
                <div className="text-blue-100">Este Mes</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link href="/affiliate/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al dashboard
          </Link>

          {/* Actions and Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Buscar por nombre o DNI..."
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
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>

            <Link href="/affiliate/register">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Registrar Afiliado
              </Button>
            </Link>
          </div>

          {/* Network Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
                <p className="text-gray-600">Cargando red de afiliados...</p>
              </div>
            </div>
          ) : network.length === 0 ? (
            <div className="text-center py-16">
              <Card className="max-w-md mx-auto">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-blue-100 rounded-full">
                    <Users className="h-12 w-12 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Tu red está vacía</h3>
                <p className="text-gray-600 mb-8">
                  Comienza a construir tu red de distribuidores registrando tu primer afiliado
                </p>
                <Link href="/affiliate/register">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Registrar Primer Afiliado
                  </Button>
                </Link>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {network.map((affiliate) => (
                <Card key={affiliate.id} className="hover:shadow-lg transition-shadow">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{affiliate.fullName}</h3>
                          <p className="text-sm text-gray-500">DNI: {affiliate.dni}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        affiliate.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {affiliate.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{affiliate.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{affiliate.city}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Desde {formatDate(affiliate.referredAt)}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{affiliate.stats.totalOrders}</div>
                        <div className="text-xs text-gray-500">Pedidos Totales</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          {formatPrice(affiliate.stats.totalSpent)}
                        </div>
                        <div className="text-xs text-gray-500">Total Gastado</div>
                      </div>
                    </div>

                    {/* Monthly Performance */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <h4 className="font-medium text-gray-900 mb-2 text-sm">Rendimiento del Mes</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="flex items-center space-x-1">
                            <ShoppingBag className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-600">Pedidos:</span>
                          </div>
                          <div className="font-semibold">{affiliate.stats.monthlyOrders}</div>
                        </div>
                        <div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-600">Gastado:</span>
                          </div>
                          <div className="font-semibold">{formatPrice(affiliate.stats.monthlySpent)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Commission Generated */}
                    <div className="bg-green-50 rounded-lg p-3">
                      <h4 className="font-medium text-green-900 mb-2 text-sm flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        Comisión Generada
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-green-600">Total:</div>
                          <div className="font-bold text-green-700">
                            {formatPrice(affiliate.stats.commissionsGenerated)}
                          </div>
                        </div>
                        <div>
                          <div className="text-green-600">Este mes:</div>
                          <div className="font-bold text-green-700">
                            {formatPrice(affiliate.stats.monthlyCommissionsGenerated)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 text-xs border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        Ver Detalle
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 text-xs border-green-600 text-green-600 hover:bg-green-50"
                      >
                        Contactar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {networkPagination && networkPagination.totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                disabled={!networkPagination.hasPrevPage}
                onClick={() => handlePageChange(networkPagination.currentPage - 1)}
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Anterior
              </Button>
              
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, networkPagination.totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm rounded-md font-medium transition-all ${
                        page === networkPagination.currentPage
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
                disabled={!networkPagination.hasNextPage}
                onClick={() => handlePageChange(networkPagination.currentPage + 1)}
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

export default AffiliateNetworkPage;
