const express = require('express');
const { Reserva, Hotel, Habitacion, Cliente } = require('../models');
const router = express.Router();

// Obtener todas las reservas
router.get('/', async (req, res) => {
  try {
    const { hotel, entrada, salida } = req.query;
    let filter = {};
    
    if (hotel) filter.HotelId = hotel;
    if (entrada && salida) {
      filter.fechaIngreso = { [Op.gte]: new Date(entrada) };
      filter.fechaSalida = { [Op.lte]: new Date(salida) };
    }

    const reservas = await Reserva.findAll({
      where: filter,
      include: [
        { model: Hotel },
        { model: Habitacion },
        { model: Cliente }
      ]
    });
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: 'Hubo un problema al obtener las reservas' });
  }
});

// Crear una nueva reserva
router.post('/', async (req, res) => {
  try {
    const reserva = await Reserva.create(req.body);
    res.status(201).json(reserva);
  } catch (error) {
    res.status(500).json({ error: 'Hubo un problema al crear la reserva' });
  }
});

module.exports = router;
