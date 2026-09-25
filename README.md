# Nawtyfairy Events

Website for Nawtyfairy Events — event styling and décor, Langa, Cape Town.

Dark, poster-style hero over a slowly panning photograph, then About, Services,
Gallery, Client words and an Enquiry form. Champagne gold on near-black.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | TypeScript check (`tsc --noEmit`) |

Deploying is a matter of running `npm run build` and uploading `dist/` — it is a
static site with no server behind it. Netlify, Vercel, Cloudflare Pages and
plain shared hosting all work, but see **Routing on a static host** below: there
is one setting every host needs or the sub-pages 404 on refresh.

## Pages

Each section is its own page with its own address, so any of them can be linked,
bookmarked, shared on WhatsApp or found in a search engine on its own.

| Route | What is on it |
| --- | --- |
| `/` | The poster hero, then a short read of each section with a way through |
| `/services` | The four service lines in full |
| `/gallery` | Every frame, with a lightbox |
| `/reviews` | Client words (currently the honest empty state) |
| `/about` | The studio, and the facts panel |
| `/contact` | The enquiry form, phone, WhatsApp, address and opening hours |
| anything else | A real 404 page, not a silent redirect home |

The page files are in [`src/pages/`](src/pages), and each one is a handful of
lines: a banner, the section, and the closing call to action. The sections
themselves live one level up and are shared between the home page and their own
page, which is why they take a `heading` prop — on a dedicated page the banner
already carries the title, so the section must not print a second copy of it.

To add a page: make a file in `src/pages/`, add a `<Route>` in
[`src/App.tsx`](src/App.tsx), and add an entry to `NAV` in `src/data.ts` if it
belongs in the menu. Five is about the most the desktop bar holds before it
starts crowding the phone button; beyond that, put it in the footer instead.

## Routing on a static host

The sub-pages are handled by the router in the browser, not by files on disk.
Loading `/about` directly — from a bookmark, a shared link or a refresh — asks
the host for a file that does not exist, and you get a 404 unless the host is
told to hand every path to `index.html`.

`public/_redirects` already does this for **Netlify** and **Cloudflare Pages**.
Other hosts want their own file, and the details are in the comments at the top
of that file:

- **Vercel** — `vercel.json` with a rewrite to `/index.html`
- **Apache** — `.htaccess` with `FallbackResource /index.html`
- **Nginx** — `try_files $uri $uri/ /index.html;`

Get this wrong and the site looks perfect until the first person refreshes.

### GitHub Pages

Pages is already set up, and it needs more than the others because it serves a
project site from a **subpath** (`/Nawtyfairy-Events-demo-web/`) rather than
from a domain root. Three things follow from that, all handled:

- `.github/workflows/deploy.yml` builds the site and publishes `dist/`. Pages'
  default "deploy from a branch" mode would serve this repo's source
  `index.html`, whose script tag points at `/src/main.tsx` — TypeScript no
  browser can run. That renders a blank page.
- The workflow passes `--base=/<repo-name>/`, and the router reads it back via
  `import.meta.env.BASE_URL`. Any asset path written as a string in a `.ts`
  file goes through `asset()` in `src/asset.ts`, because Vite cannot rewrite a
  string literal the way it rewrites an import.
- Pages ignores `_redirects`, but it does serve `404.html` for unknown paths,
  so the workflow copies `index.html` to `404.html`. That is what makes
  `/gallery` survive a refresh.

**One-off setting you have to click yourself:** Settings → Pages → Build and
deployment → Source → **GitHub Actions**. On "Deploy from a branch" the
workflow runs and nothing changes.

Moving to a root-hosted domain later needs no code change — `npm run build`
with no `--base` produces a root build, and `asset()` and the router basename
both collapse to `/`.

## Where to change things

**All the words and business details live in one file: [`src/data.ts`](src/data.ts).**
Phone number, address, opening hours, the headline, the services, the gallery
captions — change them there and they update everywhere. You should not need to
open a component to edit copy.

| I want to change… | File |
| --- | --- |
| Any wording, phone, hours, services | `src/data.ts` |
| The menu items | `NAV` in `src/data.ts` |
| A page's banner heading | `PAGES` in `src/data.ts` |
| Colours and fonts | `src/index.css` (the `@theme` block at the top) |
| Component styling | `src/components.css` |
| The home hero composition | `src/Hero.tsx` |
| The sub-page banner | `src/PageHero.tsx` |
| Which pages exist | `src/pages/` and the routes in `src/App.tsx` |
| Site description and link preview | `index.html` |

## Adding your photographs

This is the single most valuable thing you can do to the site.

