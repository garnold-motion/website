import { useCallback, useEffect, useRef, useState } from 'react';
import { Maximize2, Pause, Play, Volume2, VolumeX } from 'lucide-react';

/**
 * Self-hosted video with a minimal custom control layer.
 *
 * Native controls are deliberately off. iOS draws a heavy bar with 15-second
 * skip buttons across the frame and keeps it up whenever playback stalls,
 * which on a showreel means chrome sitting over the opening shots. This
 * replaces it with: tap to play/pause, a thin progress bar, and an auto-hide
 * after a couple of seconds of no interaction.
 *
 * Controls stay up while paused, while scrubbing, and while buffering — the
 * cases where the viewer actually wants them.
 */

const HIDE_DELAY = 2200;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function LocalVideo({ item, autoPlay = true }) {
  const videoRef = useRef(null);
  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const hideTimer = useRef(0);
  const scrubbing = useRef(false);
  // Mirrored as a ref so show() can read it without becoming a new function
  // on every stall, which would re-subscribe all the video event listeners.
  const waitingRef = useRef(false);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [visible, setVisible] = useState(true);

  /* --- show / auto-hide -------------------------------------------------- */

  // Called from real interactions and from the video's own events — never
  // from an effect body. setVisible(true) when already true is a no-op in
  // React, so calling this on every pointermove costs nothing.
  const show = useCallback(() => {
    setVisible(true);
    clearTimeout(hideTimer.current);

    const v = videoRef.current;
    // Keep them up unless the video is actually playing cleanly.
    if (!v || v.paused || v.ended || scrubbing.current || waitingRef.current) return;

    hideTimer.current = setTimeout(() => setVisible(false), HIDE_DELAY);
  }, []);

  useEffect(() => () => clearTimeout(hideTimer.current), []);

  /* --- video events ------------------------------------------------------ */

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onTime = () => {
      if (!scrubbing.current) setTime(v.currentTime);
      if (v.buffered.length) setBuffered(v.buffered.end(v.buffered.length - 1));
    };
    const onMeta = () => setDuration(v.duration);
    const onPlay = () => {
      setPlaying(true);
      show(); // starts the auto-hide countdown
    };
    const onPause = () => {
      setPlaying(false);
      show(); // paused, so this pins them open
    };
    const onWaiting = () => {
      waitingRef.current = true;
      setWaiting(true);
      show();
    };
    const onPlaying = () => {
      waitingRef.current = false;
      setWaiting(false);
      show();
    };
    const onVolume = () => setMuted(v.muted);
    const onEnded = () => {
      setPlaying(false);
      setVisible(true);
    };

    v.addEventListener('timeupdate', onTime);
    v.addEventListener('progress', onTime);
    v.addEventListener('loadedmetadata', onMeta);
    v.addEventListener('durationchange', onMeta);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    v.addEventListener('waiting', onWaiting);
    v.addEventListener('playing', onPlaying);
    v.addEventListener('volumechange', onVolume);
    v.addEventListener('ended', onEnded);

    return () => {
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('progress', onTime);
      v.removeEventListener('loadedmetadata', onMeta);
      v.removeEventListener('durationchange', onMeta);
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('waiting', onWaiting);
      v.removeEventListener('playing', onPlaying);
      v.removeEventListener('volumechange', onVolume);
      v.removeEventListener('ended', onEnded);
    };
  }, [show]);

  /* --- actions ----------------------------------------------------------- */

  const toggle = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused || v.ended) v.play().catch(() => {});
    else v.pause();
    show();
  }, [show]);

  const seekTo = (clientX) => {
    const track = trackRef.current;
    const v = videoRef.current;
    if (!track || !v || !Number.isFinite(v.duration)) return;

    const rect = track.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const next = ratio * v.duration;
    setTime(next);
    v.currentTime = next;
  };

  const onTrackDown = (e) => {
    e.stopPropagation();
    scrubbing.current = true;
    trackRef.current?.setPointerCapture?.(e.pointerId);
    seekTo(e.clientX);
    show();
  };
  const onTrackMove = (e) => {
    if (!scrubbing.current) return;
    seekTo(e.clientX);
  };
  const onTrackUp = (e) => {
    if (!scrubbing.current) return;
    scrubbing.current = false;
    trackRef.current?.releasePointerCapture?.(e.pointerId);
    show();
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (v) v.muted = !v.muted;
    show();
  };

  const goFullscreen = (e) => {
    e.stopPropagation();
    const v = videoRef.current;
    const wrap = wrapRef.current;
    // iPhone Safari can't fullscreen an arbitrary element — only the video
    // itself, via its own webkit method.
    if (v?.webkitEnterFullscreen) v.webkitEnterFullscreen();
    else if (wrap?.requestFullscreen) wrap.requestFullscreen().catch(() => {});
  };

  const onKeyDown = (e) => {
    const v = videoRef.current;
    if (!v) return;
    if (e.key === ' ' || e.key === 'k') {
      e.preventDefault();
      toggle();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      v.currentTime = Math.min(v.duration, v.currentTime + 5);
      show();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      v.currentTime = Math.max(0, v.currentTime - 5);
      show();
    } else if (e.key === 'm') {
      v.muted = !v.muted;
      show();
    }
  };

  const progress = duration ? (time / duration) * 100 : 0;
  const bufferedPct = duration ? (buffered / duration) * 100 : 0;
  const chrome = visible || !playing;

  return (
    <div
      ref={wrapRef}
      className="group relative h-full w-full bg-black"
      onPointerMove={show}
      onKeyDown={onKeyDown}
      tabIndex={0}
      style={{ cursor: chrome ? 'default' : 'none' }}
    >
      <video
        ref={videoRef}
        className="h-full w-full bg-black object-contain"
        src={item.src}
        poster={item.poster}
        autoPlay={autoPlay}
        playsInline
        preload="metadata"
        onClick={toggle}
      />

      {/* Centre play badge — only while paused, so it never sits over playback. */}
      {!playing && !waiting && (
        <button
          type="button"
          onClick={toggle}
          aria-label="Play"
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-bone/25 bg-ink/50 backdrop-blur-sm transition-colors hover:border-accent hover:bg-accent">
            <Play size={20} strokeWidth={1.5} className="ml-1 fill-bone text-bone" />
          </span>
        </button>
      )}

      {/* Buffering spinner. Without this a stall just looks like a frozen frame. */}
      {waiting && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-bone/25 border-t-accent" />
        </div>
      )}

      {/* Control bar */}
      <div
        className={`absolute inset-x-0 bottom-0 transition-opacity duration-300 ${
          chrome ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-t from-ink/85 to-transparent px-4 pb-3 pt-10 md:px-5 md:pb-4">
          {/* Scrub track. Padded vertically so it's a comfortable touch target
              while still reading as a hairline. */}
          <div
            ref={trackRef}
            role="slider"
            tabIndex={0}
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={Math.round(duration) || 0}
            aria-valuenow={Math.round(time)}
            aria-valuetext={`${formatTime(time)} of ${formatTime(duration)}`}
            onPointerDown={onTrackDown}
            onPointerMove={onTrackMove}
            onPointerUp={onTrackUp}
            onPointerCancel={onTrackUp}
            className="group/track relative -my-3 cursor-pointer py-3 touch-none"
          >
            <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-bone/20">
              <div
                className="absolute inset-y-0 left-0 bg-bone/25"
                style={{ width: `${bufferedPct}%` }}
              />
              <div
                className="absolute inset-y-0 left-0 bg-accent"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span
              aria-hidden="true"
              className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent opacity-0 transition-opacity group-hover/track:opacity-100"
              style={{ left: `${progress}%` }}
            />
          </div>

          <div className="mt-2.5 flex items-center gap-4">
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? 'Pause' : 'Play'}
              className="text-bone transition-colors hover:text-accent"
            >
              {playing ? (
                <Pause size={17} strokeWidth={1.75} className="fill-current" />
              ) : (
                <Play size={17} strokeWidth={1.75} className="fill-current" />
              )}
            </button>

            <span className="text-[0.72rem] tabular-nums text-bone-dim">
              {formatTime(time)} <span className="opacity-40">/</span> {formatTime(duration)}
            </span>

            <div className="ml-auto flex items-center gap-4">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? 'Unmute' : 'Mute'}
                className="text-bone transition-colors hover:text-accent"
              >
                {muted ? (
                  <VolumeX size={17} strokeWidth={1.75} />
                ) : (
                  <Volume2 size={17} strokeWidth={1.75} />
                )}
              </button>
              <button
                type="button"
                onClick={goFullscreen}
                aria-label="Fullscreen"
                className="text-bone transition-colors hover:text-accent"
              >
                <Maximize2 size={16} strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
