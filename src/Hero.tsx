/*
  THE HERO — a poster built on a fixed artboard, over a still that pans.

  Choreography, inherited from the reference because it came measured rather
  than invented:

      t=0      background pan    10418ms  SLOW
      t=0..    headline letters    500ms each, EASE_OUT, 60ms apart
      t=200..  wordmark letters    600ms each, EASE_OUT, 80ms apart
      t=400    the card           2084ms
      t=500    the detail rail    2084ms
      t=1500.. body copy, BY WORD, 1000ms each
      t=1600   the button         2084ms

  TWO CASCADES RUN AT DIFFERENT RATES AT THE SAME TIME. The headline steps every
  60ms over 500ms; the wordmark steps every 80ms over 600ms and starts 200ms
  later. They overlap for most of their length, and that mismatch is the whole
  effect -- matching them would flatten it.

  THE NEWLINE TAKES A SLOT. The headline's delays are exactly index * 60ms with
  the line breaks counted as characters, which is why the gap at each break is
  120ms rather than 60. Reproduced by walking the raw string, newlines included,
  rather than by joining the visible letters.

  'Cape Town' is nine characters where the reference's city was eight, so the
  80ms rig maps over with one extra beat and nothing to retune.

  --------------------------------------------------------------------------
  TWO THINGS DEPART FROM THE REFERENCE, BOTH BECAUSE THIS IS A SITE AND NOT A
  POSTER DEMO:

  1. THE ARTBOARD HAS A FLOOR. The reference locks scale to innerWidth / 1440 at
     every size. That is correct for the demo and unusable as a website: at
     375px the scale is 0.26, which sets the 63px headline at 16px and the body
     copy at 4px. Below ARTBOARD_MIN this file renders the same composition in
     flow layout instead -- same plate, same type hierarchy, same cascades, same
     order of assembly -- at sizes a phone can actually read.

  2. THE NAV LIVES OUTSIDE THE ARTBOARD (see SiteNav). Scaled with everything
     else it would be 3.6px tall on a phone, and it is the one element that has
     to stay usable at every width and persist past the hero.
*/
import { useLayoutEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, type TargetAndTransition, type Transition } from 'motion/react'
import { HEADLINE, WORDMARK, HERO_BODY, HERO_CARD } from './data'
import { Sparkle, Letters, Words, SLOW } from './ui'

const STAGE_W = 1440
const STAGE_H = 810

/* Below this the artboard stops scaling and the flow variant takes over. At
   1000px the headline still lands at 44px, which is the last size it holds. */
const ARTBOARD_MIN = 1000

/*
  A pan, not a placement: one tall still slid inside a short window.

  The reference opens on the wolf's muzzle and settles on its eyes -- the
  animation ENDS on the composition. Ours is retuned for this plate rather than
  copied. The photograph is 1440x1920 in an 810 window, so there is 1110px of
  travel: it opens at -1110 on the foreground place settings, the sharpest thing
  in the frame, and settles at -430 on the full run of dressed tables with the
  garden behind them.
*/
const BG_FROM = -1110
const BG_TO = -430
const BG_MS = 10418
const BG_H = 1920

const px = (n: number) => `${n}px`
const box = (x: number, y: number, w?: number, h?: number): React.CSSProperties => ({
  position: 'absolute',
  left: px(x),
  top: px(y),
  ...(w !== undefined ? { width: px(w) } : null),
  ...(h !== undefined ? { height: px(h) } : null),
})

/*
  The detail rail. Each thumbnail starts further right than the last, so they
  arrive in sequence off one shared duration rather than needing four delays.
*/
const THUMBS = [
  { img: '/assets/thumb-1.webp', y: 0, from: 110 },
  { img: '/assets/thumb-2.webp', y: 78, from: 150 },
  { img: '/assets/thumb-3.webp', y: 157, from: 200 },
  { img: '/assets/thumb-4.webp', y: 234, from: 210 },
]

/*
  A mask that falls off downward AND rightward. Masking the left panel on one
  axis only leaves a hard cut at the other edge. `intersect` multiplies the two
  ramps together.
*/
const twoAxisMask = (down: string): React.CSSProperties => {
  const m = `linear-gradient(to bottom, #000 0%, #000 10%, transparent ${down}), linear-gradient(to right, #000 0%, #000 46%, transparent 100%)`
  return {
    maskImage: m,
    WebkitMaskImage: m,
    maskComposite: 'intersect',
    WebkitMaskComposite: 'source-in',
  }
}

