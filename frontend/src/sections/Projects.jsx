import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Col, Container, Row } from 'react-bootstrap';
import { FaGithub } from 'react-icons/fa';
import { FiRefreshCw } from 'react-icons/fi';
import ProjectCard from '../components/ProjectCard';
import ProjectDetailsModal from '../components/ProjectDetailsModal';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import { fallbackProjects } from '../data/projects';
import { profile } from '../data/profile';
import { parseApiError } from '../services/api';
import { getPublishedProjects } from '../services/portfolioService';

const INITIAL_COUNT = 6;

export default function Projects() {
  const [projects, setProjects] = useState(fallbackProjects);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [slowServer, setSlowServer] = useState(false);
  const [category, setCategory] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    setStatus('loading');
    setSlowServer(false);
    const slowTimer = setTimeout(() => setSlowServer(true), 4000);
    try {
      const publishedProjects = await getPublishedProjects();
      if (publishedProjects.length === 0) {
        setProjects(fallbackProjects);
        setError('New projects are coming soon! Explore the curated work below in the meantime.');
        setStatus('fallback');
      } else {
        setProjects(publishedProjects);
        setError('');
        setStatus('ready');
      }
    } catch (err) {
      setProjects(fallbackProjects);
      setError('New projects are coming soon! Explore the curated work below in the meantime.');
      setStatus('fallback');
    } finally {
      clearTimeout(slowTimer);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const categories = useMemo(
    () => ['All', ...new Set(projects.map((project) => project.category).filter(Boolean))],
    [projects],
  );
  const filtered = category === 'All' ? projects : projects.filter((project) => project.category === category);
  const visible = showAll ? filtered : filtered.slice(0, INITIAL_COUNT);

  return (
    <section id="projects" className="section section-alt" aria-labelledby="projects-title">
      <Container>
        <SectionHeading
          eyebrow="Featured projects"
          title="Things I have built"
          subtitle="A selection of my web development work, from React applications to full-stack MERN projects."
          id="projects-title"
        />

        {status === 'loading' && (
          <p className="text-center text-muted-pf mb-4" role="status">
            {slowServer
              ? 'New projects are coming soon — loading now…'
              : 'Loading projects…'}
          </p>
        )}

        {status === 'fallback' && (
          <div className="projects-coming-soon text-center mx-auto mb-4">
            <span className="coming-soon-badge">🚀 New projects coming soon</span>
            <p className="text-muted-pf small mt-2 mb-0">{error}</p>
          </div>
        )}

        {status === 'ready' && projects.length === 0 && (
          <p className="text-center text-muted-pf">New projects are on their way. Check back soon.</p>
        )}

        {(status === 'ready' || status === 'fallback' || status === 'loading') && projects.length > 0 && (
          <>
            {categories.length > 2 && (
              <div className="filter-bar mb-5" role="group" aria-label="Filter projects by category">
                {categories.map((name) => (
                  <button
                    key={name}
                    type="button"
                    className={`filter-pill ${category === name ? 'active' : ''}`}
                    aria-pressed={category === name}
                    onClick={() => {
                      setCategory(name);
                      setShowAll(false);
                    }}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}

            <Row className="g-4">
              {visible.map((project, index) => (
                <Col md={6} lg={4} key={project._id}>
                  <Reveal delay={(index % 3) * 80} className="h-100">
                    <ProjectCard project={project} onDetails={setSelected} />
                  </Reveal>
                </Col>
              ))}
            </Row>

            {filtered.length > INITIAL_COUNT && (
              <div className="text-center mt-5">
                <button type="button" className="btn btn-ghost" onClick={() => setShowAll((value) => !value)}>
                  {showAll ? 'Show fewer projects' : `Show all ${filtered.length} projects`}
                </button>
              </div>
            )}
          </>
        )}
      </Container>

      <ProjectDetailsModal project={selected} onHide={() => setSelected(null)} />
    </section>
  );
}
