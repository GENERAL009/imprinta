'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

export function Marquee() {
  const t = useTranslations('marquee')
  const items = t('items').split(', ')

  return (
    <section className="py-10 overflow-hidden border-y border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-teal/30 to-transparent" />

      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="whitespace-nowrap flex items-center gap-8"
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="text-[2.5rem] md:text-[3.5rem] font-extrabold text-brand-navy/[0.07] dark:text-white/[0.05] uppercase tracking-wider select-none">
              {item}
            </span>
            <span className="w-2 h-2 rounded-full bg-brand-teal/20 shrink-0" />
          </span>
        ))}
      </motion.div>
    </section>
  )
}
