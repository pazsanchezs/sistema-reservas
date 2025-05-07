const express = require('express');
const { Hotel } = require('../models');
const router = express.Router();

// Obtener todos los hoteles
router.get('/', async (req, res) => {
  try {
    const hoteles = await Hotel.findAll();
    res.json(hoteles);
  } catch (error) {
    res.status(500).json({ error: 'Hubo un problema al obtener los hoteles' });
  }
});

// Crear un nuevo hotel
router.post('/', async (req, res) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(201).json(hotel);
  } catch (error) {
    res.status(500).json({ error: 'Hubo un problema al crear el hotel' });
  }
});

module.exports = router;
