import { useEffect, useState } from 'react';
import api from '../services/api';

function ReservationsPage() {
    const [hotels, setHotels] = useState([]);
    const [filters, setFilters] = useState({
        hotelId: '',
        checkIn: new Date().toISOString().split('T')[0],
        checkOut: '',
        clientFilter: '',
    });
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHotels = async () => {
        try {
            const hotelsData = await api.getHotels();
            setHotels(hotelsData);
        } catch (err) {
            console.error(err);
            setError('Error al cargar hoteles');
        }
    };
    
    fetchHotels();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
    
        try {
            const reservationsData = await api.getReservations(filters);
            setReservations(reservationsData);
        } catch (err) {
            setError('Error al cargar reservas');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reservations-page">
        <h1>Lista de Reservas</h1>

        <form onSubmit={handleSubmit} className="filter-form">
            <div className="form-group">
            <label>Hotel:</label>
            <select
                name="hotelId"
                value={filters.hotelId}
                onChange={handleFilterChange}
                required
            >
                <option value="">Seleccione un hotel</option>
                {hotels.map((hotel) => (
                <option key={hotel.id} value={hotel.id}>
                    {hotel.name}
                </option>
            ))}
            </select>
        </div>
        
        <div className="form-group">
            <label>Fecha de Entrada:</label>
            <input
                type="date"
                name="checkIn"
                value={filters.checkIn}
                onChange={handleFilterChange}
                required
            />
        </div>
        
        <div className="form-group">
            <label>Fecha de Salida (opcional):</label>
            <input
                type="date"
                name="checkOut"
                value={filters.checkOut}
                onChange={handleFilterChange}
            />
        </div>
        
        <div className="form-group">
            <label>Cliente (opcional):</label>
            <input
                type="text"
                name="clientFilter"
                value={filters.clientFilter}
                onChange={handleFilterChange}
                placeholder="Cédula o nombre"
            />
        </div>
        
        <button type="submit" disabled={loading}>
        {loading ? 'Filtrando...' : 'Filtrar'}
        </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        {reservations.length > 0 ? (
            <div className="reservations-table">
            <table>
                <thead>
                <tr>
                    <th>Hotel</th>
                    <th>Habitación</th>
                    <th>Piso</th>
                    <th>Cliente</th>
                    <th>Entrada</th>
                    <th>Salida</th>
                    <th>Personas</th>
                </tr>
                </thead>
            <tbody>
                {reservations.map((res) => (
                <tr key={res.id}>
                    <td>{res.room.hotel.name}</td>
                    <td>{res.room.number}</td>
                    <td>{res.room.floor}</td>
                    <td>{res.client.firstName} {res.client.lastName} ({res.client.cedula})</td>
                    <td>{new Date(res.checkIn).toLocaleDateString()}</td>
                    <td>{new Date(res.checkOut).toLocaleDateString()}</td>
                    <td>{res.guestCount}</td>
                </tr>
            ))}
            </tbody>
            </table>
        </div>
    ) : (
        <p>No hay reservas para mostrar con los filtros seleccionados.</p>
    )}
    </div>
);
}

export default ReservationsPage;