'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { ArchitecturalPattern } from '@/components/ui/uzbek'

export function CTA() {
  const t = useTranslations('cta')

  return (
    <section className="section-spacing relative overflow-hidden">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[2.5rem] overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-brand-navy-dark to-brand-navy" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,169,158,0.15),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(249,177,59,0.08),transparent_60%)]" />

          {/* Uzbek national architectural pattern overlay */}
          <ArchitecturalPattern variant="dark" />
          {/* Ornamental borders */}
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-transparent via-brand-teal/40 to-transparent" />

          {/* Floating decorations */}
          <motion.div
            animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-8 right-12 w-20 h-20 rounded-full bg-brand-teal/10 blur-xl"
          />
          <motion.div
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-8 left-12 w-16 h-16 rounded-full bg-brand-gold/10 blur-xl"
          />

          {/* Content */}
          <div className="relative z-10 p-12 md:p-16 lg:p-20 text-center">
            <h2 className="text-[2rem] md:text-[2.75rem] lg:text-[3.5rem] font-extrabold text-white leading-[1.1] tracking-tight mb-6 max-w-3xl mx-auto">
              {t('title')}
            </h2>
            <p className="text-[16px] md:text-[17px] text-white/60 mb-10 max-w-xl mx-auto leading-relaxed">
              {t('subtitle')}
            </p>

            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 px-10 py-5 rounded-full
                bg-brand-teal text-white font-semibold text-[15px]
                shadow-[0_8px_32px_rgba(0,169,158,0.4)]
                hover:shadow-[0_12px_40px_rgba(0,169,158,0.6)]
                hover:-translate-y-1 transition-all duration-300"
            >
              {t('button')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
