import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { AdminBottomNav } from './AdminBottomNav';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import { PageTransition } from '../PageTransition';
import { ScrollToTop } from '../ScrollToTop';
import { LoadingScreen } from '../LoadingScreen';
import { useAdminAuthStore } from '../../store/adminAuthStore';

export function AdminLayout() {
  const accessToken = useAdminAuthStore((state) => state.accessToken);
  const [hydrated, setHydrated] = useState(useAdminAuthStore.persist.hasHydrated());

  useEffect(() => {
    const unsubscribe = useAdminAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    setHydrated(useAdminAuthStore.persist.hasHydrated());

    return unsubscribe;
  }, []);

  if (!hydrated) {
    return <LoadingScreen />;
  }

  if (!accessToken) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-cream text-text-dark">
      <ScrollToTop />
      <AdminSidebar />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <AdminHeader />

        <main className="flex-1 px-4 py-6 pb-24 sm:px-6 lg:pb-6">
          <div className="mx-auto w-full max-w-7xl">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </div>
        </main>
      </div>

      <AdminBottomNav />
    </div>
  );
}
