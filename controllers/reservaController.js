const { Reserva, Habitacion, Cliente, Hotel } = require('../models');
const { Op } = require('sequelize');

const crearReserva = async (req, res) => {
  try {
    const { fechaIngreso, fechaSalida, cantidadPersonas, HotelId, HabitacionId, cedula, nombre, apellido } = req.body;

    console.log('Datos recibidos:', req.body);

    // Validar que las fechas estén definidas
    if (!fechaIngreso || !fechaSalida) {
      return res.status(400).json({ error: 'Las fechas de ingreso y salida son obligatorias' });
    }

    // Validar que fechaIngreso no sea anterior a hoy (sin horas)
   const hoy = new Date();
hoy.setUTCHours(0, 0, 0, 0);  // Usamos UTC para evitar problemas de zona horaria

const ingresoDate = new Date(fechaIngreso);
ingresoDate.setUTCHours(0, 0, 0, 0);

const salidaDate = new Date(fechaSalida);
salidaDate.setUTCHours(0, 0, 0, 0);

// Validación para permitir hoy
if (ingresoDate < hoy) {
  return res.status(400).json({ 
    error: 'La fecha de ingreso no puede ser anterior a hoy',
    detalles: {
      fechaIngreso: ingresoDate.toISOString(),
      hoy: hoy.toISOString()
    }
  });
}

// Validación de rango de fechas
if (salidaDate <= ingresoDate) {
  return res.status(400).json({ 
    error: 'La fecha de salida debe ser posterior a la de ingreso',
    detalles: {
      fechaIngreso: ingresoDate.toISOString(),
      fechaSalida: salidaDate.toISOString()
    }
  });
}

    // Verificar que el hotel existe
    const hotel = await Hotel.findByPk(HotelId);
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel no encontrado' });
    }

    // Verificar que la habitación existe y pertenece al hotel
    const habitacion = await Habitacion.findOne({
      where: {
        id: HabitacionId,
        HotelId: HotelId
      }
    });
    if (!habitacion) {
      return res.status(404).json({ error: 'Habitación no encontrada en este hotel' });
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
        [Op.and]: [
          { fechaIngreso: { [Op.lte]: fechaSalida } },
          { fechaSalida: { [Op.gt]: fechaIngreso } }
        ]
      }
    });

    if (existeReserva) {
      return res.status(409).json({
        error: 'La habitación no está disponible para las fechas seleccionadas'
      });
    }

    // Buscar o crear cliente
    let cliente = await Cliente.findOne({ where: { cedula } });
    if (!cliente) {
      if (!nombre || !apellido) {
        return res.status(400).json({ 
          error: 'Para clientes nuevos, nombre y apellido son requeridos. Por favor complete el formulario.'
        });
      }
      cliente = await Cliente.create({
        cedula,
        nombre,
        apellido
      });
    }

    // Guardar fechas sin conversión a ISO para evitar desfase de zona horaria
    const fechaIngresoSolo = fechaIngreso;
    const fechaSalidaSolo = fechaSalida;
    console.log('fechaIngreso original:', fechaIngreso);
console.log('fechaSalida original:', fechaSalida);
console.log('fechaIngresoSolo:', fechaIngresoSolo);
console.log('fechaSalidaSolo:', fechaSalidaSolo);


    // Crear la reserva con los nombres correctos de los campos
    const reserva = await Reserva.create({
      fechaIngreso: fechaIngresoSolo,
      fechaSalida: fechaSalidaSolo,
      cantidadPersonas,
      ClienteId: cliente.id,
      HotelId,
      HabitacionId
    });

    // Obtener datos completos para la respuesta
    const reservaCompleta = await Reserva.findByPk(reserva.id, {
      include: [
        { model: Cliente },
        { model: Hotel },
        { 
          model: Habitacion,
          include: [{ model: Hotel, as: 'hotel' }]
        }
      ]
    });

    res.status(201).json({
      mensaje: "Reserva creada con éxito",
      reserva: {
        id: reservaCompleta.id,
        fechaIngreso: reservaCompleta.fechaIngreso,
        fechaSalida: reservaCompleta.fechaSalida,
        cantidadPersonas: reservaCompleta.cantidadPersonas,
        cliente: {
          cedula: reservaCompleta.Cliente.cedula,
          nombre: reservaCompleta.Cliente.nombre,
          apellido: reservaCompleta.Cliente.apellido
        },
        hotel: {
          id: reservaCompleta.Hotel.id,
          nombre: reservaCompleta.Hotel.nombre
        },
        habitacion: {
          id: reservaCompleta.Habitacion.id,
          numero: reservaCompleta.Habitacion.numero,
          piso: reservaCompleta.Habitacion.piso,
          capacidad: reservaCompleta.Habitacion.capacidad,
          caracteristicas: reservaCompleta.Habitacion.caracteristicas
        }
      }
    });
  } 
  catch (error) {
    console.error('Error al crear reserva:', error);
    res.status(500).json({ error: error.message || 'Error al crear reserva' });
  }
};



