'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Send, CheckCircle, Phone, Mail, MapPin } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { api } from '@/lib/api'
import { useSettings } from '@/context/SettingsContext'

export function ContactForm() {
  const t = useTranslations('contact')
  const { settings } = useSettings()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    service: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/contact', form)
      setSuccess(true)
      setForm({ name: '', phone: '', email: '', company: '', service: '', message: '' })
      setTimeout(() => setSuccess(false), 5000)
    } catch {
      // handle error
    } finally {
      setLoading(false)
    }
  }

  const inputClasses = `w-full px-5 py-4 rounded-2xl
    bg-light-card dark:bg-dark-card
    border border-light-border dark:border-dark-border
    text-[14px] text-light-text dark:text-dark-text
    placeholder:text-light-text-secondary/50 dark:placeholder:text-dark-text-secondary/50
    focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal/40
    transition-all duration-300`

  return (
    <section className="section-spacing relative overflow-hidden" id="contact">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-brand-teal/[0.02] blur-[120px] -z-10" />

      <div className="container-main">
        <SectionHeader tag={t('tag')} title={t('title')} subtitle={t('subtitle')} />

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <div className="p-6 rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-teal/[0.08] flex items-center justify-center">
                  <Phone className="w-5 h-5 text-brand-teal" />
                </div>
                <div>
                  <p className="text-[13px] text-light-text-secondary dark:text-dark-text-secondary mb-1">{t('phoneLabel')}</p>
                  <p className="text-[15px] font-semibold text-light-text dark:text-dark-text">
                    {settings['contact_phone'] || settings['company_phone'] || settings['phone'] || '+998 90 123 45 67'}
                    {(settings['contact_phone2'] || settings['phone2']) && (
                      <><br />{settings['contact_phone2'] || settings['phone2']}</>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-teal/[0.08] flex items-center justify-center">
                  <Mail className="w-5 h-5 text-brand-teal" />
                </div>
                <div>
                  <p className="text-[13px] text-light-text-secondary dark:text-dark-text-secondary mb-1">{t('emailLabel')}</p>
                  <p className="text-[15px] font-semibold text-light-text dark:text-dark-text">{settings['contact_email'] || settings['company_email'] || settings['email'] || 'info@imprinta.uz'}</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-teal/[0.08] flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-brand-teal" />
                </div>
                <div>
                  <p className="text-[13px] text-light-text-secondary dark:text-dark-text-secondary mb-1">{t('addressLabel')}</p>
                  <p className="text-[15px] font-semibold text-light-text dark:text-dark-text">{settings['contact_address'] || settings['company_address_uz'] || settings['address'] || t('address')}</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-teal/[0.06] to-brand-teal/[0.02] border border-brand-teal/10">
              <p className="text-[14px] leading-relaxed text-light-text-secondary dark:text-dark-text-secondary">
                {t('workingHours')}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {success ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center justify-center h-full py-16 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-brand-teal/10 flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10 text-brand-teal" />
                </div>
                <p className="text-xl font-bold mb-2 text-light-text dark:text-dark-text">{t('success')}</p>
                <p className="text-[14px] text-light-text-secondary dark:text-dark-text-secondary">{t('successSub')}</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder={t('name')}
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClasses}
                  />
                  <input
                    type="tel"
                    placeholder={t('phone')}
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={inputClasses}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="email"
                    placeholder={t('email')}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClasses}
                  />
                  <input
                    type="text"
                    placeholder={t('company')}
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className={inputClasses}
                  />
                </div>
                <select
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                  className={`${inputClasses} appearance-none`}
                >
                  <option value="">{t('selectService')}</option>
                  <option value="wide-format">{t('serviceWideFormat')}</option>
                  <option value="polygraphy">{t('servicePolygraphy')}</option>
                  <option value="packaging">{t('servicePackaging')}</option>
                  <option value="branding">{t('serviceBranding')}</option>
                  <option value="3d">{t('service3d')}</option>
                  <option value="installation">{t('serviceInstallation')}</option>
                </select>
                <textarea
                  placeholder={t('message')}
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={`${inputClasses} resize-none`}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  <Send className="w-4 h-4" />
                  {loading ? '...' : t('submit')}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
