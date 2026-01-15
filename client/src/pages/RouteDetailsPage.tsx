import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Truck, User, MapPin, Building2, Plus, CheckCircle, Clock } from 'lucide-react';
import api from '../services/api';

// Interfaces de datos
interface Delivery {
  id: number;
  status: string;
  client: { companyName: string; address: string };
}

interface RouteDetail {
  id: number;
  scheduledDate: string;
  status: string;
  vehicle: { model: string; plate: string; capacity: number };
  driver: { firstName: string; lastName: string; phone: string };
  deliveries: Delivery[];
}

interface Client {
  id: number;
  companyName: string;
}

export default function RouteDetailsPage() {
  const { id } = useParams();
  const [route, setRoute] = useState<RouteDetail | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  // Cargar Ruta + Lista de Clientes disponibles
  const fetchData = async () => {
    try {
      const [resRoute, resClients] = await Promise.all([
        api.get(`/routes/${id}`),
        api.get('/clients')
      ]);
      setRoute(resRoute.data);
      setClients(resClients.data);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // Función para agregar una entrega nueva
  const handleAddDelivery = async () => {
    if (!selectedClientId) return;
    setAdding(true);
    try {
      await api.post(`/routes/${id}/deliveries`, {
        clientId: selectedClientId
      });
      setSelectedClientId('');
      fetchData();
    } catch (error) {
      alert('Error al agregar entrega');
    } finally {
      setAdding(false);
    }
  };

  // Función para completar entrega (NUEVA)
  const handleCompleteDelivery = async (deliveryId: number) => {
    if (!confirm('¿Confirmar que la entrega se realizó con éxito?')) return;
    
    try {
      await api.patch(`/routes/deliveries/${deliveryId}`, {
        status: 'DELIVERED'
      });
      fetchData(); // Recargar la pantalla para ver el cambio
    } catch (error) {
      alert('No se pudo actualizar la entrega');
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Cargando información...</div>;
  if (!route) return <div className="text-center py-20 text-red-500">Ruta no encontrada</div>;

  return (
    <div className="pb-20">
       {/* Botón Volver */}
       <div className="mb-6">
         <Link to="/routes" className="text-gray-500 hover:text-gray-800 flex items-center gap-2 font-medium">
           <ArrowLeft size={20} /> Volver al Itinerario
         </Link>
       </div>

       {/* Encabezado Principal */}
       <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <div>
             <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
               Ruta #{route.id}
               <span className={`text-sm px-3 py-1 rounded-full border font-semibold
                 ${route.status === 'PLANNING' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 'bg-green-100 text-green-800'}`}>
                 {route.status}
               </span>
             </h1>
             <p className="text-gray-500 mt-2 flex items-center gap-2">
               <Calendar size={18} />
               Fecha: <span className="text-gray-800 font-medium">
                 {new Date(route.scheduledDate).toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
               </span>
             </p>
           </div>
           
           <button className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900 transition flex items-center gap-2">
              <MapPin size={18} /> Ver Mapa
           </button>
         </div>
       </div>

       {/* Grid de Información (Chofer y Vehículo) */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10"><User size={100} /></div>
           <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2 text-lg">
             <User className="text-blue-600" /> Conductor
           </h3>
           <div className="space-y-1 relative z-10">
             <p className="text-2xl font-bold text-gray-800">{route.driver.firstName} {route.driver.lastName}</p>
             <p className="text-gray-500">📞 {route.driver.phone || 'Sin teléfono'}</p>
           </div>
         </div>

         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10"><Truck size={100} /></div>
           <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2 text-lg">
             <Truck className="text-green-600" /> Vehículo
           </h3>
           <div className="space-y-1 relative z-10">
             <p className="text-2xl font-bold text-gray-800">{route.vehicle.model}</p>
             <p className="text-gray-600 font-medium bg-gray-100 inline-block px-2 rounded">{route.vehicle.plate}</p>
           </div>
         </div>
       </div>

       {/* SECCIÓN NUEVA: Entregas */}
       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
         <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
           <h2 className="font-bold text-gray-700 flex items-center gap-2 text-lg">
             <Building2 className="text-blue-600" /> Puntos de Entrega
           </h2>
           <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
             {route.deliveries.length} Destinos
           </span>
         </div>

         <div className="p-6">
           {/* Formulario para Agregar Entrega */}
           <div className="flex gap-3 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
             <select 
               className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
               value={selectedClientId}
               onChange={(e) => setSelectedClientId(e.target.value)}
             >
               <option value="">Seleccione un Cliente para agregar...</option>
               {clients.map(client => (
                 <option key={client.id} value={client.id}>{client.companyName}</option>
               ))}
             </select>
             <button 
               onClick={handleAddDelivery}
               disabled={!selectedClientId || adding}
               className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
             >
               <Plus size={18} /> {adding ? 'Agregando...' : 'Agregar Destino'}
             </button>
           </div>

           {/* Lista de Entregas */}
           {route.deliveries.length === 0 ? (
             <div className="text-center py-10 text-gray-400 border-2 border-dashed rounded-lg">
               <MapPin className="mx-auto h-12 w-12 mb-2 opacity-50" />
               <p>Esta ruta no tiene entregas asignadas aún.</p>
             </div>
           ) : (
             <div className="space-y-3">
               {route.deliveries.map((delivery, index) => (
                 <div key={delivery.id} className="flex items-center p-4 border rounded-lg hover:shadow-md transition bg-white group">
                   <div className="mr-4 flex flex-col items-center">
                     <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold border border-slate-300">
                       {index + 1}
                     </div>
                     {index < route.deliveries.length - 1 && (
                       <div className="h-full w-0.5 bg-slate-200 my-1"></div>
                     )}
                   </div>
                   
                   <div className="flex-1">
                     <h4 className="font-bold text-gray-800 text-lg">{delivery.client.companyName}</h4>
                     <p className="text-gray-500 flex items-center gap-1">
                       <MapPin size={14} /> {delivery.client.address}
                     </p>
                   </div>

                   {/* Columna Derecha: Botón de Acción (ACTUALIZADO) */}
                   <div className="text-right">
                     {delivery.status === 'PENDING' ? (
                       <button 
                         onClick={() => handleCompleteDelivery(delivery.id)}
                         className="group flex items-center gap-2 bg-white border border-slate-200 hover:border-green-500 hover:text-green-600 text-slate-500 px-4 py-2 rounded-lg transition-all text-sm font-medium shadow-sm"
                       >
                         <div className="w-2 h-2 rounded-full bg-yellow-400 group-hover:bg-green-500"></div>
                         Marcar Entregado
                       </button>
                     ) : (
                       <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                         <CheckCircle size={14}/> Entregado
                       </span>
                     )}
                   </div>
                 </div>
               ))}
             </div>
           )}
         </div>
       </div>
    </div>
  );
}