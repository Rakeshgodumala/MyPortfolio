import { useCallback, useEffect, useState } from 'react';
import { Alert, Form, Spinner } from 'react-bootstrap';
import { FiArrowDown, FiArrowUp, FiEdit2, FiEye, FiPlus, FiRefreshCw, FiStar, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import ProjectDetailsModal from '../components/ProjectDetailsModal';
import { initials } from '../components/ProjectCard';
import { parseApiError, resolveImageUrl } from '../services/api';
import { adminApi } from '../services/adminService';
import ConfirmDialog from './ConfirmDialog';
import { useToast } from './ToastContext';

export default function ProjectsManager() {
  const { notify } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [preview, setPreview] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setProjects(await adminApi.listProjects());
    } catch (err) {
      setError(parseApiError(err, 'Projects could not be loaded.').message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const togglePublished = async (project) => {
    setBusyId(project._id);
    try {
      const updated = await adminApi.setPublished(project._id, !project.published);
      setProjects((list) => list.map((p) => (p._id === updated._id ? { ...p, published: updated.published } : p)));
      notify(updated.published ? `"${updated.title}" is now live on your portfolio.` : `"${updated.title}" was unpublished.`);
    } catch (err) {
      notify(parseApiError(err).message, 'danger');
    } finally {
      setBusyId(null);
    }
  };

  const move = async (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= projects.length) return;
    const reordered = [...projects];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    const previous = projects;
    setProjects(reordered); // optimistic update
    setBusyId(reordered[target]._id);
    try {
      setProjects(await adminApi.reorderProjects(reordered.map((p) => p._id)));
    } catch (err) {
      setProjects(previous);
      notify(parseApiError(err, 'Order could not be saved.').message, 'danger');
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await adminApi.deleteProject(toDelete._id);
      setProjects((list) => list.filter((p) => p._id !== toDelete._id));
      notify(`"${toDelete.title}" was deleted.`);
      setToDelete(null);
    } catch (err) {
      notify(parseApiError(err, 'Project could not be deleted.').message, 'danger');
    } finally {
      setDeleting(false);
    }
  };

  const stats = [
    { label: 'Total projects', value: projects.length },
    { label: 'Published', value: projects.filter((p) => p.published).length },
    { label: 'Drafts', value: projects.filter((p) => !p.published).length },
    { label: 'Featured', value: projects.filter((p) => p.featured).length },
  ];

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1">Projects</h1>
          <p className="text-muted-pf mb-0">Published projects appear on your portfolio in the order shown here.</p>
        </div>
        <Link to="/admin/projects/new" className="btn btn-accent">
          <FiPlus aria-hidden="true" /> Add Project
        </Link>
      </div>

      <div className="row g-3 mb-4">
        {stats.map((stat) => (
          <div className="col-6 col-md-3" key={stat.label}>
            <div className="pf-card p-3 h-100">
              <div className="small text-muted-pf">{stat.label}</div>
              <div className="h3 mb-0 fw-bold" style={{ color: 'var(--pf-heading)' }}>
                {loading ? '–' : stat.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="text-center py-5" role="status">
          <Spinner animation="border" style={{ color: 'var(--pf-accent)' }} />
          <p className="text-muted-pf mt-2">Loading projects…</p>
        </div>
      )}

      {!loading && error && (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center justify-content-between gap-2">
          {error}
          <button type="button" className="btn btn-sm btn-ghost" onClick={load}>
            <FiRefreshCw aria-hidden="true" /> Retry
          </button>
        </Alert>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="pf-card text-center p-5">
          <h2 className="h5">No projects yet</h2>
          <p className="text-muted-pf">Add your first project and it will appear on your portfolio when published.</p>
          <Link to="/admin/projects/new" className="btn btn-accent">
            <FiPlus aria-hidden="true" /> Add Project
          </Link>
        </div>
      )}

      {!loading && !error && projects.length > 0 && (
        <ul className="list-unstyled d-grid gap-3 mb-0">
          {projects.map((project, index) => (
            <li key={project._id} className="pf-card admin-project-row">
              <div className="admin-order" aria-label={`Position ${index + 1}`}>
                <button
                  type="button"
                  className="btn btn-ghost icon-btn-sm"
                  onClick={() => move(index, -1)}
                  disabled={index === 0 || busyId !== null}
                  aria-label={`Move ${project.title} up`}
                >
                  <FiArrowUp />
                </button>
                <span className="small fw-semibold">{index + 1}</span>
                <button
                  type="button"
                  className="btn btn-ghost icon-btn-sm"
                  onClick={() => move(index, 1)}
                  disabled={index === projects.length - 1 || busyId !== null}
                  aria-label={`Move ${project.title} down`}
                >
                  <FiArrowDown />
                </button>
              </div>

              <div className="admin-thumb">
                {project.imageUrl ? (
                  <img src={resolveImageUrl(project.imageUrl)} alt="" loading="lazy" />
                ) : (
                  <div className="project-placeholder" style={{ fontSize: '1.2rem' }}>
                    {initials(project.title)}
                  </div>
                )}
              </div>

              <div className="admin-project-info">
                <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                  <h2 className="h6 mb-0">{project.title}</h2>
                  {project.featured && (
                    <span className="tag tag-accent">
                      <FiStar className="me-1" aria-hidden="true" /> Featured
                    </span>
                  )}
                  <span className={`tag ${project.published ? 'tag-success' : 'tag-warning'}`}>
                    {project.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="small text-muted-pf text-truncate">
                  {project.category}
                  {project.technologies?.length ? ` · ${project.technologies.join(', ')}` : ''}
                </div>
                <div className="small text-muted-pf">
                  {project.liveDemoUrl ? 'Live demo ✓' : 'No live demo'} · {project.githubUrl ? 'GitHub ✓' : 'No GitHub link'}
                </div>
              </div>

              <div className="admin-project-actions">
                <Form.Check
                  type="switch"
                  id={`publish-${project._id}`}
                  label={project.published ? 'Live' : 'Hidden'}
                  checked={project.published}
                  disabled={busyId === project._id}
                  onChange={() => togglePublished(project)}
                  aria-label={`${project.published ? 'Unpublish' : 'Publish'} ${project.title}`}
                />
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPreview(project)}>
                  <FiEye aria-hidden="true" /> Preview
                </button>
                <Link to={`/admin/projects/${project._id}/edit`} className="btn btn-soft btn-sm">
                  <FiEdit2 aria-hidden="true" /> Edit
                </Link>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => setToDelete(project)}
                  aria-label={`Delete ${project.title}`}
                >
                  <FiTrash2 aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        show={Boolean(toDelete)}
        title="Delete project?"
        body={
          <>
            <strong>{toDelete?.title}</strong> and its screenshot will be permanently removed from your portfolio. This
            cannot be undone.
          </>
        }
        confirmLabel="Delete project"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
      <ProjectDetailsModal project={preview} onHide={() => setPreview(null)} />
    </>
  );
}
