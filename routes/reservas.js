const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');

// Obtener todas las reservas
router.get('/', reservaController.obtenerReservas);

// Buscar habitaciones disponibles
router.get('/disponibles', reservaController.buscarDisponibles);

// Crear nueva reserva
router.post('/', reservaController.crearReserva);

module.exports = router;
