import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { authApi } from '../services/adminService';

const AuthContext = createContext(null);

/**
 * Tracks whether the browser currently holds a valid admin session. This only drives the UI:
 * the backend checks the HttpOnly session cookie on every admin request regardless.
 */
export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    authApi
      .me()
      .then(setAdmin)
      .catch(() => setAdmin(null))
      .finally(() => setChecking(false));
  }, []);

  // If any admin request comes back 401 (expired or revoked session), drop back to the login page.
  useEffect(() => {
    const id = api.interceptors.response.use(undefined, (error) => {
      const url = error.config?.url || '';
      if (error.response?.status === 401 && url.startsWith('/admin/')) {
        setAdmin(null);
        setSessionExpired(true);
      }
      return Promise.reject(error);
    });
    return () => api.interceptors.response.eject(id);
  }, []);

  const login = useCallback(async (email, password) => {
    const result = await authApi.login(email, password);
    setSessionExpired(false);
    setAdmin(result);
    return result;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setAdmin(null);
    }
  }, []);

  const value = useMemo(
    () => ({ admin, checking, sessionExpired, login, logout }),
    [admin, checking, sessionExpired, login, logout],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
