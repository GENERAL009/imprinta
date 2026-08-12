'use client'

import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/ui/SectionHeader'

export default function CertificatesPage() {
  return (
    <section className="section-padding pt-32">
      <div className="container-custom">
        <SectionHeader tag="Certificates" title="Our Certificates" subtitle="Quality assurance and certifications" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="aspect-[3/4] rounded-3xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border flex items-center justify-center hover:border-brand-teal/30 transition-all"
            >
              <span className="text-light-text-secondary dark:text-dark-text-secondary">Certificate {i + 1}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
