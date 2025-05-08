const express = require('express');
const router = express.Router();
const habitacionesController = require('../controllers/habitacionesController');

// POST /habitaciones
router.post('/', habitacionesController.crearHabitacion);

// GET /habitaciones
router.get('/', habitacionesController.obtenerHabitaciones);

module.exports = router;