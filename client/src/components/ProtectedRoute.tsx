import { Navigate } from 'react-router-dom';

interface Props {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: Props) {
  // Buscamos el pase en el bolsillo
  const token = localStorage.getItem('token');

  // Si no hay pase, lo mandamos al Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si hay pase, mostramos el contenido secreto (children)
  return children;
}