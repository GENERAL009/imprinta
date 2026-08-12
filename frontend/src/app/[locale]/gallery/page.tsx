'use client'

import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/ui/SectionHeader'

export default function GalleryPage() {
  return (
    <section className="section-padding pt-32">
      <div className="container-custom">
        <SectionHeader tag="Gallery" title="Photo Gallery" subtitle="See our work environment and production" />
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-2xl bg-gradient-to-br from-brand-teal/10 to-brand-teal/5 border border-light-border dark:border-dark-border overflow-hidden break-inside-avoid ${
                i % 3 === 0 ? 'aspect-[4/5]' : i % 3 === 1 ? 'aspect-square' : 'aspect-[4/3]'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
