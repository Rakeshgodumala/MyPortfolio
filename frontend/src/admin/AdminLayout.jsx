import { useEffect, useState } from 'react';
import { Container, Nav } from 'react-bootstrap';
import { FiAward, FiExternalLink, FiGrid, FiInbox, FiLogOut } from 'react-icons/fi';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { adminApi } from '../services/adminService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const tabs = [
  { to: '/admin/dashboard', label: 'Projects', icon: FiGrid },
  { to: '/admin/certifications', label: 'Certifications', icon: FiAward },
  { to: '/admin/messages', label: 'Messages', icon: FiInbox },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [systemStatus, setSystemStatus] = useState(null);

  useEffect(() => {
    document.title = 'Dashboard | Portfolio admin';
    adminApi.status().then(setSystemStatus).catch(() => {});
  }, []);

  const onLogout = async () => {
    await logout().catch(() => {});
    notify('You have been signed out.');
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <Container className="d-flex align-items-center justify-content-between gap-3 py-2">
          <div className="d-flex align-items-center gap-2">
            <span className="brand-mark" aria-hidden="true">
              <span>RG</span>
            </span>
            <div className="lh-sm">
              <div className="fw-bold" style={{ color: 'var(--pf-heading)' }}>
                Portfolio Admin
              </div>
              <div className="small text-muted-pf d-none d-sm-block">{admin?.email}</div>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <a className="btn btn-ghost btn-sm d-none d-sm-inline-flex" href="/" target="_blank" rel="noopener noreferrer">
              <FiExternalLink aria-hidden="true" /> View site
            </a>
            <ThemeToggle />
            <button type="button" className="btn btn-ghost btn-sm" onClick={onLogout}>
              <FiLogOut aria-hidden="true" /> <span className="d-none d-sm-inline">Log out</span>
            </button>
          </div>
        </Container>
        <Container>
          <Nav as="nav" className="admin-tabs" aria-label="Admin sections">
            {tabs.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className="admin-tab">
                <Icon aria-hidden="true" /> {label}
              </NavLink>
            ))}
          </Nav>
        </Container>
      </header>

      <main className="py-4 py-md-5">
        <Container>
          {systemStatus?.imageStorage === 'unconfigured' && (
            <div className="alert alert-warning small">
              <strong>Image uploads are disabled:</strong> set <code>CLOUDINARY_URL</code> on the backend to store
              screenshots persistently.
            </div>
          )}
          {systemStatus?.imageStorage === 'local' && (
            <div className="alert alert-info small">
              Images are being saved to the local <code>backend/uploads</code> folder (development mode). Configure
              Cloudinary before deploying.
            </div>
          )}
          <Outlet context={{ systemStatus }} />
        </Container>
      </main>
    </div>
  );
}
