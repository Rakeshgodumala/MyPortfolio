import { Modal } from 'react-bootstrap';
import { resolveImageUrl } from '../services/api';
import { ProjectLinks } from './ProjectCard';

export default function ProjectDetailsModal({ project, onHide }) {
  return (
    <Modal show={Boolean(project)} onHide={onHide} size="lg" centered aria-labelledby="project-modal-title">
      {project && (
        <>
          <Modal.Header closeButton>
            <div>
              {project.category && <span className="project-category d-block">{project.category}</span>}
              <Modal.Title id="project-modal-title" as="h2" className="h4 mb-0">
                {project.title}
              </Modal.Title>
            </div>
          </Modal.Header>
          <Modal.Body>
            {project.imageUrl && (
              <img
                className="modal-project-img mb-4"
                src={resolveImageUrl(project.imageUrl)}
                alt={`Screenshot of ${project.title}`}
              />
            )}
            <h3 className="h6 text-uppercase text-muted-pf" style={{ letterSpacing: '0.06em' }}>
              About this project
            </h3>
            <p style={{ whiteSpace: 'pre-line' }}>{project.description}</p>
            {project.technologies?.length > 0 && (
              <>
                <h3 className="h6 text-uppercase text-muted-pf mt-4" style={{ letterSpacing: '0.06em' }}>
                  Technologies
                </h3>
                <ul className="list-unstyled d-flex flex-wrap gap-2 mb-0">
                  {project.technologies.map((tech) => (
                    <li key={tech} className="tag tag-accent">
                      {tech}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Modal.Body>
          <Modal.Footer className="justify-content-start gap-2">
            <ProjectLinks project={project} size="md" />
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
}
