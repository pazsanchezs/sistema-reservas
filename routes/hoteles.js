const express = require('express');
const { Hotel } = require('../models');
const router = express.Router();

//console.log(' Rutas de hoteles cargadas');

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

// Actualizar un hotel existente
router.put('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id);
    if (hotel) {
      await hotel.update(req.body);
      res.json(hotel);
    } else {
      res.status(404).json({ error: 'Hotel no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Hubo un problema al actualizar el hotel' });
  }
});

// Eliminar un hotel
router.delete('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id);
    if (hotel) {
      await hotel.destroy();
      res.json({ message: 'Hotel eliminado correctamente' });
    } else {
      res.status(404).json({ error: 'Hotel no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Hubo un problema al eliminar el hotel' });
  }
});

module.exports = router;
