import { useEffect, useMemo, useState } from 'react';
import { Alert, Col, Form, Row, Spinner } from 'react-bootstrap';
import { FiArrowLeft, FiEye, FiSave, FiSend } from 'react-icons/fi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import ProjectDetailsModal from '../components/ProjectDetailsModal';
import { skillGroups } from '../data/profile';
import { parseApiError } from '../services/api';
import { adminApi } from '../services/adminService';
import ImageUploader from './ImageUploader';
import TagInput from './TagInput';
import { useToast } from './ToastContext';

const EMPTY = {
  title: '',
  description: '',
  technologies: [],
  category: '',
  githubUrl: '',
  liveDemoUrl: '',
  imageUrl: '',
  imagePublicId: '',
  featured: false,
  published: false,
  displayOrder: '',
};

const TECH_SUGGESTIONS = [
  ...skillGroups.flatMap((group) => group.skills.map((skill) => skill.name)),
  'Bootstrap',
  'REST API',
  'Redux',
  'Axios',
  'Vite',
];

const isHttpUrl = (value) => {
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol);
  } catch {
    return false;
  }
};

function validate(values) {
  const errors = {};
  const title = values.title.trim();
  const description = values.description.trim();
  if (!title) errors.title = 'Title is required.';
  else if (title.length < 3 || title.length > 100) errors.title = 'Title must be 3–100 characters.';
  if (!description) errors.description = 'Description is required.';
  else if (description.length < 20) errors.description = 'Description must be at least 20 characters.';
  else if (description.length > 2000) errors.description = 'Description must be 2000 characters or fewer.';
  if (values.category.length > 50) errors.category = 'Category must be 50 characters or fewer.';
  if (values.githubUrl && !isHttpUrl(values.githubUrl)) errors.githubUrl = 'Enter a full URL starting with https://';
  if (values.liveDemoUrl && !isHttpUrl(values.liveDemoUrl)) errors.liveDemoUrl = 'Enter a full URL starting with https://';
  if (values.displayOrder !== '' && !/^\d{1,4}$/.test(String(values.displayOrder))) {
    errors.displayOrder = 'Use a whole number from 0 to 9999.';
  }
  return errors;
}

