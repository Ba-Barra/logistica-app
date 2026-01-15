import { useEffect, useState } from 'react';
import { X, Save, Truck, User } from 'lucide-react';
import api from '../services/api';

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function RouteForm({ onSuccess, onCancel }: Props) {
  const [loading, setLoading] = useState(false);
  
  // Datos para llenar los selectores (dropdowns)
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);

  // Datos del formulario
  const [formData, setFormData] = useState({
    vehicleId: '',
    driverId: '',
    scheduledDate: ''
  });

  // Cargar camiones y choferes al abrir el formulario
  useEffect(() => {
    const loadResources = async () => {
      try {
        const [resVehicles, resDrivers] = await Promise.all([
          api.get('/vehicles'),
          api.get('/drivers')
        ]);
        setVehicles(resVehicles.data);
        setDrivers(resDrivers.data);
      } catch (error) {
        alert('Error cargando recursos');
      }
    };
    loadResources();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/routes', {
        vehicleId: Number(formData.vehicleId), // Convertir a número
        driverId: Number(formData.driverId),   // Convertir a número
        scheduledDate: formData.scheduledDate
      });
      onSuccess();
    } catch (error) {
      alert('Error al crear la ruta. Revisa los datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Planificar Nueva Ruta</h2>
          <button onClick={onCancel}><X size={24} className="text-gray-400" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Selector de Vehículo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vehículo Asignado</label>
            <div className="relative">
              <Truck className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select 
                required
                className="w-full pl-10 p-2 border rounded appearance-none bg-white"
                value={formData.vehicleId}
                onChange={e => setFormData({...formData, vehicleId: e.target.value})}
              >
                <option value="">Seleccione un camión...</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.model} - {v.plate}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Selector de Chofer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chofer Responsable</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select 
                required
                className="w-full pl-10 p-2 border rounded appearance-none bg-white"
                value={formData.driverId}
                onChange={e => setFormData({...formData, driverId: e.target.value})}
              >
                <option value="">Seleccione un chofer...</option>
                {drivers.map(d => (
                  <option key={d.id} value={d.id}>{d.firstName} {d.lastName}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Selector de Fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Programada</label>
            <input 
              required 
              type="date" 
              className="w-full p-2 border rounded"
              value={formData.scheduledDate} 
              onChange={e => setFormData({...formData, scheduledDate: e.target.value})} 
            />
          </div>

          <button type="submit" disabled={loading} className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex justify-center gap-2">
            <Save size={18} /> {loading ? 'Planificando...' : 'Guardar Ruta'}
          </button>
        </form>
      </div>
    </div>
  );
}