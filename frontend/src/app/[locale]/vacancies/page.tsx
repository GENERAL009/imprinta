'use client'

import { motion } from 'framer-motion'
import { MapPin, Clock, DollarSign } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'

export default function VacanciesPage() {
  return (
    <section className="section-padding pt-32">
      <div className="container-custom">
        <SectionHeader tag="Vacancies" title="Join Our Team" subtitle="Explore career opportunities at ImPrinta" />
        <div className="max-w-3xl mx-auto space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border hover:border-brand-teal/30 transition-all"
            >
              <h3 className="text-lg font-bold mb-3">Vacancy {i + 1}</h3>
              <div className="flex flex-wrap gap-4 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Tashkent</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Full-time</span>
                <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> Negotiable</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
