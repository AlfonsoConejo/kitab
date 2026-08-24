import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from  '../customHooks/useAuth' 
import AppHeader from '../components/header/AppHeader';
import Sidebar from '../components/Sidebar'

export default function AppLayout() {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <p>Cargando Aplicación</p>;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="h-dvh flex flex-col">
      <AppHeader user={user}/>

      <div className="flex flex-1 min-h-0">
        <Sidebar />

        <main className="flex flex-col flex-1 overflow-y-auto text-white bg-gray-900 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}