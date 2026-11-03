import { useEffect, useState } from 'react';
import { Alert, Form, Spinner } from 'react-bootstrap';
import { FiArrowLeft, FiEye, FiEyeOff, FiLock } from 'react-icons/fi';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import PageLoader from '../components/PageLoader';
import { parseApiError } from '../services/api';
import { useAuth } from './AuthContext';

export default function AdminLogin() {
  const { admin, checking, sessionExpired, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Admin login | Portfolio';
  }, []);

  if (checking) return <PageLoader label="Checking your session…" />;
  if (admin) return <Navigate to="/admin/dashboard" replace />;

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await login(email.trim(), password);
      navigate(location.state?.from || '/admin/dashboard', { replace: true });
    } catch (err) {
      setError(parseApiError(err, 'Login failed.').message);
      setPassword('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="admin-login">
      <div className="position-absolute top-0 end-0 p-3">
        <ThemeToggle />
      </div>
      <div className="pf-card admin-login-card p-4 p-sm-5">
        <div className="text-center mb-4">
          <span className="icon-tile mb-3" aria-hidden="true">
            <FiLock />
          </span>
          <h1 className="h4 mb-1">Admin sign in</h1>
          <p className="text-muted-pf small mb-0">Manage the projects shown on your portfolio.</p>
        </div>

        {sessionExpired && !error && (
          <Alert variant="warning" className="small">
            Your session has expired. Please sign in again.
          </Alert>
        )}
        {error && (
          <Alert variant="danger" className="small" role="alert">
            {error}
          </Alert>
        )}

        <Form noValidate onSubmit={onSubmit}>
          <Form.Group className="mb-3" controlId="admin-email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </Form.Group>
          <Form.Group className="mb-4" controlId="admin-password">
            <Form.Label>Password</Form.Label>
            <div className="position-relative">
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                className="btn btn-link password-toggle"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </Form.Group>
          <button type="submit" className="btn btn-accent w-100" disabled={submitting}>
            {submitting ? (
              <>
                <Spinner size="sm" animation="border" aria-hidden="true" /> Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </Form>

        <div className="text-center mt-4">
          <Link to="/" className="small d-inline-flex align-items-center gap-1">
            <FiArrowLeft aria-hidden="true" /> Back to portfolio
          </Link>
        </div>
      </div>
    </main>
  );
}
