import { useState } from 'react';
import { X, Save } from 'lucide-react';
import api from '../services/api';

interface VehicleFormProps {
  onSuccess: () => void; // Función para recargar la lista
  onCancel: () => void;  // Función para cerrar el formulario
}

export default function VehicleForm({ onSuccess, onCancel }: VehicleFormProps) {
  const [formData, setFormData] = useState({
    plate: '',
    model: '',
    capacity: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Enviamos los datos al backend
      await api.post('/vehicles', formData);
      onSuccess(); // ¡Éxito! Avisamos al padre
    } catch (error) {
      alert('Error al guardar. Revisa que la patente no esté repetida.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        
        {/* Encabezado */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Nuevo Vehículo</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patente</label>
            <input
              required
              type="text"
              placeholder="Ej: ABCD-20"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.plate}
              onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
            <input
              required
              type="text"
              placeholder="Ej: Scania R500"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad (kg)</label>
            <input
              required
              type="number"
              placeholder="Ej: 5000"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 flex justify-center items-center gap-2"
            >
              <Save size={18} />
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}