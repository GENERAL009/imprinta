'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { api } from '@/lib/api'

function resolveImageUrl(url: string): string {
  if (!url) return ''
  if (url.startsWith('http')) return url
  const base = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8000'
  return `${base}${url}`
}

interface BlogItem {
  id: string
  title_uz?: string
  title_ru?: string
  title_en?: string
  excerpt_uz?: string
  excerpt_ru?: string
  excerpt_en?: string
  image?: string
  slug?: string
  created_at?: string
}

export default function BlogPage() {
  const t = useTranslations('news')
  const locale = useLocale()
  const [items, setItems] = useState<BlogItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/news')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.items || res.data.data || []
        setItems(data)
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  const getTitle = (item: BlogItem) => {
    if (locale === 'ru') return item.title_ru || item.title_uz || item.title_en || ''
    if (locale === 'en') return item.title_en || item.title_uz || ''
    return item.title_uz || item.title_en || ''
  }

  const getExcerpt = (item: BlogItem) => {
    if (locale === 'ru') return item.excerpt_ru || item.excerpt_uz || item.excerpt_en || ''
    if (locale === 'en') return item.excerpt_en || item.excerpt_uz || ''
    return item.excerpt_uz || item.excerpt_en || ''
  }

  return (
    <section className="section-spacing pt-32">
      <div className="container-main">
        <SectionHeader tag={t('tag')} title={t('title')} subtitle={t('subtitle')} />

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              {t('comingSoon')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <Link
                  href={`/news/${item.slug || item.id}`}
                  className="group block rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border overflow-hidden hover:shadow-xl hover:shadow-brand-teal/[0.05] transition-all duration-500"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    {item.image ? (
                      <img
                        src={resolveImageUrl(item.image)}
                        alt={getTitle(item)}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-brand-teal/20 to-brand-teal/5" />
                    )}
                  </div>
                  <div className="p-6">
                    {item.created_at && (
                      <div className="flex items-center gap-2 text-xs text-light-text-secondary dark:text-dark-text-secondary mb-3">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(item.created_at).toLocaleDateString(
                          locale === 'ru' ? 'ru-RU' : locale === 'en' ? 'en-US' : 'uz-UZ'
                        )}</span>
                      </div>
                    )}
                    <h3 className="font-bold text-light-text dark:text-dark-text mb-2 group-hover:text-brand-teal transition-colors line-clamp-2">
                      {getTitle(item)}
                    </h3>
                    {getExcerpt(item) && (
                      <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary line-clamp-2 mb-4">
                        {getExcerpt(item)}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-teal">
                      {t('readMore')}
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
