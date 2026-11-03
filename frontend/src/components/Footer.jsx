import { Col, Container, Row } from 'react-bootstrap';
import { FiDownload, FiMail } from 'react-icons/fi';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';
import { navSections, profile } from '../data/profile';

export default function Footer() {
  return (
    <footer className="site-footer">
      <Container>
        <Row className="g-4">
          <Col lg={5}>
            <h2 className="h5 mb-2">{profile.name}</h2>
            <p className="mb-3">{profile.title}</p>
            <p className="mb-4" style={{ maxWidth: 420 }}>
              Open to UI Developer and Full Stack Developer roles. Let&apos;s build something useful together.
            </p>
            <a
              className="btn btn-accent btn-sm"
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FiDownload aria-hidden="true" /> View Resume (Temp)
            </a>
          </Col>
          <Col sm={6} lg={3}>
            <h3 className="h6 text-uppercase mb-3" style={{ letterSpacing: '0.08em' }}>
              Quick links
            </h3>
            <ul className="list-unstyled d-grid gap-2 mb-0">
              {navSections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.label}</a>
                </li>
              ))}
            </ul>
          </Col>
          <Col sm={6} lg={4}>
            <h3 className="h6 text-uppercase mb-3" style={{ letterSpacing: '0.08em' }}>
              Connect
            </h3>
            <p className="mb-1">
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </p>
            <p className="mb-3">
              <a href={profile.phoneHref}>{profile.phone}</a>
            </p>
            <div className="footer-social d-flex gap-2">
              <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
              <a href={profile.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <FaGithub />
              </a>
              <a href={profile.links.leetcode} target="_blank" rel="noopener noreferrer" aria-label="LeetCode">
                <SiLeetcode />
              </a>
              <a href={`mailto:${profile.email}`} aria-label="Email">
                <FiMail />
              </a>
            </div>
          </Col>
        </Row>
        <div className="footer-bottom text-center">
          <span>
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </span>
        </div>
      </Container>
    </footer>
  );
}
