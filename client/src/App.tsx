import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import VehiclesPage from './pages/VehiclesPage';
import DriversPage from './pages/DriversPage';
import ClientsPage from './pages/ClientsPage';
import RoutesPage from './pages/RoutesPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="container mx-auto px-4 py-8">
          <Routes>
            {/* Si entran a la raíz, redirigir a vehículos */}
            <Route path="/" element={<Navigate to="/vehicles" replace />} />
            
            <Route path="/vehicles" element={<VehiclesPage />} />
            <Route path="/drivers" element={<DriversPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/routes" element={<RoutesPage />} /> 
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;