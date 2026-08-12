import { Hero } from '@/components/sections/Hero'
import { TrustedBy } from '@/components/sections/TrustedBy'
import { Services } from '@/components/sections/Services'
import { About } from '@/components/sections/About'
import { Portfolio } from '@/components/sections/Portfolio'
import { FAQ } from '@/components/sections/FAQ'
import { Location } from '@/components/sections/Location'
import { CTA } from '@/components/sections/CTA'
import { ContactForm } from '@/components/sections/ContactForm'
import { SectionDivider } from '@/components/ui/uzbek'

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <SectionDivider variant="default" />
      <Services />
      <SectionDivider variant="gold" />
      <About />
      <SectionDivider variant="teal" />
      <Portfolio />
      <SectionDivider variant="default" />
      <FAQ />
      <SectionDivider variant="gold" />
      <Location />
      <CTA />
      <SectionDivider variant="teal" />
      <ContactForm />
    </>
  )
}
