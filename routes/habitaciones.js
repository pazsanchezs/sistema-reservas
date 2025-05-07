const express = require('express');
const router = express.Router();
const habitacionController = require('../controllers/habitacionController');

// POST /habitaciones
router.post('/', habitacionController.crearHabitacion);

// GET /habitaciones
router.get('/', habitacionController.obtenerHabitaciones);

module.exports = router;