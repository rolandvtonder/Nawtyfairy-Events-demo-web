/*
  SITE NAV — fixed, transparent over the banner, backed once you leave it.

  This sits OUTSIDE the home hero's artboard. Inside it, the nav would scale
  with everything else and be 3.6px tall on a phone. It is the one element that
  has to stay legible at every width and on every route, so it keeps its own
  fixed type size and matches the artboard's coordinates only at 1440px, where
  the two are identical anyway.

  Current location comes from the router now rather than from an
  IntersectionObserver watching anchors. NavLink already knows which route is
  active, and asking the DOM the same question by measuring scroll position
  would be a second, worse source of truth.

  The wordmark is typographic. The business has no logo file -- the directory
  listing carried none -- so rather than invent a mark and pass it off as their
  identity, this sets the name in the display face beside the sparkle and is
  trivially swapped for real artwork when it exists.
*/
import { useEffect, useRef, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { NAV, BUSINESS } from './data'
import { Sparkle } from './ui'

export default function SiteNav() {
  const [backed, setBacked] = useState(false)
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const { pathname } = useLocation()
  const home = pathname === '/'

  /*
    The bar gains its ground once the banner is behind you. That is most of a
    screen on the home page, where the poster runs the full height, but only a
    little way down on the sub-pages, whose banner is a short band.
  */
  useEffect(() => {
    const onScroll = () => {
      const trigger = home ? window.innerHeight * 0.72 : 120
      setBacked(window.scrollY > trigger)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [home])

  /* Close the drawer on any navigation, including the browser back button --
     an open overlay surviving a route change is the classic mobile menu bug. */
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  /* An escape route out of the drawer, and the scroll lock that has to come
     with it. */
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    /* Focus moves into the panel so the next Tab continues inside it rather
       than running off down the page behind. */
    panelRef.current?.querySelector<HTMLAnchorElement>('a')?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  const wordmark = (
    <>
      <Sparkle size={22} />
      <span style={{ display: 'grid', lineHeight: 1 }}>
        <span className="brand-name display">Nawtyfairy</span>
        <span className="brand-sub ui">Events</span>
      </span>
    </>
  )

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <header className={`site-bar${backed ? ' is-backed' : ''}`}>
        <nav aria-label="Primary" className="site-nav">
          <Link to="/" aria-label={`${BUSINESS.name} — home`} className="brand">
            {wordmark}
          </Link>

          <ul className="nav-links">
            {NAV.map((n) => (
              <li key={n.to}>
                <NavLink
                  to={n.to}
                  className={({ isActive }) => `nav-link${isActive ? ' is-current' : ''}`}
                >
                  {n.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <a href={`tel:${BUSINESS.phoneHref}`} className="nav-phone">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                <path
                  d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5L17 13l4 1.5v3a2.5 2.5 0 0 1-2.7 2.5C10.3 19.4 4.6 13.7 4 5.7A2.5 2.5 0 0 1 6.5 3Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
              {BUSINESS.phoneDisplay}
            </a>

            <button
              ref={toggleRef}
              type="button"
              className="nav-toggle"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="nav-drawer"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              <span style={{ display: 'grid', gap: 6, width: 26 }}>
                <span style={{ display: 'block', height: 1.5, background: '#fff', width: '100%' }} />
                <span style={{ display: 'block', height: 1.5, background: '#fff', width: open ? '100%' : '68%' }} />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* ---- drawer ------------------------------------------------------- */}
      <div id="nav-drawer" ref={panelRef} hidden={!open} className={`drawer${open ? ' is-open' : ''}`}>
        <button
          type="button"
          onClick={() => {
            setOpen(false)
            toggleRef.current?.focus()
          }}
          aria-label="Close menu"
          className="drawer-close"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
            <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        <nav aria-label="Mobile" className="drawer-nav">
          <NavLink to="/" end className={({ isActive }) => `drawer-link display${isActive ? ' is-current' : ''}`}>
            Home
          </NavLink>
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) => `drawer-link display${isActive ? ' is-current' : ''}`}
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="drawer-foot">
          <a
            href={`https://wa.me/${BUSINESS.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ui btn-solid"
          >
            WhatsApp us
          </a>
          <a href={`tel:${BUSINESS.phoneHref}`} className="ui btn-ghost">
            {BUSINESS.phoneDisplay}
          </a>
        </div>
      </div>
    </>
  )
}
