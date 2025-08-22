'use client';

import { useState } from 'react';

interface PlcVariablesReaderProps {
  connectionInfo: {
    ip: string;
    rack: number;
    slot: number;
  } | null;
}

interface PlcVariable {
  name: string;
  address: string;
  dataType: string;
  value: any;
  timestamp: string;
}

export default function PlcVariablesReader({ connectionInfo }: PlcVariablesReaderProps) {
  const [variables, setVariables] = useState<PlcVariable[]>([]);
  const [isReading, setIsReading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newVariable, setNewVariable] = useState({
    name: '',
    address: '',
    dataType: 'DB',
  });

  const dataTypes = ['DB', 'M', 'I', 'Q', 'T', 'C'];

  const handleAddVariable = () => {
    if (!newVariable.name || !newVariable.address) return;

    const variable: PlcVariable = {
      name: newVariable.name,
      address: newVariable.address,
      dataType: newVariable.dataType,
      value: 'N/A',
      timestamp: new Date().toLocaleString(),
    };

    setVariables(prev => [...prev, variable]);
    setNewVariable({ name: '', address: '', dataType: 'DB' });
  };

  const handleRemoveVariable = (index: number) => {
    setVariables(prev => prev.filter((_, i) => i !== index));
  };

  const handleReadVariables = async () => {
    if (!connectionInfo) {
      setError('Debes estar conectado a un PLC para leer variables');
      return;
    }

    setIsReading(true);
    setError(null);

    try {
      // Aquí iría la lógica real de lectura de variables del PLC
      // Por ahora simulamos la lectura
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedVariables = variables.map(variable => ({
        ...variable,
        value: Math.random() > 0.5 ? Math.floor(Math.random() * 100) : 'Error',
        timestamp: new Date().toLocaleString(),
      }));

      setVariables(updatedVariables);
    } catch (err) {
      setError('Error al leer variables del PLC');
    } finally {
      setIsReading(false);
    }
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
        Lectura de Variables PLC
      </h2>

      {/* Add New Variable Form */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Agregar Nueva Variable</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Nombre de la variable"
            value={newVariable.name}
            onChange={(e) => setNewVariable(prev => ({ ...prev, name: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Dirección (ej: DB1.DBW0)"
            value={newVariable.address}
            onChange={(e) => setNewVariable(prev => ({ ...prev, address: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={newVariable.dataType}
            onChange={(e) => setNewVariable(prev => ({ ...prev, dataType: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {dataTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <button
            onClick={handleAddVariable}
            disabled={!newVariable.name || !newVariable.address}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Agregar
          </button>
        </div>
      </div>

      {/* Variables List */}
      {variables.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-700">
              Variables Configuradas ({variables.length})
            </h3>
            <button
              onClick={handleReadVariables}
              disabled={isReading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isReading ? 'Leyendo...' : 'Leer Variables'}
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Variable
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
                    Última Lectura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {variables.map((variable, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {variable.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {variable.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {variable.dataType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        variable.value === 'Error' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {variable.value}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {variable.timestamp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleRemoveVariable(index)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {variables.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            No hay variables configuradas
          </h3>
          <p className="text-gray-500">
            Agrega variables usando el formulario de arriba para comenzar a monitorear
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
