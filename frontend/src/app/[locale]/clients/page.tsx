'use client'

import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/ui/SectionHeader'

export default function ClientsPage() {
  return (
    <section className="section-padding pt-32">
      <div className="container-custom">
        <SectionHeader tag="Clients" title="Our Clients" subtitle="Trusted by leading companies" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="aspect-square rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border flex items-center justify-center p-6 hover:border-brand-teal/30 transition-all"
            >
              <span className="text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium">Client {i + 1}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
