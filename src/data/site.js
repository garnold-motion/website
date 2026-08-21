/* ----------------------------------------------------------------------------
   WHERE VIDEO IS SERVED FROM

   Video files are NOT in this repo. Git keeps every version of every file
   forever, and reels get re-cut — so they live in a Cloudflare R2 bucket and
   are served from media.georgearnold.au. Re-cutting a piece means overwriting
   the file in R2; no commit, no history, no repo growth.

   Poster images ARE committed. They're small enough that keeping their
   history costs nothing.

   Uploading a new piece:
     1. Put the .mp4 in the R2 bucket under video/
     2. Put its poster .jpg in /public/img  (1920px on the long edge)
     3. Add an entry below with video('filename.mp4')
   -------------------------------------------------------------------------- */

const R2_BASE = 'https://media.georgearnold.au';

/** Resolves a video filename to its URL in the R2 bucket. */
const video = (file) => `${R2_BASE}/video/${file}`;

export const site = {
  name: 'George Arnold',
  domain: 'georgearnold.au',
  tagline: 'Freelance editor and designer working across film, motion and interactive.',
  location: 'Melbourne, Australia',

  disciplines: ['Video Editing', 'Motion Design', 'Interactive Design'],

  contact: {
    email: 'george@georgearnold.au',

    // Rendered as one line under the email. Edit the numbers here.
    // Set to null to hide the line entirely.
    rates: [
      { amount: '$120', unit: 'hourly' },
      { amount: '$450', unit: 'half day' },
      { amount: '$850', unit: 'day' },
    ],

    // Put the PDF in /public and point at it. There's a placeholder there now —
    // replace the file and the link keeps working, no code change.
    cvUrl: '/george-arnold-cv.pdf',

    bookingUrl: null,
  },
};

export const showreel = {
  title: 'Showreel 2026',
  type: 'local',
  src: video('showreel.mp4'),
  poster: '/img/showreel-poster.jpg',
};

export const videoWork = [
  {
    id: 'fever-tree',
    title: 'Fever Tree — Social Series',
    role: 'Producer, Editor, Audio, Motion Graphics',
    year: '2025',
    type: 'local',
    src: video('fever-tree-9x16.mp4'),
    poster: '/img/fever-tree-9x16.jpg',
    // Vertical. Drives both the thumbnail treatment and the lightbox shape —
    // without this a 9:16 film plays as a narrow strip inside a 16:9 box.
    aspect: '9/16',
  },
  {
    id: 'wa-tourism',
    title: 'WA Tourism — Social Series',
    role: 'Producer, Editor, Audio',
    year: '2023',
    type: 'local',
    src: video('wa-tourism.mp4'),
    poster: '/img/wa-tourism.jpg',
  },

  {
    id: 'nova-next',
    title: 'Nova Next — Event Social Cut',
    role: 'Camera, Edit',
    year: '2024',
    type: 'local',
    src: video('nova-next.mp4'),
    poster: '/img/nova-next.jpg',
  },
  /* ---------------------------------------------------------------------
     Placeholders, commented out so the live site doesn't show cards reading
     "Add /img/motion-reel.jpg". Uncomment an entry once its video and poster
     are in /public/video and /public/img.

  {
    id: 'ramblers-brand',
    title: 'Ramblers — Brand Film',
    role: 'Edit, Colour',
    year: '2025',
    type: 'local',
    src: video('ramblers-brand.mp4'),
    poster: '/img/ramblers-brand.jpg',
  },
  {
    id: 'motion-reel',
    title: 'Motion Graphics Selects',
    role: 'Design, Animation',
    year: '2024',
    type: 'local',
    src: video('motion-reel.mp4'),
    poster: '/img/motion-reel.jpg',
  },
  {
    id: 'doc-short',
    title: 'Short Documentary',
    role: 'Edit',
    year: '2024',
    type: 'local',
    src: video('doc-short.mp4'),
    poster: '/img/doc-short.jpg',
  },
  --------------------------------------------------------------------- */
];

export const interactiveWork = [
  {
    id: 'ramblers-pour',
    title: 'The Perfect Pour',
    client: 'Ramblers',
    description:
      'A pour-timing game built in Rive for a pub loyalty app. Tilt, pour, and try not to overflow the glass.',
    year: '2026',
    src: '/rive/ramblers-pour.riv',
    artboard: null,
    stateMachine: null,
    accent: '#F5A524',
  },
  {
    id: 'flappy-nova',
    title: 'Flappy Nova',
    client: 'Nova Entertainment',
    description:
      'An in-house arcade game designed and animated for a station promo. Tap to flap.',
    // Drop the .riv in /public/rive/ and this lights up automatically.
    src: '/rive/flappy-nova.riv',
    artboard: null,
    stateMachine: null,
    accent: '#5B8DEF',
  },
];

export const services = [
  {
    title: 'Video Editing',
    body: 'Commercials, brand films, social cutdowns and long-form. Premiere and Resolve, delivered to spec.',
    items: ['Brand films', 'Commercials', 'Social cutdowns', 'Colour & finish'],
  },
  {
    title: 'Motion Design',
    body: 'Titles, lower thirds, explainers and full animated pieces. After Effects, start to finish.',
    items: ['Titles & typography', 'Explainers', 'Brand animation', 'VFX cleanup'],
  },
  {
    title: 'Interactive Design',
    body: 'Rive animations that respond to input — game mechanics, UI states, characters that react.',
    items: ['Rive state machines', 'App animation', 'Playable ads', 'Web interaction'],
  },
];
