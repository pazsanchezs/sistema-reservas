import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function SearchPage() {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [capacity, setCapacity] = useState('');
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [cedula, setCedula] = useState('');
    const [client, setClient] = useState(null);
    const [newClient, setNewClient] = useState({
        firstName: '',
        lastName: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
    
    try {
        const availableRooms = await api.getAvailableRooms(checkIn, checkOut, capacity);
        setRooms(availableRooms);
        setSelectedRoom(null);
    } catch (err) {
        setError('Error al buscar habitaciones. Por favor, intente nuevamente.');
        console.error(err);
    } finally {
        setLoading(false);
    }
    };

    const handleCheckClient = async () => {
        try {
        const clientData = await api.getClientByCedula(cedula);
        if (clientData) {
            setClient(clientData);
        } else {
            setClient(null);
        }
    } catch (err) {
        console.error(err);
        setError('Error al verificar cliente');
    }
    };

    const handleReservation = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
    
    try {
        let clientId;

        if (client) {
            clientId = client.id;
        } else {
            const newClientData = await api.createClient({
                cedula,
                firstName: newClient.firstName,
                lastName: newClient.lastName,
        });
        clientId = newClientData.id;
        }

        await api.createReservation({
            roomId: selectedRoom.id,
            clientId,
            checkIn,
            checkOut,
            guestCount: capacity || 1,
        });

        navigate('/reservations');
    } catch (err) {
        setError('Error al crear reserva. Por favor, intente nuevamente.');
        console.error(err);
    } finally {
        setLoading(false);
    }
    };

    return (
    <div className="search-page">
        <h1>Buscar Habitaciones Disponibles</h1>

        <form onSubmit={handleSearch} className="search-form">
            <div className="form-group">
            <label>Fecha de Entrada:</label>
            <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            required
            />
        </div>
        
        <div className="form-group">
            <label>Fecha de Salida:</label>
            <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                required
            />
        </div>
        
        <div className="form-group">
            <label>Capacidad (opcional):</label>
            <input
                type="number"
                min="1"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
            />
        </div>
        
        <button type="submit" disabled={loading}>
            {loading ? 'Buscando...' : 'Buscar Habitaciones'}
        </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        {rooms.length > 0 && (
        <div className="rooms-list">
            <h2>Habitaciones Disponibles</h2>
            {rooms.map((room) => (
            <div 
                key={room.id} 
                className={`room-card ${selectedRoom?.id === room.id ? 'selected' : ''}`}
                onClick={() => setSelectedRoom(room)}
            >
                <h3>{room.number} - {room.hotel.name}</h3>
                <p>Piso: {room.floor}</p>
                <p>Capacidad: {room.capacity} personas</p>
                <p>Características: {room.features}</p>
            </div>
        ))}
        </div>
        )}

        {selectedRoom && (
        <div className="reservation-form">
            <h2>Completar Reserva</h2>

            <form onSubmit={handleReservation}>
                <div className="form-group">
                    <label>Cédula:</label>
                    <div className="cedula-input">
                <input
                    type="text"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
                    required
                />
                <button 
                    type="button" 
                    onClick={handleCheckClient}
                    disabled={!cedula}
                >
                    Verificar
                </button>
            </div>
        </div>
            
            {client ? (
                <div className="client-info">
                    <p>Cliente existente: {client.firstName} {client.lastName}</p>
                </div>
            ) : (
                <div className="new-client-form">
                    <div className="form-group">
                    <label>Nombre:</label>
                    <input
                        type="text"
                        value={newClient.firstName}
                        onChange={(e) => setNewClient({...newClient, firstName: e.target.value})}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>Apellido:</label>
                    <input
                    type="text"
                    value={newClient.lastName}
                    onChange={(e) => setNewClient({...newClient, lastName: e.target.value})}
                    required
                />
                </div>
            </div>
            )}
            
            <button type="submit" disabled={loading}>
                {loading ? 'Procesando...' : 'Confirmar Reserva'}
            </button>
        </form>
        </div>
    )}
    </div>
);
}

export default SearchPage;