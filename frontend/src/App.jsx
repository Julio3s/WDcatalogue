import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AdminLayout } from './components/admin/AdminLayout';
import { LoadingScreen } from './components/LoadingScreen';
import { ToastContainer } from './components/Toast';
import { PublicLayout } from './components/PublicLayout';

const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const SelectionPage = lazy(() => import('./pages/SelectionPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
import AdminLoginPage from './pages/admin/AdminLogin';
import AdminDashboardPage from './pages/admin/DashboardPage';
import AdminSearchPage from './pages/admin/SearchPage';
import AdminProductsPage from './pages/admin/ProductsPage';
import AdminCategoriesPage from './pages/admin/CategoriesPage';
const InfoPage = lazy(() => import('./pages/InfoPage'));
const FaqPage = lazy(() => import('./pages/FaqPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ToastContainer />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/:slug" element={<ProductDetailPage />} />
            <Route path="ma-selection" element={<SelectionPage />} />
            <Route path="info" element={<InfoPage />} />
            <Route path="faq" element={<FaqPage />} />
            <Route path="conditions" element={<TermsPage />} />
          </Route>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="search" element={<AdminSearchPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
