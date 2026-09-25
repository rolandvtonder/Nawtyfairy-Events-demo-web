/*
  Every word and number on the site lives here, so copy can be changed without
  going near a component.

  The business details are the ones published on the Destinali listing. The
  listing's own "services" blurb was boilerplate from the directory's template
  -- it advertised hot desks and private offices -- and has been discarded
  rather than paraphrased.
*/

export const BUSINESS = {
  name: 'Nawtyfairy Events',
  tagline: 'Event styling & décor — Cape Town',

  /* 083 499 9495, as published. The wa.me and tel: forms need it in E.164. */
  phoneDisplay: '083 499 9495',
  phoneHref: '+27834999495',
  whatsapp: '27834999495',

  street: 'Voel St, Belgravia',
  cityLine: 'Cape Town, 7798',
  area: 'Langa, Cape Town',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Voel+St%2C+Belgravia%2C+Cape+Town%2C+7798%2C+South+Africa',
} as const

/* Sunday is closed rather than absent, so the week reads as a complete row. */
export const HOURS: ReadonlyArray<{ day: string; open: string }> = [
  { day: 'Monday', open: '9:00 – 17:30' },
  { day: 'Tuesday', open: '9:00 – 17:00' },
  { day: 'Wednesday', open: '9:30 – 18:00' },
  { day: 'Thursday', open: '9:00 – 17:00' },
  { day: 'Friday', open: '9:00 – 17:00' },
  { day: 'Saturday', open: '8:30 – 17:00' },
  { day: 'Sunday', open: 'Closed' },
]

