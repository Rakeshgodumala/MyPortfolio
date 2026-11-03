import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const ToastContext = createContext({ notify: () => {} });

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => setToasts((list) => list.filter((toast) => toast.id !== id)), []);

  const notify = useCallback((message, variant = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((list) => [...list.slice(-3), { id, message, variant }]);
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer position="bottom-end" className="p-3 position-fixed" style={{ zIndex: 2000 }}>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            onClose={() => dismiss(toast.id)}
            delay={toast.variant === 'danger' ? 7000 : 4000}
            autohide
            className={`admin-toast admin-toast-${toast.variant}`}
            role={toast.variant === 'danger' ? 'alert' : 'status'}
          >
            <Toast.Body className="d-flex align-items-start gap-2">
              {toast.variant === 'danger' ? (
                <FiAlertCircle className="flex-shrink-0 mt-1" aria-hidden="true" />
              ) : (
                <FiCheckCircle className="flex-shrink-0 mt-1" aria-hidden="true" />
              )}
              <span className="flex-grow-1">{toast.message}</span>
              <button type="button" className="btn-close btn-close-sm ms-2" aria-label="Close" onClick={() => dismiss(toast.id)} />
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
