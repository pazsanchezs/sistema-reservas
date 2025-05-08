require('dotenv').config(); // Añadir para manejo de variables de entorno
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan'); // Nuevo: Para logging de requests
const { Sequelize } = require('sequelize');
const app = express();

// Configuración de middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // Configurable por entorno
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev')); // Logging de requests en desarrollo

// Conexión a la base de datos
const sequelize = new Sequelize(
  process.env.DB_NAME || 'sistema_reservas_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASS || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test de conexión a la BD
sequelize.authenticate()
  .then(() => console.log('Conexión a la base de datos establecida'))
  .catch(err => console.error('Error al conectar a la base de datos:', err));


  app.use('/hoteles', require('./routes/hoteles'));
  app.use('/habitaciones', require('./routes/habitaciones'));
  app.use('/clientes', require('./routes/clientes'));
  const reservasRouter = require('./routes/reservas');
  app.use('/reservas', reservasRouter);
    

// Ruta de estado del servidor
app.get('/status', (req, res) => {
  res.json({
    status: 'OK',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: 'API de Reservas de Hotel',
    version: '1.0.0',
    docs: '/api-docs'
  });
});

// Manejo de errores 404
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    path: req.originalUrl
  });
});

// Manejo centralizado de errores
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.stack);
  
  const status = err.status || 500;
  const response = {
    error: err.message || 'Error interno del servidor'
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
    response.details = err.details;
  }

  res.status(status).json(response);
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
});

// Manejo de cierre elegante
process.on('SIGTERM', () => {
  console.log('Apagando servidor...');
  server.close(() => {
    console.log('Servidor apagado');
    process.exit(0);
  });
});

module.exports = app; // Para testing