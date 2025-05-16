import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ReservationsPage from './pages/ReservationsPage';
import SearchPage from './pages/SearchPage';
import './styles/main.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/reservations" element={<ReservationsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
