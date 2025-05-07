const { Hotel } = require('../models');

// Crear un nuevo hotel
const crearHotel = async (req, res) => {
  try {
    const { nombre, direccion } = req.body;
    const hotel = await Hotel.create({ nombre, direccion });
    res.status(201).json(hotel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los hoteles
const obtenerHoteles = async (req, res) => {
  try {
    const hoteles = await Hotel.findAll();
    res.status(200).json(hoteles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un hotel por ID
const obtenerHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id);
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel no encontrado' });
    }
    res.status(200).json(hotel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un hotel
const actualizarHotel = async (req, res) => {
  try {
    const { nombre, direccion } = req.body;
    const hotel = await Hotel.findByPk(req.params.id);
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel no encontrado' });
    }
    hotel.nombre = nombre || hotel.nombre;
    hotel.direccion = direccion || hotel.direccion;
    await hotel.save();
    res.status(200).json(hotel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un hotel
const eliminarHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id);
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel no encontrado' });
    }
    await hotel.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { crearHotel, obtenerHoteles, obtenerHotel, actualizarHotel, eliminarHotel };
