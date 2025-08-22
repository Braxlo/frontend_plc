# 🏭 PLC Testing Interface

Una interfaz web moderna y funcional para probar la comunicación con PLCs Siemens a través del backend PLC.

## ✨ Características

- **🔌 Conexión PLC**: Establece y gestiona conexiones a PLCs Siemens
- **📊 Lectura de Variables**: Lee todas las variables o variables específicas del PLC
- **📈 Monitoreo de Estado**: Monitorea el estado de todas las conexiones activas
- **💚 Verificación de Salud**: Verifica el estado del servicio backend
- **🔄 Auto-refresh**: Actualización automática de datos con intervalos configurables
- **📱 Responsive**: Interfaz adaptada para dispositivos móviles y de escritorio

## 🚀 Instalación

### Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Backend PLC ejecutándose en `http://localhost:3000`

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd frontend-plc
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:3001
   ```

## 🎯 Uso

### 1. Conexión al PLC

1. Ve a la pestaña **"Conexión PLC"**
2. Ingresa la IP del PLC (ej: `192.168.1.100`)
3. Configura el rack y slot si es necesario
4. Haz clic en **"Probar Conexión"**
5. Una vez conectado, verás un banner verde confirmando la conexión

### 2. Lectura de Variables

1. Ve a la pestaña **"Lectura Variables"**
2. Selecciona las variables que deseas monitorear
3. Elige entre:
   - **"Leer Todas las Variables"**: Lee todas las variables disponibles
   - **"Leer Variables Seleccionadas"**: Lee solo las variables marcadas
4. Activa **"Auto-refresh"** para actualización automática
5. Los datos se muestran en una tabla organizada

### 3. Monitoreo de Estado

1. Ve a la pestaña **"Estado Conexiones"**
2. Visualiza el estado de todas las conexiones PLC activas
3. Cada conexión muestra:
   - Estado de conexión (Conectado/Desconectado)
   - IP, Rack y Slot
   - Última actividad
   - Contador de errores
   - Barra de salud de conexión

### 4. Verificación de Servicio

1. Ve a la pestaña **"Estado Servicio"**
2. Verifica que el backend esté funcionando correctamente
3. Monitorea:
   - Estado del servicio
   - Versión
   - Tiempo de actividad
   - Información del sistema

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_REFRESH_INTERVAL=5000
```

### Personalización de Estilos

Los estilos están basados en Tailwind CSS. Puedes personalizar:

- Colores en `tailwind.config.js`
- Estilos globales en `src/app/globals.css`
- Componentes individuales en `src/app/components/`

## 📱 Endpoints del Backend

La interfaz consume los siguientes endpoints:

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/plc/connect` | POST | Conectar a un PLC |
| `/plc/disconnect` | POST | Desconectar de un PLC |
| `/plc/read-all` | POST | Leer todas las variables |
| `/plc/read-specific` | POST | Leer variables específicas |
| `/plc/variables/info` | GET | Obtener información de variables |
| `/plc/connections/status` | GET | Estado de conexiones |
| `/plc/health` | GET | Estado del servicio |

## 🎨 Tecnologías Utilizadas

- **Frontend**: Next.js 15 + React 19
- **Estilos**: Tailwind CSS 4
- **Lenguaje**: TypeScript
- **Estado**: React Hooks
- **HTTP**: Fetch API nativa

## 🚨 Solución de Problemas

### Error de Conexión al Backend

1. Verifica que el backend esté ejecutándose en el puerto 3000
2. Comprueba que no haya problemas de firewall
3. Revisa los logs del backend

### Variables No Se Muestran

1. Asegúrate de estar conectado al PLC
2. Verifica que las variables existan en el PLC
3. Revisa la configuración de rack y slot

### Interfaz No Responde

1. Verifica la consola del navegador para errores
2. Asegúrate de que todas las dependencias estén instaladas
3. Reinicia el servidor de desarrollo

## 📝 Estructura del Proyecto

```
frontend-plc/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── PlcConnectionForm.tsx
│   │   │   ├── PlcVariablesReader.tsx
│   │   │   ├── PlcStatusMonitor.tsx
│   │   │   └── PlcHealthCheck.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── ...
├── package.json
├── tailwind.config.js
└── README.md
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes preguntas o problemas:

1. Revisa la documentación del backend
2. Abre un issue en el repositorio
3. Contacta al equipo de desarrollo

---

**¡Disfruta probando tu PLC con esta interfaz moderna y funcional! 🚀**
