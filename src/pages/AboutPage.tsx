import PageHero from '../PageHero'
import Cta from '../Cta'
import { About } from '../Sections'
import { PAGES } from '../data'
import { useDocumentTitle } from '../ui'

export default function AboutPage() {
  useDocumentTitle('About — Nawtyfairy Events')
  return (
    <>
      <PageHero {...PAGES.about} image="/assets/gallery-1.webp" focus="50% 42%" />
      {/* heading={false}: the banner above already carries the eyebrow and h1. */}
      <About heading={false} />
      <Cta />
    </>
  )
}
