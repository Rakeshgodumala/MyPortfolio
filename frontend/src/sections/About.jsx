import { Col, Container, Row } from 'react-bootstrap';
import { FiBookOpen, FiBriefcase, FiGlobe, FiMapPin } from 'react-icons/fi';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import { profile } from '../data/profile';
import profilePhoto from '../assets/profile.jpg';

const facts = [
  { icon: FiMapPin, label: 'Location', value: 'Hyderabad, India' },
  { icon: FiBookOpen, label: 'Education', value: 'MCA, Osmania University' },
  { icon: FiBriefcase, label: 'Internship', value: 'Purview Services (2026)' },
  { icon: FiGlobe, label: 'Languages', value: profile.languages.join(', ') },
];

export default function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <Container>
        <SectionHeading eyebrow="About me" title="Turning ideas into clean, usable interfaces" id="about-title" />
        <Row className="align-items-center g-5">
          <Col lg={5}>
            <Reveal className="about-photo-wrap">
              <img
                className="about-photo"
                src={profilePhoto}
                alt={`Portrait of ${profile.name}`}
                width="360"
                height="450"
                loading="lazy"
              />
            </Reveal>
          </Col>
          <Col lg={7}>
            <Reveal delay={100}>
              <p className="fs-5 mb-4" style={{ color: 'var(--pf-heading)' }}>
                {profile.summary}
              </p>
            </Reveal>

            <Reveal delay={160}>
              <Row className="g-3 mb-4">
                {facts.map(({ icon: Icon, label, value }) => (
                  <Col sm={6} key={label}>
                    <div className="fact-item">
                      <span className="icon-tile" aria-hidden="true">
                        <Icon />
                      </span>
                      <div>
                        <div className="fact-label">{label}</div>
                        <div className="fact-value">{value}</div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Reveal>

            <Reveal delay={220}>
              <h3 className="h6 text-uppercase text-muted-pf mb-3" style={{ letterSpacing: '0.08em' }}>
                Interests
              </h3>
              <ul className="list-unstyled d-flex flex-wrap gap-2 mb-0">
                {profile.interests.map((interest) => (
                  <li key={interest} className="tag tag-accent">
                    {interest}
                  </li>
                ))}
              </ul>
            </Reveal>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
