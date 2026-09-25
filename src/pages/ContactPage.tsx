import PageHero from '../PageHero'
import Contact from '../Contact'
import { PAGES } from '../data'
import { useDocumentTitle } from '../ui'
import { asset } from '../asset'

export default function ContactPage() {
  useDocumentTitle('Contact — Nawtyfairy Events')
  return (
    <>
      <PageHero {...PAGES.contact} image={asset('assets/hero.webp')} focus="50% 34%" />
      {/* No Cta band here: this page IS the call to action. */}
      <Contact heading={false} />
    </>
  )
}
