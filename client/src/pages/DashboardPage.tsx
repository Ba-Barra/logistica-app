import { useEffect, useState } from 'react';
import { Truck, Users, Map, Package } from 'lucide-react';
import api from '../services/api';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    vehicles: 0,
    drivers: 0,
    activeRoutes: 0,
    pendingDeliveries: 0
  });

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  // Componente interno para las tarjetas (para no repetir código)
  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
      <div className={`p-4 rounded-full ${color} text-white`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Panel de Control 🚀</h1>
      <p className="text-gray-500 mb-8">Resumen operativo de tu flota en tiempo real.</p>

      {/* Grid de Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="Flota Total" 
          value={stats.vehicles} 
          icon={Truck} 
          color="bg-blue-600" 
        />
        <StatCard 
          title="Choferes" 
          value={stats.drivers} 
          icon={Users} 
          color="bg-indigo-600" 
        />
        <StatCard 
          title="Rutas Activas" 
          value={stats.activeRoutes} 
          icon={Map} 
          color="bg-amber-500" 
        />
        <StatCard 
          title="Entregas Pendientes" 
          value={stats.pendingDeliveries} 
          icon={Package} 
          color="bg-emerald-500" 
        />
      </div>

      {/* Sección de Bienvenida Rápida */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">¡Bienvenido a Logística Pro!</h2>
        <p className="opacity-80 max-w-2xl">
          Desde aquí puedes gestionar toda tu operación. Selecciona una opción del menú superior para comenzar a planificar los viajes de hoy.
        </p>
      </div>
    </div>
  );
}