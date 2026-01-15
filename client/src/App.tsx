import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import VehiclesPage from './pages/VehiclesPage';
import DriversPage from './pages/DriversPage';
import ClientsPage from './pages/ClientsPage';
import RoutesPage from './pages/RoutesPage';
import RouteDetailsPage from './pages/RouteDetailsPage';
import DashboardPage from './pages/DashboardPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute'; // El guardia de seguridad

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="container mx-auto px-4 py-8">
          <Routes>
            {/* --- RUTAS PÚBLICAS (Cualquiera puede entrar) --- */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* --- RUTAS PRIVADAS (Protegidas por el Guardia) --- */}
            
            {/* Dashboard */}
            <Route path="/" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            
            {/* Vehículos */}
            <Route path="/vehicles" element={
              <ProtectedRoute>
                <VehiclesPage />
              </ProtectedRoute>
            } />

            {/* Choferes */}
            <Route path="/drivers" element={
              <ProtectedRoute>
                <DriversPage />
              </ProtectedRoute>
            } />

            {/* Clientes */}
            <Route path="/clients" element={
              <ProtectedRoute>
                <ClientsPage />
              </ProtectedRoute>
            } />
            
            {/* Rutas (Lista) */}
            <Route path="/routes" element={
              <ProtectedRoute>
                <RoutesPage />
              </ProtectedRoute>
            } /> 

            {/* Detalle de Ruta */}
            <Route path="/routes/:id" element={
              <ProtectedRoute>
                <RouteDetailsPage />
              </ProtectedRoute>
            } />

          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;