import { useEffect, useState } from 'react';
import { Building2, MapPin, Phone, Plus, Save, Globe } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'; // Importamos componentes de mapa
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../services/api';

// --- CONFIGURACIÓN DE ICONOS LEAFLET ---
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = new L.Icon({
    iconUrl,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

// --- COMPONENTE INTERNO: DETECTAR CLICS EN EL MAPA ---
// Este componente invisible escucha cuando haces clic y avisa al formulario
function LocationPicker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      // Cuando el usuario hace clic, enviamos las coordenadas hacia arriba
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    companyName: '',
    address: '',
    phone: '',
    latitude: -33.4489, // Lo guardamos como número directamente
    longitude: -70.6693
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
      // Reset (Volvemos a Santiago)
      setFormData({ companyName: '', address: '', phone: '', latitude: -33.4489, longitude: -70.6693 }); 
      fetchClients();
    } catch (error) {
      alert('Error al crear cliente.');
    }
  };

  // Función mágica que actualiza el formulario cuando haces clic en el mapa
  const handleMapClick = (lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
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
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* COLUMNA IZQUIERDA: DATOS TEXTUALES */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Empresa</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input required type="text" placeholder="Ej: Supermercado Central" className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
                </div>
              </div>

              <div>
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

              {/* Inputs de coordenadas (Lectura solamente, para que el usuario vea que cambiaron) */}
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                 <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Coordenadas Seleccionadas</label>
                 <div className="flex gap-2">
                   <div className="relative flex-1">
                      <Globe className="absolute left-3 top-2.5 h-3 w-3 text-gray-400" />
                      <input type="number" step="any" readOnly className="w-full pl-8 p-1.5 border rounded text-xs bg-white text-gray-600"
                        value={formData.latitude} />
                   </div>
                   <div className="relative flex-1">
                      <input type="number" step="any" readOnly className="w-full p-1.5 border rounded text-xs bg-white text-gray-600"
                        value={formData.longitude} />
                   </div>
                 </div>
              </div>
            </div>

            {/* COLUMNA DERECHA: MAPA SELECTOR */}
            <div className="h-[300px] rounded-lg overflow-hidden border border-gray-300 relative">
               <MapContainer center={[-33.4489, -70.6693]} zoom={12} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap'
                  />
                  
                  {/* El componente que escucha los clics */}
                  <LocationPicker onLocationSelect={handleMapClick} />
                  
                  {/* El marcador visual donde hiciste clic */}
                  <Marker position={[formData.latitude, formData.longitude]} icon={defaultIcon} />
               </MapContainer>
               
               <div className="absolute bottom-2 left-2 bg-white/90 px-3 py-1 rounded text-xs font-bold shadow z-[1000]">
                 👆 Haz clic en el mapa para ubicar al cliente
               </div>
            </div>

            {/* BOTONES */}
            <div className="md:col-span-2 flex justify-end gap-2 border-t pt-4">
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