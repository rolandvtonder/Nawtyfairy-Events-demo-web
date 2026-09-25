import PageHero from '../PageHero'
import Cta from '../Cta'
import { Testimonials } from '../Sections'
import { PAGES, TESTIMONIALS } from '../data'
import { useDocumentTitle } from '../ui'
import { asset } from '../asset'

export default function ReviewsPage() {
  useDocumentTitle('Reviews — Nawtyfairy Events')

  /* The banner has to agree with what is underneath it. "What our clients say"
     over an empty state reads as a page that failed to load; until there are
     real reviews the heading asks for the first one instead. */
  const has = TESTIMONIALS.length > 0

  return (
    <>
      <PageHero
        {...PAGES.reviews}
        heading={has ? PAGES.reviews.heading : 'Be the first to\nsay something'}
        blurb={
          has
            ? PAGES.reviews.blurb
            : 'We have not gathered reviews online yet — if we have styled your event, we would love to hear from you.'
        }
        image={asset('assets/gallery-2.webp')}
        focus="50% 55%"
      />
      <Testimonials heading={false} />
      <Cta />
    </>
  )
}
