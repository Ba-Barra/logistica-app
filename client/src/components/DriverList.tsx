import { useEffect, useState } from 'react';
import { Users, Plus, Phone, CreditCard } from 'lucide-react';
import api from '../services/api';
import DriverForm from './DriverForm';

interface Driver {
  id: number;
  firstName: string;
  lastName: string;
  license: string;
  phone: string;
  status: string;
}

export default function DriverList() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [showForm, setShowForm] = useState(false);

  const fetchDrivers = async () => {
    try {
      const res = await api.get('/drivers');
      setDrivers(res.data);
    } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchDrivers(); }, []);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="font-semibold text-gray-700 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" /> Choferes
          </h2>
          <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex gap-2 hover:bg-blue-700">
            <Plus size={16} /> Nuevo
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
          {drivers.map(driver => (
            <div key={driver.id} className="border rounded-lg p-4 hover:shadow-md transition bg-white">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-800">{driver.firstName} {driver.lastName}</h3>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">{driver.status}</span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="flex items-center gap-2"><CreditCard size={14}/> {driver.license}</p>
                <p className="flex items-center gap-2"><Phone size={14}/> {driver.phone || 'Sin teléfono'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showForm && <DriverForm onSuccess={() => { setShowForm(false); fetchDrivers(); }} onCancel={() => setShowForm(false)} />}
    </>
  );
}