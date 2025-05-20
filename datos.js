const { Cliente, Habitacion, Hotel, sequelize } = require('./models');

async function cargarDatos() {
  try {
    await sequelize.authenticate();
    console.log('📡 Conectado a la base de datos.');

    // Crear hoteles siempre, sin condicionar
    const hoteles = await Hotel.bulkCreate([
      { nombre: 'Hotel Central', direccion: 'Av. Principal 123' },
      { nombre: 'Hotel Sol', direccion: 'Calle 456 Sur' },
      { nombre: 'Hotel Luna', direccion: 'Carrera 789 Este' },
      { nombre: 'Hotel Estrella', direccion: 'Diagonal 101 Norte' },
      { nombre: 'Hotel Oasis', direccion: 'Transversal 202 Oeste' }
    ], { returning: true });

    // Ahora hoteles tiene los hoteles recién creados con sus IDs asignados
    // Creamos habitaciones asignando el HotelId correspondiente
    const habitaciones = [];

    // Por ejemplo para Hotel Central (primer hotel creado)
    habitaciones.push(
      { numero: 101, piso: '1', capacidad: 2, caracteristicas: 'TV, Wi-Fi', HotelId: hoteles[0].id, posicion_x: 0, posicion_y: 0 },
      { numero: 102, piso: '1', capacidad: 4, caracteristicas: 'TV, Wi-Fi, Aire Acondicionado', HotelId: hoteles[0].id, posicion_x: 1, posicion_y: 0 },
      { numero: 201, piso: '2', capacidad: 3, caracteristicas: 'TV', HotelId: hoteles[0].id, posicion_x: 0, posicion_y: 1 },
      { numero: 301, piso: '3', capacidad: 2, caracteristicas: 'Wi-Fi, Vista al mar', HotelId: hoteles[0].id, posicion_x: 1, posicion_y: 1 },
    );

    // Hotel Sol
    habitaciones.push(
      { numero: 101, piso: '1', capacidad: 2, caracteristicas: 'TV, Wi-Fi, Mini Bar', HotelId: hoteles[1].id, posicion_x: 0, posicion_y: 0 },
      { numero: 201, piso: '2', capacidad: 3, caracteristicas: 'TV, Wi-Fi', HotelId: hoteles[1].id, posicion_x: 0, posicion_y: 1 },
      { numero: 301, piso: '3', capacidad: 1, caracteristicas: 'Wi-Fi', HotelId: hoteles[1].id, posicion_x: 1, posicion_y: 1 },
    );

    // Hotel Luna
    habitaciones.push(
      { numero: 101, piso: '1', capacidad: 4, caracteristicas: 'TV, Wi-Fi, Jacuzzi', HotelId: hoteles[2].id, posicion_x: 0, posicion_y: 0 },
      { numero: 102, piso: '1', capacidad: 2, caracteristicas: 'TV, Wi-Fi', HotelId: hoteles[2].id, posicion_x: 1, posicion_y: 0 },
      { numero: 201, piso: '2', capacidad: 2, caracteristicas: 'Wi-Fi', HotelId: hoteles[2].id, posicion_x: 0, posicion_y: 1 },
    );

    // Hotel Estrella
    habitaciones.push(
      { numero: 101, piso: '1', capacidad: 2, caracteristicas: 'TV, Wi-Fi, Terraza', HotelId: hoteles[3].id, posicion_x: 0, posicion_y: 0 },
      { numero: 201, piso: '2', capacidad: 3, caracteristicas: 'TV, Wi-Fi', HotelId: hoteles[3].id, posicion_x: 0, posicion_y: 1 },
    );

    // Hotel Oasis
    habitaciones.push(
      { numero: 101, piso: '1', capacidad: 2, caracteristicas: 'TV, Wi-Fi, Piscina privada', HotelId: hoteles[4].id, posicion_x: 0, posicion_y: 0 },
      { numero: 102, piso: '1', capacidad: 4, caracteristicas: 'TV, Wi-Fi', HotelId: hoteles[4].id, posicion_x: 1, posicion_y: 0 },
      { numero: 201, piso: '2', capacidad: 2, caracteristicas: 'Wi-Fi', HotelId: hoteles[4].id, posicion_x: 0, posicion_y: 1 },
      { numero: 202, piso: '2', capacidad: 2, caracteristicas: 'Wi-Fi, Vista al jardín', HotelId: hoteles[4].id, posicion_x: 1, posicion_y: 1 }
    );

    await Habitacion.bulkCreate(habitaciones);

    // Crear clientes siempre
    await Cliente.bulkCreate([
      { cedula: '12345678', nombre: 'Ana', apellido: 'Gómez' },
      { cedula: '87654321', nombre: 'Luis', apellido: 'Pérez' },
      { cedula: '11223344', nombre: 'Carlos', apellido: 'Martínez' },
      { cedula: '55667788', nombre: 'María', apellido: 'Rodríguez' },
      { cedula: '99887766', nombre: 'Pedro', apellido: 'Sánchez' }
    ]);

    console.log('✅ Datos cargados exitosamente.');
    process.exit();

  } catch (error) {
    console.error('❌ Error al cargar los datos:', error);
    process.exit(1);
  }
}

cargarDatos();
