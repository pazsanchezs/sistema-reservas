const express = require('express');
const router = express.Router();
const habitacionesController = require('../controllers/habitacionesController');

// POST /habitaciones
router.post('/', habitacionesController.crearHabitacion);

// GET /habitaciones
router.get('/', habitacionesController.obtenerHabitaciones);

// Actualizar una habitación
router.put('/:id', habitacionesController.actualizarHabitacion);

// Eliminar una habitación
router.delete('/:id', habitacionesController.eliminarHabitacion);

module.exports = router;