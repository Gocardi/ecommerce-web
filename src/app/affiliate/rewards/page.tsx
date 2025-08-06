'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useRewardsStore } from '@/store/rewardsStore';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  Award, 
  Star, 
  Gift,
  Clock,
  CheckCircle,
  ArrowLeft,
  Package,
  Zap,
  Trophy
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const RewardsPage: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { 
    rewards,
    myClaims,
    availablePoints,
    isLoading,
    fetchRewards,
    fetchMyClaims,
    fetchAvailablePoints,
    claimReward
  } = useRewardsStore();

  const [activeTab, setActiveTab] = useState<'available' | 'my-claims'>('available');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (user?.role !== 'afiliado') {
      router.push('/');
      return;
    }

    fetchRewards();
    fetchMyClaims();
    fetchAvailablePoints();
  }, [isAuthenticated, user, router, fetchRewards, fetchMyClaims, fetchAvailablePoints]);

  const handleClaimReward = async (rewardId: number, pointsRequired: number) => {
    if (availablePoints < pointsRequired) {
      toast.error('No tienes suficientes puntos para este premio');
      return;
    }

    if (window.confirm('¿Estás seguro de que quieres canjear este premio?')) {
      try {
        await claimReward(rewardId);
      } catch (error) {
        // Error handled in store
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'approved': return 'Aprobado';
      case 'delivered': return 'Entregado';
      default: return status;
    }
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
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Centro de Premios</h1>
                <p className="mt-2 text-purple-100 text-lg">
                  Canjea tus puntos por increíbles premios
                </p>
              </div>
            </div>
            
            {/* Points Display */}
            <div className="mt-8 bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{availablePoints}</div>
                  <div className="text-purple-100">Puntos Disponibles</div>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold">0.1</div>
                    <div className="text-purple-200">Puntos por S/1</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{myClaims.length}</div>
                    <div className="text-purple-200">Canjes Realizados</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link href="/affiliate/dashboard" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al dashboard
          </Link>

          {/* Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('available')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'available'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Premios Disponibles
                </button>
                <button
                  onClick={() => setActiveTab('my-claims')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'my-claims'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Mis Canjes ({myClaims.length})
                </button>
              </nav>
            </div>
          </div>

          {/* Available Rewards Tab */}
          {activeTab === 'available' && (
            <div>
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent"></div>
                    <p className="text-gray-600">Cargando premios...</p>
                  </div>
                </div>
              ) : rewards.length === 0 ? (
                <div className="text-center py-16">
                  <Card className="max-w-md mx-auto">
                    <div className="flex justify-center mb-6">
                      <div className="p-4 bg-purple-100 rounded-full">
                        <Gift className="h-12 w-12 text-purple-600" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">No hay premios disponibles</h3>
                    <p className="text-gray-600 mb-8">
                      Los premios se agregarán pronto. ¡Sigue acumulando puntos!
                    </p>
                    <Link href="/products">
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        Comprar Productos
                      </Button>
                    </Link>
                  </Card>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rewards.map((reward) => (
                    <Card key={reward.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                      <div className="aspect-w-16 aspect-h-9 mb-4">
                        <img
                          src={reward.imageUrl || '/placeholder-reward.jpg'}
                          alt={reward.name}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {reward.name}
                          </h3>
                          {reward.description && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {reward.description}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Star className="w-5 h-5 text-yellow-500" />
                            <span className="text-xl font-bold text-purple-600">
                              {reward.pointsRequired}
                            </span>
                            <span className="text-sm text-gray-500">puntos</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            reward.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {reward.stock > 0 ? `${reward.stock} disponibles` : 'Agotado'}
                          </span>
                        </div>
                        
                        <Button
                          onClick={() => handleClaimReward(reward.id, reward.pointsRequired)}
                          disabled={availablePoints < reward.pointsRequired || reward.stock === 0 || isLoading}
                          fullWidth
                          className={`py-3 font-medium transition-all ${
                            availablePoints >= reward.pointsRequired && reward.stock > 0
                              ? 'bg-purple-600 hover:bg-purple-700 text-white'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {availablePoints < reward.pointsRequired 
                            ? `Necesitas ${reward.pointsRequired - availablePoints} puntos más`
                            : reward.stock === 0
                            ? 'Agotado'
                            : isLoading
                            ? 'Canjeando...'
                            : 'Canjear Premio'
                          }
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* My Claims Tab */}
          {activeTab === 'my-claims' && (
            <div>
              {myClaims.length === 0 ? (
                <div className="text-center py-16">
                  <Card className="max-w-md mx-auto">
                    <div className="flex justify-center mb-6">
                      <div className="p-4 bg-purple-100 rounded-full">
                        <Trophy className="h-12 w-12 text-purple-600" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">No has canjeado premios</h3>
                    <p className="text-gray-600 mb-8">
                      Acumula puntos comprando productos y canjéalos por increíbles premios
                    </p>
                    <Button
                      onClick={() => setActiveTab('available')}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Ver Premios Disponibles
                    </Button>
                  </Card>
                </div>
              ) : (
                <div className="space-y-4">
                  {myClaims.map((claim) => (
                    <Card key={claim.id} className="hover:shadow-md transition-shadow">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex items-start space-x-4">
                          <img
                            src={claim.reward.imageUrl || '/placeholder-reward.jpg'}
                            alt={claim.reward.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">
                                {claim.reward.name}
                              </h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                                {getStatusText(claim.status)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span>{claim.pointsUsed} puntos</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>Canjeado: {formatDate(claim.claimedAt)}</span>
                              </div>
                              {claim.deliveredAt && (
                                <div className="flex items-center space-x-1">
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  <span>Entregado: {formatDate(claim.deliveredAt)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* How to Earn Points */}
          <Card className="mt-8 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              ¿Cómo Ganar Más Puntos?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-purple-800">
              <div className="flex items-start space-x-3">
                <Package className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1">Compra Productos</h4>
                  <p>Gana 0.1 puntos por cada sol gastado en productos naturales</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Star className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1">Mantén tu Status</h4>
                  <p>Cumple con la compra mínima mensual para seguir activo</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Trophy className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1">Bonificaciones</h4>
                  <p>Recibe puntos extra en promociones especiales</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default RewardsPage;