/*
  Routes, not anchors. Each section is its own page.

  Five is the most a horizontal bar holds at the 1000px breakpoint before it
  starts colliding with the phone pill, which is why Reviews earns its place
  here rather than a sixth item being added.
*/
export const NAV = [
  { label: 'Services', to: '/services' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Reviews', to: '/reviews' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
] as const

/*
  The banner at the top of each sub-page. The home page has the full poster
  hero; repeating its 10.4s pan on every route would make the site feel slow to
  move around, so the sub-pages get a short band of the same plate instead.

  `title` is also what goes in <title> and the breadcrumb.
*/
export const PAGES = {
  about: {
    title: 'About',
    eyebrow: 'The studio',
    heading: 'We dress the days\nyou do not forget',
    blurb: 'An event styling studio working out of Langa, Cape Town.',
  },
  services: {
    title: 'Services',
    eyebrow: 'What we do',
    heading: 'Four ways we\ndress a room',
    blurb: 'Weddings, private celebrations, corporate functions and décor hire.',
  },
  gallery: {
    title: 'Gallery',
    eyebrow: 'Recent work',
    heading: 'Tables we have\nset lately',
    blurb: 'Gardens, marquees and halls, dressed down to the last fold.',
  },
  reviews: {
    title: 'Reviews',
    eyebrow: 'Client words',
    heading: 'What our\nclients say',
    blurb: 'The people whose days we have set.',
  },
  contact: {
    title: 'Contact',
    eyebrow: 'Enquiries',
    heading: 'Tell us about\nyour day',
    blurb: 'Tell us the date and the headcount and we will come back with a quote.',
  },
} as const

/* ---- hero ---------------------------------------------------------------- */

/*
  Four lines, mirroring the reference's rhythm. The newline characters are
  load-bearing: the cascade counts them as slots, which is what puts a double
  beat at each line break.
*/
export const HEADLINE = 'a Table \nWhere Your \nPeople \nGather!'

/* The band across the foot of the frame. Nine characters including the space,
   which is what the 80ms step was tuned against. */
export const WORDMARK = 'Cape Town'

export const HERO_BODY =
  'Garden weddings, milestone parties and corporate functions across the Cape — styled, dressed and set down to the last fold.'

export const HERO_CARD = 'Now taking 2026 dates'

/* ---- sections ------------------------------------------------------------ */

export const ABOUT = {
  eyebrow: 'The studio',
  heading: 'We dress the days\nyou do not forget',
  body: [
    'Nawtyfairy Events is an event styling studio working out of Langa, Cape Town. We dress gardens, marquees and halls for the occasions that matter — laying tables, setting chairs, and arranging the greenery and glassware that turn a venue into an evening.',
    'We work at every scale, from a sixty-seat garden wedding to a company year-end. What stays the same is the finish: every chair cover straight, every setting matched, every last detail placed before your first guest walks in.',
  ],
  /* Facts that are true of the business as listed, not invented numbers.
     Claiming "500+ events" on a page with one photograph would not survive
     first contact with a client. */
  facts: [
    { k: 'Based in', v: 'Langa, Cape Town' },
    { k: 'We travel', v: 'Cape Town & Winelands' },
    { k: 'Setup & strike', v: 'Included' },
    { k: 'Open', v: 'Mon – Sat' },
  ],
} as const

export type Service = {
  id: string
  title: string
  body: string
  points: string[]
}

export const SERVICES: ReadonlyArray<Service> = [
  {
    id: 'weddings',
    title: 'Weddings & engagements',
    body: 'Ceremony and reception styling from the aisle to the last place card — tablescapes, linen, florals and full venue dressing.',
    points: ['Tablescapes & runners', 'Ceremony dressing', 'Florals & greenery', 'Place settings'],
  },
  {
    id: 'celebrations',
    title: 'Private celebrations',
    body: 'Birthdays, baby showers, matric dances and anniversaries, set up with exactly the same care as a wedding.',
    points: ['Milestone birthdays', 'Baby showers', 'Matric dances', 'Anniversaries'],
  },
  {
    id: 'corporate',
    title: 'Corporate & brand events',
    body: 'Launches, year-end functions, conferences and activations — styled to your brand rather than to ours.',
    points: ['Year-end functions', 'Launches & activations', 'Conferences', 'Branded styling'],
  },
  {
    id: 'hire',
    title: 'Décor & furniture hire',
    body: 'Tiffany chairs, trestle tables, linen, crockery and styling pieces — hired on their own or delivered fully set up.',
    points: ['Tiffany chairs', 'Trestle tables', 'Linen & crockery', 'Styling pieces'],
  },
]

/*
  Gallery. Every frame here is a crop of the single photograph the old listing
  carried, graded to match. They are deliberately four different compositions --
  a wide establishing shot and three closer reads -- rather than six samples of
  one texture, but this section is the first place to spend new photography.
*/
export const GALLERY = [
  {
    src: '/assets/gallery-1.webp',
    alt: 'Garden marquee set with long trestle tables and clear tiffany chairs for a seated reception',
    span: 'wide' as const,
  },
  {
    src: '/assets/gallery-2.webp',
    alt: 'Table runner dressed with trailing greenery, charger plates and folded white napkins',
    span: 'tall' as const,
  },
  {
    src: '/assets/gallery-3.webp',
    alt: 'Glassware, cutlery and linen laid along the length of the top table',
    span: 'tall' as const,
  },
  {
    src: '/assets/gallery-4.webp',
    alt: 'Clear tiffany chairs with white seat pads lined along the table on the lawn',
    span: 'wide' as const,
  },
]

/*
  TESTIMONIALS — intentionally empty.

  The Destinali listing carries no reviews, and inventing client quotes with
  invented names would put fabricated endorsements on a live business page.
  The section renders an honest "no reviews yet" state until real ones exist.

  To publish real ones, add entries in this shape and the section switches over
  on its own:

    { quote: 'They set the whole garden while we were still getting ready.',
      name: 'Thandi M.', event: 'Garden wedding, Constantia' },
*/
export type Testimonial = { quote: string; name: string; event: string }

export const TESTIMONIALS: ReadonlyArray<Testimonial> = []

export const EVENT_TYPES = [
  'Wedding or engagement',
  'Private celebration',
  'Corporate or brand event',
  'Décor & furniture hire only',
  'Something else',
] as const
