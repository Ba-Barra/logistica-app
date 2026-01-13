import ClientList from '../components/ClientList';

export default function ClientsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Clientes 🏢</h1>
      <ClientList />
    </div>
  );
}