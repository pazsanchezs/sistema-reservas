const { Cliente } = require('../models');

// Crear un nuevo cliente
const crearCliente = async (req, res) => {
  try {
    const { cedula, nombre, apellido } = req.body;
    const cliente = await Cliente.create({ cedula, nombre, apellido });
    res.status(201).json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los clientes
const obtenerClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un cliente por ID
const obtenerCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un cliente
const actualizarCliente = async (req, res) => {
  try {
    const { cedula, nombre, apellido } = req.body;
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    cliente.cedula = cedula || cliente.cedula;
    cliente.nombre = nombre || cliente.nombre;
    cliente.apellido = apellido || cliente.apellido;
    await cliente.save();
    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un cliente
const eliminarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    await cliente.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { crearCliente, obtenerClientes, obtenerCliente, actualizarCliente, eliminarCliente };
