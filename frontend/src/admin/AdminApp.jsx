import { Navigate, Route, Routes } from 'react-router-dom';
import '../styles/admin.css';
import AdminLayout from './AdminLayout';
import AdminLogin from './AdminLogin';
import { AuthProvider } from './AuthContext';
import CertificationsManager from './CertificationsManager';
import MessagesManager from './MessagesManager';
import ProjectFormPage from './ProjectFormPage';
import ProjectsManager from './ProjectsManager';
import ProtectedRoute from './ProtectedRoute';
import { ToastProvider } from './ToastContext';

export default function AdminApp() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route path="login" element={<AdminLogin />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<ProjectsManager />} />
              <Route path="projects/new" element={<ProjectFormPage />} />
              <Route path="projects/:id/edit" element={<ProjectFormPage />} />
              <Route path="certifications" element={<CertificationsManager />} />
              <Route path="messages" element={<MessagesManager />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}
