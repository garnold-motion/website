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

Two options, chosen per-video in `site.js`:

```js
// Self-hosted — file goes in public/video/
{ type: 'local', src: '/video/my-film.mp4', poster: '/img/my-film.jpg' }

// Vimeo
{ type: 'vimeo', id: '824804225', poster: '/img/my-film.jpg' }
```

Self-hosted is the default and it's the nicer experience — your domain, your
player, no branding. Two limits to respect:

- **GitHub rejects any file over 100MB.** Hard stop, no way around it.
- Repos heavy with video get slow to clone and push, and GitHub Pages has a
  100GB/month bandwidth allowance.

Practical rule: keep each file under ~40MB and the whole `public/video` folder
under ~300MB. For a showreel that means H.264 MP4, 1080p, around 8–10 Mbps.
Anything longer or heavier than that, put it on Vimeo and switch the `type`.

Poster frames go in `public/img/` as JPGs, ideally 1920×1080. Until you add
them the grid shows a labelled placeholder telling you which file is missing —
nothing breaks.

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

- Real showreel and project videos in `public/video/`
- Poster frames in `public/img/`
- `public/img/og-image.jpg` — 1200×630, used for link previews
- `public/favicon.svg`
- `public/rive/flappy-nova.riv`
- Real social URLs in `site.js` (currently placeholder homepages)
