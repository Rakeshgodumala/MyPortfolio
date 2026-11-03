import { Col, Container, Row } from 'react-bootstrap';
import { FaMedal, FaTrophy } from 'react-icons/fa';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import { achievements } from '../data/profile';

const icons = { trophy: FaTrophy, medal: FaMedal };

export default function Achievements() {
  return (
    <section id="achievements" className="section" aria-labelledby="achievements-title">
      <Container style={{ maxWidth: 1000 }}>
        <SectionHeading eyebrow="Achievements" title="Competitive coding highlights" id="achievements-title" />
        <Row className="g-4">
          {achievements.map((item, index) => {
            const Icon = icons[item.kind];
            return (
              <Col md={6} key={item.title}>
                <Reveal delay={index * 100} className="h-100">
                  <article className="pf-card pf-card-hover achievement-card">
                    <span className="icon-tile" aria-hidden="true">
                      <Icon />
                    </span>
                    <div>
                      <p className="achievement-highlight text-gradient mb-2">{item.highlight}</p>
                      <h3 className="h5 mb-2">{item.title}</h3>
                      <p className="text-muted-pf mb-0">{item.detail}</p>
                    </div>
                  </article>
                </Reveal>
              </Col>
            );
          })}
        </Row>
      </Container>
    </section>
  );
}
