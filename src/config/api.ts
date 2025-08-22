export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  ENDPOINTS: {
    PLC: {
      CONNECT: '/api/plc/connect',
      DISCONNECT: '/api/plc/disconnect',
      READ_ALL: '/api/plc/read-all',
      READ_SPECIFIC: '/api/plc/read-specific',
      READ_VARIABLE: '/api/plc/read',
      VARIABLES_INFO: '/api/plc/variables/info',
      CONNECTIONS_STATUS: '/api/plc/connections/status',
      HEALTH: '/api/plc/health',
      HEALTH_DETAILED: '/api/plc/health/detailed',
      VALIDATE_CONNECTION: '/api/plc/validate-connection',
    },
  },
};

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
