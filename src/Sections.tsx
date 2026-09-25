/*
  ABOUT · SERVICES · GALLERY · TESTIMONIALS

  These are section bodies, not pages. Each one renders on its own route
  underneath a PageHero, and several also render on the home page as a taster.

  That is what `heading` is for. On a dedicated route the PageHero already
  carries the eyebrow and the <h1>, so the section must not print a second copy
  of them -- it would read as the same title twice and put two competing
  headings in the document outline. On the home page there is no banner, so the
  section supplies its own.

  Below the hero everything is ordinary flow layout. The artboard is the right
  tool for a fixed poster composition and the wrong one for text that has to
  reflow, so nothing down here is absolutely positioned. The visual language
  carries over -- thin display caps, gold eyebrows, hairline rules, the same
  grain-and-gold grade -- but the layout is grid and flex.
*/
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ABOUT, SERVICES, GALLERY, TESTIMONIALS, BUSINESS } from './data'
import { Container, Section, Reveal, Rule, Eyebrow, Heading, Sparkle } from './ui'

type Head = { heading?: boolean }

/* ---- about --------------------------------------------------------------- */

export function About({ heading = true }: Head) {
  return (
    <Section id="about" label="About the studio">
      <Container>
        <div className="about-grid">
          <div>
            {heading && (
              <Reveal>
                <Eyebrow>{ABOUT.eyebrow}</Eyebrow>
                <Heading text={ABOUT.heading} />
              </Reveal>
            )}

            <Reveal delay={0.08}>
              <div style={{ marginTop: heading ? 28 : 0, maxWidth: 560 }}>
                {ABOUT.body.map((p, i) => (
                  <p
                    key={i}
                    className="prose"
                    style={{ margin: i === 0 ? '0 0 18px' : 0, color: 'rgba(255,255,255,0.76)' }}
                  >
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.14}>
              <dl className="fact-grid">
                {ABOUT.facts.map((f) => (
                  <div key={f.k}>
                    <dt className="fact-k">{f.k}</dt>
                    <dd className="fact-v">{f.v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <Reveal delay={0.1} y={34}>
            <figure style={{ margin: 0, position: 'relative' }}>
              <img
                src="/assets/gallery-2.webp"
                alt="A dressed trestle table with trailing greenery, charger plates and folded linen"
                width={1100}
                height={825}
                loading="lazy"
                decoding="async"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  borderRadius: 4,
                  border: '1px solid rgba(232,220,196,0.16)',
                }}
              />
              {/* The ring-and-sparkle from the hero, reused as a seal. */}
              <span className="figure-seal" aria-hidden="true">
                <Sparkle size={34} />
              </span>
            </figure>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}

/* ---- services ------------------------------------------------------------ */

export function Services({ heading = true }: Head) {
  return (
    <Section id="services" label="Services">
      <Container>
        {heading && <Rule />}
        <div style={{ paddingTop: heading ? 'clamp(36px, 5vw, 72px)' : 0 }}>
          {heading && (
            <Reveal>
              <Eyebrow>What we do</Eyebrow>
              <Heading text={'Four ways we\ndress a room'} />
            </Reveal>
          )}

          <ol className="service-grid" style={{ marginTop: heading ? undefined : 0 }}>
            {SERVICES.map((s, i) => (
              <li key={s.id} style={{ listStyle: 'none' }}>
                <Reveal delay={0.06 * i}>
                  <article className="service-card">
                    <span className="service-no" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    <h3 className="service-title display">{s.title}</h3>

                    <p className="prose service-body">{s.body}</p>

                    <ul className="service-points">
                      {s.points.map((p) => (
                        <li key={p}>
                          <Sparkle size={11} />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  )
}

/* ---- gallery ------------------------------------------------------------- */

/*
  A lightbox rather than a plain grid, because a gallery whose images cannot be
  seen larger is a contact sheet. It is a real dialog: Escape closes it, arrows
  move between frames, focus goes to the close button on open and returns to the
  thumbnail that opened it on close, and the page behind stops scrolling.

  `limit` trims the grid for the home page. The lightbox indexes into the
  trimmed list, not the full one, so "3 of 3" stays honest.
*/
export function Gallery({ heading = true, limit }: Head & { limit?: number }) {
  const shots = limit ? GALLERY.slice(0, limit) : GALLERY
  const [openAt, setOpenAt] = useState<number | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const returnRef = useRef<HTMLButtonElement | null>(null)

  const close = useCallback(() => {
    setOpenAt(null)
    returnRef.current?.focus()
  }, [])

  const step = useCallback(
    (d: number) => {
      setOpenAt((v) => (v === null ? v : (v + d + shots.length) % shots.length))
    },
    [shots.length]
  )

  useEffect(() => {
    if (openAt === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [openAt, close, step])

  const shot = openAt === null ? null : shots[openAt]

  return (
    <Section id="gallery" label="Gallery">
      <Container>
        {heading && <Rule />}
        <div style={{ paddingTop: heading ? 'clamp(36px, 5vw, 72px)' : 0 }}>
          {heading && (
            <Reveal>
              <Eyebrow>Recent work</Eyebrow>
              <Heading text={'Tables we have\nset lately'} />
            </Reveal>
          )}

          <ul className="gallery-grid" style={heading ? undefined : { marginTop: 0 }}>
            {shots.map((g, i) => (
              <li key={g.src} className={`tile tile-${g.span}`} style={{ listStyle: 'none' }}>
                <Reveal delay={0.05 * i} y={18} style={{ height: '100%' }}>
                  <button
                    type="button"
                    className="tile-btn"
                    onClick={(e) => {
                      returnRef.current = e.currentTarget
                      setOpenAt(i)
                    }}
                    aria-label={`Open larger: ${g.alt}`}
                  >
                    <img
                      src={g.src}
                      alt={g.alt}
                      loading="lazy"
                      decoding="async"
                      width={1100}
                      height={g.span === 'wide' ? 428 : 825}
                    />
                    <span className="tile-cue" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M4 9V4h5M20 15v5h-5M20 9V4h-5M4 15v5h5"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </button>
                </Reveal>
              </li>
            ))}
          </ul>

          {limit ? (
            <Reveal delay={0.1}>
              <Link to="/gallery" className="ui btn-ghost" style={{ marginTop: 32 }}>
                See the full gallery
              </Link>
            </Reveal>
          ) : (
            <p className="prose gallery-note">
              More photographs from recent events are on the way — in the meantime,{' '}
              <a
                href={`https://wa.me/${BUSINESS.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                ask us on WhatsApp
              </a>{' '}
              for the full portfolio.
            </p>
          )}
        </div>
      </Container>

      {shot && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image"
          className="lightbox"
          onClick={(e) => {
            if (e.target === e.currentTarget) close()
          }}
        >
          <button ref={closeRef} type="button" onClick={close} className="lb-btn lb-close" aria-label="Close">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
          <button type="button" onClick={() => step(-1)} className="lb-btn lb-prev" aria-label="Previous image">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 4l-8 8 8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <figure style={{ margin: 0, maxWidth: 'min(1100px, 92vw)' }}>
            <img src={shot.src} alt={shot.alt} style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 4 }} />
            <figcaption className="prose lb-cap">
              {shot.alt}
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>
                {' '}
                · {openAt !== null ? openAt + 1 : 0} of {shots.length}
              </span>
            </figcaption>
          </figure>
          <button type="button" onClick={() => step(1)} className="lb-btn lb-next" aria-label="Next image">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 4l8 8-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </Section>
  )
}

/* ---- testimonials -------------------------------------------------------- */

/*
  Honest by construction. TESTIMONIALS is empty because the business has no
  published reviews, and writing plausible quotes under invented client names
  would put fabricated endorsements on a live page. The section renders an
  invitation instead, and switches to real cards the moment entries exist in
  data.ts -- no code change needed.
*/
export function Testimonials({ heading = true }: Head) {
  const has = TESTIMONIALS.length > 0

  return (
    <Section id="testimonials" label="Client words">
      <Container>
        {heading && <Rule />}
        <div style={{ paddingTop: heading ? 'clamp(36px, 5vw, 72px)' : 0 }}>
          {heading && (
            <Reveal>
              <Eyebrow>Client words</Eyebrow>
              <Heading text={has ? 'What our clients\nsay after' : 'Be the first to\nsay something'} />
            </Reveal>
          )}

          {has ? (
            <ul className="quote-grid" style={heading ? undefined : { marginTop: 0 }}>
              {TESTIMONIALS.map((t, i) => (
                <li key={t.name + i} style={{ listStyle: 'none' }}>
                  <Reveal delay={0.06 * i}>
                    <figure className="quote-card">
                      <Sparkle size={20} />
                      <blockquote style={{ margin: '18px 0 0' }}>
                        <p className="prose quote-text">“{t.quote}”</p>
                      </blockquote>
                      <figcaption className="quote-by">
                        <span style={{ color: 'var(--color-gold)' }}>{t.name}</span>
                        <span style={{ color: 'rgba(255,255,255,0.45)' }}> · {t.event}</span>
                      </figcaption>
                    </figure>
                  </Reveal>
                </li>
              ))}
            </ul>
          ) : (
            <Reveal delay={0.08}>
              <div className="quote-empty" style={heading ? undefined : { marginTop: 0 }}>
                <Sparkle size={30} />
                <p className="prose quote-empty-text">
                  We have not collected reviews online yet. If we have styled an event for you, a
                  few words would mean a great deal — and they will appear right here.
                </p>
                <a
                  href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(
                    "Hi Nawtyfairy Events, I'd like to leave a review."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ui btn-ghost"
                  style={{ marginTop: 28 }}
                >
                  Send us a review
                </a>
              </div>
            </Reveal>
          )}
        </div>
      </Container>
    </Section>
  )
}
