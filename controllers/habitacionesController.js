const { Habitacion, Hotel, Reserva } = require('../models');
const { Op } = require('sequelize');

const crearHabitacion = async (req, res) => {
  try {
    // Destructuring con las claves correctas, HotelId en mayúsculas
    const { numero, HotelId, posicion_x, posicion_y, piso, capacidad } = req.body;

    // Validación manual adicional
    if (!numero || !HotelId || posicion_x === undefined || posicion_y === undefined || !piso || !capacidad) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos: numero, HotelId, posicion_x, posicion_y, piso, capacidad' 
      });
    }

    // Verificar existencia del hotel
    const hotel = await Hotel.findByPk(HotelId); // Usar HotelId en lugar de hotelId
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel no encontrado' });
    }

    // Verificar duplicados
    const existe = await Habitacion.findOne({ where: { numero, HotelId } }); // Usar HotelId en lugar de hotelId
    if (existe) {
      return res.status(409).json({ 
        error: 'Ya existe una habitación con este número en el hotel' 
      });
    }

    // Crear la habitación
    const habitacion = await Habitacion.create({
      numero,
      HotelId,  // Usar HotelId en lugar de hotelId
      posicion_x: posicion_x,
      posicion_y: posicion_y,
      piso,
      capacidad,
      caracteristicas: req.body.caracteristicas || ''
    });

    // Responder con la habitación creada
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
