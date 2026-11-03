import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { FaAws, FaGoogle, FaMicrosoft, FaPython } from 'react-icons/fa';
import { FiAward, FiExternalLink } from 'react-icons/fi';
import { SiCoursera, SiUdemy } from 'react-icons/si';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import { fallbackCertifications } from '../data/profile';
import { getCertifications } from '../services/portfolioService';

/**
 * Returns a brand-specific icon component based on the issuer name.
 * Falls back to a generic award icon if no match is found.
 */
function CertIcon({ issuer = '' }) {
  const lower = issuer.toLowerCase();
  if (lower.includes('ibm'))       return <FiAward />;
  if (lower.includes('udemy'))     return <SiUdemy />;
  if (lower.includes('microsoft')) return <FaMicrosoft />;
  if (lower.includes('cognitive') || lower.includes('python')) return <FaPython />;
  if (lower.includes('coursera'))  return <SiCoursera />;
  if (lower.includes('google'))    return <FaGoogle />;
  if (lower.includes('aws') || lower.includes('amazon')) return <FaAws />;
  return <FiExternalLink />;
}

export default function Certifications() {
  const [certifications, setCertifications] = useState(fallbackCertifications);

  useEffect(() => {
    let cancelled = false;
    // The static list is shown immediately; the API adds verification links managed in the dashboard.
    getCertifications()
      .then((list) => !cancelled && list.length && setCertifications(list))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="certifications" className="section section-alt" aria-labelledby="certifications-title">
      <Container>
        <SectionHeading eyebrow="Certifications" title="Courses and certifications" id="certifications-title" />
        <Row className="g-4 justify-content-center">
          {certifications.map((cert, index) => (
            <Col md={6} lg={4} key={cert._id}>
              <Reveal delay={index * 100} variant="zoom" className="h-100">
                {/* Whole card is clickable — opens the certificate in a new tab */}
                {cert.credentialUrl ? (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pf-card pf-card-hover cert-card cert-card-link"
                    aria-label={`View ${cert.title} certificate from ${cert.issuer}`}
                  >
                    <span className="icon-tile" aria-hidden="true">
                      <CertIcon issuer={cert.issuer} />
                    </span>
                    <div className="d-flex flex-column">
                      <h3 className="h6 mb-1" style={{ lineHeight: 1.4 }}>
                        {cert.title}
                      </h3>
                      <p className="text-muted-pf small mb-0">{cert.issuer}</p>
                      <span className="cert-view-label small fw-semibold d-inline-flex align-items-center gap-1 mt-auto pt-2">
                        View credential <FiExternalLink size={12} aria-hidden="true" />
                      </span>
                    </div>
                  </a>
                ) : (
                  <article className="pf-card cert-card">
                    <span className="icon-tile" aria-hidden="true">
                      <CertIcon issuer={cert.issuer} />
                    </span>
                    <div className="d-flex flex-column">
                      <h3 className="h6 mb-1" style={{ lineHeight: 1.4 }}>
                        {cert.title}
                      </h3>
                      <p className="text-muted-pf small mb-0">{cert.issuer}</p>
                    </div>
                  </article>
                )}
              </Reveal>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
