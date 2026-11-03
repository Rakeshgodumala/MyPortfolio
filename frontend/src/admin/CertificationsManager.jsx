import { useCallback, useEffect, useState } from 'react';
import { Alert, Col, Form, Row, Spinner } from 'react-bootstrap';
import { FiEdit2, FiExternalLink, FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import { parseApiError } from '../services/api';
import { adminApi } from '../services/adminService';
import ConfirmDialog from './ConfirmDialog';
import { useToast } from './ToastContext';

const EMPTY = { title: '', issuer: '', credentialUrl: '', displayOrder: '' };

export default function CertificationsManager() {
  const { notify } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [editingId, setEditingId] = useState(null); // null = closed, 'new' = adding
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await adminApi.listCertifications());
      setLoadError('');
    } catch (err) {
      setLoadError(parseApiError(err, 'Certifications could not be loaded.').message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Certifications | Portfolio admin';
    load();
  }, [load]);

  const openEditor = (item) => {
    setEditingId(item ? item._id : 'new');
    setValues(item ? { ...EMPTY, ...item, displayOrder: item.displayOrder ?? '' } : EMPTY);
    setErrors({});
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setErrors({});
    const body = {
      title: values.title,
      issuer: values.issuer,
      credentialUrl: values.credentialUrl.trim(),
      displayOrder: values.displayOrder === '' ? undefined : Number(values.displayOrder),
    };
    try {
      if (editingId === 'new') {
        await adminApi.createCertification(body);
        notify('Certification added.');
      } else {
        await adminApi.updateCertification(editingId, body);
        notify('Certification updated.');
      }
      setEditingId(null);
      load();
    } catch (err) {
      const parsed = parseApiError(err, 'Certification could not be saved.');
      setErrors({ ...parsed.fieldErrors, _form: parsed.message });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await adminApi.deleteCertification(toDelete._id);
      setItems((list) => list.filter((c) => c._id !== toDelete._id));
      notify('Certification deleted.');
      setToDelete(null);
    } catch (err) {
      notify(parseApiError(err).message, 'danger');
    } finally {
      setDeleting(false);
    }
  };

  const onField = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1">Certifications</h1>
          <p className="text-muted-pf mb-0">
            Add a verification link only for credentials you can share. Without a link, no &ldquo;verify&rdquo; button is shown.
          </p>
        </div>
        {editingId === null && (
          <button type="button" className="btn btn-accent" onClick={() => openEditor(null)}>
            <FiPlus aria-hidden="true" /> Add certification
          </button>
        )}
      </div>

      {editingId !== null && (
        <Form noValidate onSubmit={onSubmit} className="pf-card p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h5 mb-0">{editingId === 'new' ? 'New certification' : 'Edit certification'}</h2>
            <button type="button" className="btn btn-ghost icon-btn-sm" onClick={() => setEditingId(null)} aria-label="Close editor">
              <FiX />
            </button>
          </div>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group controlId="cert-title">
                <Form.Label>Title *</Form.Label>
                <Form.Control name="title" value={values.title} onChange={onField} isInvalid={Boolean(errors.title)} maxLength={150} />
                <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="cert-issuer">
                <Form.Label>Issuer *</Form.Label>
                <Form.Control name="issuer" value={values.issuer} onChange={onField} isInvalid={Boolean(errors.issuer)} maxLength={100} />
                <Form.Control.Feedback type="invalid">{errors.issuer}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={9}>
              <Form.Group controlId="cert-url">
                <Form.Label>Verification URL</Form.Label>
                <Form.Control
                  type="url"
                  name="credentialUrl"
                  value={values.credentialUrl}
                  onChange={onField}
                  isInvalid={Boolean(errors.credentialUrl)}
                  placeholder="https://…"
                />
                <Form.Control.Feedback type="invalid">{errors.credentialUrl}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="cert-order">
                <Form.Label>Order</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  name="displayOrder"
                  value={values.displayOrder}
                  onChange={onField}
                  isInvalid={Boolean(errors.displayOrder)}
                />
                <Form.Control.Feedback type="invalid">{errors.displayOrder}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          {errors._form && <Alert variant="danger" className="mt-3 mb-0">{errors._form}</Alert>}
          <div className="d-flex gap-2 mt-4">
            <button type="submit" className="btn btn-accent" disabled={saving}>
              {saving && <Spinner size="sm" animation="border" aria-hidden="true" />} Save
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setEditingId(null)} disabled={saving}>
              Cancel
            </button>
          </div>
        </Form>
      )}

      {loading && (
        <div className="text-center py-5" role="status">
          <Spinner animation="border" style={{ color: 'var(--pf-accent)' }} />
        </div>
      )}
      {!loading && loadError && <Alert variant="danger">{loadError}</Alert>}
      {!loading && !loadError && items.length === 0 && (
        <p className="text-muted-pf">No certifications yet.</p>
      )}

      <ul className="list-unstyled d-grid gap-3 mb-0">
        {items.map((cert) => (
          <li key={cert._id} className="pf-card p-3 d-flex flex-wrap align-items-center gap-3">
            <div className="flex-grow-1" style={{ minWidth: 200 }}>
              <div className="fw-semibold" style={{ color: 'var(--pf-heading)' }}>
                {cert.title}
              </div>
              <div className="small text-muted-pf">
                {cert.issuer} · Order {cert.displayOrder}
              </div>
              {cert.credentialUrl ? (
                <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="small">
                  Verification link <FiExternalLink aria-hidden="true" />
                </a>
              ) : (
                <span className="small text-muted-pf">No verification link</span>
              )}
            </div>
            <div className="d-flex gap-2">
              <button type="button" className="btn btn-soft btn-sm" onClick={() => openEditor(cert)}>
                <FiEdit2 aria-hidden="true" /> Edit
              </button>
              <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => setToDelete(cert)} aria-label={`Delete ${cert.title}`}>
                <FiTrash2 aria-hidden="true" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <ConfirmDialog
        show={Boolean(toDelete)}
        title="Delete certification?"
        body={<><strong>{toDelete?.title}</strong> will be removed from your portfolio.</>}
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
