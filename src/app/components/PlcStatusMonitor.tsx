'use client';

import { useState, useEffect } from 'react';

interface ConnectionStatus {
  id: string;
  ip: string;
  rack: number;
  slot: number;
  status: 'connected' | 'disconnected' | 'error';
  lastSeen: string;
  responseTime: number;
  variablesCount: number;
}

export default function PlcStatusMonitor() {
  const [connections, setConnections] = useState<ConnectionStatus[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Simular conexiones existentes
  useEffect(() => {
    const mockConnections: ConnectionStatus[] = [
      {
        id: '1',
        ip: '192.168.0.10',
        rack: 0,
        slot: 1,
        status: 'connected',
        lastSeen: new Date().toLocaleString(),
        responseTime: 45,
        variablesCount: 12,
      },
      {
        id: '2',
        ip: '192.168.0.20',
        rack: 0,
        slot: 1,
        status: 'connected',
        lastSeen: new Date().toLocaleString(),
        responseTime: 32,
        variablesCount: 8,
      },
      {
        id: '3',
        ip: '192.168.0.30',
        rack: 0,
        slot: 1,
        status: 'error',
        lastSeen: new Date(Date.now() - 5 * 60 * 1000).toLocaleString(),
        responseTime: 0,
        variablesCount: 0,
      },
    ];

    setConnections(mockConnections);
  }, []);

  // Auto-refresh cada 30 segundos
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refreshConnections();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const refreshConnections = async () => {
    setIsRefreshing(true);
    
    try {
      // Simular actualización de estado
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setConnections(prev => prev.map(conn => ({
        ...conn,
        lastSeen: new Date().toLocaleString(),
        responseTime: conn.status === 'connected' ? Math.floor(Math.random() * 50) + 20 : 0,
      })));
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'disconnected':
        return 'bg-gray-100 text-gray-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return '🟢';
      case 'disconnected':
        return '⚪';
      case 'error':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const getResponseTimeColor = (time: number) => {
    if (time === 0) return 'text-gray-400';
    if (time < 50) return 'text-green-600';
    if (time < 100) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Estado de Conexiones PLC
      </h2>

      {/* Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={refreshConnections}
            disabled={isRefreshing}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRefreshing ? 'Actualizando...' : 'Actualizar Ahora'}
          </button>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Auto-actualizar cada 30s</span>
          </label>
        </div>

        <div className="text-sm text-gray-500">
          Última actualización: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Connection Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {connections.map((connection) => (
          <div
            key={connection.id}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  PLC {connection.ip}
                </h3>
                <p className="text-sm text-gray-500">
                  Rack {connection.rack}, Slot {connection.slot}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(connection.status)}`}>
                  {getStatusIcon(connection.status)} {connection.status}
                </span>
              </div>
            </div>

            {/* Status Details */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Estado:</span>
                <span className={`text-sm font-medium ${getStatusColor(connection.status)}`}>
                  {connection.status === 'connected' ? 'Conectado' : 
                   connection.status === 'error' ? 'Error' : 'Desconectado'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tiempo de respuesta:</span>
                <span className={`text-sm font-medium ${getResponseTimeColor(connection.responseTime)}`}>
                  {connection.responseTime > 0 ? `${connection.responseTime}ms` : 'N/A'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Variables monitoreadas:</span>
                <span className="text-sm font-medium text-gray-900">
                  {connection.variablesCount}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Última actividad:</span>
                <span className="text-sm text-gray-500">
                  {connection.lastSeen}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-md text-sm hover:bg-blue-200 transition-colors">
                  Ver Detalles
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm hover:bg-gray-200 transition-colors">
                  Configurar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Resumen del Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {connections.length}
            </div>
            <div className="text-sm text-gray-600">Total PLCs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {connections.filter(c => c.status === 'connected').length}
            </div>
            <div className="text-sm text-gray-600">Conectados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {connections.filter(c => c.status === 'error').length}
            </div>
            <div className="text-sm text-gray-600">Con Errores</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {connections.reduce((sum, c) => sum + c.variablesCount, 0)}
            </div>
            <div className="text-sm text-gray-600">Variables Totales</div>
          </div>
        </div>
      </div>
    </div>
  );
}
