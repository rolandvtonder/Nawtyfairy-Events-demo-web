/*
  Shared furniture: the brand mark, the two cascade rigs, the container, the
  section shell and the scroll reveal.

  The cascades live here rather than in Hero because the sub-page banners run
  the same per-character reveal on their headings. One rig, two callers, and the
  reduced-motion branch written once.
*/
import { useEffect } from 'react'
import { motion, useReducedMotion } from 'motion/react'

export const EASE_OUT = [0, 0, 0.58, 1] as const
export const SLOW = [0.4, 0, 0.2, 1] as const

export const PAD = 'clamp(20px, 4.1vw, 59px)'

/* ---- the brand mark ------------------------------------------------------ */

/* A four-point sparkle. It is the Grey Wolf reference's own nav glyph, kept
   because a business called Nawtyfairy has an obvious claim on it. */
export function Sparkle({ size = 54, fill = 'var(--color-gold)' }: { size?: number; fill?: string }) {
  const pts: [number, number, number][] = [
    [27, 6, 9],
    [14, 30, 6],
    [40, 32, 7],
    [27, 46, 5],
  ]
  return (
    <svg width={size} height={size} viewBox="0 0 54 54" aria-hidden="true" focusable="false">
      {pts.map(([cx, cy, r], i) => (
        <path
          key={i}
          d={`M${cx} ${cy - r} Q${cx + r * 0.22} ${cy - r * 0.22} ${cx + r} ${cy} Q${cx + r * 0.22} ${cy + r * 0.22} ${cx} ${cy + r} Q${cx - r * 0.22} ${cy + r * 0.22} ${cx - r} ${cy} Q${cx - r * 0.22} ${cy - r * 0.22} ${cx} ${cy - r} Z`}
          fill={fill}
        />
      ))}
    </svg>
  )
}

/* ---- the cascades -------------------------------------------------------- */

/*
  One span per character, delay = index * step.

  NEWLINES TAKE A SLOT. Walking the raw string with the line breaks counted as
  characters is what puts a double beat at each break -- 120ms rather than 60 --
  and it is why this maps the string itself rather than joining visible letters.

  Wrap the caller in `.lineclip` so each line masks its own letters; per-letter
  transforms alone let ascenders show through the gap between lines.

  LETTERS ARE GROUPED INTO WORDS, and that grouping is load-bearing rather than
  tidiness. Every character here is its own inline-block, and a browser takes a
  break opportunity between any two adjacent inline-level boxes -- so with a
  flat run of letters a heading that does not fit wraps in the middle of a word.
  On a 375px screen the about page read:

      WE DRESS THE DAY
      S
      YOU DO NOT FORG
      ET

  Each word is now a nowrap box, so the only break opportunities left are the
  spaces, where they belong. The delay index still counts every character --
  spaces and newlines included -- so the choreography is unchanged.
*/
export function Letters({
  text,
  step,
  offset = 0,
  dur,
}: {
  text: string
  step: number
  offset?: number
  dur: number
}) {
  const reduced = useReducedMotion()
  const out: React.ReactNode[] = []
  let word: React.ReactNode[] = []
  let wordKey = 0

  const flushWord = () => {
    if (word.length === 0) return
    out.push(
      <span className="word" key={`w${wordKey++}`}>
        {word}
      </span>
    )
    word = []
  }

  ;[...text].forEach((ch, i) => {
    if (ch === '\n') {
      flushWord()
      out.push(<br key={`b${i}`} />)
      return
    }
    const span = (
      <motion.span
        key={i}
        initial={{ y: reduced ? '0%' : '110%' }}
        animate={{ y: '0%' }}
        transition={
          reduced ? { duration: 0 } : { duration: dur, ease: EASE_OUT, delay: (offset + i * step) / 1000 }
        }
        style={{ display: 'inline-block', whiteSpace: 'pre' }}
      >
        {ch}
      </motion.span>
    )
    /* The space rides outside the word box, so it stays a break opportunity. */
    if (ch === ' ') {
      flushWord()
      out.push(span)
      return
    }
    word.push(span)
  })
  flushWord()

  return <>{out}</>
}

/* Body copy arrives BY WORD, not by letter. A second per word sounds slow until
   you see it against the headline: the letters snap while the paragraph drifts. */
export function Words({ text, startMs, stepMs = 70 }: { text: string; startMs: number; stepMs?: number }) {
  const reduced = useReducedMotion()
  return (
    <>
      {text.split(' ').map((w, i) => (
        <motion.span
          key={i}
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduced ? { duration: 0 } : { duration: 1, ease: EASE_OUT, delay: (startMs + i * stepMs) / 1000 }
          }
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {w}{' '}
        </motion.span>
      ))}
    </>
  )
}

/* ---- layout -------------------------------------------------------------- */

export function Container({
  children,
  style,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', paddingInline: PAD, ...style }}>{children}</div>
  )
}

export function Section({
  id,
  children,
  label,
  style,
}: {
  id?: string
  children: React.ReactNode
  label: string
  style?: React.CSSProperties
}) {
  return (
    <section
      id={id}
      aria-label={label}
      /* 64px floor rather than letting 9.5vw decide: at 375px that term is
         36px, which runs consecutive sections into each other. */
      style={{ paddingBlock: 'clamp(64px, 9.5vw, 132px)', position: 'relative', ...style }}
    >
      {children}
    </section>
  )
}

/*
  `once: true` so a section does not re-animate every time it scrolls back into
  view, which turns a calm page into a flicker. The negative margin holds the
  trigger until the element is properly on screen.
*/
export function Reveal({
  children,
  delay = 0,
  y = 24,
  style,
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  style?: React.CSSProperties
}) {
  const reduced = useReducedMotion()
  if (reduced) return <div style={style}>{children}</div>
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: EASE_OUT, delay }}
      style={style}
    >
      {children}
    </motion.div>
  )
}

/* A hairline with a soft falloff at each end, used to separate blocks without
   a hard rule running the full width. */
export function Rule() {
  return (
    <div
      aria-hidden="true"
      style={{
        height: 1,
        background:
          'linear-gradient(to right, transparent, rgba(232,220,196,0.22) 18%, rgba(232,220,196,0.22) 82%, transparent)',
      }}
    />
  )
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="eyebrow" style={{ margin: '0 0 18px' }}>
      {children}
    </p>
  )
}

/*
  Section headings carry a hard newline in the copy. Rendering it as a <br>
  rather than letting the line wrap keeps the break where it was written, which
  is the difference between a two-line heading and a two-line heading with one
  orphan.
*/
export function Heading({
  text,
  as: Tag = 'h2',
  size = 'clamp(32px, 4.6vw, 62px)',
}: {
  text: string
  as?: 'h1' | 'h2' | 'h3'
  size?: string
}) {
  return (
    <Tag
      className="display"
      style={{
        margin: 0,
        fontSize: size,
        lineHeight: 1.04,
        fontWeight: 100,
        letterSpacing: '-0.01em',
        color: '#fff',
        textTransform: 'uppercase',
        textWrap: 'balance',
      }}
    >
      {text.split('\n').map((line, i) => (
        <span key={i} style={{ display: 'block' }}>
          {line}
        </span>
      ))}
    </Tag>
  )
}

/* Each route sets its own tab title; without this every page reads as the home
   page in history, in bookmarks and when a tab is read aloud. */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title
  }, [title])
}
