import PageHero from '../PageHero'
import Cta from '../Cta'
import { Services } from '../Sections'
import { PAGES } from '../data'
import { useDocumentTitle } from '../ui'

export default function ServicesPage() {
  useDocumentTitle('Services — Nawtyfairy Events')
  return (
    <>
      <PageHero {...PAGES.services} image="/assets/gallery-3.webp" focus="50% 50%" />
      <Services heading={false} />
      <Cta heading="Not sure which one you need?" blurb="Tell us what you are planning and we will work out what it takes." />
    </>
  )
}
