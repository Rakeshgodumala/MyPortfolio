import Reveal from './Reveal';

export default function SectionHeading({ eyebrow, title, subtitle, center = true, id }) {
  return (
    <Reveal className={`section-heading mb-5 ${center ? 'text-center' : ''}`}>
      <p className="section-eyebrow">{eyebrow}</p>
      <h2 className="section-title" id={id}>
        {title}
      </h2>
      {subtitle && <p className="section-subtitle mb-0">{subtitle}</p>}
    </Reveal>
  );
}
