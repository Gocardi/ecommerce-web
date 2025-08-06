'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useAdminStore } from '@/store/adminStore';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  BarChart3, 
  Users, 
  ShoppingBag, 
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Package,
  Clock,
  CheckCircle,
  Eye,
  Settings
} from 'lucide-react';
import Link from 'next/link';

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { 
    dashboard, 
    isLoading,
    fetchDashboard
  } = useAdminStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (user?.role !== 'admin' && user?.role !== 'admin_general') {
      router.push('/');
      return;
    }

    fetchDashboard();
  }, [isAuthenticated, user, router, fetchDashboard]);

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

  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'admin_general')) {
    return null;
  }

  const kpis = [
    {
      title: 'Ventas Totales',
      value: formatPrice(dashboard?.kpis?.totalSales || 0),
      icon: DollarSign,
      color: 'green',
      change: '+12.5%'
    },
    {
      title: 'Pedidos del Mes',
      value: dashboard?.kpis?.monthlyOrders || 0,
      icon: ShoppingBag,
      color: 'blue',
      change: '+8.2%'
    },
    {
      title: 'Afiliados Activos',
      value: dashboard?.kpis?.activeAffiliates || 0,
      icon: Users,
      color: 'purple',
      change: '+15.3%'
    },
    {
      title: 'Comisiones Pendientes',
      value: dashboard?.kpis?.pendingCommissions || 0,
      icon: Clock,
      color: 'yellow',
      change: 'Requiere atención'
    }
  ];

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-full">
                <BarChart3 className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Panel de Administración</h1>
                <p className="mt-2 text-gray-300 text-lg">
                  Gestiona el sistema y supervisa las operaciones
                </p>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/admin/orders">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Gestionar Pedidos
                </Button>
              </Link>
              <Link href="/admin/commissions">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Aprobar Comisiones
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Users className="w-4 h-4 mr-2" />
                  Gestionar Usuarios
                </Button>
              </Link>
              {user?.role === 'admin_general' && (
                <Link href="/admin/config">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    <Settings className="w-4 h-4 mr-2" />
                    Configuración
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-600 border-t-transparent"></div>
                <p className="text-gray-600">Cargando dashboard...</p>
              </div>
            </div>
          )}

          {!isLoading && (
            <>
              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {kpis.map((kpi, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                        <p className={`text-sm mt-2 ${
                          kpi.change.includes('+') ? 'text-green-600' : 
                          kpi.change.includes('Requiere') ? 'text-yellow-600' : 'text-gray-600'
                        }`}>
                          {kpi.change}
                        </p>
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
                {/* Recent Orders */}
                <div className="lg:col-span-2">
                  <Card>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <ShoppingBag className="w-5 h-5 mr-2 text-blue-600" />
                        Pedidos Recientes
                      </h3>
                      <Link href="/admin/orders" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Ver todos
                      </Link>
                    </div>
                    
                    {dashboard?.recentOrders?.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No hay pedidos recientes
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {dashboard?.recentOrders?.slice(0, 5).map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <span className="font-medium text-gray-900">
                                  Pedido #{order.id}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                  {getStatusText(order.status)}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600">
                                {formatDate(order.createdAt)} • {formatPrice(order.totalAmount)}
                              </div>
                            </div>
                            <Link href={`/admin/orders/${order.id}`}>
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Low Stock Alert */}
                  <Card>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                      Stock Bajo
                    </h3>
                    {dashboard?.lowStockProducts?.length === 0 ? (
                      <p className="text-gray-500 text-sm">Todos los productos tienen stock suficiente</p>
                    ) : (
                      <div className="space-y-3">
                        {dashboard?.lowStockProducts?.slice(0, 3).map((product) => (
                          <div key={product.id} className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900 text-sm">
                                {product.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                Stock: {product.stock}
                              </div>
                            </div>
                            <span className="text-red-600 text-xs font-medium">
                              ¡Bajo!
                            </span>
                          </div>
                        ))}
                        <Link href="/admin/products">
                          <Button size="sm" variant="outline" fullWidth className="mt-3">
                            Gestionar Productos
                          </Button>
                        </Link>
                      </div>
                    )}
                  </Card>

                  {/* Pending Commissions */}
                  <Card>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-yellow-600" />
                      Comisiones Pendientes
                    </h3>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-600 mb-2">
                        {dashboard?.pendingCommissionsCount || 0}
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Comisiones esperando aprobación
                      </p>
                      <Link href="/admin/commissions">
                        <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700" fullWidth>
                          Revisar Comisiones
                        </Button>
                      </Link>
                    </div>
                  </Card>

                  {/* Quick Stats */}
                  <Card>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas Rápidas</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Usuarios:</span>
                        <span className="font-medium">{dashboard?.kpis?.totalUsers || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ingresos del Mes:</span>
                        <span className="font-medium text-green-600">
                          {formatPrice(dashboard?.kpis?.monthlyRevenue || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Afiliados Activos:</span>
                        <span className="font-medium">{dashboard?.kpis?.activeAffiliates || 0}</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Charts Section - Placeholder */}
              <div className="mt-8">
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    Ventas del Último Mes
                  </h3>
                  
                  {/* Placeholder for chart */}
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Gráfico de ventas próximamente</p>
                    </div>
                  </div>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
