import { FaBootstrap, FaReact } from 'react-icons/fa';
import { SiMongodb } from 'react-icons/si';

const lines = [
  [['tok-com', '// developer.js']],
  [['tok-key', 'const '], ['tok-var', 'developer'], ['tok-punc', ' = {']],
  [['', '  '], ['tok-prop', 'name'], ['tok-punc', ': '], ['tok-str', "'Rakesh Godumala'"], ['tok-punc', ',']],
  [['', '  '], ['tok-prop', 'role'], ['tok-punc', ': '], ['tok-str', "'Frontend Developer'"], ['tok-punc', ',']],
  [['', '  '], ['tok-prop', 'location'], ['tok-punc', ': '], ['tok-str', "'Hyderabad, India'"], ['tok-punc', ',']],
  [['', '  '], ['tok-prop', 'stack'], ['tok-punc', ': ['], ['tok-str', "'React'"], ['tok-punc', ', '], ['tok-str', "'JavaScript'"], ['tok-punc', ',']],
  [['', '          '], ['tok-str', "'Bootstrap'"], ['tok-punc', ', '], ['tok-str', "'Node.js'"], ['tok-punc', '],']],
  [['', '  '], ['tok-prop', 'focus'], ['tok-punc', ': '], ['tok-str', "'Clean, responsive UI'"], ['tok-punc', ',']],
  [['', '  '], ['tok-prop', 'openToWork'], ['tok-punc', ': '], ['tok-bool', 'true'], ['tok-punc', ',']],
  [['tok-punc', '};']],
];

/** Decorative code-editor illustration for the hero section. */
export default function HeroGraphic() {
  return (
    <div className="position-relative px-3 px-sm-4 py-4" aria-hidden="true">
      <span className="floating-chip" style={{ top: 0, right: 0 }}>
        <FaReact style={{ color: '#00b4d8' }} /> React.js
      </span>
      <span className="floating-chip" style={{ bottom: '0.5rem', left: 0, animationDelay: '-2s' }}>
        <FaBootstrap style={{ color: '#7952b3' }} /> Bootstrap 5
      </span>
      <span className="floating-chip d-none d-sm-inline-flex" style={{ bottom: '35%', right: '-0.5rem', animationDelay: '-4s' }}>
        <SiMongodb style={{ color: '#47a248' }} /> MERN
      </span>

      <div className="code-window">
        <div className="code-window-bar">
          <span className="code-dot" style={{ background: '#ff5f57' }} />
          <span className="code-dot" style={{ background: '#febc2e' }} />
          <span className="code-dot" style={{ background: '#28c840' }} />
          <span className="code-file">developer.js</span>
        </div>
        <pre className="code-body">
          {lines.map((tokens, index) => (
            <div key={index}>
              <span className="code-ln">{index + 1}</span>
              {tokens.map(([cls, text], i) => (
                <span key={i} className={cls}>
                  {text}
                </span>
              ))}
              {index === lines.length - 1 && <span className="code-cursor ms-1" />}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}
