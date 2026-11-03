import { Col, Container, Row } from 'react-bootstrap';
import { FiAward } from 'react-icons/fi';
import { LuGraduationCap } from 'react-icons/lu';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import { education } from '../data/profile';

export default function Education() {
  return (
    <section id="education" className="section" aria-labelledby="education-title">
      <Container>
        <SectionHeading eyebrow="Education" title="Academic background" id="education-title" />
        <Row className="g-4">
          {education.map((item, index) => (
            <Col md={6} lg={4} key={item.degree}>
              <Reveal delay={index * 80} className="h-100">
                <article className="pf-card pf-card-hover h-100 p-4">
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <span className="icon-tile" aria-hidden="true">
                      <LuGraduationCap />
                    </span>
                    <span className="timeline-period">{item.period}</span>
                  </div>
                  <h3 className="h5 mb-2">{item.degree}</h3>
                  <p className="text-muted-pf mb-3">{item.institution}</p>
                  <span className="tag tag-accent">
                    <FiAward className="me-1" aria-hidden="true" /> {item.score}
                  </span>
                </article>
              </Reveal>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
