'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { MapPin, Phone, Clock, Navigation } from 'lucide-react'
import { api } from '@/lib/api'

export function Location() {
  const t = useTranslations('location')
  const [mapUrl, setMapUrl] = useState('')
  const [directionsUrl, setDirectionsUrl] = useState('https://maps.google.com')

  useEffect(() => {
    api.get('/settings').then(res => {
      const settings = res.data
      if (settings.google_maps) {
        const url = settings.google_maps
        if (url.includes('output=embed') || url.includes('/embed')) {
          setMapUrl(url)
          const coordMatch = url.match(/q=([-\d.]+),([-\d.]+)/)
          if (coordMatch) {
            setDirectionsUrl(`https://maps.google.com/?q=${coordMatch[1]},${coordMatch[2]}`)
          }
        } else {
          setDirectionsUrl(url)
          const coordMatch = url.match(/q=([-\d.]+),([-\d.]+)/)
          if (coordMatch) {
            setMapUrl(`https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&z=15&output=embed`)
          } else {
            const query = url.replace(/https?:\/\/(www\.)?google\.com\/maps.*?\?/, '')
            setMapUrl(`https://maps.google.com/maps?${query}&output=embed`)
          }
        }
      }
    }).catch(() => {})
  }, [])

  return (
    <section className="section-spacing relative overflow-hidden bg-light-bg-alt dark:bg-dark-bg-alt" id="location">
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5L35 15L45 15L37 22L40 32L30 26L20 32L23 22L15 15L25 15Z' fill='%2300a99e' fill-opacity='0.4'/%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px'
      }} />

      <div className="container-main">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-teal/[0.08] border border-brand-teal/20 mb-2">
              <span className="text-[12px] font-semibold text-brand-teal uppercase tracking-wider">{t('tag')}</span>
            </span>

            <h2 className="text-[2rem] md:text-[2.5rem] font-extrabold tracking-tight leading-[1.1] text-light-text dark:text-dark-text">
              {t('title')}
            </h2>

            <p className="text-[15px] text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
              {t('subtitle')}
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group p-5 rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border hover:border-brand-teal/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="w-12 h-12 rounded-xl bg-brand-teal/[0.08] flex items-center justify-center shrink-0"
                >
                  <MapPin className="w-5 h-5 text-brand-teal" />
                </motion.div>
                <div>
                  <p className="text-[14px] font-bold mb-1 text-light-text dark:text-dark-text">{t('addressLabel')}</p>
                  <p className="text-[13px] text-light-text-secondary dark:text-dark-text-secondary">
                    {t('addressLine1')}<br />
                    {t('addressLine2')}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="group p-5 rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border hover:border-brand-teal/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -10 }}
                  className="w-12 h-12 rounded-xl bg-brand-gold/[0.08] flex items-center justify-center shrink-0"
                >
                  <Phone className="w-5 h-5 text-brand-gold" />
                </motion.div>
                <div>
                  <p className="text-[14px] font-bold mb-1 text-light-text dark:text-dark-text">{t('phoneLabel')}</p>
                  <p className="text-[13px] text-light-text-secondary dark:text-dark-text-secondary">
                    +998 90 123 45 67<br />
                    +998 71 200 00 00
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="group p-5 rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border hover:border-brand-teal/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="w-12 h-12 rounded-xl bg-brand-navy/[0.08] dark:bg-brand-teal/[0.08] flex items-center justify-center shrink-0"
                >
                  <Clock className="w-5 h-5 text-brand-navy dark:text-brand-teal" />
                </motion.div>
                <div>
                  <p className="text-[14px] font-bold mb-1 text-light-text dark:text-dark-text">{t('workingHoursLabel')}</p>
                  <p className="text-[13px] text-light-text-secondary dark:text-dark-text-secondary">
                    {t('workingHoursLine1')}<br />
                    {t('workingHoursLine2')}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden border border-light-border dark:border-dark-border shadow-2xl shadow-brand-teal/[0.05]">
              {mapUrl && (
                <iframe
                  src={mapUrl}
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 0, filter: 'saturate(0.8) contrast(1.1)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              )}

              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, type: 'spring', stiffness: 200, damping: 15 }}
                  className="relative"
                >
                  <motion.div
                    animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -inset-4 rounded-full bg-brand-teal/20"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                    className="absolute -inset-8 rounded-full bg-brand-teal/10"
                  />
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative z-10 w-14 h-14 rounded-full bg-brand-teal shadow-[0_8px_30px_rgba(0,169,158,0.5)] flex items-center justify-center"
                  >
                    <Navigation className="w-6 h-6 text-white" fill="white" />
                  </motion.div>
                  <motion.div
                    animate={{ scale: [0.8, 1, 0.8], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-2 rounded-full bg-black/20 blur-sm"
                  />
                </motion.div>
              </div>

              <div className="absolute top-4 left-4 px-4 py-2 rounded-xl glass-light dark:glass-dark">
                <p className="text-[11px] font-bold text-brand-navy dark:text-white">📍 {t('officeLabel')}</p>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-light-bg-alt dark:from-dark-bg-alt to-transparent" />
            </div>

            <motion.a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="absolute -bottom-5 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-teal text-white text-[13px] font-semibold shadow-[0_8px_30px_rgba(0,169,158,0.35)] hover:shadow-[0_12px_40px_rgba(0,169,158,0.5)] transition-all duration-300"
            >
              <Navigation className="w-4 h-4" />
              {t('directions')}
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
