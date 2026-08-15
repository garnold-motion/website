/* ============================================================================
   SITE CONTENT
   ----------------------------------------------------------------------------
   Everything you'll want to change day-to-day lives in this one file.
   No need to touch any component to add a project, swap a video, or fix a link.
   ========================================================================== */

export const site = {
  name: 'George Arnold',
  domain: 'georgearnold.au',
  tagline: 'Freelance editor and designer working across film, motion and interactive.',
  location: 'Melbourne, Australia',

  // The three big words under your name in the hero.
  disciplines: ['Video Editing', 'Motion Design', 'Interactive Design'],

  contact: {
    email: 'garnoldmotion@gmail.com',
    // Set to null to hide a link entirely.
    socials: [
      { label: 'Instagram', href: 'https://instagram.com/' },
      { label: 'LinkedIn', href: 'https://linkedin.com/' },
      { label: 'Vimeo', href: 'https://vimeo.com/' },
    ],
    // When you're ready for bookings, drop a Cal.com or Calendly URL in here
    // and the contact section grows a "Check availability" button automatically.
    bookingUrl: null,
  },
};

/* ----------------------------------------------------------------------------
   SHOWREEL — the single hero video at the top of the work section.
   -------------------------------------------------------------------------- */

export const showreel = {
  title: 'Showreel 2026',
  // type: 'local' | 'vimeo' | 'youtube'
  //   local  -> src is a path inside /public, e.g. '/video/showreel.mp4'
  //   vimeo  -> id is the numeric Vimeo ID, e.g. '824804225'
  //   youtube-> id is the watch ID, e.g. 'dQw4w9WgXcQ'
  type: 'local',
  src: '/video/showreel.mp4',
  // Poster frame shown before play. Also used as the section backdrop.
  poster: '/img/showreel-poster.jpg',
};

/* ----------------------------------------------------------------------------
   VIDEO WORK — the grid below the showreel.

   Each entry takes the same type/src/id shape as the showreel above, so you can
   mix self-hosted MP4s and Vimeo embeds freely.

   Keep self-hosted files under ~40MB each. GitHub rejects anything over 100MB
   outright, and a repo heavy with video gets slow to push.
   -------------------------------------------------------------------------- */

export const videoWork = [
  {
    id: 'nova-campaign',
    title: 'Nova — Summer Campaign',
    role: 'Edit, Motion Graphics',
    year: '2025',
    type: 'local',
    src: '/video/nova-campaign.mp4',
    poster: '/img/nova-campaign.jpg',
  },
  {
    id: 'ramblers-brand',
    title: 'Ramblers — Brand Film',
    role: 'Edit, Colour',
    year: '2025',
    type: 'local',
    src: '/video/ramblers-brand.mp4',
    poster: '/img/ramblers-brand.jpg',
  },
  {
    id: 'motion-reel',
    title: 'Motion Graphics Selects',
    role: 'Design, Animation',
    year: '2024',
    type: 'local',
    src: '/video/motion-reel.mp4',
    poster: '/img/motion-reel.jpg',
  },
  {
    id: 'doc-short',
    title: 'Short Documentary',
    role: 'Edit',
    year: '2024',
    type: 'local',
    src: '/video/doc-short.mp4',
    poster: '/img/doc-short.jpg',
  },
];

/* ----------------------------------------------------------------------------
   INTERACTIVE WORK — Rive projects.

   Each one opens in a phone frame on desktop, fullscreen on mobile.
   Drop the .riv file in /public/rive/ and point `src` at it.

   artboard / stateMachine: leave as null to use the file's defaults. Only set
   them if a file has multiple artboards and you want a specific one.
   -------------------------------------------------------------------------- */

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

/* ----------------------------------------------------------------------------
   SERVICES — the short "what I do" strip. Keep these to one line each.
   -------------------------------------------------------------------------- */

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
