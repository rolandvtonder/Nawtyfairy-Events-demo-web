/*
  The closing band. It ends every route except /contact, which is already the
  thing it asks you to do.

  One shared component rather than a per-page block: the call to action is the
  same on all of them, and four near-identical copies would drift apart the
  first time the wording changed.
*/
import { Link } from 'react-router-dom'
import { BUSINESS } from './data'
import { Container, Reveal, Sparkle } from './ui'

export default function Cta({
  heading = 'Let us set your table',
  blurb = 'Tell us the date and roughly how many are sitting down, and we will come back with a quote.',
}: {
  heading?: string
  blurb?: string
}) {
  return (
    <section className="cta-band" aria-label="Get in touch">
      <Container>
        <Reveal>
          <div className="cta-inner">
            <Sparkle size={30} />
            <h2 className="display cta-h">{heading}</h2>
            <p className="prose cta-blurb">{blurb}</p>
            <div className="cta-actions">
              <Link to="/contact" className="ui btn-solid">
                Plan your day
                <Sparkle size={15} fill="var(--color-void)" />
              </Link>
              <a
                href={`https://wa.me/${BUSINESS.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ui btn-ghost"
              >
                WhatsApp {BUSINESS.phoneDisplay}
              </a>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
