const { Habitacion, Hotel, Reserva } = require('../models');
const { Op } = require('sequelize');

const crearHabitacion = async (req, res) => {
  try {
    const { numero, hotelId, posX, posY, piso, capacidad } = req.body;
    
    // Validación manual adicional
    if (!numero || !hotelId || posX === undefined || posY === undefined || !piso || !capacidad) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos: numero, hotelId, posX, posY, piso, capacidad' 
      });
    }

    // Verificar existencia del hotel
    const hotel = await Hotel.findByPk(hotelId);
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel no encontrado' });
    }

    // Verificar duplicados
    const existe = await Habitacion.findOne({ where: { numero, hotelId } });
    if (existe) {
      return res.status(409).json({ 
        error: 'Ya existe una habitación con este número en el hotel' 
      });
    }

    const habitacion = await Habitacion.create({
      numero,
      hotelId,
      posicion_x: posX,
      posicion_y: posY,
      piso,
      capacidad,
      caracteristicas: req.body.caracteristicas || ''
    });

    res.status(201).json(habitacion);
  } catch (error) {
    console.error('Error en crearHabitacion:', error);
    res.status(500).json({ 
      error: 'Error al crear habitación',
      detalles: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const obtenerHabitaciones = async (req, res) => {
  try {
    const { hotelId } = req.query;
    const whereClause = {};
    
    if (hotelId) {
      if (isNaN(hotelId)) {
        return res.status(400).json({ error: 'ID de hotel inválido' });
      }
      whereClause.hotelId = parseInt(hotelId);
    }

    const habitaciones = await Habitacion.findAll({
      where: whereClause,
      include: [{
        model: Hotel,
        as: 'hotel',
        attributes: ['nombre']
      }],
      order: [['piso', 'ASC'], ['numero', 'ASC']]
    });

    res.json(habitaciones);
  } catch (error) {
    console.error('Error en obtenerHabitaciones:', error);
    res.status(500).json({ 
      error: 'Error al obtener habitaciones',
      detalles: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  crearHabitacion,
  obtenerHabitaciones
};