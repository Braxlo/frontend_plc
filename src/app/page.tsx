'use client';

import { useState } from 'react';
import PlcConnectionForm from './components/PlcConnectionForm';
import PlcVariablesReader from './components/PlcVariablesReader';
import PlcStatusMonitor from './components/PlcStatusMonitor';
import PlcHealthCheck from './components/PlcHealthCheck';
import { PlcConnection } from '../services/plcService';

export default function Home() {
  const [activeTab, setActiveTab] = useState('connection');
  const [connectionInfo, setConnectionInfo] = useState<PlcConnection | null>(null);

  const tabs = [
    { id: 'connection', label: 'Conexión PLC S7-1200', icon: '🔌' },
    { id: 'variables', label: 'Variables PLC', icon: '📊' },
    { id: 'status', label: 'Estado Conexiones', icon: '📈' },
    { id: 'health', label: 'Estado Servicio', icon: '💚' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🏭 PLC S7-1200 Interface
          </h1>
          <p className="text-gray-600 text-lg">
            Interfaz para monitorear variables del PLC Siemens S7-1200
          </p>
        </div>

        {/* Connection Info Banner */}
        {connectionInfo && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-800 font-medium">
                  Conectado a PLC S7-1200: {connectionInfo.ip} (Rack: {connectionInfo.rack}, Slot: {connectionInfo.slot})
                </span>
              </div>
              <button
                onClick={() => setConnectionInfo(null)}
                className="text-green-600 hover:text-green-800"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {activeTab === 'connection' && (
            <PlcConnectionForm onConnectionEstablished={setConnectionInfo} />
          )}
          {activeTab === 'variables' && (
            <PlcVariablesReader connectionInfo={connectionInfo} />
          )}
          {activeTab === 'status' && <PlcStatusMonitor />}
          {activeTab === 'health' && <PlcHealthCheck />}
        </div>
      </div>
    </div>
  );
}
