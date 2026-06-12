import { Outlet} from 'react-router-dom';
import { useAuth } from  '../customHooks/useAuth' 
import AppHeader from '../components/header/AppHeader';
import Sidebar from '../components/Sidebar'
export default function AppLayout() {

  const {user, setUser, authLoading} = useAuth();
  console.log(user, authLoading);

  if (authLoading) {
    return <p>Cargando Aplicación</p>;
  }

  return(
    <div className="h-dvh flex flex-col">
      <AppHeader 
        user={user}
        setUser={setUser}
        authLoading={authLoading}
      />

      <div className="flex flex-1 min-h-0">
        <Sidebar />

        <main className="flex flex-col flex-1 overflow-y-auto text-white bg-gray-900 px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}