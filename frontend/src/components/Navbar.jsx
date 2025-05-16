import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav style={{ background: '#333', padding: '1rem' }}>
        <Link to="/" style={{ color: 'white', marginRight: '1rem' }}>Inicio</Link>
        <Link to="/search" style={{ color: 'white' }}>Buscar Habitaciones</Link>
        </nav>
    );
}

export default Navbar;