import { Col, Container, Row } from 'react-bootstrap';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FiArrowRight, FiDownload, FiMail, FiMapPin } from 'react-icons/fi';
import { SiLeetcode } from 'react-icons/si';
import HeroGraphic from '../components/HeroGraphic';
import Reveal from '../components/Reveal';
import { profile } from '../data/profile';
import { useTypewriter } from '../hooks/useTypewriter';

export default function Hero() {
  const { displayed } = useTypewriter(profile.roles, {
    typeSpeed: 85,
    eraseSpeed: 50,
    pauseAfterType: 2000,
    pauseAfterErase: 400,
  });
  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-glow hero-glow-1" aria-hidden="true" />
      <div className="hero-glow hero-glow-2" aria-hidden="true" />

      <Container className="position-relative">
        <Row className="align-items-center g-5">
          <Col lg={7}>
            <Reveal>
              <span className="availability">
                <span className="availability-dot" aria-hidden="true" />
                Open for UI Developer | Full Stack Developer
              </span>
              <h1 className="hero-title" id="hero-title">
                <span className="hero-greeting">Hi, I&apos;m</span>{' '}
                <span className="hero-name-cursive">{profile.name}</span>
              </h1>
              <p className="hero-role">
                <span className="typewriter-text">{displayed}</span>
              </p>
              <p className="hero-intro mb-2">{profile.intro}</p>
              <p className="text-muted-pf d-flex align-items-center gap-2 mb-4">
                <FiMapPin aria-hidden="true" /> {profile.location}
              </p>
            </Reveal>

            <Reveal delay={120} className="d-flex flex-wrap gap-3 mb-4">
              <a href="#projects" className="btn btn-accent">
                View My Projects <FiArrowRight aria-hidden="true" />
              </a>
              <a
                href={profile.resumeUrl}
                className="btn btn-ghost"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FiDownload aria-hidden="true" /> View Resume (Temp)
              </a>
              <a href="#contact" className="btn btn-ghost">
                <FiMail aria-hidden="true" /> Contact Me
              </a>
            </Reveal>

            <Reveal delay={200} className="hero-socials d-flex align-items-center gap-4">
              <a href={profile.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
                <FaGithub />
              </a>
              <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
                <FaLinkedin />
              </a>
              <a href={profile.links.leetcode} target="_blank" rel="noopener noreferrer" aria-label="LeetCode profile">
                <SiLeetcode />
              </a>
              <a href={`mailto:${profile.email}`} aria-label="Send an email">
                <FiMail />
              </a>
            </Reveal>
          </Col>

          <Col lg={5}>
            <Reveal delay={150}>
              <HeroGraphic />
            </Reveal>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
