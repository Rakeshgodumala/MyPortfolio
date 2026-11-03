import { useEffect } from 'react';
import BackToTop from '../components/BackToTop';
import Footer from '../components/Footer';
import NavBar from '../components/NavBar';
import About from '../sections/About';
import Achievements from '../sections/Achievements';
import Certifications from '../sections/Certifications';
import Contact from '../sections/Contact';
import Education from '../sections/Education';
import Experience from '../sections/Experience';
import Hero from '../sections/Hero';
import Projects from '../sections/Projects';
import Skills from '../sections/Skills';

export default function HomePage() {
  useEffect(() => {
    document.title = 'Rakesh Godumala | Frontend Developer & React.js Developer';
  }, []);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <NavBar />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Certifications />
        <Achievements />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
