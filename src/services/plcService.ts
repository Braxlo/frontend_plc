import { API_CONFIG, getApiUrl } from '../config/api';

export interface PlcConnection {
  ip: string;
  rack: number;
  slot: number;
}

export interface PlcVariable {
  name: string;
  description: string;
  value: any;
  type: string;
  unit?: string;
  timestamp: Date;
  isError: boolean;
  errorMessage?: string;
}

export interface PlcVariableInfo {
  name: string;
  description: string;
  address: string;
  type: string;
  unit: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

class PlcService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = getApiUrl(endpoint);
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(`Error en la petición: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async connectToPlc(connection: PlcConnection): Promise<ApiResponse<any>> {
    return this.makeRequest(API_CONFIG.ENDPOINTS.PLC.CONNECT, {
      method: 'POST',
      body: JSON.stringify(connection),
    });
  }

  async disconnectFromPlc(connection: PlcConnection): Promise<ApiResponse<any>> {
    return this.makeRequest(API_CONFIG.ENDPOINTS.PLC.DISCONNECT, {
      method: 'POST',
      body: JSON.stringify(connection),
    });
  }

  async readAllVariables(connection: PlcConnection): Promise<ApiResponse<{ variables: PlcVariable[] }>> {
    return this.makeRequest(API_CONFIG.ENDPOINTS.PLC.READ_ALL, {
      method: 'POST',
      body: JSON.stringify(connection),
    });
  }

  async readSpecificVariables(connection: PlcConnection, variableNames: string[]): Promise<ApiResponse<{ variables: PlcVariable[] }>> {
    return this.makeRequest(API_CONFIG.ENDPOINTS.PLC.READ_SPECIFIC, {
      method: 'POST',
      body: JSON.stringify({
        ...connection,
        variables: variableNames,
      }),
    });
  }

  async getVariablesInfo(): Promise<ApiResponse<{ variables: PlcVariableInfo[] }>> {
    return this.makeRequest(API_CONFIG.ENDPOINTS.PLC.VARIABLES_INFO, {
      method: 'GET',
    });
  }

  async getConnectionStatus(): Promise<ApiResponse<{ connections: any[] }>> {
    return this.makeRequest(API_CONFIG.ENDPOINTS.PLC.CONNECTIONS_STATUS, {
      method: 'GET',
    });
  }

  async getHealth(): Promise<any> {
    return this.makeRequest(API_CONFIG.ENDPOINTS.PLC.HEALTH, {
      method: 'GET',
    });
  }

  async validateConnection(connection: PlcConnection): Promise<ApiResponse<any>> {
    return this.makeRequest('/api/plc/validate-connection', {
      method: 'POST',
      body: JSON.stringify(connection),
    });
  }
}

export const plcService = new PlcService();
