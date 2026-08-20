'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Send, Instagram, Facebook, Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import { FooterOrnament } from '@/components/ui/uzbek'
import { useSettings } from '@/context/SettingsContext'

export function Footer() {
  const t = useTranslations('footer')
  const nav = useTranslations('nav')
  const { settings } = useSettings()

  const phone1 = settings['contact_phone'] || settings['company_phone'] || settings['phone'] || '+998 90 123 45 67'
  const email = settings['contact_email'] || settings['company_email'] || settings['email'] || 'info@imprinta.uz'
  const address = settings['contact_address'] || settings['company_address_uz'] || settings['address'] || 'Toshkent, O\'zbekiston'
  const telegram = settings['social_telegram'] || settings['telegram'] || 'https://t.me/imprinta'
  const instagram = settings['social_instagram'] || settings['instagram'] || 'https://instagram.com/imprinta.uz'
  const facebook = settings['social_facebook'] || settings['facebook'] || '#'

  const socialLinks: Array<{ id: string; url: string; label: string; icon?: string }> = settings['social.links'] || []

  const services = [
    { name: 'Keng formatli bosma', href: '/services' },
    { name: 'Poligrafiya', href: '/services' },
    { name: 'Packaging', href: '/services' },
    { name: 'Brending', href: '/services' },
    { name: '3D reklama', href: '/services' },
    { name: 'Montaj xizmati', href: '/services' },
  ]

  const company = [
    { name: nav('about'), href: '/about' },
    { name: nav('portfolio'), href: '/portfolio' },
    { name: nav('news'), href: '/news' },
    { name: nav('contact'), href: '/contact' },
    { name: 'FAQ', href: '/faq' },
  ]

  return (
    <footer className="bg-brand-navy dark:bg-dark-bg border-t border-white/[0.05] relative overflow-hidden">
      <FooterOrnament />
      <div className="container-main py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="relative w-[130px] h-[36px] mb-6">
              <Image
                src="/images/logo-white.svg"
                alt="ImPrinta"
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="text-white/50 text-[14px] leading-relaxed mb-7">
              {t('description')}
            </p>
            <div className="flex items-center gap-2.5">
              {socialLinks.length > 0 ? (
                socialLinks.filter(l => l.url && l.url.trim()).map((link) => (
                  <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-brand-teal/20 border border-white/[0.06] hover:border-brand-teal/30 flex items-center justify-center text-white/40 hover:text-brand-teal transition-all duration-300" aria-label={link.label}>
                    {link.icon ? (
                      <img src={link.icon} alt="" className="w-5 h-5 object-contain" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </a>
                ))
              ) : (
                <>
                  <a href={telegram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-brand-teal/20 border border-white/[0.06] hover:border-brand-teal/30 flex items-center justify-center text-white/40 hover:text-brand-teal transition-all duration-300" aria-label="Telegram">
                    <Send className="w-4 h-4" />
                  </a>
                  <a href={instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-brand-teal/20 border border-white/[0.06] hover:border-brand-teal/30 flex items-center justify-center text-white/40 hover:text-brand-teal transition-all duration-300" aria-label="Instagram">
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a href={facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-brand-teal/20 border border-white/[0.06] hover:border-brand-teal/30 flex items-center justify-center text-white/40 hover:text-brand-teal transition-all duration-300" aria-label="Facebook">
                    <Facebook className="w-4 h-4" />
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold text-[14px] mb-6">{t('services')}</h4>
            <ul className="space-y-3.5">
              {services.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="group flex items-center gap-2 text-white/40 hover:text-brand-teal text-[13px] transition-colors duration-300">
                    <span>{item.name}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-[14px] mb-6">{t('company')}</h4>
            <ul className="space-y-3.5">
              {company.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="group flex items-center gap-2 text-white/40 hover:text-brand-teal text-[13px] transition-colors duration-300">
                    <span>{item.name}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-[14px] mb-6">{t('contacts')}</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-brand-teal/[0.08] flex items-center justify-center">
                  <Phone className="w-4 h-4 text-brand-teal" />
                </div>
                <span className="text-white/50 text-[13px]">{phone1}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-brand-teal/[0.08] flex items-center justify-center">
                  <Mail className="w-4 h-4 text-brand-teal" />
                </div>
                <span className="text-white/50 text-[13px]">{email}</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-brand-teal/[0.08] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-brand-teal" />
                </div>
                <span className="text-white/50 text-[13px] pt-2">{address}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/[0.05]">
        <div className="container-main py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-[12px]">
            &copy; {new Date().getFullYear()} ImPrinta. {t('rights')}
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-white/30 hover:text-brand-teal text-[12px] transition-colors duration-300">Privacy</Link>
            <Link href="/terms" className="text-white/30 hover:text-brand-teal text-[12px] transition-colors duration-300">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
