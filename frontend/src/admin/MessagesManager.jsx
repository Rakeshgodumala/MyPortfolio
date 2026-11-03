import { useCallback, useEffect, useState } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { FiCornerUpLeft, FiMail, FiRefreshCw, FiTrash2 } from 'react-icons/fi';
import { useOutletContext } from 'react-router-dom';
import { parseApiError } from '../services/api';
import { adminApi } from '../services/adminService';
import ConfirmDialog from './ConfirmDialog';
import { useToast } from './ToastContext';

const formatDate = (iso) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

export default function MessagesManager() {
  const { notify } = useToast();
  const { systemStatus } = useOutletContext() || {};
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setMessages(await adminApi.listMessages());
      setError('');
    } catch (err) {
      setError(parseApiError(err, 'Messages could not be loaded.').message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Messages | Portfolio admin';
    load();
  }, [load]);

  const toggleRead = async (msg) => {
    try {
      const updated = await adminApi.setMessageRead(msg._id, !msg.read);
      setMessages((list) => list.map((m) => (m._id === updated._id ? updated : m)));
    } catch (err) {
      notify(parseApiError(err).message, 'danger');
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await adminApi.deleteMessage(toDelete._id);
      setMessages((list) => list.filter((m) => m._id !== toDelete._id));
      notify('Message deleted.');
      setToDelete(null);
    } catch (err) {
      notify(parseApiError(err).message, 'danger');
    } finally {
      setDeleting(false);
    }
  };

  const unread = messages.filter((m) => !m.read).length;

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1">Messages</h1>
          <p className="text-muted-pf mb-0">
            Contact form submissions{unread ? ` · ${unread} unread` : ''}.
          </p>
        </div>
        <button type="button" className="btn btn-ghost btn-sm" onClick={load} disabled={loading}>
          <FiRefreshCw aria-hidden="true" /> Refresh
        </button>
      </div>

      {systemStatus?.email === 'not-configured' && (
        <Alert variant="info" className="small">
          Email delivery is not configured, so new messages are only stored here. Set the SMTP variables on the backend to
          also receive them by email.
        </Alert>
      )}

      {loading && (
        <div className="text-center py-5" role="status">
          <Spinner animation="border" style={{ color: 'var(--pf-accent)' }} />
        </div>
      )}
      {!loading && error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && messages.length === 0 && (
        <div className="pf-card p-5 text-center text-muted-pf">
          <FiMail style={{ fontSize: '2rem' }} aria-hidden="true" />
          <p className="mt-2 mb-0">No messages yet.</p>
        </div>
      )}

      <ul className="list-unstyled d-grid gap-3 mb-0">
        {messages.map((msg) => (
          <li key={msg._id} className={`pf-card p-4 message-card ${msg.read ? '' : 'is-unread'}`}>
            <div className="d-flex flex-wrap justify-content-between gap-2 mb-2">
              <div>
                <div className="fw-semibold" style={{ color: 'var(--pf-heading)' }}>
                  {msg.subject}
                </div>
                <div className="small text-muted-pf">
                  {msg.name} · <a href={`mailto:${msg.email}`}>{msg.email}</a>
                </div>
              </div>
              <div className="small text-muted-pf text-md-end">
                {formatDate(msg.createdAt)}
                <div>{msg.emailDelivered ? 'Emailed to you' : 'Stored only'}</div>
              </div>
            </div>
            <p className="mb-3" style={{ whiteSpace: 'pre-line' }}>
              {msg.message}
            </p>
            <div className="d-flex flex-wrap gap-2">
              <a
                className="btn btn-soft btn-sm"
                href={`mailto:${msg.email}?subject=${encodeURIComponent(`Re: ${msg.subject}`)}`}
              >
                <FiCornerUpLeft aria-hidden="true" /> Reply
              </a>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => toggleRead(msg)}>
                Mark as {msg.read ? 'unread' : 'read'}
              </button>
              <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => setToDelete(msg)} aria-label="Delete message">
                <FiTrash2 aria-hidden="true" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <ConfirmDialog
        show={Boolean(toDelete)}
        title="Delete message?"
        body={<>The message from <strong>{toDelete?.name}</strong> will be permanently deleted.</>}
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
