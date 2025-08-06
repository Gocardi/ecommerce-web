'use client';

import React, { useState } from 'react';
import { useAddressStore } from '@/store/addressStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { X, MapPin, Phone, User } from 'lucide-react';
import toast from 'react-hot-toast';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddressModal: React.FC<AddressModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { createAddress, isLoading } = useAddressStore();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    region: '',
    city: '',
    address: '',
    reference: '',
    isDefault: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.phone.trim() || !formData.region.trim() || 
        !formData.city.trim() || !formData.address.trim()) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      await createAddress(formData);
      setFormData({
        name: '',
        phone: '',
        region: '',
        city: '',
        address: '',
        reference: '',
        isDefault: false
      });
      onSuccess();
    } catch (error) {
      // Error is handled in the store
    }
  };

  const regions = [
    'Lima', 'Arequipa', 'Cusco', 'Trujillo', 'Chiclayo', 'Piura', 
    'Iquitos', 'Huancayo', 'Tacna', 'Ica', 'Otro'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <Card padding="none">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-green-600" />
                Nueva Dirección de Envío
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Destinatario *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Juan Pérez"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="987654321"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                  Región *
                </label>
                <select
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                  required
                >
                  <option value="">Selecciona tu región</option>
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  Ciudad/Distrito *
                </label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="San Isidro, Miraflores, etc."
                  value={formData.city}
                  onChange={handleInputChange}
                  className="border-green-200 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Dirección Completa *
              </label>
              <Input
                id="address"
                name="address"
                type="text"
                placeholder="Av. Principal 123, Dpto 101"
                value={formData.address}
                onChange={handleInputChange}
                className="border-green-200 focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-2">
                Referencia (Opcional)
              </label>
              <Input
                id="reference"
                name="reference"
                type="text"
                placeholder="Frente al parque, cerca del mercado..."
                value={formData.reference}
                onChange={handleInputChange}
                className="border-green-200 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isDefault"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleInputChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="isDefault" className="text-sm text-gray-700">
                Establecer como dirección principal
              </label>
            </div>

            <div className="flex space-x-4 pt-4">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isLoading ? 'Guardando...' : 'Guardar Dirección'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AddressModal;
