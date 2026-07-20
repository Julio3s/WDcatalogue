import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axios';

const AUTH_KEY = 'world-design-admin-auth';

const useAdminAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      loading: false,
      error: '',

      login: async (identifier, password) => {
        set({ loading: true, error: '' });
        try {
          const response = await api.post('/auth/login/', {
            identifier,
            password,
          });

          const accessToken = response.data.access;
          const user = response.data.user;

          if (!accessToken || !user) {
            throw new Error("La réponse d'authentification est invalide.");
          }

          localStorage.setItem(AUTH_KEY, JSON.stringify({
            state: {
              user,
              accessToken,
            },
          }));

          set({
            user,
            accessToken,
            loading: false,
            error: '',
          });

          window.location.assign('/admin/dashboard');
        } catch (err) {
          const message = err?.response?.data?.detail || "Identifiant ou mot de passe incorrect.";
          set({
            error: message,
            loading: false,
          });
        }
      },

      logout: () => {
        localStorage.removeItem(AUTH_KEY);
        set({
          user: null,
          accessToken: null,
          loading: false,
          error: '',
        });
        window.location.assign('/admin');
      },

      clearError: () => {
        set({ error: '' });
      },
    }),
    {
      name: AUTH_KEY,
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
    }
  )
);

export { useAdminAuthStore };
