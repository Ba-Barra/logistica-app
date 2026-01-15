import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Truck, Users, Map, Package, LogOut } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Lógica para ocultar la barra en Login y Registro
  const hideNavbarRoutes = ['/login', '/register'];
  if (hideNavbarRoutes.includes(location.pathname)) {
    return null; // No renderizar nada
  }

  // 2. Función para Cerrar Sesión
  const handleLogout = () => {
    if (confirm('¿Estás seguro de que quieres salir?')) {
      localStorage.removeItem('token'); // Borramos la llave
      navigate('/login'); // Mandamos al usuario a la entrada
    }
  };

  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo / Título */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl hover:text-blue-400 transition">
            <Truck className="text-blue-500" />
            Logística<span className="text-blue-500">Pro</span>
          </Link>

          {/* Enlaces de Navegación */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition text-sm font-medium">
              <LayoutDashboard size={18} /> Panel
            </Link>
            <Link to="/routes" className="flex items-center gap-2 text-slate-300 hover:text-white transition text-sm font-medium">
              <Map size={18} /> Rutas
            </Link>
            <Link to="/vehicles" className="flex items-center gap-2 text-slate-300 hover:text-white transition text-sm font-medium">
              <Truck size={18} /> Vehículos
            </Link>
            <Link to="/drivers" className="flex items-center gap-2 text-slate-300 hover:text-white transition text-sm font-medium">
              <Users size={18} /> Choferes
            </Link>
            <Link to="/clients" className="flex items-center gap-2 text-slate-300 hover:text-white transition text-sm font-medium">
              <Package size={18} /> Clientes
            </Link>
          </div>

          {/* Botón de Cerrar Sesión */}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition shadow-md"
          >
            <LogOut size={16} /> Salir
          </button>

        </div>
      </div>
    </nav>
  );
}