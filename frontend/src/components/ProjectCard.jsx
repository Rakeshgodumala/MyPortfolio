import { FaGithub } from 'react-icons/fa';
import { FiClock, FiExternalLink, FiInfo, FiStar } from 'react-icons/fi';
import { resolveImageUrl } from '../services/api';

export function initials(title = '') {
  return (
    title
      .split(/\s+/)
      .filter((word) => /^[A-Za-z0-9]/.test(word))
      .slice(0, 2)
      .map((word) => word[0].toUpperCase())
      .join('') || 'P'
  );
}

export function ProjectImage({ project, eager = false }) {
  const src = resolveImageUrl(project.imageUrl);
  if (!src) {
    return (
      <div className="project-placeholder" aria-hidden="true">
        {initials(project.title)}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={`Screenshot of ${project.title || 'the project'}`}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      width="640"
      height="400"
    />
  );
}

/** Live demo / GitHub buttons. Missing links are never shown as working buttons. */
export function ProjectLinks({ project, size = 'sm' }) {
  return (
    <>
      {project.liveDemoUrl ? (
        <a className={`btn btn-accent btn-${size}`} href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer">
          <FiExternalLink aria-hidden="true" /> Live Demo
        </a>
      ) : (
        !project.githubUrl && (
          <span className="demo-soon">
            <FiClock aria-hidden="true" /> Demo Coming Soon
          </span>
        )
      )}
      {project.githubUrl && (
        <a className={`btn btn-ghost btn-${size}`} href={project.githubUrl} target="_blank" rel="noopener noreferrer">
          <FaGithub aria-hidden="true" /> GitHub
        </a>
      )}
    </>
  );
}

export default function ProjectCard({ project, onDetails, showDraftBadge = false }) {
  const titleId = `project-${project._id || 'preview'}-title`;
  return (
    <article className="pf-card pf-card-hover project-card" aria-labelledby={titleId}>
      <div className="project-media">
        <div className="project-badges">
          {project.featured && (
            <span className="badge-featured">
              <FiStar aria-hidden="true" /> Featured
            </span>
          )}
          {showDraftBadge && !project.published && <span className="badge-featured badge-draft">Draft</span>}
        </div>
        <ProjectImage project={project} />
      </div>
      <div className="project-body">
        {project.category && <span className="project-category">{project.category}</span>}
        <h3 className="project-title" id={titleId}>
          {project.title || 'Untitled project'}
        </h3>
        <p className="project-desc mb-3">{project.description || 'Project description will appear here.'}</p>
        {project.technologies?.length > 0 && (
          <ul className="list-unstyled d-flex flex-wrap gap-2 mb-0" aria-label="Technologies used">
            {project.technologies.map((tech) => (
              <li key={tech} className="tag">
                {tech}
              </li>
            ))}
          </ul>
        )}
        <div className="project-actions">
          <ProjectLinks project={project} />
          {onDetails && (
            <button type="button" className="btn btn-soft btn-sm" onClick={() => onDetails(project)}>
              <FiInfo aria-hidden="true" /> View Details
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
