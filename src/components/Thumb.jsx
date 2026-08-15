import { useState } from 'react';
import { Play } from 'lucide-react';

/**
 * Poster thumbnail with a graceful fallback.
 *
 * Until real poster frames exist in /public/img, the image 404s — so we catch
 * that and render a labelled placeholder instead of a broken-image icon.
 */
export default function Thumb({ src, alt, label, ratio = 'aspect-video', ringed = false }) {
  const [failed, setFailed] = useState(!src);

  return (
    <div
      className={`relative w-full overflow-hidden bg-ink-soft ${ratio} ${
        // Marks the showreel out from the rest of the rail without changing
        // its size, so every card still lines up.
        ringed ? 'ring-1 ring-accent/45' : ''
      }`}
    >
      {!failed ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      ) : (
        /* Visible enough to read as a deliberate empty slot rather than a
           rendering fault, without competing with real poster frames. */
        <div className="absolute inset-0 flex items-end justify-start border border-ink-line bg-[#141419] p-5">
          <span className="text-eyebrow text-bone-dim/45">{label || 'Add poster frame'}</span>
        </div>
      )}

      {/* Play affordance. */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-bone/25 bg-ink/40 backdrop-blur-sm transition-all duration-500 group-hover:border-accent group-hover:bg-accent md:h-16 md:w-16">
          <Play
            size={18}
            strokeWidth={1.5}
            className="ml-0.5 fill-bone text-bone transition-colors group-hover:fill-ink group-hover:text-ink"
          />
        </span>
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-ink/20 transition-opacity duration-500 group-hover:opacity-0"
      />
    </div>
  );
}
