'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { api } from '@/lib/api'

function resolveImageUrl(url: string): string {
  if (!url) return ''
  if (url.startsWith('http')) return url
  const base = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8000'
  return `${base}${url}`
}

interface PortfolioItem {
  id: string
  title_uz?: string
  title_ru?: string
  title_en?: string
  image?: string
  images?: string[]
  category?: { name_uz?: string; name_ru?: string; name_en?: string }
  client?: string
}

export default function PortfolioPage() {
  const t = useTranslations('portfolio')
  const locale = useLocale()
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/portfolio')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.items || res.data.data || []
        setItems(data)
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  const getTitle = (item: PortfolioItem) => {
    if (locale === 'ru') return item.title_ru || item.title_uz || item.title_en || ''
    if (locale === 'en') return item.title_en || item.title_uz || ''
    return item.title_uz || item.title_en || ''
  }

  const getCategory = (item: PortfolioItem) => {
    if (!item.category) return ''
    if (locale === 'ru') return item.category.name_ru || item.category.name_uz || ''
    if (locale === 'en') return item.category.name_en || item.category.name_uz || ''
    return item.category.name_uz || item.category.name_en || ''
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {items.map((item, i) => {
              const mainImage = item.image || item.images?.[0]
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                >
                  <Link
                    href={`/portfolio/${item.id}`}
                    className="group relative block aspect-[4/3] rounded-[1.75rem] overflow-hidden border border-light-border dark:border-dark-border card-hover cursor-pointer"
                  >
                    {mainImage ? (
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url(${resolveImageUrl(mainImage)})` }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-navy-dark to-brand-navy" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-[17px] font-bold text-white mb-1">
                        {getTitle(item)}
                      </h3>
                      <div className="flex items-center gap-3">
                        {getCategory(item) && (
                          <span className="text-[12px] font-medium text-brand-teal bg-brand-teal/[0.15] px-3 py-1 rounded-full">
                            {getCategory(item)}
                          </span>
                        )}
                        {item.client && (
                          <span className="text-[12px] text-white/60">{item.client}</span>
                        )}
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-brand-navy/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                        <ExternalLink className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
