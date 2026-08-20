'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon, ChevronDown, Send } from 'lucide-react'
import { Link, usePathname, useRouter } from '@/i18n/routing'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import { useSettings } from '@/context/SettingsContext'

const navItems = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  { key: 'services', href: '/services' },
  { key: 'portfolio', href: '/portfolio' },
  { key: 'news', href: '/news' },
  { key: 'contact', href: '/contact' },
]

const locales = [
  { code: 'uz', label: "O'z" },
  { code: 'ru', label: 'Рус' },
  { code: 'en', label: 'Eng' },
]

interface SocialLink {
  id: string
  url: string
  label: string
  icon: string
}

export function Header() {
  const t = useTranslations('nav')
  const { setTheme, resolvedTheme } = useTheme()
  const { settings } = useSettings()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [socialOpen, setSocialOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const socialLinks: SocialLink[] = (settings['social.links'] && Array.isArray(settings['social.links']))
    ? settings['social.links'].filter((l: any) => l.url && l.url.trim())
    : []

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!langOpen) return
    const close = () => setLangOpen(false)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [langOpen])

  useEffect(() => {
    if (!socialOpen) return
    const close = () => setSocialOpen(false)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [socialOpen])

  const switchLocale = (newLocale: string) => {
    const currentPath = window.location.pathname
    const pathWithoutLocale = currentPath.replace(/^\/(uz|ru|en)/, '') || '/'
    window.location.href = `/${newLocale}${pathWithoutLocale}`
    setLangOpen(false)
  }

  const isDark = resolvedTheme === 'dark'
  const isHome = pathname === '/'
  const isOverVideo = isHome && !scrolled

  return (
    <motion.header
      initial={false}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled || !isHome
          ? 'py-3 glass-light dark:glass-dark'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container-main">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-10 flex items-center gap-3 group">
            <div className="relative w-[140px] h-[40px]">
              {mounted && (
                <Image
                  src={isDark || isOverVideo ? '/images/logo-white.svg' : '/images/logo-dark.svg'}
                  alt="ImPrinta"
                  fill
                  className="object-contain object-left"
                  priority
                />
              )}
            </div>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className={`relative px-5 py-2.5 rounded-full text-[14px] font-medium transition-all duration-300
                    ${pathname === item.href
                      ? 'text-brand-teal bg-brand-teal/[0.08]'
                      : isOverVideo
                        ? 'text-white/90 hover:text-white'
                        : 'text-brand-navy/80 dark:text-dark-text-secondary hover:text-brand-teal'
                    }`}
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Social Links Button */}
            {socialLinks.length > 0 && (
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setSocialOpen(!socialOpen)}
                  className={`p-2.5 rounded-full transition-all duration-300
                    ${isOverVideo
                      ? 'text-white/70 hover:text-white hover:bg-white/10'
                      : 'text-brand-navy/70 dark:text-dark-text-secondary hover:bg-brand-teal/[0.06] hover:text-brand-teal'
                    }`}
                  aria-label="Social media"
                >
                  <Send className="w-[18px] h-[18px]" />
                </button>
                <AnimatePresence>
                  {socialOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 p-1.5 rounded-2xl glass-light dark:glass-dark min-w-[180px]"
                    >
                      {socialLinks.map((link) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 hover:bg-gray-50 dark:hover:bg-white/5 text-light-text-secondary dark:text-dark-text-secondary hover:text-brand-teal"
                        >
                          {link.icon ? (
                            <img src={link.icon} alt="" className="w-5 h-5 object-contain" />
                          ) : (
                            <span className="w-5 h-5 rounded-full bg-brand-teal/20 block" />
                          )}
                          {link.label}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Language Switcher */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[13px] font-semibold transition-all duration-300
                  ${isOverVideo
                    ? 'text-white/70 hover:text-white hover:bg-white/10'
                    : 'text-brand-navy/70 dark:text-dark-text-secondary hover:bg-brand-teal/[0.06] hover:text-brand-teal'
                  }`}
              >
                {locales.find(l => l.code === locale)?.label}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 p-1.5 rounded-2xl glass-light dark:glass-dark min-w-[110px]"
                  >
                    {locales.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => switchLocale(l.code)}
                        className={`block w-full text-left px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                          locale === l.code
                            ? 'bg-brand-teal/10 text-brand-teal'
                            : 'hover:bg-gray-50 dark:hover:bg-white/5 text-light-text-secondary dark:text-dark-text-secondary'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            {mounted && (
              <motion.button
                whileTap={{ scale: 0.9, rotate: 180 }}
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className={`p-2.5 rounded-full transition-all duration-300
                  ${isOverVideo
                    ? 'text-white/70 hover:text-white hover:bg-white/10'
                    : 'text-brand-navy/70 dark:text-dark-text-secondary hover:bg-brand-teal/[0.06] hover:text-brand-teal'
                  }`}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
              </motion.button>
            )}

            {/* CTA */}
            <Link
              href="/contact"
              className="hidden md:inline-flex items-center gap-2 px-6 py-2.5 rounded-full
                bg-brand-teal text-white text-[13px] font-semibold
                shadow-[0_4px_20px_rgba(0,169,158,0.25)]
                hover:shadow-[0_8px_30px_rgba(0,169,158,0.4)]
                hover:-translate-y-0.5 transition-all duration-300"
            >
              {t('order')}
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2.5 rounded-full transition-all
                ${isOverVideo ? 'text-white hover:bg-white/10' : 'text-brand-navy dark:text-white hover:bg-brand-teal/[0.06]'}`}
              aria-label="Menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </div>


      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden border-t border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg"
          >
            <div className="container-main py-6 space-y-1">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3.5 rounded-2xl text-[15px] font-medium
                      text-light-text dark:text-dark-text
                      hover:bg-brand-teal/[0.06] hover:text-brand-teal transition-all"
                  >
                    {t(item.key)}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="block mt-4 btn-primary text-center"
              >
                {t('order')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
