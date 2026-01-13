import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import vehicleRoutes from './routes/vehicleRoutes';
import driverRoutes from './routes/driverRoutes';
import clientRoutes from './routes/clientRoutes'; 
import routeRoutes from './routes/routeRoutes';

// Configuración de variables de entorno
dotenv.config();

// Inicializar la aplicación Express
const app = express();
const PORT = process.env.PORT || 3001; // Usaremos el puerto 3001 para el backend

// Middlewares (Configuraciones intermedias)
app.use(cors()); // Permite conexiones externas (como desde tu Frontend)
app.use(express.json()); // Permite recibir datos en formato JSON

app.use('/api/vehicles', vehicleRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/routes', routeRoutes);

// Ruta de prueba (Health Check)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor Logístico funcionando correctamente 🚛',
    timestamp: new Date()
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor Backend corriendo en: http://localhost:${PORT}`);
  console.log(`🏥 Health Check disponible en: http://localhost:${PORT}/api/health\n`);
});