const { Reserva, Habitacion, Cliente, Hotel } = require('../models');
const { Op } = require('sequelize');

const crearReserva = async (req, res) => {
  try {
    const { fechaIngreso, fechaSalida, cantidadPersonas, ClienteId, HotelId, HabitacionId } = req.body;

    // Verificar que la habitación existe
    const habitacion = await Habitacion.findByPk(HabitacionId);
    if (!habitacion) {
      return res.status(404).json({ error: 'Habitación no encontrada' });
    }

    // Verificar capacidad
    if (cantidadPersonas > habitacion.capacidad) {
      return res.status(400).json({ 
        error: `La habitación solo tiene capacidad para ${habitacion.capacidad} personas` 
      });
    }

    // Verificar disponibilidad
    const existeReserva = await Reserva.findOne({
      where: {
        HabitacionId,
        [Op.or]: [
          {
            fechaIngreso: { [Op.between]: [fechaIngreso, fechaSalida] }
          },
          {
            fechaSalida: { [Op.between]: [fechaIngreso, fechaSalida] }
          },
          {
            [Op.and]: [
              { fechaIngreso: { [Op.lte]: fechaIngreso } },
              { fechaSalida: { [Op.gte]: fechaSalida } }
            ]
          }
        ]
      }
    });

    if (existeReserva) {
      return res.status(409).json({ 
        error: 'La habitación no está disponible para las fechas seleccionadas' 
      });
    }

    const reserva = await Reserva.create({
      fechaIngreso,
      fechaSalida,
      cantidadPersonas,
      ClienteId,
      hotelId,
      HabitacionId
    });

    res.status(201).json(reserva);
  } catch (error) {
    console.error('Error al crear reserva:', error);
    res.status(500).json({ 
      error: 'Error al crear reserva',
      detalles: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const obtenerReservas = async (req, res) => {
  try {
    const { hotelId, fechaIngreso, fechaSalida, ClienteId } = req.query;

    if (!hotelId || !fechaIngreso) {
      return res.status(400).json({ error: 'hotelId y fechaIngreso son obligatorios' });
    }

    const where = {
      hotelId,
      fechaIngreso: { [Op.gte]: fechaIngreso }
    };

    if (fechaSalida) {
      where.fechaSalida = { [Op.lte]: fechaSalida };
    }

    if (ClienteId) {
      where.ClienteId = ClienteId;
    }

    const reservas = await Reserva.findAll({
      where,
      include: [
        { model: Cliente },
        { model: Hotel },
        { model: Habitacion }
      ],
      order: [
        ['fechaIngreso', 'ASC'],
        [{ model: Habitacion }, 'piso', 'ASC'],
        [{ model: Habitacion }, 'numero', 'ASC']
      ]
    });

    res.json(reservas);
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    res.status(500).json({ 
      error: 'Error al obtener reservas',
      detalles: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


const buscarDisponibles = async (req, res) => {
  try {
    const { fechaIngreso, fechaSalida, capacidad, hotelId } = req.query;
    
    if (!fechaIngreso || !fechaSalida) {
      return res.status(400).json({ error: 'Las fechas de ingreso y salida son requeridas' });
    }

    // Obtener habitaciones ocupadas en el rango
    const reservas = await Reserva.findAll({
      where: {
        [Op.or]: [
          {
            fechaIngreso: { [Op.between]: [fechaIngreso, fechaSalida] }
          },
          {
            fechaSalida: { [Op.between]: [fechaIngreso, fechaSalida] }
          },
          {
            [Op.and]: [
              { fechaIngreso: { [Op.lte]: fechaIngreso } },
              { fechaSalida: { [Op.gte]: fechaSalida } }
            ]
          }
        ]
      },
      attributes: ['HabitacionId']
    });

    const ocupadas = reservas.map(r => r.HabitacionId);
    
    // Filtros para habitaciones disponibles
    const whereHabitacion = {
      id: { [Op.notIn]: ocupadas }
    };
    
    if (capacidad) whereHabitacion.capacidad = { [Op.gte]: capacidad };
    if (hotelId) whereHabitacion.hotelId = hotelId;

    const habitaciones = await Habitacion.findAll({
      where: whereHabitacion,
      include: [
        { model: Hotel, attributes: ['nombre', 'direccion'] }
      ]
    });

    res.json(habitaciones);
  } catch (error) {
    console.error('Error al buscar disponibilidad:', error);
    res.status(500).json({ 
      error: 'Error al buscar disponibilidad',
      detalles: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  crearReserva,
  obtenerReservas,
  buscarDisponibles
};