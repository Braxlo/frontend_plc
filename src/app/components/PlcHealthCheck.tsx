'use client';

import { useState, useEffect } from 'react';

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

  // Simular servicios del sistema
  useEffect(() => {
    const mockServices: ServiceHealth[] = [
      {
        name: 'PLC Communication Service',
        status: 'healthy',
        responseTime: 25,
        lastCheck: new Date().toLocaleString(),
        details: 'Servicio funcionando correctamente',
      },
      {
        name: 'Database Connection',
        status: 'healthy',
        responseTime: 15,
        lastCheck: new Date().toLocaleString(),
        details: 'Conexión estable a la base de datos',
      },
      {
        name: 'WebSocket Gateway',
        status: 'warning',
        responseTime: 120,
        lastCheck: new Date().toLocaleString(),
        details: 'Respuesta lenta, monitoreando',
      },
      {
        name: 'Variable Logger',
        status: 'healthy',
        responseTime: 45,
        lastCheck: new Date().toLocaleString(),
        details: 'Logging de variables activo',
      },
      {
        name: 'Authentication Service',
        status: 'healthy',
        responseTime: 30,
        lastCheck: new Date().toLocaleString(),
        details: 'Autenticación funcionando',
      },
    ];

    setServices(mockServices);
  }, []);

  // Simular métricas del sistema
  useEffect(() => {
    const updateMetrics = () => {
      setMetrics({
        cpuUsage: Math.floor(Math.random() * 30) + 20, // 20-50%
        memoryUsage: Math.floor(Math.random() * 20) + 60, // 60-80%
        diskUsage: Math.floor(Math.random() * 15) + 45, // 45-60%
        networkLatency: Math.floor(Math.random() * 20) + 10, // 10-30ms
        activeConnections: Math.floor(Math.random() * 5) + 8, // 8-13
      });
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 10000); // Actualizar cada 10s

    return () => clearInterval(interval);
  }, []);

  const performHealthCheck = async () => {
    setIsChecking(true);
    
    try {
      // Simular verificación de salud
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setServices(prev => prev.map(service => ({
        ...service,
        lastCheck: new Date().toLocaleString(),
        responseTime: service.status === 'healthy' ? 
          Math.floor(Math.random() * 50) + 20 : 
          Math.floor(Math.random() * 100) + 100,
      })));

      setLastSystemCheck(new Date().toLocaleString());
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
        Estado del Servicio PLC
      </h2>

      {/* Health Check Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={performHealthCheck}
            disabled={isChecking}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
            Estado de Servicios del Sistema
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
          💡 Recomendaciones del Sistema
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
        </ul>
      </div>
    </div>
  );
}