function ArrowOut({ size = 46 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 46 46" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M12 34L34 12M34 12H17M34 12v17"
        stroke="var(--color-gold)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function Hero() {
  const [scale, setScale] = useState(1)
  const [cover, setCover] = useState(1)
  const [flow, setFlow] = useState(false)
  const reduced = useReducedMotion()

  /* Scene covers, UI contains. Sharing one scale puts the background and the
     layout at different sizes on any window that is not 16:9. */
  useLayoutEffect(() => {
    const fit = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      setFlow(vw < ARTBOARD_MIN)
      // Width-locked: the interface is exactly as wide as the window. Fitting
      // it with Math.min pillarboxes it on anything that is not 16:9.
      setScale(vw / STAGE_W)
      setCover(Math.max(vw / STAGE_W, vh / STAGE_H))
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  /*
    Reduced motion collapses every reveal to its end state -- which is the
    composition the reveals were built to arrive at. Nothing is hidden and
    nothing has to be waited out.
  */
  const mo = (initial: TargetAndTransition, animate: TargetAndTransition, transition: Transition) =>
    reduced ? { initial: animate, animate } : { initial, animate, transition }

  /*
    THE FLOW PLATE. A separate element, not the artboard plate at a different
    scale, and that is the point.

    The artboard plate is a fixed 1440x810 box scaled by `cover`. On a 16:9-ish
    window that fills the frame correctly. On a 375x812 phone, `cover` resolves
    against the BOX's aspect rather than the window's and lands at ~1.0, which
    leaves a 1656px-wide plate inside a 375px window -- you see 23% of the
    picture's width, blown up until the chairs are unreadable abstraction.

    object-fit: cover on a plain <img> does the same job correctly at any
    aspect, because the browser solves the cover maths against the actual box.
    The element is 118% of the container's height, which is the 18% of travel
    the pan then moves through -- the same gesture as the artboard's -1110 to
    -430, expressed as a percentage so it holds at every phone size.
  */
  const flowPlate = (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 1 }}>
      <motion.img
        src="/assets/hero.webp"
        alt=""
        fetchPriority="high"
        {...mo({ y: '-15.2%' }, { y: '0%' }, { duration: BG_MS / 1000, ease: SLOW })}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '118%',
          objectFit: 'cover',
          /* Biased above centre: the dressed tables sit in the upper-middle of
             the plate, and dead-centre put the lawn in frame instead. */
          objectPosition: '50% 38%',
        }}
      />
    </div>
  )

  /* ---- the artboard plate ------------------------------------------------ */
  const plate = (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: px(STAGE_W),
        height: px(STAGE_H),
        transform: `translate(-50%, -50%) scale(${cover})`,
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      <motion.img
        src="/assets/hero.webp"
        alt=""
        width={1440}
        height={BG_H}
        fetchPriority="high"
        {...mo({ y: BG_FROM }, { y: BG_TO }, { duration: BG_MS / 1000, ease: SLOW })}
        style={{ position: 'absolute', left: 0, top: 0, width: 1440, height: BG_H }}
      />
      {/*
        Three scrims, taken from the reference's own fills rather than eyeballed,
        then feathered because a literal transcription shows its seams.

          top     black gradient, 0.7 max
          bottom  a warm lift that ramps IN over its first quarter -- at full
                  strength on its top edge it butts against the blurred panel
                  and reads as a hard line straight across the frame
          left    a subtle vertical gradient plus a progressive background blur

        CSS has no progressive blur, so the radius ramp is three stacked
        backdrop-filter layers: the strongest masked to a short run at the top,
        the weakest running the full height. Stacking radii approximates a
        falling radius far better than one blur behind an opacity mask, which
        only fades a uniformly-blurred plate.

        The panel is 640 wide rather than the reference's 445 so the horizontal
        falloff finishes clear of the headline, which ends at x=479.
      */}
      <div
        style={{
          ...box(0, 0, 1440, 173),
          background: 'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
        }}
      />
      <div
        style={{
          ...box(0, 513, 1440, 297),
          background:
            'linear-gradient(to bottom, rgba(26,20,14,0) 0%, rgba(26,20,14,0.34) 24%, rgba(10,9,8,0) 100%)',
        }}
      />
      {[
        { r: 100, to: '24%' },
        { r: 56, to: '56%' },
        { r: 24, to: '100%' },
      ].map((l) => (
        <div
          key={l.r}
          style={{
            ...box(0, 0, 640, 810),
            backdropFilter: `blur(${l.r}px)`,
            WebkitBackdropFilter: `blur(${l.r}px)`,
            ...twoAxisMask(l.to),
          }}
        />
      ))}
      <div
        style={{
          ...box(0, 0, 640, 810),
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.06) 100%)',
          ...twoAxisMask('100%'),
        }}
      />
    </div>
  )

  /* ---- flow layout: under ARTBOARD_MIN ----------------------------------- */
  if (flow) {
    return (
      <section
        id="top"
        aria-label="Nawtyfairy Events — event styling in Cape Town"
        style={{
          position: 'relative',
          minHeight: '100dvh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          paddingTop: 108,
        }}
      >
        {flowPlate}
        {/* A floor under the copy, so the type never sits on bare photograph. */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            background:
              'linear-gradient(to bottom, rgba(10,9,8,0.82) 0%, rgba(10,9,8,0.42) 38%, rgba(10,9,8,0.88) 78%, var(--color-void) 100%)',
          }}
        />

        <div style={{ position: 'relative', zIndex: 3, padding: '0 16px 28px' }}>
          <h1
            className="display lineclip"
            style={{
              margin: '0 0 20px',
              fontSize: 'clamp(38px, 12.2vw, 62px)',
              lineHeight: 0.92,
              color: '#fff',
              textTransform: 'uppercase',
            }}
          >
            <Letters text={HEADLINE} step={60} dur={0.5} />
          </h1>

          <p
            className="prose"
            style={{ margin: '0 0 24px', maxWidth: 420, color: 'rgba(255,255,255,0.88)' }}
          >
            <Words text={HERO_BODY} startMs={1500} />
          </p>

          <motion.div
            {...mo(
              { opacity: 0, scale: 0.92 },
              { opacity: 1, scale: 1 },
              { duration: 2.084, ease: SLOW, delay: 1.6 }
            )}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}
          >
            <Link
              to="/contact"
              className="ui"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 9,
                minHeight: 52,
                padding: '0 26px',
                borderRadius: 999,
                background: 'var(--color-champagne)',
                color: 'var(--color-void)',
                fontSize: 14,
                letterSpacing: '0.04em',
                textDecoration: 'none',
              }}
            >
              Plan your day
              <Sparkle size={16} fill="var(--color-void)" />
            </Link>
            <Link
              to="/gallery"
              className="ui"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                minHeight: 52,
                padding: '0 22px',
                borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.4)',
                color: '#fff',
                fontSize: 14,
                letterSpacing: '0.04em',
                textDecoration: 'none',
              }}
            >
              See the work
            </Link>
          </motion.div>

          {/* The rail turns horizontal here rather than disappearing. */}
          <Link
            to="/gallery"
            aria-label="View the gallery"
            style={{ display: 'flex', gap: 10, marginTop: 28, textDecoration: 'none' }}
          >
            {THUMBS.map((t) => (
              <motion.img
                key={t.img}
                src={t.img}
                alt=""
                width={56}
                height={56}
                loading="lazy"
                {...mo(
                  { x: t.from * 0.3, opacity: 0 },
                  { x: 0, opacity: 1 },
                  { duration: 2.084, ease: SLOW, delay: 0.5 }
                )}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1.5px solid rgba(201,169,97,0.6)',
                }}
              />
            ))}
          </Link>
        </div>

        {/* The band, sized to the viewport rather than to the artboard. */}
        <div
          className="display lineclip"
          style={{
            position: 'relative',
            zIndex: 3,
            /* Archivo Thin sets 'CAPE TOWN' at about 5.9x its font size, so
               17vw spans very close to the full viewport at any flow width and
               bleeds by a few px rather than by a whole letter. 21vw lost the
               N entirely, which left the band reading 'CAPE TOW'. */
            fontSize: 'clamp(44px, 17vw, 175px)',
            lineHeight: 0.78,
            color: '#fff',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            paddingLeft: 10,
            marginBottom: -4,
          }}
          aria-hidden="true"
        >
          <Letters text={WORDMARK} step={80} offset={200} dur={0.6} />
        </div>
      </section>
    )
  }

  /* ---- artboard layout: ARTBOARD_MIN and up ------------------------------ */
  return (
    <section
      id="top"
      aria-label="Nawtyfairy Events — event styling in Cape Town"
      className="relative w-full overflow-hidden"
      style={{ height: `max(calc(100vw * ${STAGE_H} / ${STAGE_W}), 100vh)` }}
    >
      {plate}

      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: px(STAGE_W),
          height: px(STAGE_H),
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          zIndex: 2,
        }}
      >
        {/* ---- headline: 60ms per character, newlines included ------------ */}
        <h1
          className="display"
          style={{
            ...box(59, 150, 460),
            margin: 0,
            fontSize: 63,
            lineHeight: '57px',
            fontWeight: 100,
            color: '#fff',
            textTransform: 'uppercase',
          }}
        >
          <span className="lineclip"><Letters text={HEADLINE} step={60} dur={0.5} /></span>
        </h1>

        {/* ---- body copy: by WORD, a second each --------------------------- */}
        <p
          className="prose"
          style={{
            ...box(60, 404, 268),
            margin: 0,
            fontSize: 17,
            lineHeight: '25px',
            color: 'rgba(255,255,255,0.88)',
          }}
        >
          <Words text={HERO_BODY} startMs={1500} />
        </p>

        {/* ---- the CTA pill ------------------------------------------------ */}
        <motion.div
          {...mo(
            { opacity: 0, scale: 0.92 },
            { opacity: 1, scale: 1 },
            { duration: 2.084, ease: SLOW, delay: 1.6 }
          )}
          style={box(352, 407, 178, 58)}
        >
          <Link
            to="/contact"
            className="ui"
            style={{
              display: 'flex',
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 9,
              borderRadius: 999,
              background: 'var(--color-champagne)',
              color: 'var(--color-void)',
              fontSize: 14,
              letterSpacing: '0.04em',
              textDecoration: 'none',
            }}
          >
            Plan your day
            <Sparkle size={15} fill="var(--color-void)" />
          </Link>
        </motion.div>

        {/* ---- the ring-and-dot mark -------------------------------------- */}
        <motion.div
          {...mo(
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1 },
            { duration: 1.2, ease: SLOW, delay: 1.9 }
          )}
          style={{
            ...box(232, 512, 92, 92),
            borderRadius: '50%',
            border: '1px solid rgba(201,169,97,0.55)',
          }}
          aria-hidden="true"
        >
          <span
            style={{
              ...box(27, 27, 38, 38),
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <Sparkle size={38} />
          </span>
        </motion.div>

        {/* ---- the card --------------------------------------------------- */}
        <motion.div
          {...mo(
            { opacity: 0, x: 44, y: 34 },
            { opacity: 1, x: 0, y: 0 },
            { duration: 2.084, ease: SLOW, delay: 0.4 }
          )}
          style={box(933, 265, 293, 314)}
        >
          <Link
            to="/contact"
            className="hero-card"
            style={{
              position: 'relative',
              display: 'block',
              width: '100%',
              height: '100%',
              borderRadius: 40,
              border: '1px solid rgba(232,220,196,0.62)',
              textDecoration: 'none',
            }}
          >
            <span style={{ ...box(213, 22), display: 'block' }}>
              <ArrowOut />
            </span>
            <span
              className="display"
              style={{
                ...box(24, 184, 232),
                display: 'block',
                fontSize: 32,
                lineHeight: '38px',
                fontWeight: 300,
                color: '#fff',
                textTransform: 'uppercase',
              }}
            >
              {HERO_CARD}
            </span>
          </Link>
        </motion.div>

        {/* ---- the detail rail: each starts further right ------------------ */}
        <Link
          to="/gallery"
          aria-label="View the gallery"
          style={{ ...box(1347, 270, 68, 302), display: 'block' }}
        >
          {THUMBS.map((t) => (
            <motion.img
              key={t.img}
              src={t.img}
              alt=""
              width={68}
              height={68}
              {...mo(
                { x: t.from, opacity: 0 },
                { x: 0, opacity: 1 },
                { duration: 2.084, ease: SLOW, delay: 0.5 }
              )}
              style={{
                ...box(0, t.y, 68, 68),
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1.5px solid rgba(232,220,196,0.85)',
              }}
            />
          ))}
        </Link>

        {/*
          The band. Not centred text that happens to overflow -- sized and
          positioned to be read as a band rather than a word, bleeding off both
          edges, with the frame clipping it. Hidden from the accessibility tree
          because 'Cape Town' is already in the page's copy and heading
          structure; here it is a graphic.

          SIZED BY MEASUREMENT, NOT BY COPYING. The reference sets its eight-
          letter city at 294px inside a 1491 box, where it just fits. Archivo
          Thin renders 'CAPE TOWN' at 294px 1733px wide against a 1440 stage,
          which clipped the N clean off and left the band reading 'CAPE TOW'.
          At 258px it measures about 1520 and spans -22 to 1498 -- still bleeding
          off both edges, as intended, but now losing only the shoulders of the
          outer letters rather than a whole one. The line-height and y came down
          with it (206->181, 600->620) so the band still sits on the artboard's
          floor at 801 rather than floating 25px above it.
        */}
        <div
          className="display"
          style={{
            ...box(-22, 620, 1524),
            fontSize: 258,
            lineHeight: '181px',
            color: '#fff',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
          aria-hidden="true"
        >
          <span className="lineclip"><Letters text={WORDMARK} step={80} offset={200} dur={0.6} /></span>
        </div>
      </div>
    </section>
  )
}
