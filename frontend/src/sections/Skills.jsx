import { Col, Container, Row } from 'react-bootstrap';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import { skillGroups } from '../data/profile';

export default function Skills() {
  return (
    <section id="skills" className="section section-alt" aria-labelledby="skills-title">
      <Container>
        <SectionHeading
          eyebrow="Technical skills"
          title="Tools and technologies I work with"
          subtitle="Technologies from my coursework, internship and personal projects."
          id="skills-title"
        />
        <Row className="g-4">
          {skillGroups.map((group, index) => (
            <Col lg={6} key={group.title}>
              <Reveal delay={index * 80} className="h-100">
                <div className="pf-card skill-group">
                  <h3 className="skill-group-title">{group.title}</h3>
                  <p className="text-muted-pf mb-0 small">{group.description}</p>
                  <ul className="skill-grid list-unstyled mb-0">
                    {group.skills.map(({ name, icon: Icon, color }) => (
                      <li key={name} className="skill-chip">
                        <Icon style={{ color }} aria-hidden="true" />
                        <span>{name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
