import { useState } from 'react';
import { X, Save } from 'lucide-react';
import api from '../services/api';

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function DriverForm({ onSuccess, onCancel }: Props) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    license: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/drivers', formData);
      onSuccess();
    } catch (error) {
      alert('Error al guardar chofer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Nuevo Chofer</h2>
          <button onClick={onCancel}><X size={24} className="text-gray-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input required type="text" className="w-full p-2 border rounded"
                value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
              <input required type="text" className="w-full p-2 border rounded"
                value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Licencia</label>
            <input required type="text" className="w-full p-2 border rounded"
              value={formData.license} onChange={e => setFormData({...formData, license: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input required type="text" className="w-full p-2 border rounded"
              value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex justify-center gap-2">
            <Save size={18} /> {loading ? 'Guardando...' : 'Guardar Chofer'}
          </button>
        </form>
      </div>
    </div>
  );
}