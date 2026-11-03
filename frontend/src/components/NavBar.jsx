import { useState } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { FiDownload } from 'react-icons/fi';
import profilePhoto from '../assets/profile.jpg';
import { navSections, profile } from '../data/profile';
import { useActiveSection } from '../hooks/useActiveSection';
import { useScrolled } from '../hooks/useScrolled';
import ThemeToggle from './ThemeToggle';

const sectionIds = navSections.map((section) => section.id);

export default function NavBar() {
  const [expanded, setExpanded] = useState(false);
  const scrolled = useScrolled();
  const active = useActiveSection(sectionIds);

  return (
    <Navbar
      expand="lg"
      fixed="top"
      expanded={expanded}
      onToggle={setExpanded}
      collapseOnSelect
      className={`site-nav ${scrolled ? 'is-scrolled' : ''} ${expanded ? 'is-open' : ''}`}
      as="header"
    >
      <Container>
        <Navbar.Brand href="#home" className="d-flex align-items-center gap-2" onClick={() => setExpanded(false)}>
          <img
            src={profilePhoto}
            alt={profile.name}
            className="brand-avatar"
            width="38"
            height="38"
          />
          <span className="brand-name">{profile.name}</span>
        </Navbar.Brand>

        <div className="d-flex align-items-center gap-2 order-lg-last ms-auto ms-lg-3">
          <ThemeToggle />
          <a
            className="btn btn-accent btn-sm d-none d-sm-inline-flex align-items-center gap-1"
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open resume in new tab"
          >
            <FiDownload aria-hidden="true" /> Resume <span className="badge bg-light text-dark ms-1" style={{ fontSize: '0.65rem' }}>Temp</span>
          </a>
          <Navbar.Toggle aria-controls="main-nav" aria-label="Toggle navigation" />
        </div>

        <Navbar.Collapse id="main-nav">
          <Nav as="nav" aria-label="Main navigation" className="ms-auto gap-lg-1">
            {navSections.map((section) => (
              <Nav.Link
                key={section.id}
                href={`#${section.id}`}
                eventKey={section.id}
                active={active === section.id}
                aria-current={active === section.id ? 'location' : undefined}
              >
                {section.label}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
