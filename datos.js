const { Cliente, Habitacion, Hotel, sequelize } = require('./models');

async function cargarDatos() {
    try {
        // Conectar a la base de datos
        await sequelize.authenticate();
        console.log('📡 Conectado a la base de datos.');

        // Verificar si ya hay hoteles
        const cantidadHoteles = await Hotel.count();
        if (cantidadHoteles === 0) {
            // Crear 5 hoteles diferentes
            const hotel1 = await Hotel.create({ 
                id: 1,
                nombre: 'Hotel Central', 
                direccion: 'Av. Principal 123' 
            });
            
            const hotel2 = await Hotel.create({ 
                id: 2,
                nombre: 'Hotel Sol', 
                direccion: 'Calle 456 Sur' 
            });
            
            const hotel3 = await Hotel.create({ 
                id: 3,
                nombre: 'Hotel Luna', 
                direccion: 'Carrera 789 Este' 
            });
            
            const hotel4 = await Hotel.create({ 
                id: 4,
                nombre: 'Hotel Estrella', 
                direccion: 'Diagonal 101 Norte' 
            });
            
            const hotel5 = await Hotel.create({ 
                id: 5,
                nombre: 'Hotel Oasis', 
                direccion: 'Transversal 202 Oeste' 
            });

            // Crear habitaciones para cada hotel
            await Habitacion.bulkCreate([
                // Hotel Central (ID 1)
                { numero: 101, piso: 1, capacidad: 2, caracteristicas: 'TV, Wi-Fi', HotelId: 1 },
                { numero: 102, piso: 1, capacidad: 4, caracteristicas: 'TV, Wi-Fi, Aire Acondicionado', HotelId: 1 },
                { numero: 201, piso: 2, capacidad: 3, caracteristicas: 'TV', HotelId: 1 },
                { numero: 301, piso: 3, capacidad: 2, caracteristicas: 'Wi-Fi, Vista al mar', HotelId: 1 },
                
                // Hotel Sol (ID 2)
                { numero: 101, piso: 1, capacidad: 2, caracteristicas: 'TV, Wi-Fi, Mini Bar', HotelId: 2 },
                { numero: 201, piso: 2, capacidad: 3, caracteristicas: 'TV, Wi-Fi', HotelId: 2 },
                { numero: 301, piso: 3, capacidad: 1, caracteristicas: 'Wi-Fi', HotelId: 2 },
                
                // Hotel Luna (ID 3)
                { numero: 101, piso: 1, capacidad: 4, caracteristicas: 'TV, Wi-Fi, Jacuzzi', HotelId: 3 },
                { numero: 102, piso: 1, capacidad: 2, caracteristicas: 'TV, Wi-Fi', HotelId: 3 },
                { numero: 201, piso: 2, capacidad: 2, caracteristicas: 'Wi-Fi', HotelId: 3 },
                
                // Hotel Estrella (ID 4)
                { numero: 101, piso: 1, capacidad: 2, caracteristicas: 'TV, Wi-Fi, Terraza', HotelId: 4 },
                { numero: 201, piso: 2, capacidad: 3, caracteristicas: 'TV, Wi-Fi', HotelId: 4 },
                
                // Hotel Oasis (ID 5)
                { numero: 101, piso: 1, capacidad: 2, caracteristicas: 'TV, Wi-Fi, Piscina privada', HotelId: 5 },
                { numero: 102, piso: 1, capacidad: 4, caracteristicas: 'TV, Wi-Fi', HotelId: 5 },
                { numero: 201, piso: 2, capacidad: 2, caracteristicas: 'Wi-Fi', HotelId: 5 },
                { numero: 202, piso: 2, capacidad: 2, caracteristicas: 'Wi-Fi, Vista al jardín', HotelId: 5 }
            ]);
        }

        // Verificar si hay clientes
        const cantidadClientes = await Cliente.count();
        if (cantidadClientes === 0) {
            await Cliente.bulkCreate([
                { cedula: '12345678', nombre: 'Ana', apellido: 'Gómez' },
                { cedula: '87654321', nombre: 'Luis', apellido: 'Pérez' },
                { cedula: '11223344', nombre: 'Carlos', apellido: 'Martínez' },
                { cedula: '55667788', nombre: 'María', apellido: 'Rodríguez' },
                { cedula: '99887766', nombre: 'Pedro', apellido: 'Sánchez' }
            ]);
        }

        console.log('✅ Datos cargados exitosamente. Hoteles disponibles con IDs: 1, 2, 3, 4, 5');
        process.exit();
    } catch (error) {
        console.error('❌ Error al cargar los datos:', error);
        process.exit(1);
    }
}

cargarDatos();