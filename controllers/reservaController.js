const { Habitacion, Reserva, Hotel, Cliente } = require('../models');
const { Op } = require('sequelize');

// Buscar habitaciones disponibles
const buscarDisponibles = async (req, res) => {
  try {
    const { fechaIngreso, fechaSalida, capacidad } = req.query;

    if (!fechaIngreso || !fechaSalida) {
      return res.status(400).json({ error: 'Debe ingresar fecha de ingreso y salida' });
    }

    const reservas = await Reserva.findAll({
      where: {
        [Op.or]: [
          {
            fechaIngreso: { [Op.lt]: fechaSalida },
            fechaSalida: { [Op.gt]: fechaIngreso }
          }
        ]
      },
      attributes: ['HabitacionId']
    });

    const habitacionesOcupadas = reservas.map(r => r.HabitacionId);

    const whereHabitacion = {
      id: { [Op.notIn]: habitacionesOcupadas }
    };

    if (capacidad) {
      whereHabitacion.capacidad = { [Op.gte]: parseInt(capacidad) };
    }

    const disponibles = await Habitacion.findAll({
      where: whereHabitacion,
      include: [{ model: Hotel, attributes: ['nombre'] }]
    });

    res.json(disponibles);
  } catch (error) {
    console.error('Error al buscar habitaciones disponibles:', error);
    res.status(500).json({ error: 'Error al buscar habitaciones disponibles' });
  }
};

// Buscar o registrar cliente
const buscarORegistrarCliente = async (cedula, nombre, apellido) => {
  let cliente = await Cliente.findOne({ where: { cedula } });
  if (!cliente) {
    cliente = await Cliente.create({ cedula, nombre, apellido });
  }
  return cliente;
};

// Obtener reservas (corregido: uso de mayúsculas y eliminación de duplicado)
const obtenerReservas = async (req, res) => {
  try {
    const reservas = await Reserva.findAll({
      include: [
        {
          model: Cliente,
          attributes: ['cedula', 'nombre', 'apellido']
        },
        {
          model: Habitacion,
          attributes: ['numero', 'piso', 'capacidad']
        },
        {
          model: Hotel,
          attributes: ['nombre']
        }
      ]
    });
    res.json(reservas);
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
};

// Crear reserva
const crearReserva = async (req, res) => {
  try {
    const {
      HotelId,
      HabitacionId,
      fechaIngreso,
      fechaSalida,
      cantidadPersonas,
      cedula,
      nombre,
      apellido
    } = req.body;

    if (!HotelId || !HabitacionId || !fechaIngreso || !fechaSalida || !cedula) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const cliente = await buscarORegistrarCliente(cedula, nombre, apellido);

    const conflicto = await Reserva.findOne({
      where: {
        HabitacionId,
        fechaIngreso: { [Op.lt]: fechaSalida },
        fechaSalida: { [Op.gt]: fechaIngreso }
      }
    });

    if (conflicto) {
      return res.status(409).json({ error: 'La habitación ya está reservada en ese rango de fechas' });
    }

    const reserva = await Reserva.create({
      HotelId,
      HabitacionId,
      ClienteId: cliente.id,
      fechaIngreso,
      fechaSalida,
      cantidadPersonas
    });

    res.status(201).json(reserva);
  } catch (error) {
    console.error('Error al crear reserva:', error);
    res.status(500).json({ error: 'Error al crear la reserva' });
  }
};

module.exports = {
  buscarDisponibles,
  crearReserva,
  obtenerReservas
};
