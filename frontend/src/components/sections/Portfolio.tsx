'use client'

import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { PortfolioFrame } from '@/components/ui/uzbek'
import { api } from '@/lib/api'
import { useEffect, useState } from 'react'

function resolveImageUrl(url: string): string {
  if (!url) return ''
  if (url.startsWith('http')) return url
  const base = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8000'
  return `${base}${url}`
}

const colors = [
  'from-brand-teal/20 to-brand-teal/[0.05]',
  'from-brand-gold/20 to-brand-gold/[0.05]',
  'from-brand-navy/20 to-brand-navy/[0.05]',
  'from-brand-teal/15 to-brand-navy/[0.05]',
]

interface PortfolioItem {
  id: number | string
  title_uz?: string
  title_ru?: string
  title_en?: string
  image?: string
  images?: string[]
  category?: { name_uz?: string; name_ru?: string; name_en?: string }
  category_name?: string
}

export function Portfolio() {
  const t = useTranslations('portfolio')
  const locale = useLocale()
  const [projects, setProjects] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/portfolio')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.items || res.data.data || []
        setProjects(data.slice(0, 4))
      })
      .catch(() => setProjects([]))
      .finally(() => setLoading(false))
  }, [])

  const getTitle = (item: PortfolioItem) => {
    if (locale === 'ru') return item.title_ru || item.title_uz || item.title_en || ''
    if (locale === 'en') return item.title_en || item.title_uz || ''
    return item.title_uz || item.title_en || ''
  }

  const getCategory = (item: PortfolioItem) => {
    if (item.category) {
      if (locale === 'ru') return item.category.name_ru || item.category.name_uz || ''
      if (locale === 'en') return item.category.name_en || item.category.name_uz || ''
      return item.category.name_uz || item.category.name_en || ''
    }
    return item.category_name || ''
  }

  if (loading) {
    return (
      <section className="section-spacing relative overflow-hidden" id="portfolio">
        <div className="container-main">
          <SectionHeader tag={t('tag')} title={t('title')} subtitle={t('subtitle')} />
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </section>
    )
  }

  if (projects.length === 0) {
    return null
  }

  return (
    <section className="section-spacing relative overflow-hidden" id="portfolio">
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-brand-gold/[0.02] blur-[100px] -z-10" />

      <div className="container-main">
        <SectionHeader tag={t('tag')} title={t('title')} subtitle={t('subtitle')} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={`/portfolio/${project.id}`} className="group relative block aspect-[4/3] rounded-[1.75rem] overflow-hidden border border-light-border dark:border-dark-border card-hover cursor-pointer bg-light-card dark:bg-dark-card">
                <PortfolioFrame active={i < 2} />

                {project.image ? (
                  <>
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${resolveImageUrl(project.image!)})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end p-8">
                      <h3 className="text-[17px] font-bold mb-2 text-white">{getTitle(project)}</h3>
                      {getCategory(project) && (
                        <span className="text-[12px] font-medium text-brand-teal bg-brand-teal/[0.15] px-3 py-1 rounded-full w-fit">
                          {getCategory(project)}
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`absolute inset-0 bg-gradient-to-br ${colors[i % colors.length]}`} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                      <div className="w-16 h-16 rounded-2xl bg-white/80 dark:bg-dark-card/80 border border-light-border dark:border-dark-border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                        <span className="text-2xl font-extrabold text-brand-navy dark:text-white">{i + 1}</span>
                      </div>
                      <h3 className="text-[17px] font-bold text-center mb-2 text-light-text dark:text-dark-text">{getTitle(project)}</h3>
                      {getCategory(project) && (
                        <span className="text-[12px] font-medium text-brand-teal bg-brand-teal/[0.08] px-3 py-1 rounded-full">
                          {getCategory(project)}
                        </span>
                      )}
                    </div>
                  </>
                )}

                <div className="absolute inset-0 bg-brand-navy/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                    <ExternalLink className="w-5 h-5 text-white" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link href="/portfolio" className="btn-secondary group">
            {t('viewAll')}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
