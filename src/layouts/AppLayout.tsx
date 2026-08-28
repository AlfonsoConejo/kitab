import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../customHooks/useAuth';
import AppHeader from '../components/header/AppHeader';
import Sidebar from '../components/Sidebar';

const SIDEBAR_COLLAPSED_KEY = 'kitab-sidebar-collapsed';

export default function AppLayout() {
  const { user, authLoading } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(
    () => localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true',
  );

  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(isDesktopSidebarCollapsed));
  }, [isDesktopSidebarCollapsed]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMobileSidebarOpen(false);
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileSidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileSidebarOpen]);

  if (authLoading) {
    return <p>Cargando Aplicación</p>;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="h-dvh flex flex-col">
      <AppHeader
        user={user}
        onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
      />

      <div className="flex flex-1 min-h-0">
        <Sidebar
          isDesktopCollapsed={isDesktopSidebarCollapsed}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onToggleDesktopCollapsed={() => setIsDesktopSidebarCollapsed((collapsed) => !collapsed)}
        />

        <main className="flex flex-col flex-1 overflow-y-auto text-white bg-gray-900 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
