import { useEffect, useState } from 'react';
import { Truck, AlertCircle, Plus } from 'lucide-react';
import api from '../services/api';
import VehicleForm from './VehicleForm'; // <--- Importamos el formulario

interface Vehicle {
  id: number;
  plate: string;
  model: string;
  capacity: number;
  status: string;
}

export default function VehicleList() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); // Estado para mostrar/ocultar modal

  // Función para cargar datos (la usaremos al iniciar y al guardar uno nuevo)
  const fetchVehicles = async () => {
    try {
      const response = await api.get('/vehicles');
      setVehicles(response.data);
    } catch (error) {
      console.error("Error cargando vehículos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleSuccess = () => {
    setShowForm(false); // Cerrar formulario
    fetchVehicles();    // Recargar la lista automáticamente
  };

  if (loading) return <p className="text-center py-10">Cargando flota...</p>;

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Encabezado con Botón Nuevo */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="font-semibold text-gray-700 flex items-center gap-2">
            <Truck className="h-5 w-5 text-blue-600" />
            Listado de Vehículos
          </h2>
          
          <button 
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition"
          >
            <Plus size={16} />
            Nuevo Vehículo
          </button>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Patente</th>
                <th className="px-6 py-3">Modelo</th>
                <th className="px-6 py-3">Capacidad (kg)</th>
                <th className="px-6 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.length > 0 ? (
                vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {vehicle.plate}
                    </td>
                    <td className="px-6 py-4">{vehicle.model}</td>
                    <td className="px-6 py-4">{vehicle.capacity} kg</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                        ${vehicle.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {vehicle.status === 'ACTIVE' ? 'Activo' : vehicle.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="h-8 w-8" />
                      <p>No hay vehículos registrados aún.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Renderizamos el Formulario (Modal) si showForm es true */}
      {showForm && (
        <VehicleForm 
          onSuccess={handleSuccess} 
          onCancel={() => setShowForm(false)} 
        />
      )}
    </>
  );
}