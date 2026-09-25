/*
  THE SHELL — router, the chrome that wraps every route, and the footer.

  Each section of the site is its own route rather than an anchor on one long
  page, so every one of them has an address that can be linked, bookmarked,
  shared on WhatsApp and indexed separately.

  Two things have to happen on every navigation and neither is automatic in a
  single-page app:

    1. THE PAGE HAS TO GO BACK TO THE TOP. Without it, following a link from
       halfway down Services drops you halfway down Contact.

    2. FOCUS HAS TO MOVE. A screen reader's cursor stays where it was when the
       DOM swaps underneath it, so the new page is never announced and keyboard
       tabbing carries on from a control that no longer exists. Moving focus to
       <main> is what makes a route change a real page change.
*/
import { useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import SiteNav from './SiteNav'
import Home from './pages/Home'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import GalleryPage from './pages/GalleryPage'
import ReviewsPage from './pages/ReviewsPage'
import ContactPage from './pages/ContactPage'
import NotFound from './pages/NotFound'
import { BUSINESS, NAV } from './data'
import { Container, Sparkle } from './ui'

export default function App() {
  return (
    <BrowserRouter>
      <SiteNav />
      <Shell />
      <Footer />
    </BrowserRouter>
  )
}

function Shell() {
  const { pathname } = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  const first = useRef(true)

  useEffect(() => {
    /* Not on the very first render: the page has only just loaded, focus is
       where the browser put it, and yanking it into <main> would skip past the
       nav for someone who never asked to skip it. */
    if (first.current) {
      first.current = false
      return
    }
    /* scrollTop directly rather than window.scrollTo, because `html` carries
       scroll-behavior: smooth for the in-page anchors and a route change should
       be instant, not a ride back up the previous page. */
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    /* preventScroll, or the browser scrolls <main> into view and undoes the
       line above on any page whose main does not start at the very top. */
    mainRef.current?.focus({ preventScroll: true })
  }, [pathname])

  return (
    <main id="main" ref={mainRef} tabIndex={-1} style={{ outline: 'none' }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  )
}

function Footer() {
  return (
    <footer className="site-foot">
      <Container style={{ paddingBlock: 'clamp(44px, 6vw, 72px)' }}>
        <div className="foot-grid">
          <div>
            <Link to="/" className="brand" aria-label={`${BUSINESS.name} — home`}>
              <Sparkle size={22} />
              <span style={{ display: 'grid', lineHeight: 1 }}>
                <span className="brand-name display">Nawtyfairy</span>
                <span className="brand-sub ui">Events</span>
              </span>
            </Link>
            <p className="prose foot-blurb">
              {BUSINESS.tagline}. Styling gardens, marquees and halls across the Cape.
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="eyebrow" style={{ margin: '0 0 16px' }}>
              Pages
            </h2>
            <ul className="foot-list">
              <li>
                <Link to="/" className="foot-link">
                  Home
                </Link>
              </li>
              {NAV.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="foot-link">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="eyebrow" style={{ margin: '0 0 16px' }}>
              Contact
            </h2>
            <ul className="foot-list">
              <li>
                <a href={`tel:${BUSINESS.phoneHref}`} className="foot-link">
                  {BUSINESS.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${BUSINESS.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="foot-link"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={BUSINESS.mapsUrl} target="_blank" rel="noopener noreferrer" className="foot-link">
                  {BUSINESS.street}, {BUSINESS.cityLine}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="foot-legal ui">
          © {new Date().getFullYear()} {BUSINESS.name} · {BUSINESS.area}
        </p>
      </Container>
    </footer>
  )
}
