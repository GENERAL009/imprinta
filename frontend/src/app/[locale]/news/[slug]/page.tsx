'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { api } from '@/lib/api'

interface BlogPost {
  id: string
  title_uz?: string
  title_en?: string
  title_ru?: string
  content_uz?: string
  content_en?: string
  content_ru?: string
  excerpt_uz?: string
  excerpt_en?: string
  excerpt_ru?: string
  image?: string
  slug?: string
  created_at?: string
  views?: number
}

function resolveImageUrl(url: string): string {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return url
}

export default function BlogDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const locale = useLocale()
  const t = useTranslations('news')
  const [item, setItem] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/news/${slug}`)
      .then(res => setItem(res.data))
      .catch(() => setItem(null))
      .finally(() => setLoading(false))
  }, [slug])

  const getTitle = (p: BlogPost) => {
    if (locale === 'ru') return p.title_ru || p.title_uz || p.title_en || ''
    if (locale === 'en') return p.title_en || p.title_uz || ''
    return p.title_uz || p.title_en || ''
  }

  const getContent = (p: BlogPost) => {
    if (locale === 'ru') return p.content_ru || p.content_uz || p.content_en || ''
    if (locale === 'en') return p.content_en || p.content_uz || ''
    return p.content_uz || p.content_en || ''
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
          <Link href="/news" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t('allArticles')}
          </Link>
        </div>
      </div>
    )
  }

  const title = getTitle(item)
  const content = getContent(item)

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative h-[45vh] min-h-[350px] overflow-hidden">
        {item.image ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${resolveImageUrl(item.image)})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-brand-navy-dark to-brand-navy" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-light-bg dark:from-dark-bg via-black/60 to-black/30" />

        <div className="relative z-10 h-full flex items-end">
          <div className="container-main pb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                href="/news"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('allArticles')}
              </Link>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white max-w-4xl">
                {title}
              </h1>
              <div className="flex items-center gap-4 mt-4 flex-wrap">
                {item.created_at && (
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Calendar className="w-4 h-4" />
                    {new Date(item.created_at).toLocaleDateString(
                      locale === 'ru' ? 'ru-RU' : locale === 'en' ? 'en-US' : 'uz-UZ',
                      { year: 'numeric', month: 'long', day: 'numeric' }
                    )}
                  </div>
                )}
                {item.views !== undefined && item.views > 0 && (
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Clock className="w-4 h-4" />
                    {item.views} {t('views')}
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
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl"
          >
            {content && (
              <div className="prose prose-lg dark:prose-invert max-w-none text-light-text-secondary dark:text-dark-text-secondary leading-relaxed whitespace-pre-line">
                {content}
              </div>
            )}
          </motion.article>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 pt-8 border-t border-light-border dark:border-dark-border"
          >
            <Link href="/news" className="btn-secondary inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t('allArticles')}
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
