'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Award, Clock, DollarSign, Users, MapPin } from 'lucide-react'
import { UzbekistanMap } from '@/components/ui/UzbekistanMap'

export function About() {
  const t = useTranslations('about')

  const features = [
    { icon: Award, title: t('feature1Title'), desc: t('feature1Desc') },
    { icon: Clock, title: t('feature2Title'), desc: t('feature2Desc') },
    { icon: DollarSign, title: t('feature3Title'), desc: t('feature3Desc') },
    { icon: Users, title: t('feature4Title'), desc: t('feature4Desc') },
    { icon: MapPin, title: t('feature5Title'), desc: t('feature5Desc') },
  ]

  return (
    <section className="section-spacing bg-light-bg-alt dark:bg-dark-bg-alt relative overflow-hidden" id="about">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-brand-teal/[0.03] blur-[100px] -z-10" />

      <div className="container-main">
        <div className="grid lg:grid-cols-[55%_45%] gap-12 lg:gap-16 items-center">
          {/* Map Side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="order-2 lg:order-1"
          >
            <UzbekistanMap />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 lg:order-2"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-teal/[0.08] border border-brand-teal/20 mb-6">
              <span className="text-[12px] font-semibold text-brand-teal uppercase tracking-wider">{t('tag')}</span>
            </span>

            <h2 className="text-[2.25rem] md:text-[2.75rem] lg:text-[3.25rem] font-extrabold leading-[1.1] tracking-tight mb-6 text-light-text dark:text-dark-text">
              {t('title')}
            </h2>

            <p className="text-[16px] md:text-[17px] leading-relaxed text-light-text-secondary dark:text-dark-text-secondary mb-10">
              {t('subtitle')}
            </p>

            <div className="grid gap-4">
              {features.map((feature, i) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                    className="flex items-start gap-4 p-4 rounded-2xl hover:bg-brand-teal/[0.03] transition-colors duration-300"
                  >
                    <div className="w-11 h-11 rounded-xl bg-brand-teal/[0.08] flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-brand-teal" />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold mb-1 text-light-text dark:text-dark-text">{feature.title}</h4>
                      <p className="text-[13px] text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">{feature.desc}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
