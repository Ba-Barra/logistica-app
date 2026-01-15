import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Ya no necesitas Navigate
import Navbar from './components/Navbar';
import VehiclesPage from './pages/VehiclesPage';
import DriversPage from './pages/DriversPage';
import ClientsPage from './pages/ClientsPage';
import RoutesPage from './pages/RoutesPage';
import RouteDetailsPage from './pages/RouteDetailsPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="container mx-auto px-4 py-8">
          <Routes>
            {/* AQUI ESTÁ EL CAMBIO: La raíz "/" ahora muestra el Dashboard */}
            <Route path="/" element={<DashboardPage />} />
            
            <Route path="/vehicles" element={<VehiclesPage />} />
            <Route path="/drivers" element={<DriversPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            
            <Route path="/routes" element={<RoutesPage />} /> 
            {/* RUTA DINÁMICA */}
            <Route path="/routes/:id" element={<RouteDetailsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;