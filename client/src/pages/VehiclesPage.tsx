import VehicleList from '../components/VehicleList';

export default function VehiclesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Vehículos 🚛</h1>
      <VehicleList />
    </div>
  );
}