import RouteList from '../components/RouteList';

export default function RoutesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Rutas 🗺️</h1>
      <p className="text-gray-500 mb-6">Planifica las entregas asignando camiones y choferes.</p>
      
      <RouteList />
    </div>
  );
}