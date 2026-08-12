'use client'

import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { Printer, BookOpen, Package, Palette, Box, Wrench, ArrowUpRight } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ArchitecturalPattern } from '@/components/ui/uzbek'
import { Link } from '@/i18n/routing'
import { api } from '@/lib/api'
import { useEffect, useState } from 'react'

const fallbackIcons = [Printer, BookOpen, Package, Palette, Box, Wrench]

interface ServiceItem {
  id: string
  title_uz?: string
  title_ru?: string
  title_en?: string
  description_uz?: string
  description_ru?: string
  description_en?: string
  icon?: string
  image?: string
  slug: string
  is_featured?: boolean
  sort_order?: number
}

export function Services() {
  const t = useTranslations('services')
  const locale = useLocale()
  const [services, setServices] = useState<ServiceItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/services')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.items || res.data.data || []
        setServices(data)
      })
      .catch(() => setServices([]))
      .finally(() => setLoading(false))
  }, [])

  const getTitle = (item: ServiceItem) => {
    if (locale === 'ru') return item.title_ru || item.title_uz || item.title_en || ''
    if (locale === 'en') return item.title_en || item.title_uz || ''
    return item.title_uz || item.title_en || ''
  }

  const getDesc = (item: ServiceItem) => {
    if (locale === 'ru') return item.description_ru || item.description_uz || item.description_en || ''
    if (locale === 'en') return item.description_en || item.description_uz || ''
    return item.description_uz || item.description_en || ''
  }

  if (loading) {
    return (
      <section className="section-spacing relative overflow-hidden" id="services">
        <div className="container-main">
          <SectionHeader tag={t('tag')} title={t('title')} subtitle={t('subtitle')} />
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </section>
    )
  }

  if (services.length === 0) {
    return null
  }

  return (
    <section className="section-spacing relative overflow-hidden" id="services">
      <ArchitecturalPattern />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-brand-teal/[0.03] dark:bg-brand-teal/[0.05] blur-[100px] -z-10" />

      <div className="container-main">
        <SectionHeader tag={t('tag')} title={t('title')} subtitle={t('subtitle')} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {services.map((service, i) => {
            const Icon = fallbackIcons[i % fallbackIcons.length]
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={`/services/${service.slug}`}
                  className="group relative block h-full rounded-[1.75rem] overflow-hidden
                    border border-light-border dark:border-dark-border
                    hover:border-brand-teal/30 dark:hover:border-brand-teal/30
                    card-hover"
                >
                  {service.image ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${service.image})` }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-light-card dark:bg-dark-card" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 group-hover:from-black/85 group-hover:via-black/50 transition-all duration-500" />

                  <div className="relative z-10 p-7 lg:p-8 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl
                        bg-white/10 backdrop-blur-sm group-hover:bg-brand-teal/20
                        flex items-center justify-center transition-colors duration-500">
                        <Icon className="w-6 h-6 text-white group-hover:text-brand-teal transition-colors duration-300" />
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-white/50 group-hover:text-brand-teal group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                    </div>
                    <div className="mt-auto">
                      <h3 className="text-[17px] font-bold mb-2 text-white group-hover:text-brand-teal transition-colors duration-300">
                        {getTitle(service)}
                      </h3>
                      <p className="text-[14px] leading-relaxed text-white/70">
                        {getDesc(service)}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
