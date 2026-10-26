import { useLayoutEffect, type CSSProperties } from 'react';

/** Stagger helper: `<div data-reveal style={delay(120)} />` waits 120ms before animating. */
export const delay = (ms: number): CSSProperties => ({ ['--reveal-delay' as string]: `${ms}ms` });

/** Hero entrance delay (CSS classes hero-in / hero-word / hero-fade read --d). */
export const d = (ms: number): CSSProperties => ({ ['--d' as string]: `${ms}ms` });

/**
 * Scroll-triggered reveals. Any element with a `data-reveal` attribute is hidden
 * until it scrolls into view, then gets `data-in` and the matching CSS animation
 * (see index.css). Nothing is hidden unless this hook has run, and nothing is
 * hidden at all for visitors who prefer reduced motion.
 */
export function useScrollReveal(): void {
  useLayoutEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const root = document.documentElement;
    root.classList.add('reveal-ready');

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.in = '';
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      root.classList.remove('reveal-ready');
    };
  }, []);
}
