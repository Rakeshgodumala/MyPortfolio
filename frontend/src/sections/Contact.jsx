import { useState } from 'react';
import { Alert, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FiMail, FiPhone, FiSend } from 'react-icons/fi';
import { SiLeetcode } from 'react-icons/si';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import { profile } from '../data/profile';
import { parseApiError } from '../services/api';
import { sendContactMessage } from '../services/portfolioService';

const EMPTY = { name: '', email: '', subject: '', message: '', website: '' };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const channels = [
  { icon: FiMail, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
  { icon: FiPhone, label: 'Phone', value: profile.phone, href: profile.phoneHref },
  { icon: FaLinkedin, label: 'LinkedIn', value: 'Rakesh Godumala', href: profile.links.linkedin, external: true },
  { icon: FaGithub, label: 'GitHub', value: 'github.com/Rakeshgodumala', href: profile.links.github, external: true },
  { icon: SiLeetcode, label: 'LeetCode', value: 'leetcode.com/u/rakeshgodumala', href: profile.links.leetcode, external: true },
];

function validate(values) {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = 'Please enter your name.';
  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Please enter a valid email address.';
  if (values.subject.trim().length < 3) errors.subject = 'Subject must be at least 3 characters.';
  if (values.message.trim().length < 10) errors.message = 'Message must be at least 10 characters.';
  if (values.message.length > 3000) errors.message = 'Message must be 3000 characters or fewer.';
  return errors;
}

function mailtoLink(values) {
  const params = new URLSearchParams({
    subject: values.subject || 'Hello from your portfolio',
    body: `${values.message}\n\n${values.name}${values.email ? ` (${values.email})` : ''}`,
  });
  return `mailto:${profile.email}?${params.toString().replace(/\+/g, '%20')}`;
}

export default function Contact() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const onChange = (event) => {
    const { name, value } = event.target;
    const next = { ...values, [name]: value };
    setValues(next);
    if (touched[name]) setErrors(validate(next));
  };

  const onBlur = (event) => {
    setTouched((current) => ({ ...current, [event.target.name]: true }));
    setErrors(validate(values));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    setTouched({ name: true, email: true, subject: true, message: true });
    if (Object.keys(found).length) {
      setStatus({ state: 'idle', message: '' });
      return;
    }

    setStatus({ state: 'sending', message: '' });
    try {
      const result = await sendContactMessage(values);
      setStatus({ state: 'success', message: result.message });
      setValues(EMPTY);
      setTouched({});
    } catch (err) {
      const parsed = parseApiError(err, 'Your message could not be sent.');
      setErrors(parsed.fieldErrors);
      setStatus({ state: 'error', message: parsed.message });
    }
  };

  const field = (name) => ({
    name,
    value: values[name],
    onChange,
    onBlur,
    isInvalid: Boolean(touched[name] && errors[name]),
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
    required: true,
  });

  return (
    <section id="contact" className="section section-alt" aria-labelledby="contact-title">
      <Container>
        <SectionHeading
          eyebrow="Contact"
          title="Let's work together"
          subtitle="I am open to Frontend Developer and React.js Developer opportunities. Send me a message and I will reply as soon as I can."
          id="contact-title"
        />
        <Row className="g-4">
          <Col lg={5}>
            <Reveal className="d-grid gap-3">
              {channels.map(({ icon: Icon, label, value, href, external }) => (
                <a
                  key={label}
                  className="pf-card pf-card-hover contact-link"
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <span className="icon-tile" aria-hidden="true">
                    <Icon />
                  </span>
                  <span>
                    <span className="d-block fw-semibold">{label}</span>
                    <span className="contact-value">{value}</span>
                  </span>
                </a>
              ))}
            </Reveal>
          </Col>

          <Col lg={7}>
            <Reveal delay={100} className="pf-card p-4 p-md-5 h-100">
              <Form noValidate onSubmit={onSubmit} aria-label="Contact form">
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group controlId="contact-name">
                      <Form.Label>Name</Form.Label>
                      <Form.Control type="text" autoComplete="name" placeholder="Your name" maxLength={80} {...field('name')} />
                      <Form.Control.Feedback type="invalid" id="name-error">
                        {errors.name}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="contact-email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="email" autoComplete="email" placeholder="you@company.com" maxLength={120} {...field('email')} />
                      <Form.Control.Feedback type="invalid" id="email-error">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group controlId="contact-subject">
                      <Form.Label>Subject</Form.Label>
                      <Form.Control type="text" placeholder="Job opportunity, collaboration…" maxLength={120} {...field('subject')} />
                      <Form.Control.Feedback type="invalid" id="subject-error">
                        {errors.subject}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group controlId="contact-message">
                      <Form.Label>Message</Form.Label>
                      <Form.Control as="textarea" rows={5} placeholder="Write your message…" maxLength={3000} {...field('message')} />
                      <Form.Control.Feedback type="invalid" id="message-error">
                        {errors.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  {/* Honeypot: hidden from people and screen readers; bots tend to fill it in. */}
                  <div className="hp-field" aria-hidden="true">
                    <label htmlFor="contact-website">Website</label>
                    <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={onChange} />
                  </div>

                  <Col xs={12}>
                    <div aria-live="polite">
                      {status.state === 'success' && <Alert variant="success" className="mb-3">{status.message}</Alert>}
                      {status.state === 'error' && (
                        <Alert variant="danger" className="mb-3">
                          {status.message}{' '}
                          <a href={mailtoLink(values)} className="alert-link">
                            Send it with your email app instead
                          </a>
                          .
                        </Alert>
                      )}
                    </div>
                    <button type="submit" className="btn btn-accent px-4" disabled={status.state === 'sending'}>
                      {status.state === 'sending' ? (
                        <>
                          <Spinner size="sm" animation="border" aria-hidden="true" /> Sending…
                        </>
                      ) : (
                        <>
                          <FiSend aria-hidden="true" /> Send Message
                        </>
                      )}
                    </button>
                  </Col>
                </Row>
              </Form>
            </Reveal>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
