const { Cliente, Habitacion, Hotel, sequelize } = require('./models');

async function cargarDatos() {
    try {
    // Opcional: conectar la base de datos si no está hecho
    await sequelize.authenticate();
    console.log('📡 Conectado a la base de datos.');

    // Verificar si ya hay hoteles
    const cantidadHoteles = await Hotel.count();
    if (cantidadHoteles === 0) {
        const hotel1 = await Hotel.create({ nombre: 'Hotel Central', direccion: 'Av. Principal 123' });
        const hotel2 = await Hotel.create({ nombre: 'Hotel Sol', direccion: 'Calle 456 Sur' });

        await Habitacion.bulkCreate([
        { numero: 101, piso: 1, capacidad: 2, caracteristicas: 'TV, Wi-Fi', HotelId: hotel1.id },
        { numero: 102, piso: 1, capacidad: 4, caracteristicas: 'TV, Wi-Fi, Aire Acondicionado', HotelId: hotel1.id },
        { numero: 201, piso: 2, capacidad: 3, caracteristicas: 'TV', HotelId: hotel1.id },
        { numero: 301, piso: 3, capacidad: 2, caracteristicas: 'Wi-Fi, Vista al mar', HotelId: hotel2.id },
        { numero: 302, piso: 3, capacidad: 1, caracteristicas: '', HotelId: hotel2.id },
    ]);
    }

    // Verificar si hay clientes
    const cantidadClientes = await Cliente.count();
    if (cantidadClientes === 0) {
        await Cliente.bulkCreate([
        { cedula: '12345678', nombre: 'Ana', apellido: 'Gómez' },
        { cedula: '87654321', nombre: 'Luis', apellido: 'Pérez' },
    ]);
    }

        console.log('✅ Datos cargados sin eliminar las tablas.');
        process.exit();
    } catch (error) {
        console.error('❌ Error al cargar los datos:', error);
        process.exit(1);
    }
}

cargarDatos();
