import { useEffect, useState } from 'react';
import { Building2, MapPin, Phone, Plus, Save, Globe } from 'lucide-react';
import api from '../services/api';

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  // Formulario actualizado con coordenadas
  const [formData, setFormData] = useState({
    companyName: '',
    address: '',
    phone: '',
    latitude: '-33.4489', // Valor inicial (Santiago Centro)
    longitude: '-70.6693'
  });

  const fetchClients = async () => {
    try {
      const res = await api.get('/clients');
      setClients(res.data);
    } catch (error) {
      console.error("Error al cargar clientes");
    }
  };

  useEffect(() => { fetchClients(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/clients', formData);
      setShowForm(false);
      // Reset del formulario
      setFormData({ companyName: '', address: '', phone: '', latitude: '-33.4489', longitude: '-70.6693' }); 
      fetchClients();
    } catch (error) {
      alert('Error al crear cliente. Revisa que el servidor esté funcionando.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Cartera de Clientes 🏢</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus size={20} /> Nuevo Cliente
        </button>
      </div>

      {/* Formulario de Creación */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8 animate-fade-in-down">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Registrar Empresa</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Empresa</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input required type="text" placeholder="Ej: Supermercado Central" className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección Física</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input required type="text" placeholder="Av. Siempre Viva 123" className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono de Contacto</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input required type="text" placeholder="+56 9..." className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>

            {/* SECCIÓN NUEVA: COORDENADAS */}
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Coordenadas (Lat / Lng)</label>
               <div className="flex gap-2">
                 <div className="relative flex-1">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input required type="number" step="any" placeholder="Latitud" className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      value={formData.latitude} onChange={e => setFormData({...formData, latitude: e.target.value})} />
                 </div>
                 <div className="relative flex-1">
                    <input required type="number" step="any" placeholder="Longitud" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      value={formData.longitude} onChange={e => setFormData({...formData, longitude: e.target.value})} />
                 </div>
               </div>
               {/* AQUÍ ESTABA EL ERROR: Cambié "->" por "y" */}
               <p className="text-xs text-gray-400 mt-1">Tip: Busca en Google Maps, clic derecho y copia las coordenadas.</p>
            </div>

            <div className="md:col-span-2 flex justify-end gap-2 mt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancelar</button>
              <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 flex items-center gap-2">
                <Save size={18} /> Guardar Cliente
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Clientes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clients.length === 0 ? (
          <p className="text-gray-400 col-span-3 text-center py-10">No hay clientes registrados aún.</p>
        ) : (
          clients.map(client => (
            <div key={client.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-2">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <Building2 className="text-blue-600 h-6 w-6" />
                </div>
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-1">{client.companyName}</h3>
              <p className="text-gray-500 text-sm flex items-center gap-2 mb-1"><MapPin size={14} /> {client.address}</p>
              
              {/* Mostramos las coordenadas guardadas */}
              <p className="text-gray-400 text-xs mb-3 font-mono bg-gray-50 inline-block px-2 py-1 rounded">
                 📍 {Number(client.latitude).toFixed(4)}, {Number(client.longitude).toFixed(4)}
              </p>
              
              <div className="pt-3 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-600">
                <Phone size={14} /> {client.phone || 'Sin teléfono'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}