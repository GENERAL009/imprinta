'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLocale } from 'next-intl'
import { api } from '@/lib/api'
import { useClientLogos } from '@/context/NationalIdentityContext'

interface Client {
  id: string
  name: string
  logo: string | null
  website: string | null
  is_partner: boolean
}

function resolveImageUrl(url: string): string {
  if (url.startsWith('http')) return url
  const base = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8000'
  return `${base}${url}`
}

export function TrustedBy() {
  const [clients, setClients] = useState<Client[]>([])
  const [title, setTitle] = useState('')
  const [showTitle, setShowTitle] = useState(false)
  const { showClientLogos } = useClientLogos()
  const locale = useLocale()

  useEffect(() => {
    loadClients()
    loadSettings()
  }, [])

  const loadClients = async () => {
    try {
      const res = await api.get('/clients')
      const data = res.data?.items || res.data || []
      setClients(data)
    } catch {
      setClients([])
    }
  }

  const loadSettings = async () => {
    try {
      const res = await api.get('/settings')
      const data = res.data || {}
      const visible = data['partners_title_visible'] !== 'false' && data['partners_title_visible'] !== false
      setShowTitle(visible)
      if (locale === 'ru') setTitle(data['partners_title_ru'] || 'Наши Партнёры')
      else if (locale === 'en') setTitle(data['partners_title_en'] || 'Our Partners')
      else setTitle(data['partners_title_uz'] || 'Bizning Hamkorlar')
    } catch {
      setShowTitle(false)
    }
  }

  if (clients.length === 0) {
    return null
  }

  const doubled = [...clients, ...clients]

  return (
    <section className="py-10 overflow-hidden border-y border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-teal/30 to-transparent" />

      {showTitle && title && (
        <div className="container-main mb-6">
          <h2 className="text-center text-xl md:text-2xl font-bold text-light-text dark:text-dark-text">
            {title}
          </h2>
        </div>
      )}

      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: clients.length * 4, repeat: Infinity, ease: 'linear' }}
        className="whitespace-nowrap flex items-center gap-8"
      >
        {doubled.map((client, i) => (
          <span key={`${client.id}-${i}`} className="flex items-center gap-8">
            {showClientLogos && client.logo ? (
              <span className="inline-flex items-center justify-center min-w-[140px] h-[50px]">
                <img
                  src={resolveImageUrl(client.logo)}
                  alt={client.name}
                  className="max-w-[120px] max-h-[40px] object-contain opacity-40 grayscale hover:opacity-70 hover:grayscale-0 transition-all duration-300"
                />
              </span>
            ) : (
              <span className="text-[2.5rem] md:text-[3.5rem] font-extrabold text-brand-navy/[0.07] dark:text-white/[0.05] uppercase tracking-wider select-none">
                {client.name}
              </span>
            )}
            <span className="w-2 h-2 rounded-full bg-brand-teal/20 shrink-0" />
          </span>
        ))}
      </motion.div>
    </section>
  )
}
