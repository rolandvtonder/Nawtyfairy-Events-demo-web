import { Link } from 'react-router-dom'
import { Container, Section, Heading, Eyebrow, Sparkle, useDocumentTitle } from '../ui'

/* A real 404 rather than a silent redirect to home, so a mistyped or dead link
   says what happened instead of pretending it went somewhere. */
export default function NotFound() {
  useDocumentTitle('Page not found — Nawtyfairy Events')
  return (
    <Section label="Page not found" style={{ paddingTop: 'clamp(140px, 22vh, 220px)' }}>
      <Container>
        <Sparkle size={34} />
        <div style={{ marginTop: 20 }}>
          <Eyebrow>404</Eyebrow>
          <Heading as="h1" text={'We cannot find\nthat page'} />
        </div>
        <p className="prose" style={{ marginTop: 22, maxWidth: 460, color: 'rgba(255,255,255,0.7)' }}>
          The link may be out of date. Everything on the site is one tap away from the menu.
        </p>
        <Link to="/" className="ui btn-solid" style={{ marginTop: 30 }}>
          Back to the home page
        </Link>
      </Container>
    </Section>
  )
}
