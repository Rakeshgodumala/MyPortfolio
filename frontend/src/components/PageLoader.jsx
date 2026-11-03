import { Spinner } from 'react-bootstrap';

export default function PageLoader({ label = 'Loading…' }) {
  return (
    <div className="full-center" role="status" aria-live="polite">
      <div className="text-center">
        <Spinner animation="border" style={{ color: 'var(--pf-accent)' }} />
        <p className="mt-3 text-muted-pf">{label}</p>
      </div>
    </div>
  );
}
