import { useEffect, useState } from 'react';

/** Returns the id of the section currently in the middle band of the viewport. */
export function useActiveSection(ids) {
  const [active, setActive] = useState('');

  useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!elements.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    elements.forEach((el) => observer.observe(el));

    const clearAtTop = () => window.scrollY < 200 && setActive('');
    window.addEventListener('scroll', clearAtTop, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', clearAtTop);
    };
  }, [ids]);

  return active;
}
