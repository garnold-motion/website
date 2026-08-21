import LocalVideo from './LocalVideo.jsx';

/**
 * Renders a video from whichever source the data file specifies.
 *
 *   { type: 'local',   src: '/video/reel.mp4' }
 *   { type: 'vimeo',   id: '824804225' }
 *   { type: 'youtube', id: 'dQw4w9WgXcQ' }
 *
 * Keeping this behind one component means swapping a self-hosted file for a
 * Vimeo embed later is a one-line change in src/data/site.js.
 */
export default function VideoPlayer({ item, autoPlay = true, className = '' }) {
  const frame = 'h-full w-full border-0';

  if (item.type === 'vimeo') {
    const params = new URLSearchParams({
      autoplay: autoPlay ? '1' : '0',
      title: '0',
      byline: '0',
      portrait: '0',
      dnt: '1',
    });
    return (
      <iframe
        className={`${frame} ${className}`}
        src={`https://player.vimeo.com/video/${item.id}?${params}`}
        title={item.title}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (item.type === 'youtube') {
    const params = new URLSearchParams({
      autoplay: autoPlay ? '1' : '0',
      rel: '0',
      modestbranding: '1',
    });
    return (
      <iframe
        className={`${frame} ${className}`}
        src={`https://www.youtube-nocookie.com/embed/${item.id}?${params}`}
        title={item.title}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }

  // Self-hosted MP4 — custom control layer, see LocalVideo.
  return (
    <div className={`h-full w-full ${className}`}>
      <LocalVideo item={item} autoPlay={autoPlay} />
    </div>
  );
}
