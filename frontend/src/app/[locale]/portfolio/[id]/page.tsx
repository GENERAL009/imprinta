'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Tag, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { api } from '@/lib/api'

interface PortfolioItem {
  id: string
  title_uz?: string
  title_en?: string
  title_ru?: string
  description_uz?: string
  description_en?: string
  description_ru?: string
  image?: string
  images?: string[]
  category?: { name_uz?: string; name_ru?: string; name_en?: string }
  client?: string
  created_at?: string
  slug?: string
}

function resolveImageUrl(url: string): string {
  if (!url) return ''
  if (url.startsWith('http')) return url
  const base = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8000'
  return `${base}${url}`
}

export default function PortfolioDetailPage() {
  const params = useParams()
  const id = params.id as string
  const locale = useLocale()
  const t = useTranslations('portfolio')
  const [item, setItem] = useState<PortfolioItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    api.get(`/portfolio/${id}`)
      .then(res => setItem(res.data))
      .catch(() => setItem(null))
      .finally(() => setLoading(false))
  }, [id])

  const getTitle = (p: PortfolioItem) => {
    if (locale === 'ru') return p.title_ru || p.title_uz || p.title_en || ''
    if (locale === 'en') return p.title_en || p.title_uz || ''
    return p.title_uz || p.title_en || ''
  }

  const getDesc = (p: PortfolioItem) => {
    if (locale === 'ru') return p.description_ru || p.description_uz || p.description_en || ''
    if (locale === 'en') return p.description_en || p.description_uz || ''
    return p.description_uz || p.description_en || ''
  }

  const getCategory = (p: PortfolioItem) => {
    if (!p.category) return ''
    if (locale === 'ru') return p.category.name_ru || p.category.name_uz || ''
    if (locale === 'en') return p.category.name_en || p.category.name_uz || ''
    return p.category.name_uz || p.category.name_en || ''
  }

  if (loading) {
    return (
      <div className="pt-32 pb-20 flex justify-center">
        <div className="w-8 h-8 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!item) {
    return (
      <div className="pt-32 pb-20 text-center">
        <div className="container-main">
          <h1 className="text-2xl font-bold text-light-text dark:text-dark-text mb-4">
            {t('notFound')}
          </h1>
          <Link href="/portfolio" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t('allProjects')}
          </Link>
        </div>
      </div>
    )
  }

  const title = getTitle(item)
  const description = getDesc(item)
  const category = getCategory(item)
  const allImages = [item.image, ...(item.images || [])].filter(Boolean) as string[]

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        {allImages.length > 0 ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-500"
            style={{ backgroundImage: `url(${resolveImageUrl(allImages[activeImage] || allImages[0])})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-brand-navy-dark to-brand-navy" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-light-bg dark:from-dark-bg via-black/50 to-black/30" />

        {allImages.length > 1 && (
          <>
            <button
              onClick={() => setActiveImage(prev => prev === 0 ? allImages.length - 1 : prev - 1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveImage(prev => prev === allImages.length - 1 ? 0 : prev + 1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        <div className="relative z-10 h-full flex items-end">
          <div className="container-main pb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('allProjects')}
              </Link>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white">
                {title}
              </h1>
              <div className="flex items-center gap-4 mt-4 flex-wrap">
                {category && (
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-brand-teal" />
                    <span className="text-sm text-white/70">{category}</span>
                  </div>
                )}
                {item.client && (
                  <div className="text-sm text-white/70">
                    {t('client')}: {item.client}
                  </div>
                )}
                {item.created_at && (
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Calendar className="w-4 h-4" />
                    {new Date(item.created_at).toLocaleDateString(
                      locale === 'ru' ? 'ru-RU' : locale === 'en' ? 'en-US' : 'uz-UZ'
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-20">
        <div className="container-main">
          {description && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-3xl mb-12"
            >
              <p className="text-[16px] leading-relaxed text-light-text-secondary dark:text-dark-text-secondary whitespace-pre-line">
                {description}
              </p>
            </motion.div>
          )}

          {/* Gallery thumbnails */}
          {allImages.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12"
            >
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-[4/3] rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                    activeImage === i
                      ? 'border-brand-teal shadow-lg shadow-brand-teal/20 scale-[1.02]'
                      : 'border-light-border dark:border-dark-border hover:border-brand-teal/50'
                  }`}
                >
                  <img
                    src={resolveImageUrl(img)}
                    alt={`${title} - ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link href="/portfolio" className="btn-secondary inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t('allProjects')}
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
