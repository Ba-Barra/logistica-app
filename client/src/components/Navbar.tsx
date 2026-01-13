import { Link, useLocation } from 'react-router-dom';
import { Truck, Users, Building2, Calendar } from 'lucide-react';

export default function Navbar() {
  const location = useLocation(); // Nos dice en qué página estamos

  // Función para saber si un botón debe pintarse de azul
  const isActive = (path: string) => {
    return location.pathname === path 
      ? 'bg-slate-800 text-blue-400' 
      : 'text-gray-300 hover:bg-slate-800 hover:text-white';
  };

  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Truck className="h-6 w-6" />
            </div>
            <span className="font-bold text-xl">Logística Pro</span>
          </Link>

          <div className="flex space-x-2">
            <Link to="/vehicles" className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${isActive('/vehicles')}`}>
              <Truck className="h-4 w-4" />
              <span>Vehículos</span>
            </Link>
            
            <Link to="/drivers" className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${isActive('/drivers')}`}>
              <Users className="h-4 w-4" />
              <span>Choferes</span>
            </Link>
            
            <Link to="/clients" className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${isActive('/clients')}`}>
              <Building2 className="h-4 w-4" />
              <span>Clientes</span>
            </Link>
            
            <Link to="/routes" className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${isActive('/routes')}`}>
              <Calendar className="h-4 w-4" />
              <span>Rutas</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}