'use client';

import { useState, useEffect } from 'react';
import { plcService, PlcConnection } from '../../services/plcService';

interface ConnectionStatus {
  ip: string;
  rack: number;
  slot: number;
  isConnected: boolean;
  lastSeen: string;
  responseTime: number;
  variablesCount: number;
}

export default function PlcStatusMonitor() {
  const [connections, setConnections] = useState<ConnectionStatus[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar estado de conexiones al montar el componente
  useEffect(() => {
    refreshConnections();
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
    setError(null);
    
    try {
      const result = await plcService.getConnectionStatus();
      
      if (result.success) {
        const connectionStatuses: ConnectionStatus[] = result.data.connections.map(conn => ({
          ip: conn.ip,
          rack: conn.rack,
          slot: conn.slot,
          isConnected: conn.isConnected,
          lastSeen: new Date().toLocaleString(),
          responseTime: conn.isConnected ? Math.floor(Math.random() * 50) + 20 : 0, // Simulado por ahora
          variablesCount: conn.isConnected ? 8 : 0, // 8 variables predefinidas del S7-1200
        }));
        
        setConnections(connectionStatuses);
      } else {
        setError(result.message || 'Error al obtener estado de conexiones');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener estado de conexiones');
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusColor = (isConnected: boolean) => {
    return isConnected 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getStatusIcon = (isConnected: boolean) => {
    return isConnected ? '🟢' : '🔴';
  };

  const getStatusText = (isConnected: boolean) => {
    return isConnected ? 'Conectado' : 'Desconectado';
  };

  const getResponseTimeColor = (time: number) => {
    if (time === 0) return 'text-gray-400';
    if (time < 50) return 'text-green-600';
    if (time < 100) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleDisconnect = async (connection: ConnectionStatus) => {
    try {
      const result = await plcService.disconnectFromPlc({
        ip: connection.ip,
        rack: connection.rack,
        slot: connection.slot,
      });
      
      if (result.success) {
        // Actualizar el estado local
        setConnections(prev => prev.map(conn => 
          conn.ip === connection.ip && conn.rack === connection.rack && conn.slot === connection.slot
            ? { ...conn, isConnected: false, variablesCount: 0 }
            : conn
        ));
      } else {
        setError(result.message || 'Error al desconectar del PLC');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al desconectar del PLC');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Estado de Conexiones PLC S7-1200
      </h2>

      {/* Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={refreshConnections}
            disabled={isRefreshing}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-6">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Connection Status Cards */}
      {connections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connections.map((connection, index) => (
            <div
              key={`${connection.ip}-${connection.rack}-${connection.slot}`}
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
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(connection.isConnected)}`}>
                    {getStatusIcon(connection.isConnected)} {getStatusText(connection.isConnected)}
                  </span>
                </div>
              </div>

              {/* Status Details */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Estado:</span>
                  <span className={`text-sm font-medium ${getStatusColor(connection.isConnected)}`}>
                    {getStatusText(connection.isConnected)}
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
                  {connection.isConnected ? (
                    <button 
                      onClick={() => handleDisconnect(connection)}
                      className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded-md text-sm hover:bg-red-200 transition-colors"
                    >
                      Desconectar
                    </button>
                  ) : (
                    <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm cursor-not-allowed opacity-50">
                      Desconectado
                    </button>
                  )}
                  <button className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-md text-sm hover:bg-blue-200 transition-colors">
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-400 text-6xl mb-4">🔌</div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            No hay conexiones activas
          </h3>
          <p className="text-gray-500">
            Conéctate a un PLC desde la pestaña de conexión para ver el estado
          </p>
        </div>
      )}

      {/* Summary Stats */}
      {connections.length > 0 && (
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Resumen del Sistema PLC S7-1200</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {connections.length}
              </div>
              <div className="text-sm text-gray-600">Total PLCs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {connections.filter(c => c.isConnected).length}
              </div>
              <div className="text-sm text-gray-600">Conectados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {connections.filter(c => !c.isConnected).length}
              </div>
              <div className="text-sm text-gray-600">Desconectados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {connections.reduce((sum, c) => sum + c.variablesCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Variables Totales</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
