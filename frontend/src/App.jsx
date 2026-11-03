import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PageLoader from './components/PageLoader';
import { ThemeProvider } from './hooks/useTheme';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';

// The admin panel is a separate bundle, so public visitors never download it.
const AdminApp = lazy(() => import('./admin/AdminApp'));

export default function App() {
  return (
    <ThemeProvider>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}
