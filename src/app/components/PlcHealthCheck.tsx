'use client';

import { useState, useEffect } from 'react';
import { plcService } from '../../services/plcService';

interface ServiceHealth {
  name: string;
  status: 'healthy' | 'warning' | 'error' | 'unknown';
  responseTime: number;
  lastCheck: string;
  details: string;
}

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkLatency: number;
  activeConnections: number;
}

export default function PlcHealthCheck() {
  const [services, setServices] = useState<ServiceHealth[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
    networkLatency: 0,
    activeConnections: 0,
  });
  const [isChecking, setIsChecking] = useState(false);
  const [lastSystemCheck, setLastSystemCheck] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Cargar estado inicial del sistema
  useEffect(() => {
    performHealthCheck();
  }, []);

  // Auto-actualización cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      performHealthCheck();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const performHealthCheck = async () => {
    setIsChecking(true);
    setError(null);
    
    try {
      // Verificar salud del servicio PLC
      const healthResult = await plcService.getHealth();
      
      if (healthResult.success) {
        // Actualizar servicios basado en la respuesta del backend
        const updatedServices: ServiceHealth[] = [
          {
            name: 'PLC Communication Service',
            status: 'healthy',
            responseTime: Math.floor(Math.random() * 30) + 20, // Simulado por ahora
            lastCheck: new Date().toLocaleString(),
            details: 'Servicio funcionando correctamente',
          },
          {
            name: 'PLC Variables Service',
            status: 'healthy',
            responseTime: Math.floor(Math.random() * 25) + 15,
            lastCheck: new Date().toLocaleString(),
            details: 'Servicio de variables funcionando',
          },
          {
            name: 'Connection Monitor',
            status: 'healthy',
            responseTime: Math.floor(Math.random() * 20) + 10,
            lastCheck: new Date().toLocaleString(),
            details: 'Monitor de conexiones activo',
          },
          {
            name: 'Health Service',
            status: 'healthy',
            responseTime: Math.floor(Math.random() * 15) + 5,
            lastCheck: new Date().toLocaleString(),
            details: 'Servicio de salud funcionando',
          },
          {
            name: 'Logger Service',
            status: 'healthy',
            responseTime: Math.floor(Math.random() * 20) + 10,
            lastCheck: new Date().toLocaleString(),
            details: 'Servicio de logging activo',
          },
        ];

        setServices(updatedServices);

        // Simular métricas del sistema (en un sistema real vendrían del backend)
        setMetrics({
          cpuUsage: Math.floor(Math.random() * 30) + 20, // 20-50%
          memoryUsage: Math.floor(Math.random() * 20) + 60, // 60-80%
          diskUsage: Math.floor(Math.random() * 15) + 45, // 45-60%
          networkLatency: Math.floor(Math.random() * 20) + 10, // 10-30ms
          activeConnections: Math.floor(Math.random() * 5) + 8, // 8-13
        });

        setLastSystemCheck(new Date().toLocaleString());
      } else {
        setError(healthResult.message || 'Error al verificar la salud del sistema');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al verificar la salud del sistema');
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return '🟢';
      case 'warning':
        return '🟡';
      case 'error':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const getMetricColor = (value: number, thresholds: { warning: number; error: number }) => {
    if (value >= thresholds.error) return 'text-red-600';
    if (value >= thresholds.warning) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Estado del Servicio PLC S7-1200
      </h2>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-6">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Health Check Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={performHealthCheck}
            disabled={isChecking}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isChecking ? 'Verificando...' : 'Verificar Salud del Sistema'}
          </button>
          
          <span className="text-sm text-gray-500">
            Última verificación: {lastSystemCheck || 'Nunca'}
          </span>
        </div>

        <div className="text-sm text-gray-500">
          Auto-actualización cada 10s
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className={`text-2xl font-bold ${getMetricColor(metrics.cpuUsage, { warning: 70, error: 85 })}`}>
            {metrics.cpuUsage}%
          </div>
          <div className="text-sm text-gray-600">CPU</div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className={`text-2xl font-bold ${getMetricColor(metrics.memoryUsage, { warning: 80, error: 90 })}`}>
            {metrics.memoryUsage}%
          </div>
          <div className="text-sm text-gray-600">Memoria</div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className={`text-2xl font-bold ${getMetricColor(metrics.diskUsage, { warning: 80, error: 90 })}`}>
            {metrics.diskUsage}%
          </div>
          <div className="text-sm text-gray-600">Disco</div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className={`text-2xl font-bold ${getMetricColor(metrics.networkLatency, { warning: 50, error: 100 })}`}>
            {metrics.networkLatency}ms
          </div>
          <div className="text-sm text-gray-600">Latencia</div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {metrics.activeConnections}
          </div>
          <div className="text-sm text-gray-600">Conexiones</div>
        </div>
      </div>

      {/* Service Health Status */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-700">
            Estado de Servicios del Sistema PLC
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {services.map((service, index) => (
            <div key={index} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getStatusIcon(service.status)}</span>
                  <div>
                    <h4 className="font-medium text-gray-900">{service.name}</h4>
                    <p className="text-sm text-gray-500">{service.details}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Tiempo de respuesta</div>
                    <div className="font-medium text-gray-900">{service.responseTime}ms</div>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(service.status)}`}>
                    {service.status === 'healthy' ? 'Saludable' : 
                     service.status === 'warning' ? 'Advertencia' : 
                     service.status === 'error' ? 'Error' : 'Desconocido'}
                  </span>
                </div>
              </div>
              
              <div className="mt-2 text-xs text-gray-500">
                Última verificación: {service.lastCheck}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Recommendations */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-800 mb-3">
          💡 Recomendaciones del Sistema PLC S7-1200
        </h3>
        <ul className="space-y-2 text-blue-700">
          <li className="flex items-start space-x-2">
            <span>•</span>
            <span>Monitorea regularmente el uso de CPU y memoria para detectar picos de actividad</span>
          </li>
          <li className="flex items-start space-x-2">
            <span>•</span>
            <span>Verifica la latencia de red si experimentas problemas de comunicación con PLCs</span>
          </li>
          <li className="flex items-start space-x-2">
            <span>•</span>
            <span>Revisa los logs del sistema si algún servicio muestra estado de advertencia o error</span>
          </li>
          <li className="flex items-start space-x-2">
            <span>•</span>
            <span>Mantén al menos 20% de espacio libre en disco para logs y datos temporales</span>
          </li>
          <li className="flex items-start space-x-2">
            <span>•</span>
            <span>Verifica que el PLC S7-1200 esté configurado correctamente con las variables predefinidas</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
