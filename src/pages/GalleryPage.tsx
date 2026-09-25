import PageHero from '../PageHero'
import Cta from '../Cta'
import { Gallery } from '../Sections'
import { PAGES } from '../data'
import { useDocumentTitle } from '../ui'
import { asset } from '../asset'

export default function GalleryPage() {
  useDocumentTitle('Gallery — Nawtyfairy Events')
  return (
    <>
      <PageHero {...PAGES.gallery} image={asset('assets/gallery-4.webp')} focus="50% 46%" />
      <Gallery heading={false} />
      <Cta heading="Want your day to look like this?" />
    </>
  )
}
