import { Calendar, AlertTriangle } from 'lucide-react';

export default function RoutesPage() {
  return (
    <div className="text-center py-20">
      <div className="bg-blue-50 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6">
        <Calendar className="h-10 w-10 text-blue-600" />
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Planificación de Rutas</h2>
      <p className="text-gray-500 max-w-md mx-auto mb-8">
        Aquí es donde ocurrirá la magia. Podrás asignar choferes a camiones y definir las entregas del día en un calendario interactivo.
      </p>
      
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-200 text-sm">
        <AlertTriangle size={16} />
        <span>Necesitamos tener Choferes y Clientes listos antes de empezar aquí.</span>
      </div>
    </div>
  );
}