import { useRef, useState } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { FiImage, FiTrash2, FiUploadCloud } from 'react-icons/fi';
import { parseApiError, resolveImageUrl } from '../services/api';
import { adminApi } from '../services/adminService';

const MAX_BYTES = 2 * 1024 * 1024;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

export default function ImageUploader({ imageUrl, onUploaded, onRemove, error, disabled }) {
  const inputRef = useRef(null);
  const [progress, setProgress] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [dragging, setDragging] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    setUploadError('');
    // Quick checks for a friendly message; the server re-validates the actual file contents.
    if (!ACCEPTED.includes(file.type)) {
      setUploadError('Please choose a JPEG, PNG or WebP image.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setUploadError(`Image is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is 2 MB.`);
      return;
    }
    setProgress(0);
    try {
      const stored = await adminApi.uploadImage(file, setProgress);
      onUploaded(stored);
    } catch (err) {
      setUploadError(parseApiError(err, 'Upload failed.').message);
    } finally {
      setProgress(null);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const busy = progress !== null;
  const message = uploadError || error;

  return (
    <div>
      {imageUrl ? (
        <div className="image-preview">
          <img src={resolveImageUrl(imageUrl)} alt="Project screenshot preview" />
          <div className="image-preview-actions">
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => inputRef.current?.click()} disabled={busy || disabled}>
              <FiImage aria-hidden="true" /> Replace
            </button>
            <button type="button" className="btn btn-outline-danger btn-sm" onClick={onRemove} disabled={busy || disabled}>
              <FiTrash2 aria-hidden="true" /> Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className={`dropzone ${dragging ? 'is-dragging' : ''} ${message ? 'is-invalid' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          disabled={busy || disabled}
        >
          <FiUploadCloud className="mb-2" style={{ fontSize: '2rem', color: 'var(--pf-accent)' }} aria-hidden="true" />
          <span className="fw-semibold d-block" style={{ color: 'var(--pf-heading)' }}>
            Click to upload or drag and drop
          </span>
          <span className="small text-muted-pf">JPEG, PNG or WebP · up to 2 MB · 16:10 screenshots look best</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(',')}
        className="d-none"
        onChange={(e) => handleFile(e.target.files?.[0])}
        aria-label="Upload project screenshot"
      />

      {busy && <ProgressBar now={progress} label={`${progress}%`} className="mt-2" />}
      {message && (
        <div className="invalid-feedback d-block" role="alert">
          {message}
        </div>
      )}
    </div>
  );
}
