import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { AdminBreadcrumb } from './AdminBreadcrumb';

const AUTH_KEY = 'world-design-admin-auth';

function getStoredUser() {
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    if (!stored) return null;
    const auth = JSON.parse(stored);
    return auth?.state?.user || null;
  } catch {
    return null;
  }
}

function getUserDisplayName(user) {
  if (!user) return 'Administrateur';
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ').trim();
  return fullName || user.email || 'Administrateur';
}

export function AdminHeader() {
  const navigate = useNavigate();
  const user = getStoredUser();

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    navigate('/admin', { replace: true });
  };

  return (
    <header className="border-b border-[#E0DBD5] bg-white">
      <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <AdminBreadcrumb />

        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <p className="text-sm font-medium text-text-dark">{getUserDisplayName(user)}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent transition hover:opacity-90"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
}