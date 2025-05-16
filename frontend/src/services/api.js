import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3000',
});

export default {
  // Hoteles
    getHotels() {
    return API.get('/hotels');
    },

  // Habitaciones
    getAvailableRooms(checkIn, checkOut, capacity) {
    let url = `/rooms/available?checkIn=${checkIn}&checkOut=${checkOut}`;
    if (capacity) url += `&capacity=${capacity}`;
    return API.get(url);
    },

  // Clientes
    getClientByCedula(cedula) {
    return API.get(`/clients?cedula=${cedula}`);
    },
    createClient(clientData) {
    return API.post('/clients', clientData);
    },

  // Reservas
    createReservation(reservationData) {
    return API.post('/reservations', reservationData);
    },
    getReservations(filters) {
    const { hotelId, checkIn, checkOut, clientFilter } = filters;
    let url = `/reservations?hotelId=${hotelId}&checkIn=${checkIn}`;
    if (checkOut) url += `&checkOut=${checkOut}`;
    if (clientFilter) url += `&clientFilter=${clientFilter}`;
    return API.get(url);
    },
};