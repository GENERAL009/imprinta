'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, CheckCircle, Phone } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { api } from '@/lib/api'
import { CTA } from '@/components/sections/CTA'

interface ServiceData {
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
}

export default function ServiceDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const locale = useLocale()
  const t = useTranslations('serviceDetail')
  const [service, setService] = useState<ServiceData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/services/${slug}`)
      .then(res => setService(res.data))
      .catch(() => setService(null))
      .finally(() => setLoading(false))
  }, [slug])

  const getTitle = (item: ServiceData) => {
    if (locale === 'ru') return item.title_ru || item.title_uz || item.title_en || ''
    if (locale === 'en') return item.title_en || item.title_uz || ''
    return item.title_uz || item.title_en || ''
  }

  const getDesc = (item: ServiceData) => {
    if (locale === 'ru') return item.description_ru || item.description_uz || item.description_en || ''
    if (locale === 'en') return item.description_en || item.description_uz || ''
    return item.description_uz || item.description_en || ''
  }

  if (loading) {
    return (
      <div className="pt-32 pb-20 flex justify-center">
        <div className="w-8 h-8 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!service) {
    return (
      <div className="pt-32 pb-20 text-center">
        <div className="container-main">
          <h1 className="text-2xl font-bold text-light-text dark:text-dark-text mb-4">
            {t('notFound')}
          </h1>
          <Link href="/#services" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t('allServices')}
          </Link>
        </div>
      </div>
    )
  }

  const title = getTitle(service)
  const description = getDesc(service)

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        {service.image ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${service.image})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-brand-navy-dark to-brand-navy" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-light-bg dark:from-dark-bg via-black/50 to-black/30" />
        <div className="relative z-10 h-full flex items-end">
          <div className="container-main pb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                href="/#services"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('allServices')}
              </Link>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white">
                {title}
              </h1>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-20">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl"
          >
            <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-6">
              {t('aboutService')}
            </h2>
            {description && (
              <p className="text-[16px] leading-relaxed text-light-text-secondary dark:text-dark-text-secondary mb-8 whitespace-pre-line">
                {description}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
              <div className="p-6 rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
                <Clock className="w-6 h-6 text-brand-teal mb-3" />
                <div className="text-xl font-bold text-light-text dark:text-dark-text mb-1">24/7</div>
                <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  {t('orderAcceptance')}
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
                <CheckCircle className="w-6 h-6 text-brand-teal mb-3" />
                <div className="text-xl font-bold text-light-text dark:text-dark-text mb-1">1-3
                  {' '}{t('days')}
                </div>
                <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  {t('deliveryTime')}
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
                <Phone className="w-6 h-6 text-brand-teal mb-3" />
                <div className="text-xl font-bold text-light-text dark:text-dark-text mb-1">100%</div>
                <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  {t('qualityGuarantee')}
                </div>
              </div>
            </div>

            <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
              {t('orderNow')}
            </Link>
          </motion.div>
        </div>
      </section>

      <CTA />
    </div>
  )
}
