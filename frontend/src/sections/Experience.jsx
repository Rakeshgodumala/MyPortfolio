import { Container } from 'react-bootstrap';
import { FiCheckCircle } from 'react-icons/fi';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import { experience } from '../data/profile';

export default function Experience() {
  return (
    <section id="experience" className="section" aria-labelledby="experience-title">
      <Container style={{ maxWidth: 900 }}>
        <SectionHeading eyebrow="Internship experience" title="Where I have applied my skills" id="experience-title" />
        <div className="experience-stack">
          {experience.map((item, index) => (
            <div
              className="experience-sticky-card"
              key={`${item.organization}-${item.period}`}
              style={{
                top: `calc(85px + ${index * 32}px)`,
                zIndex: index + 1,
              }}
            >
              <article className="pf-card experience-card p-4 p-md-5">
                <div className="d-flex flex-wrap justify-content-between gap-2 mb-2">
                  <span className="timeline-period">{item.period}</span>
                  <div className="d-flex gap-2">
                    <span className="tag tag-accent">{item.type}</span>
                    {item.mode && <span className="tag">{item.mode}</span>}
                  </div>
                </div>
                <h3 className="h4 mb-1">{item.role}</h3>
                <p className="fw-semibold mb-3" style={{ color: 'var(--pf-accent)' }}>
                  {item.organization}
                </p>
                <p className="mb-3">
                  <span className="text-muted-pf">Project: </span>
                  <strong style={{ color: 'var(--pf-heading)' }}>{item.project}</strong>
                </p>
                <ul className="check-list mb-4">
                  {item.points.map((point) => (
                    <li key={point}>
                      <FiCheckCircle aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
                <ul className="list-unstyled d-flex flex-wrap gap-2 mb-0" aria-label="Technologies used">
                  {item.technologies.map((tech) => (
                    <li key={tech} className="tag">
                      {tech}
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
