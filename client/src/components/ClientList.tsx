import { useEffect, useState } from 'react';
import { Building2, Plus, MapPin } from 'lucide-react';
import api from '../services/api';
import ClientForm from './ClientForm';

interface Client {
  id: number;
  companyName: string;
  address: string;
}

export default function ClientList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [showForm, setShowForm] = useState(false);

  const fetchClients = async () => {
    try {
      const res = await api.get('/clients');
      setClients(res.data);
    } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchClients(); }, []);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="font-semibold text-gray-700 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" /> Cartera de Clientes
          </h2>
          <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex gap-2 hover:bg-blue-700">
            <Plus size={16} /> Nuevo
          </button>
        </div>
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Empresa</th>
              <th className="px-6 py-3">Dirección</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{client.companyName}</td>
                <td className="px-6 py-4 flex items-center gap-2"><MapPin size={14}/> {client.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm && <ClientForm onSuccess={() => { setShowForm(false); fetchClients(); }} onCancel={() => setShowForm(false)} />}
    </>
  );
}