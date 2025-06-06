const express = require('express');
const { Cliente } = require('../models');
const { buscarPorCedula} = require('../controllers/clientesController');
const router = express.Router();


router.get(['/', '/buscar'], (req, res) => {
  if (req.query.cedula) {
    return buscarPorCedula(req, res);
  }
  return obtenerClientes(req, res);
});

// Obtener todos los clientes
router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'Hubo un problema al obtener los clientes' });
  }
});

// Crear un nuevo cliente
router.post('/', async (req, res) => {
  try {
    const cliente = await Cliente.create(req.body);
    res.status(201).json(cliente);
  } catch (error) {
    res.status(500).json({ error: 'Hubo un problema al crear el cliente' });
  }
});

module.exports = router;
