'use client';

import { useState, useEffect } from 'react';
import { plcService, PlcConnection, PlcVariable, PlcVariableInfo } from '../../services/plcService';

interface PlcVariablesReaderProps {
  connectionInfo: PlcConnection | null;
}

export default function PlcVariablesReader({ connectionInfo }: PlcVariablesReaderProps) {
  const [variables, setVariables] = useState<PlcVariable[]>([]);
  const [variablesInfo, setVariablesInfo] = useState<PlcVariableInfo[]>([]);
  const [isReading, setIsReading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(5000); // 5 segundos por defecto

  // Cargar información de las variables disponibles al montar el componente
  useEffect(() => {
    loadVariablesInfo();
  }, []);

  // Auto-refresh cuando esté habilitado
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoRefresh && connectionInfo) {
      interval = setInterval(() => {
        readAllVariables();
      }, refreshInterval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoRefresh, refreshInterval, connectionInfo]);

  const loadVariablesInfo = async () => {
    try {
      const result = await plcService.getVariablesInfo();
      if (result.success) {
        setVariablesInfo(result.data.variables);
        // Inicializar las variables con valores vacíos
        const initialVariables = result.data.variables.map(info => ({
          name: info.name,
          description: info.description,
          value: 'N/A',
          type: info.type,
          unit: info.unit,
          timestamp: new Date(),
          isError: false,
          errorMessage: undefined,
        }));
        setVariables(initialVariables);
      }
    } catch (err) {
      setError('Error al cargar información de variables');
    }
  };

  const readAllVariables = async () => {
    if (!connectionInfo) {
      setError('Debes estar conectado a un PLC para leer variables');
      return;
    }

    setIsReading(true);
    setError(null);

    try {
      const result = await plcService.readAllVariables(connectionInfo);
      
      if (result.success) {
        setVariables(result.data.variables);
      } else {
        setError(result.message || 'Error al leer variables del PLC');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al leer variables del PLC');
    } finally {
      setIsReading(false);
    }
  };

  const readSpecificVariables = async (variableNames: string[]) => {
    if (!connectionInfo) {
      setError('Debes estar conectado a un PLC para leer variables');
      return;
    }

    setIsReading(true);
    setError(null);

    try {
      const result = await plcService.readSpecificVariables(connectionInfo, variableNames);
      
      if (result.success) {
        // Actualizar solo las variables leídas
        setVariables(prev => {
          const updated = [...prev];
          result.data.variables.forEach(newVar => {
            const index = updated.findIndex(v => v.name === newVar.name);
            if (index !== -1) {
              updated[index] = newVar;
            }
          });
          return updated;
        });
      } else {
        setError(result.message || 'Error al leer variables específicas del PLC');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al leer variables específicas del PLC');
    } finally {
      setIsReading(false);
    }
  };

  const handleRefreshIntervalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    setRefreshInterval(value);
  };

  if (!connectionInfo) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-6xl mb-4">🔌</div>
        <h3 className="text-xl font-medium text-gray-600 mb-2">
          No hay conexión activa
        </h3>
        <p className="text-gray-500">
          Conéctate a un PLC desde la pestaña de conexión para poder leer variables
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Variables del PLC S7-1200
      </h2>

      {/* Controles de lectura */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={readAllVariables}
            disabled={isReading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isReading ? 'Leyendo...' : 'Leer Todas las Variables'}
          </button>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="autoRefresh"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="autoRefresh" className="text-sm font-medium text-gray-700">
              Auto-refresh
            </label>
          </div>

          {autoRefresh && (
            <select
              value={refreshInterval}
              onChange={handleRefreshIntervalChange}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={2000}>2 segundos</option>
              <option value={5000}>5 segundos</option>
              <option value={10000}>10 segundos</option>
              <option value={30000}>30 segundos</option>
            </select>
          )}
        </div>
      </div>

      {/* Variables List */}
      {variables.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variable
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dirección
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Lectura
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {variables.map((variable, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {variable.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                    {variable.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {variablesInfo.find(info => info.name === variable.name)?.address || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {variable.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      variable.isError 
                        ? 'bg-red-100 text-red-800' 
                        : variable.value === 'N/A'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {variable.isError ? 'Error' : variable.value}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {variable.unit || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {variable.timestamp.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {variable.isError ? (
                      <span className="text-red-600 text-xs" title={variable.errorMessage}>
                        ❌ Error
                      </span>
                    ) : (
                      <span className="text-green-600 text-xs">✅ OK</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {variables.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            No hay variables disponibles
          </h3>
          <p className="text-gray-500">
            Las variables del PLC S7-1200 se cargarán automáticamente
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mt-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Información de las variables */}
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h3 className="font-medium text-blue-800 mb-2">Variables del PLC S7-1200</h3>
        <p className="text-blue-700 text-sm mb-2">
          Este sistema está configurado para leer las siguientes variables del PLC S7-1200:
        </p>
        <ul className="text-blue-700 text-sm space-y-1">
          <li><strong>FechaHora:</strong> P#DB51.DBX164.0 - Estado de fecha y hora</li>
          <li><strong>VB:</strong> %DB1.DBD24 - Voltaje de batería (V)</li>
          <li><strong>CB:</strong> %DB1.DBW28 - Corriente de batería (A)</li>
          <li><strong>SW:</strong> %DB1.DBW50 - Solar Watt (W)</li>
          <li><strong>ET:</strong> %DB1.DBW16 - Energía total (J)</li>
          <li><strong>PT:</strong> %DB1.DBW18 - Potencia total (W)</li>
          <li><strong>VS:</strong> %DB1.DBD36 - Voltaje solar (V)</li>
          <li><strong>CS:</strong> %DB1.DBW34 - Corriente solar (A)</li>
        </ul>
      </div>
    </div>
  );
}
