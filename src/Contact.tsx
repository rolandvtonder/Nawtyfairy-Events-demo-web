/*
  ENQUIRY — a real form with no server behind it.

  The business publishes a phone number and a WhatsApp link and no email
  address, so there is nothing to POST to and inventing an endpoint would ship a
  form that silently drops every lead. Instead the form validates properly and
  then hands a fully composed message to WhatsApp, which is the channel the
  business actually answers on. Nothing is lost, and the client arrives with
  their date, their event type and their guest count already typed out.

  Swapping in a backend later means replacing one function -- `submit` -- and
  nothing else.

  Accessibility, because forms are where it is usually dropped:
    - every field has a visible <label>, not a placeholder standing in for one
    - validation runs on blur, not on keystroke, so it does not shout at you
      while you are still typing
    - errors sit beside their field AND in a summary at the top; the summary is
      focusable, is what receives focus after a failed submit, and each row
      moves focus to the field it names
    - the summary is role="alert" so it is announced rather than just appearing
    - inputs carry the type and autocomplete that let a phone show the right
      keyboard and the browser autofill
*/
import { useEffect, useRef, useState } from 'react'
import { BUSINESS, HOURS, EVENT_TYPES } from './data'
import { Container, Section, Reveal, Rule, Eyebrow, Heading, Sparkle } from './ui'


type Fields = {
  name: string
  phone: string
  email: string
  type: string
  date: string
  guests: string
  message: string
}

const EMPTY: Fields = { name: '', phone: '', email: '', type: '', date: '', guests: '', message: '' }

const LABELS: Record<keyof Fields, string> = {
  name: 'Your name',
  phone: 'Phone number',
  email: 'Email address',
  type: 'Type of event',
  date: 'Event date',
  guests: 'Guests',
  message: 'Tell us about it',
}

/* Deliberately loose. A South African number can be written 083 499 9495,
   0834999495 or +27 83 499 9495, and rejecting any of those would be the form
   being wrong about the user rather than the other way round. */
const PHONE_OK = /^[+\d][\d\s()-]{7,}$/
const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(f: Fields): Partial<Record<keyof Fields, string>> {
  const e: Partial<Record<keyof Fields, string>> = {}
  if (!f.name.trim()) e.name = 'Please tell us your name so we know who we are replying to.'
  if (!f.phone.trim()) e.phone = 'We need a number to reach you on.'
  else if (!PHONE_OK.test(f.phone.trim())) e.phone = 'That does not look like a phone number — for example 083 499 9495.'
  if (f.email.trim() && !EMAIL_OK.test(f.email.trim()))
    e.email = 'Check the email address — it is missing an @ or a domain.'
  if (!f.type) e.type = 'Choose the kind of event so we can quote accurately.'
  if (!f.message.trim()) e.message = 'A sentence or two about the event helps us come back with a real answer.'
  return e
}

