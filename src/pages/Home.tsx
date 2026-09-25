/*
  HOME — the poster, then a taster of each route.

  The sections below the hero are deliberately NOT the full pages. If home
  printed the whole of About, the whole of Services and the whole of Gallery,
  the routes underneath it would have nothing left to be. So each block here is
  a short read with a way through to the page that carries the detail: the
  studio in one paragraph, the four services as an index rather than as cards,
  three frames out of the gallery.
*/
import { Link } from 'react-router-dom'
import Hero from '../Hero'
import Cta from '../Cta'
import { Gallery } from '../Sections'
import { ABOUT, SERVICES } from '../data'
import { Container, Section, Reveal, Rule, Eyebrow, Heading, useDocumentTitle } from '../ui'

export default function Home() {
  useDocumentTitle('Nawtyfairy Events — Event styling & décor, Cape Town')

  return (
    <>
      <Hero />

      {/* ---- the studio, in one paragraph ------------------------------- */}
      <Section id="intro" label="About the studio">
        <Container>
          <div className="intro-grid">
            <Reveal>
              <Eyebrow>{ABOUT.eyebrow}</Eyebrow>
              <Heading text={ABOUT.heading} />
            </Reveal>
            <Reveal delay={0.08}>
              <div>
                <p className="prose intro-body">{ABOUT.body[0]}</p>
                <Link to="/about" className="ui link-arrow">
                  More about the studio
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ---- services as an index, not as cards -------------------------- */}
      <Section id="services-teaser" label="What we do">
        <Container>
          <Rule />
          <div style={{ paddingTop: 'clamp(36px, 5vw, 72px)' }}>
            <Reveal>
              <Eyebrow>What we do</Eyebrow>
              <Heading text={'Four ways we\ndress a room'} />
            </Reveal>

            <ol className="index-list">
              {SERVICES.map((s, i) => (
                <li key={s.id}>
                  <Reveal delay={0.05 * i} y={16}>
                    <Link to="/services" className="index-row">
                      <span className="index-no" aria-hidden="true">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="index-title display">{s.title}</span>
                      <span className="index-cue" aria-hidden="true">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ol>

            <Reveal delay={0.1}>
              <Link to="/services" className="ui btn-ghost" style={{ marginTop: 32 }}>
                See what each one includes
              </Link>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ---- three frames, then through to the gallery ------------------- */}
      <Gallery limit={3} />

      <Cta />
    </>
  )
}
