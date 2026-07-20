import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { LoadingScreen } from '../../components/LoadingScreen';
import { useAdminAuthStore } from '../../store/adminAuthStore';

export default function AdminLoginPage() {
  const location = useLocation();
  const { login, loading, error, clearError, accessToken } = useAdminAuthStore();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [hydrated, setHydrated] = useState(useAdminAuthStore.persist.hasHydrated());

  const redirectTo = (location.state?.from?.pathname || '/admin/dashboard').replace(/\/$/, '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const trimmedIdentifier = identifier.trim();
    const trimmedPassword = password.trim();
    if (!trimmedIdentifier || !trimmedPassword) return;

    await login(trimmedIdentifier, trimmedPassword);
  };

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

  if (accessToken) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/10 p-6 shadow-xl"
      >
        <h1 className="text-center text-xl font-bold text-white">Espace admin</h1>
        <p className="mt-1 text-center text-sm text-white/60">Connectez-vous pour gérer le catalogue.</p>

        <div className="mt-6 space-y-4">
          <label className="flex flex-col gap-2 text-sm font-medium text-white">
            <span>Email ou identifiant</span>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="h-11 rounded-[8px] border border-white/20 bg-white/90 px-3 text-sm text-gray-900 outline-none transition focus:border-accent"
              placeholder="WDC ou admin@worlddesign.local"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-white">
            <span>Mot de passe</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-[8px] border border-white/20 bg-white/90 px-3 text-sm text-gray-900 outline-none transition focus:border-accent"
              placeholder="••••••••"
            />
          </label>

          {error ? (
            <p className="text-sm text-red-300">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-white py-3 text-sm font-bold text-primary transition hover:bg-white/90 disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </div>
      </form>
    </div>
  );
}
