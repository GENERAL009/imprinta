'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useLocale } from 'next-intl'
import { api } from '@/lib/api'

interface Client {
  id: string
  name: string
  logo: string | null
  website: string | null
  is_partner: boolean
  show_text: boolean
  show_logo: boolean
}

function resolveImageUrl(url: string): string {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return url
}

export function TrustedBy() {
  const [clients, setClients] = useState<Client[]>([])
  const [title, setTitle] = useState('')
  const [showTitle, setShowTitle] = useState(false)
  const [showClientLogos, setShowClientLogos] = useState(true)
  const locale = useLocale()

  const scrollRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>(0)
  const speedRef = useRef(1)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const pausedUntil = useRef(0)

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
      if (data['client_display_logos'] !== undefined) {
        setShowClientLogos(data['client_display_logos'] === true || data['client_display_logos'] === 'true')
      }
      if (locale === 'ru') setTitle(data['partners_title_ru'] || 'Наши Партнёры')
      else if (locale === 'en') setTitle(data['partners_title_en'] || 'Our Partners')
      else setTitle(data['partners_title_uz'] || 'Bizning Hamkorlar')
    } catch {
      setShowTitle(false)
    }
  }

  const animate = useCallback(() => {
    const el = scrollRef.current
    if (!el) return

    if (!isDragging.current && Date.now() > pausedUntil.current) {
      el.scrollLeft += speedRef.current

      const halfWidth = el.scrollWidth / 2
      if (el.scrollLeft >= halfWidth) {
        el.scrollLeft -= halfWidth
      } else if (el.scrollLeft <= 0) {
        el.scrollLeft += halfWidth
      }
    }

    animationRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    if (clients.length === 0) return
    animationRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationRef.current)
  }, [clients, animate])

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    startX.current = e.pageX - (scrollRef.current?.offsetLeft || 0)
    scrollLeft.current = scrollRef.current?.scrollLeft || 0
    if (scrollRef.current) scrollRef.current.style.cursor = 'grabbing'
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - (scrollRef.current.offsetLeft || 0)
    const walk = (x - startX.current) * 1.5
    scrollRef.current.scrollLeft = scrollLeft.current - walk
  }

  const handleMouseUp = () => {
    isDragging.current = false
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab'
    pausedUntil.current = Date.now() + 1500
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true
    startX.current = e.touches[0].pageX - (scrollRef.current?.offsetLeft || 0)
    scrollLeft.current = scrollRef.current?.scrollLeft || 0
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || !scrollRef.current) return
    const x = e.touches[0].pageX - (scrollRef.current.offsetLeft || 0)
    const walk = (x - startX.current) * 1.5
    scrollRef.current.scrollLeft = scrollLeft.current - walk
  }

  const handleTouchEnd = () => {
    isDragging.current = false
    pausedUntil.current = Date.now() + 1500
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (!scrollRef.current) return
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault()
      scrollRef.current.scrollLeft += e.deltaX
      pausedUntil.current = Date.now() + 2000
    }
  }

  if (clients.length === 0) {
    return null
  }

  const tripled = [...clients, ...clients, ...clients]

  return (
    <section className="py-12 overflow-hidden border-y border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-teal/30 to-transparent" />

      {showTitle && title && (
        <div className="container-main mb-8">
          <h2 className="text-center text-xl md:text-2xl font-bold text-light-text dark:text-dark-text">
            {title}
          </h2>
        </div>
      )}

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-light-bg dark:from-dark-bg to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-light-bg dark:from-dark-bg to-transparent z-10 pointer-events-none" />

        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
          className="flex items-center gap-12 overflow-x-hidden cursor-grab select-none scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {tripled.map((client, i) => {
            const shouldShowLogo = client.show_logo !== false && client.logo && showClientLogos
            const shouldShowText = client.show_text !== false

            return (
              <div
                key={`${client.id}-${i}`}
                className="flex-shrink-0 flex items-center justify-center"
              >
                {shouldShowLogo ? (
                  <div className="inline-flex items-center justify-center min-w-[280px] h-[120px] md:min-w-[320px] md:h-[140px] px-4">
                    <img
                      src={resolveImageUrl(client.logo!)}
                      alt={client.name}
                      draggable={false}
                      className="max-w-[260px] max-h-[110px] md:max-w-[300px] md:max-h-[130px] object-contain opacity-50 grayscale hover:opacity-80 hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                ) : shouldShowText ? (
                  <span className="text-[2.5rem] md:text-[3.5rem] font-extrabold text-brand-navy/[0.07] dark:text-white/[0.05] uppercase tracking-wider select-none whitespace-nowrap px-4">
                    {client.name}
                  </span>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
