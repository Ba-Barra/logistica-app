import { useEffect, useState } from 'react';
import { Calendar, Plus, Truck, User, MapPin } from 'lucide-react';
import api from '../services/api';
import RouteForm from './RouteForm';
import { Link } from 'react-router-dom';

interface RouteData {
  id: number;
  scheduledDate: string;
  status: string;
  vehicle: { model: string; plate: string };
  driver: { firstName: string; lastName: string };
}

export default function RouteList() {
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [showForm, setShowForm] = useState(false);

  const fetchRoutes = async () => {
    try {
      const res = await api.get('/routes');
      setRoutes(res.data);
    } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchRoutes(); }, []);

  // Función para formatear fechas bonitas (ej: 20/01/2026)
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="font-semibold text-gray-700 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" /> Itinerario
          </h2>
          <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex gap-2 hover:bg-blue-700">
            <Plus size={16} /> Planificar Ruta
          </button>
        </div>

        <div className="grid gap-4 p-6">
          {routes.length === 0 ? (
            <p className="text-center text-gray-400 py-10">No hay rutas planificadas.</p>
          ) : (
            routes.map(route => (
              <div key={route.id} className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-center hover:shadow-md transition bg-slate-50">
                
                {/* Columna Izquierda: Fecha y Estado */}
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="bg-blue-100 p-3 rounded-full text-blue-600 font-bold text-center w-16">
                    {new Date(route.scheduledDate).getDate()}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 capitalize">{formatDate(route.scheduledDate)}</p>
                    <span className="text-xs font-semibold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                      {route.status}
                    </span>
                  </div>
                </div>

                {/* Columna Centro: Detalles */}
                <div className="flex-1 px-4 md:px-10 space-y-1">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Truck size={16} className="text-blue-500" />
                    <span className="font-medium">{route.vehicle.model}</span>
                    <span className="text-xs text-gray-400">({route.vehicle.plate})</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <User size={16} className="text-green-500" />
                    <span>{route.driver.firstName} {route.driver.lastName}</span>
                  </div>
                </div>

                {/* Columna Derecha: Acciones (Futuro) */}
<div className="text-right">
  <Link 
    to={`/routes/${route.id}`} 
    className="text-sm text-blue-600 hover:underline font-medium"
  >
    Ver Detalles →
  </Link>
</div>
              </div>
            ))
          )}
        </div>
      </div>

      {showForm && <RouteForm onSuccess={() => { setShowForm(false); fetchRoutes(); }} onCancel={() => setShowForm(false)} />}
    </>
  );
}