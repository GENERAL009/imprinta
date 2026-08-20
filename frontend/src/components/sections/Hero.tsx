'use client'

import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { useSettings } from '@/context/SettingsContext'

export function Hero() {
  const t = useTranslations('hero')
  const stats = useTranslations('stats')
  const { resolvedTheme } = useTheme()
  const { settings } = useSettings()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const statsValues = {
    projects: settings['stats_projects'] || '500+',
    clients: settings['stats_clients'] || '50+',
    experience: settings['stats_experience'] || '5+',
    equipment: settings['stats_equipment'] || '20+',
  }

  const isDark = resolvedTheme === 'dark'

  const statsData = [
    { value: statsValues.projects, label: stats('projects') },
    { value: statsValues.clients, label: stats('clients') },
    { value: statsValues.experience, label: stats('experience') },
    { value: statsValues.equipment, label: stats('equipment') },
  ]


  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Video Background - covers top 70% */}
      <div className="absolute inset-x-0 top-0 h-[70vh] overflow-hidden">
        {mounted && (
          <video
            key={isDark ? 'night' : 'day'}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source
              src={isDark ? '/gallery/night.mp4' : '/gallery/day.mp4'}
              type="video/mp4"
            />
          </video>
        )}

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50 dark:bg-black/60" />

        {/* Gradient fade at the bottom of video area */}
        <div className="absolute inset-x-0 bottom-0 h-[200px] bg-gradient-to-t from-light-bg-alt dark:from-dark-bg to-transparent" />
      </div>


      {/* Animated Background Elements (visible below video) */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-light-bg-alt to-light-bg-alt dark:via-dark-bg dark:to-dark-bg" />

        {/* Gradient orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[60%] right-[10%] w-[500px] h-[500px] rounded-full bg-brand-teal/[0.06] dark:bg-brand-teal/[0.08] blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-brand-navy/[0.04] dark:bg-brand-teal/[0.04] blur-[80px]"
        />

        {/* Subtle grid pattern in lower area */}
        <div className="absolute inset-0 top-[70vh] bg-[linear-gradient(rgba(0,169,158,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,169,158,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(0,169,158,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,169,158,0.04)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      {/* Main Content */}
      <div className="container-main w-full pt-32 pb-8 lg:pt-40 lg:pb-12 flex-1 flex items-center relative z-10">
        <div className="flex items-start justify-between w-full">
        <div className="max-w-3xl">
          {/* Text Content */}
          <div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="text-[2.75rem] sm:text-[3.5rem] md:text-[4rem] lg:text-[4.5rem] font-extrabold leading-[1.05] tracking-tight mb-7 text-white drop-shadow-lg"
            >
              {t('title')}{' '}
              <span className="text-white">
                {t('titleHighlight')}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-[17px] md:text-[18px] leading-relaxed text-white/80 dark:text-white/70 mb-10 max-w-[540px] drop-shadow-sm"
            >
              {t('subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap items-center gap-4 mb-16"
            >
              <Link href="/contact" className="btn-primary group">
                {t('cta')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link href="/services" className="btn-secondary !border-black/50 !text-black dark:!border-white dark:!text-white hover:!bg-white/10 hover:!border-brand-teal hover:!text-brand-teal">
                {t('ctaSecondary')}
              </Link>
            </motion.div>

          </div>

        </div>

        {/* Logo - right side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hidden md:flex items-start justify-center flex-shrink-0 ml-8 lg:ml-16 xl:ml-24 pt-2 lg:pt-4"
        >
          <motion.img
            src="/logo.png"
            alt="ImPrinta"
            animate={{
              y: [0, -12, 0],
              rotate: [0, 3, 0, -3, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-48 h-48 md:w-56 md:h-56 lg:w-72 lg:h-72 xl:w-80 xl:h-80 drop-shadow-2xl"
          />
        </motion.div>
        </div>
      </div>

      {/* Logo - mobile (below content) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="md:hidden flex justify-center relative z-10 -mt-8 mb-4"
      >
        <motion.img
          src="/logo.png"
          alt="ImPrinta"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 3, 0, -3, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-24 h-24 drop-shadow-2xl"
        />
      </motion.div>

      {/* Scroll indicator - fixed at bottom of viewport, hides on scroll */}
      <AnimatePresence>
        {!scrolled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.5, duration: 0.3 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2"
            >
              <div className="w-1.5 h-3 rounded-full bg-white/60" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="relative z-10 mt-auto"
      >
        <div className="container-main w-full pb-20">
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-brand-teal via-brand-gold to-brand-teal opacity-60" />

            <div className="backdrop-blur-xl bg-[#edf0f4]/90 dark:bg-dark-card/80 border border-light-border dark:border-dark-border px-8 py-7 shadow-xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {statsData.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 + i * 0.1 }}
                    className="relative text-center md:text-left"
                  >
                    {i > 0 && (
                      <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-10 bg-gradient-to-b from-transparent via-brand-teal/30 to-transparent" />
                    )}
                    <div className={i > 0 ? 'md:pl-6' : ''}>
                      <div className="text-3xl md:text-4xl font-extrabold text-brand-navy dark:text-white">
                        {stat.value}
                      </div>
                      <div className="text-[13px] md:text-[14px] text-light-text-secondary dark:text-dark-text-secondary mt-1.5 font-medium uppercase tracking-wide">
                        {stat.label}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
          </div>
        </div>
      </motion.div>

    </section>
  )
}
