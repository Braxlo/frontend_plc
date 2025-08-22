'use client';

import { useState } from 'react';

interface PlcConnectionFormProps {
  onConnectionEstablished: (connectionInfo: {
    ip: string;
    rack: number;
    slot: number;
  }) => void;
}

export default function PlcConnectionForm({ onConnectionEstablished }: PlcConnectionFormProps) {
  const [formData, setFormData] = useState({
    ip: '192.168.0.1',
    rack: 0,
    slot: 1,
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    setError(null);

    try {
      // Aquí iría la lógica real de conexión al PLC
      // Por ahora simulamos una conexión exitosa
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onConnectionEstablished(formData);
    } catch (err) {
      setError('Error al conectar con el PLC. Verifica la IP y configuración.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'ip' ? value : parseInt(value) || 0,
    }));
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Configuración de Conexión PLC
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="ip" className="block text-sm font-medium text-gray-700 mb-2">
            Dirección IP del PLC
          </label>
          <input
            type="text"
            id="ip"
            name="ip"
            value={formData.ip}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="192.168.0.1"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="rack" className="block text-sm font-medium text-gray-700 mb-2">
              Número de Rack
            </label>
            <input
              type="number"
              id="rack"
              name="rack"
              value={formData.rack}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              required
            />
          </div>

          <div>
            <label htmlFor="slot" className="block text-sm font-medium text-gray-700 mb-2">
              Número de Slot
            </label>
            <input
              type="number"
              id="slot"
              name="slot"
              value={formData.slot}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              required
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isConnecting}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isConnecting ? 'Conectando...' : 'Conectar al PLC'}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h3 className="font-medium text-blue-800 mb-2">Información de Conexión</h3>
        <p className="text-blue-700 text-sm">
          Asegúrate de que el PLC esté encendido y accesible desde la red. 
          La dirección IP debe ser la misma que configuraste en el PLC.
        </p>
      </div>
    </div>
  );
}
