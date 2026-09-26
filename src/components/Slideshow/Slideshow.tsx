import { useCallback, useEffect, useRef, useState } from 'react';
import { SLIDESHOW_IMAGES } from '../../config/site';

const INTERVAL_MS = 4500;

/**
 * Official Tata Boutique homepage slideshow.
 * Uses the 11 fixed i.ibb.co images per spec — auto-advances every 4-5s,
 * has prev/next controls, dot indicators, pauses on hover/focus, and is
 * fully responsive with object-fit: cover to avoid distorting people.
 */
export default function Slideshow() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = SLIDESHOW_IMAGES.length;

  const goTo = useCallback((i: number) => {
    setIndex(((i % total) + total) % total);
  }, [total]);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, total]);

  // Touch swipe support for mobile
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      delta > 0 ? prev() : next();
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="group relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-surface-offset sm:aspect-[16/10] lg:aspect-[16/11]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="region"
      aria-roledescription="carrousel"
      aria-label="Photos de Tata Boutique"
    >
      {SLIDESHOW_IMAGES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`Tata Boutique — photo ${i + 1} sur ${total}`}
          loading={i === 0 ? 'eager' : 'lazy'}
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ zIndex: i === index ? 1 : 0 }}
        />
      ))}

      {/* Gradient for readability of controls */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

      {/* Prev / Next */}
      <button
        type="button"
        onClick={prev}
        aria-label="Photo précédente"
        className="absolute left-2 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-text opacity-0 shadow-md transition-opacity hover:bg-white group-hover:opacity-100 focus-visible:opacity-100 sm:left-4"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M15 18l-6-6 6-6" /></svg>
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Photo suivante"
        className="absolute right-2 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-text opacity-0 shadow-md transition-opacity hover:bg-white group-hover:opacity-100 focus-visible:opacity-100 sm:right-4"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M9 18l6-6-6-6" /></svg>
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 sm:bottom-4">
        {SLIDESHOW_IMAGES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Aller à la photo ${i + 1}`}
            aria-current={i === index}
            className={`h-2 rounded-full transition-all ${
              i === index ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