export default function Contact({ heading = true }: { heading?: boolean }) {
  const [f, setF] = useState<Fields>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({})
  const [sent, setSent] = useState(false)
  /*
    Counts failed submits rather than storing a boolean, so two failed submits
    in a row still move focus the second time.
  */
  const [failedAt, setFailedAt] = useState(0)
  const summaryRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  /*
    Focus moves to the summary in an effect, not inline in the submit handler.
    React batches the setErrors call, so at the moment the handler runs the
    summary is still hidden -- and a hidden element cannot take focus, which
    left focus sitting on the submit button and the error unannounced. By the
    time this effect runs the summary is in the DOM and visible.
  */
  useEffect(() => {
    if (failedAt === 0) return
    summaryRef.current?.focus()
  }, [failedAt])

  const set = (k: keyof Fields) => (v: string) => {
    setF((p) => ({ ...p, [k]: v }))
    /* Clear an error the moment the field stops being wrong, so a corrected
       field does not keep its red state until the next submit. */
    if (errors[k]) {
      const next = validate({ ...f, [k]: v })
      setErrors((p) => ({ ...p, [k]: next[k] }))
    }
  }

  const blur = (k: keyof Fields) => () => {
    setTouched((p) => ({ ...p, [k]: true }))
    const next = validate(f)
    setErrors((p) => ({ ...p, [k]: next[k] }))
  }

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault()
    const found = validate(f)
    setErrors(found)
    setTouched(Object.fromEntries(Object.keys(f).map((k) => [k, true])))

    const keys = Object.keys(found) as (keyof Fields)[]
    if (keys.length > 0) {
      /* Focus the summary, not the first field: with several errors the summary
         is the thing that tells you how many there are. The effect above does
         the focusing, once the summary has actually rendered. */
      setFailedAt((n) => n + 1)
      return
    }

    const lines = [
      `Hi ${BUSINESS.name}, I'd like to enquire about an event.`,
      '',
      `Name: ${f.name.trim()}`,
      `Phone: ${f.phone.trim()}`,
      f.email.trim() ? `Email: ${f.email.trim()}` : null,
      `Event: ${f.type}`,
      f.date ? `Date: ${f.date}` : null,
      f.guests.trim() ? `Guests: ${f.guests.trim()}` : null,
      '',
      f.message.trim(),
    ].filter((l): l is string => l !== null)

    window.open(
      `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`,
      '_blank',
      'noopener,noreferrer'
    )
    setSent(true)
  }

  const errorList = (Object.keys(errors) as (keyof Fields)[]).filter((k) => errors[k])

  const focusField = (k: keyof Fields) => (e: React.MouseEvent) => {
    e.preventDefault()
    formRef.current?.querySelector<HTMLElement>(`#f-${k}`)?.focus()
  }

  return (
    <Section id="contact" label="Contact and enquiries">
      <Container>
        {/* On /contact the PageHero already carries the eyebrow and the h1,
            so printing them here too would put the same title on screen twice. */}
        {heading && <Rule />}
        <div style={{ paddingTop: heading ? 'clamp(36px, 5vw, 72px)' : 0 }}>
          {heading && (
          <Reveal>
            <Eyebrow>Enquiries</Eyebrow>
            <Heading text={'Tell us about\nyour day'} />
          </Reveal>
          )}

          <div className="contact-grid" style={heading ? undefined : { marginTop: 0 }}>
            {/* ---- the form ---------------------------------------------- */}
            <Reveal delay={0.06}>
              {sent ? (
                <div className="sent-card" role="status">
                  <Sparkle size={34} />
                  <h3 className="display" style={{ margin: '18px 0 12px', fontSize: 27, fontWeight: 300, color: '#fff', textTransform: 'uppercase' }}>
                    Your message is ready
                  </h3>
                  <p className="prose" style={{ margin: 0, color: 'rgba(255,255,255,0.72)' }}>
                    We have opened WhatsApp with your details filled in — press send there and we
                    will come back to you within one working day. If the tab did not open, call us
                    on{' '}
                    <a href={`tel:${BUSINESS.phoneHref}`} style={{ color: 'var(--color-gold)' }}>
                      {BUSINESS.phoneDisplay}
                    </a>
                    .
                  </p>
                  <button
                    type="button"
                    className="ui btn-ghost"
                    style={{ marginTop: 26 }}
                    onClick={() => {
                      setSent(false)
                      setF(EMPTY)
                      setErrors({})
                      setTouched({})
                    }}
                  >
                    Send another enquiry
                  </button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={submit} noValidate>
                  {/*
                    The summary is always in the DOM but only filled after a
                    failed submit. tabIndex -1 so it can take focus
                    programmatically without joining the tab order.
                  */}
                  <div
                    ref={summaryRef}
                    tabIndex={-1}
                    role="alert"
                    className="err-summary"
                    hidden={errorList.length === 0}
                  >
                    {errorList.length > 0 && (
                      <>
                        <p style={{ margin: '0 0 10px', fontWeight: 600 }}>
                          {errorList.length === 1
                            ? 'One thing needs fixing before we can send this:'
                            : `${errorList.length} things need fixing before we can send this:`}
                        </p>
                        <ul style={{ margin: 0, paddingLeft: 18 }}>
                          {errorList.map((k) => (
                            <li key={k}>
                              <a href={`#f-${k}`} onClick={focusField(k)}>
                                {LABELS[k]}: {errors[k]}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>

                  <div className="field-grid">
                    <Field id="name" label={LABELS.name} required error={touched.name ? errors.name : undefined}>
                      <input
                        id="f-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={f.name}
                        onChange={(e) => set('name')(e.target.value)}
                        onBlur={blur('name')}
                        aria-invalid={touched.name && !!errors.name}
                        aria-describedby={touched.name && errors.name ? 'e-name' : undefined}
                      />
                    </Field>

                    <Field
                      id="phone"
                      label={LABELS.phone}
                      required
                      hint="A WhatsApp number is easiest."
                      error={touched.phone ? errors.phone : undefined}
                    >
                      <input
                        id="f-phone"
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        value={f.phone}
                        onChange={(e) => set('phone')(e.target.value)}
                        onBlur={blur('phone')}
                        aria-invalid={touched.phone && !!errors.phone}
                        aria-describedby={
                          [touched.phone && errors.phone ? 'e-phone' : null, 'h-phone']
                            .filter(Boolean)
                            .join(' ') || undefined
                        }
                      />
                    </Field>

                    <Field id="email" label={LABELS.email} hint="Optional." error={touched.email ? errors.email : undefined}>
                      <input
                        id="f-email"
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        value={f.email}
                        onChange={(e) => set('email')(e.target.value)}
                        onBlur={blur('email')}
                        aria-invalid={touched.email && !!errors.email}
                        aria-describedby={
                          [touched.email && errors.email ? 'e-email' : null, 'h-email']
                            .filter(Boolean)
                            .join(' ') || undefined
                        }
                      />
                    </Field>

                    <Field id="type" label={LABELS.type} required error={touched.type ? errors.type : undefined}>
                      <select
                        id="f-type"
                        name="type"
                        value={f.type}
                        onChange={(e) => set('type')(e.target.value)}
                        onBlur={blur('type')}
                        aria-invalid={touched.type && !!errors.type}
                        aria-describedby={touched.type && errors.type ? 'e-type' : undefined}
                      >
                        <option value="">Please choose…</option>
                        {EVENT_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field id="date" label={LABELS.date} hint="Even a rough one helps.">
                      <input
                        id="f-date"
                        name="date"
                        type="date"
                        value={f.date}
                        onChange={(e) => set('date')(e.target.value)}
                        aria-describedby="h-date"
                      />
                    </Field>

                    <Field id="guests" label={LABELS.guests} hint="Roughly how many seated.">
                      <input
                        id="f-guests"
                        name="guests"
                        type="number"
                        inputMode="numeric"
                        min={1}
                        value={f.guests}
                        onChange={(e) => set('guests')(e.target.value)}
                        aria-describedby="h-guests"
                      />
                    </Field>

                    <Field
                      id="message"
                      label={LABELS.message}
                      required
                      span2
                      error={touched.message ? errors.message : undefined}
                    >
                      <textarea
                        id="f-message"
                        name="message"
                        rows={5}
                        value={f.message}
                        onChange={(e) => set('message')(e.target.value)}
                        onBlur={blur('message')}
                        aria-invalid={touched.message && !!errors.message}
                        aria-describedby={touched.message && errors.message ? 'e-message' : undefined}
                      />
                    </Field>
                  </div>

                  <button type="submit" className="ui btn-solid" style={{ marginTop: 26 }}>
                    Send enquiry
                    <Sparkle size={15} fill="var(--color-void)" />
                  </button>

                  <p className="prose" style={{ marginTop: 14, fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>
                    This opens WhatsApp with your details filled in — you press send.
                  </p>
                </form>
              )}
            </Reveal>

            {/* ---- details ------------------------------------------------ */}
            <Reveal delay={0.12}>
              <div className="detail-card">
                <h3 className="eyebrow" style={{ margin: '0 0 18px' }}>
                  Find us
                </h3>

                <a href={`tel:${BUSINESS.phoneHref}`} className="detail-row">
                  <span className="detail-k">Phone</span>
                  <span className="detail-v">{BUSINESS.phoneDisplay}</span>
                </a>

                <a
                  href={`https://wa.me/${BUSINESS.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="detail-row"
                >
                  <span className="detail-k">WhatsApp</span>
                  <span className="detail-v">Start a chat</span>
                </a>

                <a href={BUSINESS.mapsUrl} target="_blank" rel="noopener noreferrer" className="detail-row">
                  <span className="detail-k">Studio</span>
                  <span className="detail-v">
                    {BUSINESS.street}
                    <br />
                    {BUSINESS.cityLine}
                  </span>
                </a>

                <div style={{ marginTop: 26 }}>
                  <h4 className="eyebrow" style={{ margin: '0 0 12px' }}>
                    Opening hours
                  </h4>
                  <table className="hours">
                    <tbody>
                      {HOURS.map((h) => (
                        <tr key={h.day}>
                          <th scope="row">{h.day}</th>
                          <td className={h.open === 'Closed' ? 'closed' : undefined}>{h.open}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  )
}

/* One field shell: label, optional hint, control, inline error. */
function Field({
  id,
  label,
  children,
  required,
  hint,
  error,
  span2,
}: {
  id: string
  label: string
  children: React.ReactNode
  required?: boolean
  hint?: string
  error?: string
  span2?: boolean
}) {
  return (
    <div className={`field${span2 ? ' field-span2' : ''}${error ? ' field-err' : ''}`}>
      <label htmlFor={`f-${id}`}>
        {label}
        {required ? (
          <span className="req" aria-hidden="true">
            {' '}
            *
          </span>
        ) : null}
        {required ? <span className="sr-only"> (required)</span> : null}
      </label>
      {hint ? (
        <span className="hint" id={`h-${id}`}>
          {hint}
        </span>
      ) : null}
      {children}
      {error ? (
        <span className="err" id={`e-${id}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
            <path d="M12 7.5v5.5M12 16.2v.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          {error}
        </span>
      ) : null}
    </div>
  )
}
