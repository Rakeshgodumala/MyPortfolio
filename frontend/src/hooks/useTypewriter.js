import { useEffect, useState } from 'react';

/**
 * Typewriter hook — cycles through an array of strings with a
 * typing → pause → erasing → pause loop.
 *
 * @param {string[]} words    - Array of strings to cycle through
 * @param {number}   typeSpeed  - ms per character while typing   (default 80)
 * @param {number}   eraseSpeed - ms per character while erasing  (default 45)
 * @param {number}   pauseAfterType  - ms pause when word is fully typed   (default 1800)
 * @param {number}   pauseAfterErase - ms pause after fully erased         (default 400)
 */
export function useTypewriter(
  words,
  { typeSpeed = 80, eraseSpeed = 45, pauseAfterType = 1800, pauseAfterErase = 400 } = {},
) {
  const [displayed, setDisplayed]   = useState('');
  const [wordIndex, setWordIndex]   = useState(0);
  const [charIndex, setCharIndex]   = useState(0);
  const [isErasing, setIsErasing]   = useState(false);

  useEffect(() => {
    if (!words?.length) return;

    const current = words[wordIndex % words.length];

    let delay;

    if (!isErasing) {
      // --- Typing phase ---
      if (charIndex < current.length) {
        delay = typeSpeed;
        const t = setTimeout(() => {
          setDisplayed(current.slice(0, charIndex + 1));
          setCharIndex((c) => c + 1);
        }, delay);
        return () => clearTimeout(t);
      }
      // Finished typing → pause then start erasing
      delay = pauseAfterType;
      const t = setTimeout(() => setIsErasing(true), delay);
      return () => clearTimeout(t);
    }

    // --- Erasing phase ---
    if (charIndex > 0) {
      delay = eraseSpeed;
      const t = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex - 1));
        setCharIndex((c) => c - 1);
      }, delay);
      return () => clearTimeout(t);
    }
    // Fully erased → pause then move to next word
    delay = pauseAfterErase;
    const t = setTimeout(() => {
      setIsErasing(false);
      setWordIndex((w) => (w + 1) % words.length);
    }, delay);
    return () => clearTimeout(t);
  }, [charIndex, isErasing, wordIndex, words, typeSpeed, eraseSpeed, pauseAfterType, pauseAfterErase]);

  return { displayed, isErasing };
}
