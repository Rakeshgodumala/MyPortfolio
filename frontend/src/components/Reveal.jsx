import { useEffect, useRef, useState } from 'react';

/**
 * Scroll-reveal wrapper — inspired by Linear / Vercel / cal.com style animations.
 *
 * Props:
 *   variant  — 'fade-up' (default) | 'fade-left' | 'fade-right' | 'fade' | 'zoom'
 *   delay    — ms delay before the animation starts (for staggered cards)
 *   duration — ms (default 700)
 *   as       — HTML tag to render (default 'div')
 */
export default function Reveal({
  as: Tag = 'div',
  delay = 0,
  duration = 700,
  variant = 'fade-up',
  className = '',
  children,
  ...rest
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || !('IntersectionObserver' in window)) {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      // Trigger slightly earlier so the animation finishes as element enters view
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal reveal--${variant} ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={{
        '--reveal-delay': `${delay}ms`,
        '--reveal-duration': `${duration}ms`,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
