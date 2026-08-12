'use client'

import { motion } from 'framer-motion'

interface SectionHeaderProps {
  tag: string
  title: string
  subtitle?: string
  center?: boolean
}

export function SectionHeader({ tag, title, subtitle, center = true }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`mb-16 lg:mb-20 ${center ? 'text-center' : ''}`}
    >
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-teal/[0.08] border border-brand-teal/20 mb-6">
        <span className="text-[12px] font-semibold text-brand-teal uppercase tracking-wider">{tag}</span>
      </span>
      <h2 className="text-[2rem] md:text-[2.5rem] lg:text-[3rem] font-extrabold tracking-tight leading-[1.1] mb-5 text-light-text dark:text-dark-text">
        {title}
      </h2>
      {subtitle && (
        <p className={`text-[16px] md:text-[17px] leading-relaxed text-light-text-secondary dark:text-dark-text-secondary ${center ? 'max-w-2xl mx-auto' : 'max-w-xl'}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
