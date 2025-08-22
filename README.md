# PLC S7-1200 Interface

Interfaz web para monitorear variables del PLC Siemens S7-1200 en tiempo real.

## 🚀 Características

- **Conexión PLC**: Establece conexión con PLCs S7-1200 usando el protocolo S7
- **Variables Predefinidas**: Monitorea 8 variables específicas del sistema solar/batería
- **Monitoreo en Tiempo Real**: Lectura automática de variables con auto-refresh configurable
- **Estado de Conexiones**: Visualización del estado de todas las conexiones PLC
- **Health Check**: Monitoreo del estado del servicio y métricas del sistema

## 🔌 Variables del PLC S7-1200

El sistema está configurado para leer las siguientes variables:

| Variable | Descripción | Dirección | Tipo | Unidad |
|----------|-------------|-----------|------|---------|
| **FechaHora** | Estado de fecha y hora | P#DB51.DBX164.0 | BOOL | - |
| **VB** | Voltaje de batería | %DB1.DBD24 | REAL | V |
| **CB** | Corriente de batería | %DB1.DBW28 | INT | A |
| **SW** | Solar Watt | %DB1.DBW50 | INT | W |
| **ET** | Energía total | %DB1.DBW16 | INT | J |
| **PT** | Potencia total | %DB1.DBW18 | INT | W |
| **VS** | Voltaje solar | %DB1.DBD36 | REAL | V |
| **CS** | Corriente solar | %DB1.DBW34 | INT | A |

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: NestJS, Node.js, TypeScript
- **Comunicación PLC**: Protocolo S7 usando node-snap7
- **Arquitectura**: API REST con comunicación en tiempo real

## 📋 Requisitos

- Node.js 18+ 
- PLC Siemens S7-1200 accesible por red
- Configuración correcta de las variables en el PLC

## 🚀 Instalación

### Backend

```bash
cd backend-plc
npm install
npm run build
npm run start:dev
```

### Frontend

```bash
cd frontend-plc
npm install
npm run dev
```

## ⚙️ Configuración

### Variables de Entorno Backend

```env
PORT=3000
CORS_ORIGIN=http://localhost:3001
PLC_CONNECTION_TIMEOUT=5000
PLC_MAX_RECONNECTION_ATTEMPTS=3
PLC_DEFAULT_RACK=0
PLC_DEFAULT_SLOT=1
```

### Variables de Entorno Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🔧 Uso

### 1. Conexión al PLC

1. Ve a la pestaña "Conexión PLC S7-1200"
2. Ingresa la IP del PLC
3. Configura Rack y Slot (por defecto: 0, 1)
4. Haz clic en "Conectar al PLC"

### 2. Monitoreo de Variables

1. Una vez conectado, ve a "Variables PLC"
2. Las variables se cargan automáticamente
3. Usa "Leer Todas las Variables" para actualizar valores
4. Activa "Auto-refresh" para monitoreo continuo

### 3. Estado de Conexiones

- Visualiza todas las conexiones activas
- Monitorea el estado de cada PLC
- Desconecta PLCs individualmente

### 4. Health Check

- Verifica el estado del servicio
- Monitorea métricas del sistema
- Revisa recomendaciones del sistema

## 📡 API Endpoints

### Conexión PLC
- `POST /plc/connect` - Conectar a PLC
- `POST /plc/disconnect` - Desconectar de PLC
- `POST /plc/validate-connection` - Validar conexión

### Variables
- `POST /plc/read-all` - Leer todas las variables
- `POST /plc/read-specific` - Leer variables específicas
- `GET /plc/variables/info` - Información de variables disponibles

### Estado del Sistema
- `GET /plc/connections/status` - Estado de conexiones
- `GET /plc/health` - Health check del servicio
- `GET /plc/health/detailed` - Health check detallado

## 🔍 Troubleshooting

### Problemas de Conexión

1. **Verifica la IP del PLC**: Asegúrate de que sea accesible desde la red
2. **Configuración de Rack/Slot**: Verifica que coincida con la configuración del PLC
3. **Firewall**: Asegúrate de que el puerto 102 (S7) esté abierto
4. **Variables del PLC**: Verifica que las variables estén configuradas correctamente

### Errores Comunes

- **"No se pudo conectar al PLC"**: Verifica conectividad de red y configuración
- **"Variables no encontradas"**: Verifica que las variables estén configuradas en el PLC
- **"Error de validación"**: Verifica que los bloques de datos DB1 y DB51 existan

## 📊 Monitoreo y Logs

El sistema incluye:
- Logs detallados de conexiones
- Métricas de rendimiento
- Monitoreo de errores
- Estadísticas de uso

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 📞 Soporte

Para soporte técnico o preguntas:
- Revisa la documentación del PLC S7-1200
- Consulta los logs del sistema
- Verifica la configuración de red
