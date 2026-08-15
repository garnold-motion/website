import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Horizontal snap rail.
 *
 * Built on native CSS scroll-snap rather than a carousel library, which means
 * trackpad momentum, touch swipe and scrollbar dragging all work for free and
 * behave the way the OS expects. On top of that we add:
 *
 *  - Arrow buttons that advance exactly one card (measured, not guessed):
 *    outlined buttons under the rail on desktop, small overlaid chevrons at
 *    the edges on mobile where there's no room for a control row.
 *  - Click-and-drag for desktop mouse users, who otherwise have no way to
 *    scroll a horizontal rail. A movement threshold stops a drag from firing
 *    the click handler on the card underneath.
 *  - Left/Right keys when the rail has focus.
 *  - A progress bar tracking scroll position.
 */

/** Slack, in px, below which a rail counts as "not scrollable". Must exceed
 *  the trailing spacer width used by consuming sections (currently 40px). */
const SCROLL_TOLERANCE = 48;

/** Progress indicator width, as a fraction of the track.
 *  Keep in sync with the `rail-progress-slide` keyframes in index.css. */
const BAR_FRACTION = 0.28;

/** True where the browser can drive the indicator off the scroll position
 *  itself, on the compositor. Chrome 115+ and Safari 26+; Firefox falls back
 *  to the JS path below. Evaluated once — support doesn't change at runtime. */
const HAS_SCROLL_TIMELINE =
  typeof CSS !== 'undefined' &&
  CSS.supports?.('animation-timeline: scroll()') &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function Carousel({
  children,
  label,
  controlsClassName = '',
  // Insets for the mobile edge chevrons. The default assumes the rail sits in
  // a container with a left gutter and runs to the right screen edge, and
  // lands both arrows the same distance from the screen edge.
  edgeArrowsClassName = '-left-2 right-4',
}) {
  const railRef = useRef(null);
  const barRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const measure = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;

    const max = rail.scrollWidth - rail.clientWidth;

    // A rail that doesn't meaningfully overflow has nothing to scroll — treat
    // it as both ends at once so no controls are offered. The tolerance is
    // above the trailing spacer's width, so a rail whose cards all fit doesn't
    // sprout arrows for 40px of dead travel.
    if (max <= SCROLL_TOLERANCE) {
      setAtStart(true);
      setAtEnd(true);
      return;
    }

    // Fallback path for browsers without scroll-driven animations. Writes the
    // transform straight to the DOM rather than through state.
    //
    // This is what fixed the original stutter: the bar used to have a CSS
    // transition AND a new target position on every scroll frame, so each
    // frame interrupted the previous one's easing and restarted it. Mirroring
    // scroll position 1:1 with no transition removes the fight entirely.
    if (!HAS_SCROLL_TIMELINE && barRef.current) {
      const progress = Math.min(1, Math.max(0, rail.scrollLeft / max));
      barRef.current.style.transform = `translateX(${progress * (100 / BAR_FRACTION - 100)}%)`;
    }

    // These only flip at the extremes, and React bails out of same-value
    // updates, so this doesn't re-render on every frame.
    setAtStart(rail.scrollLeft <= 1);
    setAtEnd(rail.scrollLeft >= max - 1);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    measure();

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    rail.addEventListener('scroll', onScroll, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(rail);

    return () => {
      cancelAnimationFrame(frame);
      rail.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, [measure, children]);

  /** Distance from one card's left edge to the next, including the gap. */
  const step = () => {
    const rail = railRef.current;
    if (!rail) return 0;
    const [a, b] = rail.children;
    if (a && b) return b.offsetLeft - a.offsetLeft;
    return a ? a.offsetWidth : rail.clientWidth;
  };

  const nudge = (dir) => {
    railRef.current?.scrollBy({ left: dir * step(), behavior: 'smooth' });
  };

  /* --- drag to scroll ---------------------------------------------------- */

  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: 0 });

  const onPointerDown = (e) => {
    // Touch already scrolls natively; hijacking it breaks momentum.
    if (e.pointerType === 'touch') return;
    const rail = railRef.current;
    drag.current = { active: true, startX: e.clientX, startScroll: rail.scrollLeft, moved: 0 };
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d.active) return;
    const dx = e.clientX - d.startX;
    d.moved = Math.max(d.moved, Math.abs(dx));

    // Only take over once the gesture is clearly a drag, so small mouse
    // wobbles during a click don't scroll the rail.
    if (d.moved > 4) {
      railRef.current.scrollLeft = d.startScroll - dx;
      railRef.current.setPointerCapture?.(e.pointerId);
    }
  };

  const endDrag = (e) => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    railRef.current?.releasePointerCapture?.(e.pointerId);
  };

  // Runs in the capture phase, so it can cancel the card's own click before
  // it fires. Without this, every drag also opens whatever card you released on.
  const onClickCapture = (e) => {
    if (drag.current.moved > 4) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = 0;
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nudge(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      nudge(-1);
    }
  };

  const hasOverflow = !(atStart && atEnd);

  const edgeArrow =
    'pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full ' +
    'border border-bone/15 bg-ink/70 text-bone backdrop-blur-md transition-opacity duration-300 ' +
    'active:bg-ink/90';

  return (
    <div className="rail-scope relative">
      <div className="relative">
        <div
          ref={railRef}
          role="region"
          aria-label={label}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={onClickCapture}
          onKeyDown={onKeyDown}
          // Grab cursor is pure CSS — :active covers the drag state without
          // re-rendering the rail on every pointer move.
          className="rail-scroller no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain pb-2 md:gap-6 md:cursor-grab md:active:cursor-grabbing"
        >
          {children}
        </div>

        {/* Mobile edge chevrons. Overlaid on the rail so they read as "there's
            more this way" without taking a row of their own. Hidden rather
            than disabled at each end, so they never sit there looking dead. */}
        {hasOverflow && (
          <div
            className={`pointer-events-none absolute inset-y-0 z-10 flex items-center justify-between md:hidden ${edgeArrowsClassName}`}
          >
            <button
              type="button"
              onClick={() => nudge(-1)}
              disabled={atStart}
              aria-label="Previous"
              className={`${edgeArrow} ${atStart ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
            >
              <ChevronLeft size={17} strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => nudge(1)}
              disabled={atEnd}
              aria-label="Next"
              className={`${edgeArrow} ${atEnd ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
            >
              <ChevronRight size={17} strokeWidth={2} />
            </button>
          </div>
        )}
      </div>

      {/* Progress + desktop arrows */}
      {hasOverflow && (
        <div className={`mt-6 flex items-center gap-6 md:mt-8 ${controlsClassName}`}>
          <div className="h-px flex-1 overflow-hidden bg-ink-line" aria-hidden="true">
            {/* Driven by the scroll timeline in index.css where supported,
                otherwise by measure(). Deliberately no CSS transition — see
                the comment in measure(). */}
            <div
              ref={barRef}
              className="rail-progress h-px bg-accent"
              style={{ width: `${BAR_FRACTION * 100}%`, willChange: 'transform' }}
            />
          </div>

          <div className="hidden shrink-0 items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => nudge(-1)}
              disabled={atStart}
              aria-label="Previous"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-line text-bone transition-colors hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-25"
            >
              <ArrowLeft size={17} strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={() => nudge(1)}
              disabled={atEnd}
              aria-label="Next"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-line text-bone transition-colors hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-25"
            >
              <ArrowRight size={17} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
