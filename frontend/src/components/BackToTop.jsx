import { FiArrowUp } from 'react-icons/fi';
import { useScrolled } from '../hooks/useScrolled';

export default function BackToTop() {
  const show = useScrolled(600);
  return (
    <a
      href="#home"
      className={`back-to-top ${show ? 'show' : ''}`}
      aria-label="Back to top"
      tabIndex={show ? 0 : -1}
    >
      <FiArrowUp size={22} strokeWidth={2.8} aria-hidden="true" />
    </a>
  );
}