export default function ProjectFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { notify } = useToast();

  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(null); // 'draft' | 'publish' | 'save'
  const [formError, setFormError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [categories, setCategories] = useState([]);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    document.title = `${isEdit ? 'Edit' : 'Add'} project | Portfolio admin`;
    adminApi
      .listProjects()
      .then((list) => setCategories([...new Set(list.map((p) => p.category).filter(Boolean))]))
      .catch(() => {});
  }, [isEdit]);

  useEffect(() => {
    if (!isEdit) return;
    adminApi
      .getProject(id)
      .then((project) => {
        setValues({
          ...EMPTY,
          ...project,
          imagePublicId: '',
          displayOrder: project.displayOrder ?? '',
          technologies: project.technologies || [],
        });
      })
      .catch((err) => setLoadError(parseApiError(err, 'Project could not be loaded.').message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  // Warn before closing the tab with unsaved changes.
  useEffect(() => {
    if (!dirty) return undefined;
    const handler = (event) => event.preventDefault();
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const update = (patch) => {
    setValues((current) => {
      const next = { ...current, ...patch };
      if (Object.keys(errors).length) {
        const found = validate(next);
        setErrors(found);
        if (!Object.keys(found).length) setFormError('');
      }
      return next;
    });
    setDirty(true);
  };

  const onField = (event) => {
    const { name, value, type, checked } = event.target;
    update({ [name]: type === 'checkbox' ? checked : value });
  };

  const submit = async (mode) => {
    const published = mode === 'publish' ? true : mode === 'draft' ? false : values.published;
    const payload = { ...values, published };
    const found = validate(payload);
    setErrors(found);
    setFormError('');
    if (Object.keys(found).length) {
      setFormError('Please fix the highlighted fields.');
      return;
    }

    setSaving(mode);
    try {
      const body = {
        title: payload.title,
        description: payload.description,
        technologies: payload.technologies,
        category: payload.category,
        githubUrl: payload.githubUrl.trim(),
        liveDemoUrl: payload.liveDemoUrl.trim(),
        imageUrl: payload.imageUrl,
        imagePublicId: payload.imagePublicId,
        featured: payload.featured,
        published,
        displayOrder: payload.displayOrder === '' ? undefined : Number(payload.displayOrder),
      };
      const saved = isEdit ? await adminApi.updateProject(id, body) : await adminApi.createProject(body);
      setDirty(false);
      notify(
        saved.published
          ? `"${saved.title}" was saved and is live on your portfolio.`
          : `"${saved.title}" was saved as a draft (not visible to visitors).`,
      );
      navigate('/admin/dashboard');
    } catch (err) {
      const parsed = parseApiError(err, 'The project could not be saved.');
      setErrors(parsed.fieldErrors);
      setFormError(parsed.message);
    } finally {
      setSaving(null);
    }
  };

  const previewProject = useMemo(
    () => ({ ...values, _id: 'preview', category: values.category || 'Web App' }),
    [values],
  );

  if (loading) {
    return (
      <div className="text-center py-5" role="status">
        <Spinner animation="border" style={{ color: 'var(--pf-accent)' }} />
      </div>
    );
  }

  if (loadError) {
    return (
      <Alert variant="danger">
        {loadError} <Link to="/admin/dashboard">Back to projects</Link>
      </Alert>
    );
  }

  const fieldProps = (name) => ({
    name,
    value: values[name],
    onChange: onField,
    isInvalid: Boolean(errors[name]),
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  });
  const feedback = (name) => (
    <Form.Control.Feedback type="invalid" id={`${name}-error`}>
      {errors[name]}
    </Form.Control.Feedback>
  );
  const busy = saving !== null;

  return (
    <>
      <Link to="/admin/dashboard" className="small d-inline-flex align-items-center gap-1 mb-3">
        <FiArrowLeft aria-hidden="true" /> All projects
      </Link>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <h1 className="h3 mb-0">{isEdit ? 'Edit project' : 'Add a new project'}</h1>
        {isEdit && (
          <span className={`tag ${values.published ? 'tag-success' : 'tag-warning'}`}>
            {values.published ? 'Currently published' : 'Currently a draft'}
          </span>
        )}
      </div>

      <Row className="g-4">
        <Col xl={7}>
          <Form noValidate onSubmit={(e) => { e.preventDefault(); submit(isEdit ? 'save' : 'publish'); }}>
            <div className="pf-card p-4 mb-4">
              <h2 className="h6 text-uppercase text-muted-pf mb-3" style={{ letterSpacing: '0.06em' }}>
                Project details
              </h2>
              <Form.Group className="mb-3" controlId="project-title">
                <Form.Label>Project title *</Form.Label>
                <Form.Control type="text" maxLength={100} placeholder="e.g. Employee Management System" {...fieldProps('title')} />
                {feedback('title')}
              </Form.Group>

              <Form.Group className="mb-3" controlId="project-description">
                <Form.Label>Description *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  maxLength={2000}
                  placeholder="What does it do, what did you build, and which features did you implement?"
                  {...fieldProps('description')}
                />
                <div className="d-flex justify-content-between">
                  {feedback('description')}
                  <Form.Text className="ms-auto text-muted-pf">{values.description.length}/2000</Form.Text>
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="project-technologies">Technologies</Form.Label>
                <TagInput
                  tags={values.technologies}
                  onChange={(technologies) => update({ technologies })}
                  suggestions={TECH_SUGGESTIONS}
                  invalid={Boolean(errors.technologies)}
                  describedBy="technologies-help"
                />
                {errors.technologies ? (
                  <div className="invalid-feedback d-block">{errors.technologies}</div>
                ) : (
                  <Form.Text id="technologies-help" className="text-muted-pf">
                    Press Enter or comma after each technology.
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group controlId="project-category">
                <Form.Label>Category</Form.Label>
                <Form.Control type="text" list="category-options" maxLength={50} placeholder="e.g. React, Full Stack, Web App" {...fieldProps('category')} />
                <datalist id="category-options">
                  {categories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
                {feedback('category')}
              </Form.Group>
            </div>

            <div className="pf-card p-4 mb-4">
              <h2 className="h6 text-uppercase text-muted-pf mb-3" style={{ letterSpacing: '0.06em' }}>
                Links
              </h2>
              <Form.Group className="mb-3" controlId="project-github">
                <Form.Label>GitHub repository URL</Form.Label>
                <Form.Control type="url" placeholder="https://github.com/Rakeshgodumala/…" {...fieldProps('githubUrl')} />
                {feedback('githubUrl')}
              </Form.Group>
              <Form.Group controlId="project-demo">
                <Form.Label>Live demo URL</Form.Label>
                <Form.Control type="url" placeholder="https://…" {...fieldProps('liveDemoUrl')} />
                {errors.liveDemoUrl ? feedback('liveDemoUrl') : (
                  <Form.Text className="text-muted-pf">Leave empty to show “Demo Coming Soon”.</Form.Text>
                )}
              </Form.Group>
            </div>

            <div className="pf-card p-4 mb-4">
              <h2 className="h6 text-uppercase text-muted-pf mb-3" style={{ letterSpacing: '0.06em' }}>
                Screenshot
              </h2>
              <ImageUploader
                imageUrl={values.imageUrl}
                error={errors.imageUrl}
                disabled={busy}
                onUploaded={({ imageUrl, imagePublicId }) => update({ imageUrl, imagePublicId })}
                onRemove={() => update({ imageUrl: '', imagePublicId: '' })}
              />
            </div>

            <div className="pf-card p-4 mb-4">
              <h2 className="h6 text-uppercase text-muted-pf mb-3" style={{ letterSpacing: '0.06em' }}>
                Display
              </h2>
              <Row className="g-3 align-items-end">
                <Col sm={6}>
                  <Form.Check
                    type="switch"
                    id="project-featured"
                    name="featured"
                    label="Mark as Featured"
                    checked={values.featured}
                    onChange={onField}
                  />
                  {isEdit && (
                    <Form.Check
                      type="switch"
                      id="project-published"
                      name="published"
                      label="Published (visible to visitors)"
                      checked={values.published}
                      onChange={onField}
                      className="mt-2"
                    />
                  )}
                </Col>
                <Col sm={6}>
                  <Form.Group controlId="project-order">
                    <Form.Label>Display order</Form.Label>
                    <Form.Control type="number" min={0} max={9999} placeholder="Auto (end of list)" {...fieldProps('displayOrder')} />
                    {feedback('displayOrder')}
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {formError && (
              <Alert variant="danger" role="alert">
                {formError}
              </Alert>
            )}

            <div className="d-flex flex-wrap gap-2">
              {isEdit ? (
                <button type="submit" className="btn btn-accent" disabled={busy}>
                  {saving === 'save' ? <Spinner size="sm" animation="border" aria-hidden="true" /> : <FiSave aria-hidden="true" />}
                  Save changes
                </button>
              ) : (
                <>
                  <button type="submit" className="btn btn-accent" disabled={busy}>
                    {saving === 'publish' ? <Spinner size="sm" animation="border" aria-hidden="true" /> : <FiSend aria-hidden="true" />}
                    Save & publish
                  </button>
                  <button type="button" className="btn btn-ghost" disabled={busy} onClick={() => submit('draft')}>
                    {saving === 'draft' ? <Spinner size="sm" animation="border" aria-hidden="true" /> : <FiSave aria-hidden="true" />}
                    Save as draft
                  </button>
                </>
              )}
              <button type="button" className="btn btn-soft" onClick={() => setShowPreview(true)}>
                <FiEye aria-hidden="true" /> Preview details
              </button>
              <Link to="/admin/dashboard" className="btn btn-link text-muted-pf">
                Cancel
              </Link>
            </div>
          </Form>
        </Col>

        <Col xl={5}>
          <div className="admin-preview-sticky">
            <h2 className="h6 text-uppercase text-muted-pf mb-3" style={{ letterSpacing: '0.06em' }}>
              Live preview
            </h2>
            <ProjectCard project={previewProject} onDetails={() => setShowPreview(true)} showDraftBadge />
            <p className="small text-muted-pf mt-3 mb-0">
              This is exactly how the card will look in the Projects section of your portfolio.
            </p>
          </div>
        </Col>
      </Row>

      <ProjectDetailsModal project={showPreview ? previewProject : null} onHide={() => setShowPreview(false)} />
    </>
  );
}