const obtenerReservas = async (req, res) => {
  try {
    const { HotelId, fechaIngreso, fechaSalida, ClienteId, cedula } = req.query;

    if (!HotelId || !fechaIngreso) {
      return res.status(400).json({ error: 'HotelId y fechaIngreso son obligatorios' });
    }

    const where = {
      HotelId,
      fechaIngreso: { [Op.gte]: fechaIngreso }
    };

    if (fechaSalida) {
      where.fechaSalida = { [Op.lte]: fechaSalida };
    }

    // Si viene cedula, buscar cliente y usar su id para filtrar
    if (cedula) {
      const cliente = await Cliente.findOne({ where: { cedula } });
      if (!cliente) {
        // No hay cliente con esa cédula, devolver array vacío
        return res.json([]);
      }
      where.ClienteId = cliente.id;
    } else if (ClienteId) {
      where.ClienteId = ClienteId;
    }

    const reservas = await Reserva.findAll({
      where,
      include: [
        { model: Cliente, attributes: ['cedula', 'nombre', 'apellido'] },
        { model: Hotel,attributes: ['nombre'] },
        { 
          model: Habitacion,
          attributes: ['numero', 'piso', 'capacidad', 'caracteristicas'],
          include: [{ model: Hotel, as: 'hotel', attributes: ['nombre'] }]
        }
      ],
      order: [
        ['fechaIngreso', 'ASC'],
        [{ model: Habitacion }, 'piso', 'ASC'],
        [{ model: Habitacion }, 'numero', 'ASC']
      ]
    });

    res.json(reservas.map(reserva => ({
      id: reserva.id,
      fechaIngreso: reserva.fechaIngreso,
      fechaSalida: reserva.fechaSalida,
      cantidadPersonas: reserva.cantidadPersonas,
      cliente: reserva.Cliente,
      hotel: reserva.Hotel,
      habitacion: {
        ...reserva.Habitacion.toJSON(),
        hotel: reserva.Habitacion.hotel
      }
    })));
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
    const { fechaIngreso, fechaSalida, capacidad, HotelId } = req.query;
    
    // Validaciones básicas
    if (!fechaIngreso || !fechaSalida || !HotelId) {
      return res.status(400).json({ 
        error: 'Los campos fechaIngreso, fechaSalida y HotelId son requeridos' 
      });
    }

    if (new Date(fechaSalida) <= new Date(fechaIngreso)) {
      return res.status(400).json({ error: 'La fecha de salida debe ser posterior a la de ingreso' });
    }

    // Obtener habitaciones ocupadas
    const reservasOcupadas = await Reserva.findAll({
      where: {
        [Op.and]: [
          { fechaIngreso: { [Op.lt]: fechaSalida } },
          { fechaSalida: { [Op.gt]: fechaIngreso } }
        ],
        HotelId
      },
      attributes: ['HabitacionId'],
      raw: true
    });

    const idsOcupadas = reservasOcupadas.map(r => r.HabitacionId);

    // Buscar habitaciones disponibles
    const where = {
      HotelId,
      id: { [Op.notIn]: idsOcupadas }
    };

    if (capacidad) {
      where.capacidad = { [Op.gte]: parseInt(capacidad) };
    }

    const habitaciones = await Habitacion.findAll({
      where,
      include: [
        { 
          model: Hotel,
          as: 'hotel', // Aquí se usa el alias 'hotel'
          attributes: ['nombre', 'direccion']
        }
      ],
      attributes: ['id', 'numero', 'piso', 'capacidad', 'caracteristicas', 'posicion_x', 'posicion_y'],
      order: [
        ['piso', 'ASC'],
        ['numero', 'ASC']
      ]
    });

    res.json(habitaciones.map(h => ({
      id: h.id,
      numero: h.numero,
      piso: h.piso,
      capacidad: h.capacidad,
      caracteristicas: h.caracteristicas,
      posicion: { x: h.posicion_x, y: h.posicion_y },
      hotel: h.hotel // 'Hotel' está asociado a 'hotel' en el alias
    })));
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
