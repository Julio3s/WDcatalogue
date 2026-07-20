import { createBrowserRouter } from 'react-router-dom';

import App from './App';

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { index: true, path: '/' },
      { path: 'products' },
      { path: 'products/:slug' },
      { path: 'ma-selection' },
      { path: 'info' },
      { path: 'faq' },
      { path: 'conditions' },
      { path: 'admin/login', lazy: () => import('./pages/admin/AdminLogin') },
      {
        path: '/admin',
        lazy: () => import('./components/admin/AdminLayout'),
        children: [
          { index: true, path: 'dashboard', lazy: () => import('./pages/admin/DashboardPage') },
          { path: 'products', lazy: () => import('./pages/admin/ProductsPage') },
          { path: 'categories', lazy: () => import('./pages/admin/CategoriesPage') },
        ],
      },
      { path: '*', lazy: () => import('./pages/NotFoundPage') },
    ],
  },
]);

export default router;
