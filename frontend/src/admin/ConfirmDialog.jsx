import { Modal, Spinner } from 'react-bootstrap';

export default function ConfirmDialog({ show, title, body, confirmLabel = 'Delete', busy = false, onConfirm, onCancel }) {
  return (
    <Modal show={show} onHide={busy ? undefined : onCancel} centered aria-labelledby="confirm-title">
      <Modal.Header closeButton={!busy}>
        <Modal.Title id="confirm-title" as="h2" className="h5 mb-0">
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
        <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={busy}>
          {busy && <Spinner size="sm" animation="border" aria-hidden="true" />} {confirmLabel}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
