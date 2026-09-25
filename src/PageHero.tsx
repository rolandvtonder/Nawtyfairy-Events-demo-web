/*
  PAGE HERO — the banner at the top of every route except home.

  The home page carries the full poster: a fixed artboard, a 10.4s pan, two
  cascades at different rates. Running that on every page would make the site
  feel heavy to move around, and the second time you saw it the pan would be
  something to sit through rather than something to watch.

  So the sub-pages get a short band of the same plate: the same grade, the same
  per-character reveal on the heading, a quarter of the height and none of the
  pan. It reads as the same poster, cropped.

  Each page passes its own frame, so moving between them does not look like the
  same picture with different words on it.
*/
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { Container, Letters, Sparkle, EASE_OUT } from './ui'

export default function PageHero({
  title,
  eyebrow,
  heading,
  blurb,
  image,
  focus = '50% 50%',
}: {
  title: string
  eyebrow: string
  heading: string
  blurb: string
  image: string
  focus?: string
}) {
  const reduced = useReducedMotion()

  return (
    <section className="page-hero" aria-label={`${title} — page heading`}>
      <div className="page-hero-plate">
        <img src={image} alt="" width={1100} height={825} fetchPriority="high" style={{ objectPosition: focus }} />
        {/* Two scrims: one across the top so the fixed nav always has ground,
            one up from the floor so the heading never sits on bare photograph
            and the band dissolves into the page rather than ending on a line. */}
        <div className="page-hero-scrim" />
      </div>

      <Container style={{ position: 'relative', zIndex: 2 }}>
        <nav aria-label="Breadcrumb" className="crumb">
          <ol>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li aria-hidden="true" className="crumb-sep">
              <Sparkle size={9} />
            </li>
            <li>
              <span aria-current="page">{title}</span>
            </li>
          </ol>
        </nav>

        <p className="eyebrow" style={{ margin: '0 0 14px' }}>
          {eyebrow}
        </p>

        <h1 className="display page-hero-h1">
          <span className="lineclip">
            <Letters text={heading} step={55} dur={0.5} />
          </span>
        </h1>

        <motion.p
          className="prose page-hero-blurb"
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduced ? { duration: 0 } : { duration: 0.8, ease: EASE_OUT, delay: 0.5 }}
        >
          {blurb}
        </motion.p>
      </Container>
    </section>
  )
}
