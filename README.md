# georgearnold.au

Personal site for George Arnold — video editing, motion design, interactive design.

Vite + React 19 + Tailwind 4 + Rive. One page, responsive, no backend.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to dist/
npm run preview  # serve the production build locally
```

## Changing content

**Almost everything lives in `src/data/site.js`.** Name, tagline, the three
disciplines in the hero, every video, every Rive piece, services, contact
details. You shouldn't need to open a component to update the site.

### Adding a video

**Videos are not in this repo.** They live in a Cloudflare R2 bucket and are
served from `media.georgearnold.au`. Git keeps every version of every file
permanently, so committing a reel you'll later re-cut bloats the repo forever —
R2 has no history, so overwriting a file just replaces it.

To add a piece:

1. Upload the `.mp4` to the R2 bucket under `video/`
2. Put its poster in `public/img/` as a JPG, ~1920px on the long edge
3. Add an entry to `videoWork` in `src/data/site.js`:

```js
{
  id: 'my-piece',
  title: 'Client — Piece Name',
  role: 'Editor, Motion Graphics',
  year: '2026',
  type: 'local',
  src: video('my-piece.mp4'),      // resolves to the R2 bucket
  poster: '/img/my-piece.jpg',
}
```

To **replace** an existing video, just overwrite the file in R2 — no code
change, no commit. Cloudflare may cache the old one briefly; purge it in the
dashboard if you need it live immediately.

Vertical (9:16) pieces need one extra line, `aspect: '9/16'`. That switches the
thumbnail to a blurred-fill treatment so the card stays level with the others,
and makes the lightbox tall rather than letterboxing the video into a strip.

`R2_BASE` at the top of `site.js` is the one place the host is named. Point it
somewhere else, or set it to `''` and put files back in `public/video`, and
everything follows.

Poster images **are** committed — they're small and their history is harmless.
Until a poster exists the card shows a labelled placeholder naming the missing
file, so nothing breaks silently.

### The video player

Self-hosted MP4s use a custom control layer (`src/components/LocalVideo.jsx`)
rather than the browser's native controls. iOS draws a heavy bar with 15-second
skip buttons across the frame and keeps it up whenever playback stalls, which
on a showreel means chrome sitting over the opening shots.

The custom layer is: tap to play/pause, thin accent progress bar with buffered
indicator, mute and fullscreen, auto-hiding after 2.2s. It stays visible while
paused, while scrubbing and while buffering. Keyboard: space to play/pause,
arrows to seek 5s, m to mute.

Vimeo and YouTube items still use their own embedded players — only `local`
videos get this.

**Export settings that work well:** H.264 High profile, 1080p, VBR 2-pass,
~4 Mbps target, AAC audio at 160 kbps, and Fast Start enabled (this puts the
file index at the front so playback can start before the download finishes).

### Adding a Rive piece

Drop the `.riv` in `public/rive/`, then add an entry to `interactiveWork` in
`site.js`. Leave `artboard` and `stateMachine` as `null` unless the file has
several and you want a specific one.

The card appears whether or not the file exists yet — a missing file shows a
"coming soon" state inside the phone rather than erroring. That's how
`flappy-nova` is currently set up; add `public/rive/flappy-nova.riv` and it
goes live with no code change.

### How the work sections lay out

Both the video work and the Rive pieces sit in a horizontal carousel
(`src/components/Carousel.jsx`) rather than a vertical grid, so the page doesn't
force a long scroll to reach the interactive section.

It's built on native CSS scroll-snap, so trackpad, touch and scrollbar all
behave normally. On top of that: arrow buttons on desktop, click-and-drag for
mouse users, Left/Right keys when the rail is focused, and a progress bar.

Add as many projects as you like — the rail just gets longer. If everything
fits on screen the controls hide themselves.

The showreel is the first slide, pulled in from the `showreel` object in
`site.js` and marked with an accent ring. To take it back out of the rail and
give it its own full-width block above, edit `buildSlides()` at the top of
`Work.jsx`.

The progress bar under each rail uses a CSS scroll-driven animation
(`rail-progress-slide` in `index.css`), so the browser links it to scroll
position on the compositor — it tracks a swipe exactly rather than chasing it
from JavaScript. Firefox doesn't support this yet and falls back to a JS path
in `Carousel.jsx`. If you change `BAR_FRACTION` there, update the keyframe
percentage in `index.css` to match.

### Turning on bookings

Set `contact.bookingUrl` in `site.js` to a Cal.com or Calendly link. A "Check
availability" button appears in the contact section. Leave it `null` to hide.

### Changing the accent colour

One line — `--color-accent` in `src/index.css`. Everything follows.

## Deploying

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and
publishes to GitHub Pages.

One-time setup in the repo: **Settings → Pages → Source → GitHub Actions**.

`public/CNAME` holds the custom domain, so Pages keeps georgearnold.au wired up
across deploys. The DNS records you need at your registrar:

| Type  | Name | Value                                                      |
| ----- | ---- | ---------------------------------------------------------- |
| A     | @    | 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153 |
| CNAME | www  | `<your-github-username>.github.io`                          |

Then tick **Enforce HTTPS** in the Pages settings once the cert issues (can
take up to an hour after DNS propagates).

## Still to add

- `public/img/og-image.jpg` — 1200×630, used for link previews when shared
- `public/rive/flappy-nova.riv` — the card renders a "coming soon" state until it lands
- Real Rive pieces (the Interactive section is currently a placeholder)
