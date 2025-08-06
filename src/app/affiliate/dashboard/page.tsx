'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useAffiliateStore } from '@/store/affiliateStore';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Package,
  Target,
  Award,
  Calendar,
  ArrowUp,
  ArrowDown,
  Leaf,
  CheckCircle,
  AlertCircle,
  Star,
  ShoppingBag,
  Percent
} from 'lucide-react';
import Link from 'next/link';

const AffiliateDashboard: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { 
    affiliateStats, 
    currentMonthStatus, 
    commissionSummary,
    networkSummary,
    fetchAffiliateStats, 
    fetchCurrentMonthStatus,
    fetchCommissions,
    fetchNetwork
  } = useAffiliateStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (user?.role !== 'afiliado') {
      router.push('/');
      return;
    }

    // Load all dashboard data
    fetchAffiliateStats();
    fetchCurrentMonthStatus();
    fetchCommissions({ limit: 5 });
    fetchNetwork({ limit: 5 });
  }, [isAuthenticated, user, router, fetchAffiliateStats, fetchCurrentMonthStatus, fetchCommissions, fetchNetwork]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(price);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  if (!isAuthenticated || user?.role !== 'afiliado') {
    return null;
  }

  const kpis = [
    {
      title: 'Comisiones del Mes',
      value: formatPrice(commissionSummary?.currentMonth?.total || 0),
      change: affiliateStats?.commissionMetrics?.monthlyEarnings || 0,
      icon: DollarSign,
      color: 'green',
      trend: 'up'
    },
    {
      title: 'Mi Red',
      value: networkSummary?.totalAffiliates || 0,
      change: networkSummary?.activeAffiliates || 0,
      changeLabel: 'activos',
      icon: Users,
      color: 'blue',
      trend: 'up'
    },
    {
      title: 'Ventas Totales',
      value: formatPrice(affiliateStats?.salesMetrics?.totalSales || 0),
      change: affiliateStats?.salesMetrics?.monthlyGrowth || 0,
      icon: TrendingUp,
      color: 'purple',
      trend: affiliateStats?.salesMetrics?.monthlyGrowth > 0 ? 'up' : 'down'
    },
    {
      title: 'Puntos Actuales',
      value: user?.affiliate?.points || 0,
      change: 50, // TODO: Get from API
      changeLabel: 'este mes',
      icon: Award,
      color: 'yellow',
      trend: 'up'
    }
  ];

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-full">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Mi Dashboard</h1>
                <p className="mt-2 text-green-100 text-lg">
                  ¡Hola {user?.fullName?.split(' ')[0]}! Aquí tienes el resumen de tu negocio
                </p>
              </div>
            </div>
            
            {/* Quick Status */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-4">
                {currentMonthStatus?.achieved ? (
                  <CheckCircle className="w-6 h-6 text-green-200" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-yellow-200" />
                )}
                <div>
                  <div className="font-semibold">Compra Mínima</div>
                  <div className="text-sm text-green-100">
                    {currentMonthStatus?.achieved ? 'Cumplida este mes' : `${currentMonthStatus?.daysRemaining || 0} días restantes`}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-4">
                <Star className="w-6 h-6 text-green-200" />
                <div>
                  <div className="font-semibold">Estado Activo</div>
                  <div className="text-sm text-green-100">Beneficios completos</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-4">
                <Leaf className="w-6 h-6 text-green-200" />
                <div>
                  <div className="font-semibold">Nivel Afiliado</div>
                  <div className="text-sm text-green-100">Precios especiales</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpis.map((kpi, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                    <div className="flex items-center mt-2">
                      {kpi.trend === 'up' ? (
                        <ArrowUp className="w-4 h-4 text-green-600 mr-1" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-red-600 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {typeof kpi.change === 'number' && kpi.change > 0 
                          ? (kpi.changeLabel ? `${kpi.change} ${kpi.changeLabel}` : formatPercentage(kpi.change))
                          : kpi.changeLabel || '0%'
                        }
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${
                    kpi.color === 'green' ? 'bg-green-100' :
                    kpi.color === 'blue' ? 'bg-blue-100' :
                    kpi.color === 'purple' ? 'bg-purple-100' :
                    'bg-yellow-100'
                  }`}>
                    <kpi.icon className={`w-6 h-6 ${
                      kpi.color === 'green' ? 'text-green-600' :
                      kpi.color === 'blue' ? 'text-blue-600' :
                      kpi.color === 'purple' ? 'text-purple-600' :
                      'text-yellow-600'
                    }`} />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Monthly Buy Status */}
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-green-600" />
                    Estado de Compra Mínima
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    currentMonthStatus?.achieved 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {currentMonthStatus?.achieved ? 'Cumplida' : 'Pendiente'}
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Productos comprados este mes:</span>
                    <span className="font-semibold text-gray-900">
                      {currentMonthStatus?.quantity || 0} de {currentMonthStatus?.required || 1}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-600 h-3 rounded-full transition-all duration-300" 
                      style={{ 
                        width: `${Math.min(100, ((currentMonthStatus?.quantity || 0) / (currentMonthStatus?.required || 1)) * 100)}%` 
                      }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {currentMonthStatus?.daysRemaining || 0} días restantes
                    </span>
                    <span className="text-green-600 font-medium">
                      Racha: {currentMonthStatus?.streak || 0} meses
                    </span>
                  </div>
                  
                  {!currentMonthStatus?.achieved && (
                    <div className="mt-4">
                      <Link href="/products">
                        <Button className="bg-green-600 hover:bg-green-700">
                          <ShoppingBag className="w-4 h-4 mr-2" />
                          Comprar Productos
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </Card>

              {/* Performance Chart Placeholder */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  Rendimiento Mensual
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {affiliateStats?.salesMetrics?.totalSales ? formatPrice(affiliateStats.salesMetrics.totalSales) : 'S/ 0'}
                    </div>
                    <div className="text-sm text-gray-600">Ventas Totales</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {affiliateStats?.salesMetrics?.averageOrderValue ? formatPrice(affiliateStats.salesMetrics.averageOrderValue) : 'S/ 0'}
                    </div>
                    <div className="text-sm text-gray-600">Valor Promedio</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {affiliateStats?.salesMetrics?.conversionRate || 0}%
                    </div>
                    <div className="text-sm text-gray-600">Conversión</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {affiliateStats?.networkMetrics?.totalReferrals || 0}
                    </div>
                    <div className="text-sm text-gray-600">Referidos</div>
                  </div>
                </div>
                
                {/* Placeholder for chart */}
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Gráfico de rendimiento próximamente</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
                <div className="space-y-3">
                  <Link href="/affiliate/register">
                    <Button fullWidth variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                      <Users className="w-4 h-4 mr-2" />
                      Registrar Afiliado
                    </Button>
                  </Link>
                  <Link href="/products">
                    <Button fullWidth variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                      <Package className="w-4 h-4 mr-2" />
                      Ver Productos
                    </Button>
                  </Link>
                  <Link href="/affiliate/rewards">
                    <Button fullWidth variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                      <Award className="w-4 h-4 mr-2" />
                      Canjear Puntos
                    </Button>
                  </Link>
                  <Link href="/affiliate/training">
                    <Button fullWidth variant="outline" className="border-yellow-600 text-yellow-600 hover:bg-yellow-50">
                      <Star className="w-4 h-4 mr-2" />
                      Capacitación
                    </Button>
                  </Link>
                </div>
              </Card>

              {/* Commission Summary */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  Resumen de Comisiones
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Este mes:</span>
                    <span className="font-semibold text-green-600">
                      {formatPrice(commissionSummary?.currentMonth?.total || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pendientes:</span>
                    <span className="font-semibold text-yellow-600">
                      {formatPrice(commissionSummary?.currentMonth?.pending || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total histórico:</span>
                    <span className="font-semibold text-gray-900">
                      {formatPrice(commissionSummary?.allTime?.total || 0)}
                    </span>
                  </div>
                  <Link href="/affiliate/commissions">
                    <Button fullWidth className="bg-green-600 hover:bg-green-700 mt-4">
                      Ver Detalle
                    </Button>
                  </Link>
                </div>
              </Card>

              {/* Network Preview */}
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-600" />
                    Mi Red
                  </h3>
                  <Link href="/affiliate/network" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Ver todo
                  </Link>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total afiliados:</span>
                    <span className="font-semibold">{networkSummary?.totalAffiliates || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Activos:</span>
                    <span className="font-semibold text-green-600">{networkSummary?.activeAffiliates || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Comisiones generadas:</span>
                    <span className="font-semibold text-blue-600">
                      {formatPrice(networkSummary?.totalCommissionsGenerated || 0)}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Tips */}
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                  <Leaf className="w-5 h-5 mr-2" />
                  Tip del Día
                </h3>
                <p className="text-green-800 text-sm mb-4">
                  💡 Comparte los beneficios de los productos naturales en tus redes sociales 
                  para atraer más clientes y referidos. ¡La autenticidad es clave!
                </p>
                <Link href="/affiliate/training">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Ver Más Tips
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AffiliateDashboard;