Right now every image is a crop of the **one** photograph that existed on the
old Destinali listing. It has been cover-cropped, graded and grained to carry a
full-bleed poster hero, but it is one frame of one event, and the gallery in
particular is four crops of that same frame. Real photography from a few
different events will transform the page without a line of code changing.

To add them:

1. Put the new files in `tools/source/`.
2. Open `tools/build-assets.js` and point `HERO_SOURCE`, `DETAILS` and
   `GALLERY` at them.
3. Run:

   ```bash
   npm i -D sharp
   node tools/build-assets.js
   ```

Everything in `public/assets/` is regenerated on the same grade, so new pictures
match the existing ones automatically. The script has comments explaining each
number and why the grade is built the way it is.

If you would rather not run the script, you can simply replace the files in
`public/assets/` by hand, keeping the same names and roughly the same
dimensions — but they will not be colour-matched to each other.

## The logo

There is **no logo file**. The old listing carried none, so rather than invent a
mark and present it as the business's identity, the site sets the name
typographically: `NAWTYFAIRY` in the display face above a tracked `EVENTS`,
beside a four-point sparkle.

If you have real artwork, drop it into `public/` and replace the `<Sparkle />`
and the two text spans in `src/SiteNav.tsx` (and the matching block in the
footer in `src/App.tsx`).

## Client reviews

The Client words section is deliberately empty. The business has no published
reviews, and writing convincing quotes under invented client names would put
fabricated endorsements on a live page, so the section shows an honest
invitation instead.

The moment you add real ones it switches over on its own — no code change. In
`src/data.ts`:

```ts
export const TESTIMONIALS: ReadonlyArray<Testimonial> = [
  {
    quote: 'They set the whole garden while we were still getting ready.',
    name: 'Thandi M.',
    event: 'Garden wedding, Constantia',
  },
]
```

## How the enquiry form works

There is no server and no published email address, so the form does not POST
anywhere. It validates properly and then opens WhatsApp with the whole enquiry
already written out — name, phone, event type, date, guest count and message —
for the client to press send on. That way nothing is silently dropped, and
enquiries arrive on the channel the business already answers.

To move to a real backend later, replace the single `submit` function in
`src/Contact.tsx`. Nothing else needs to change.

## Before you go live

- **Set the link-preview image to an absolute URL.** In `index.html`,
  `og:image` is `/assets/og.webp`. Facebook and WhatsApp need the full address,
  so change it to `https://yourdomain.co.za/assets/og.webp` once you have a
  domain.
- Check the opening hours and address in `src/data.ts` are still correct — they
  were taken from the old directory listing.
- Add real photographs (see above).

## A note on the layout

The hero is not a normal flow layout. Above 1000px it is drawn on a fixed
1440×810 artboard with every element placed at an exact coordinate, and the
whole board is scaled to the width of the window. That is what keeps the poster
composition intact at any desktop size.

Below 1000px it switches to an ordinary responsive layout with the same type
hierarchy, the same photograph and the same animation, because a scaled artboard
on a phone would set the headline at 16px and the body copy at 4px.

Both paths are in `src/Hero.tsx`, and the comments there explain the coordinates
and the reveal timings. Everything below the hero is ordinary grid and flex
layout.

The other pages do not repeat that poster. They open on a short band of the same
photograph with the same per-character reveal on the heading and none of the pan
— running a 10.4-second pan on every route would make the site feel slow to move
around. That banner is `src/PageHero.tsx`.

## Accessibility

Built in rather than bolted on, and worth preserving if you edit:

- Full keyboard support, with a visible gold focus ring on everything
  interactive and a "skip to content" link.
- `prefers-reduced-motion` collapses every reveal to its finished state, so
  nothing has to be waited out and nothing is hidden.
- The form has visible labels, helper text, validation on blur, inline errors
  beside each field, and a focusable error summary that takes focus after a
  failed submit and links to each problem.
- The gallery lightbox is a real dialog: Escape closes it, arrow keys move
  between frames, focus returns to the thumbnail that opened it.
- Gold on near-black measures 8.8:1, which passes AA and AAA for normal text.
- Colour never carries meaning on its own — errors have an icon and a sentence,
  and the current menu item is marked with a rule as well as gold.
- Every route change resets the scroll position and moves focus to `<main>`, so
  a screen reader announces the new page instead of leaving its cursor on a
  control that no longer exists.
- Headings group their letters into words. Each letter is animated separately,
  and without the grouping a browser will wrap a heading in the middle of a
  word on a narrow screen.

## Stack

Vite 6 · React 19 · TypeScript · Tailwind CSS v4 · `motion` · React Router 7
Fonts: Archivo (display and UI) and Cormorant Infant (prose), from Google Fonts.
