export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  ENDPOINTS: {
    PLC: {
      CONNECT: '/plc/connect',
      DISCONNECT: '/plc/disconnect',
      READ_ALL: '/plc/read-all',
      READ_SPECIFIC: '/plc/read-specific',
      READ_VARIABLE: '/plc/read',
      VARIABLES_INFO: '/plc/variables/info',
      CONNECTIONS_STATUS: '/plc/connections/status',
      HEALTH: '/plc/health',
      HEALTH_DETAILED: '/plc/health/detailed',
      VALIDATE_CONNECTION: '/plc/validate-connection',
    },
  },
};

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
