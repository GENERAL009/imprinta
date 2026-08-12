'use client'

import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/ui/SectionHeader'

export default function TeamPage() {
  return (
    <section className="section-padding pt-32">
      <div className="container-custom">
        <SectionHeader tag="Team" title="Our Team" subtitle="Meet the professionals behind ImPrinta" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group text-center"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-light-bg-alt to-light-card dark:from-dark-bg-alt dark:to-dark-card border border-light-border dark:border-dark-border mb-4 overflow-hidden group-hover:border-brand-teal/30 transition-all" />
              <h4 className="font-semibold">Team Member {i + 1}</h4>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Position</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
