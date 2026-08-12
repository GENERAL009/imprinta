'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ArchitecturalPattern } from '@/components/ui/uzbek'

const faqKeys = ['1', '2', '3', '4', '5']

export function FAQ() {
  const t = useTranslations('faq')
  const [openId, setOpenId] = useState<string | null>('1')

  return (
    <section className="section-spacing bg-light-bg-alt dark:bg-dark-bg-alt relative" id="faq">
      <ArchitecturalPattern variant="dark" />
      <div className="container-main max-w-[800px]">
        <SectionHeader tag={t('tag')} title={t('title')} subtitle={t('subtitle')} />

        <div className="space-y-3">
          {faqKeys.map((key, i) => {
            const isOpen = openId === key
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className={`rounded-2xl border overflow-hidden transition-colors duration-300 ${
                  isOpen
                    ? 'border-brand-teal/20 bg-light-card dark:bg-dark-card shadow-lg shadow-brand-teal/[0.04]'
                    : 'border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card hover:border-brand-teal/10'
                }`}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : key)}
                  className="w-full flex items-center justify-between p-6 text-left group"
                >
                  <div className="flex items-center gap-4 pr-4">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
                      isOpen ? 'bg-brand-teal/10' : 'bg-light-bg-alt dark:bg-dark-bg-alt'
                    }`}>
                      <HelpCircle className={`w-4 h-4 transition-colors duration-300 ${
                        isOpen ? 'text-brand-teal' : 'text-light-text-secondary dark:text-dark-text-secondary'
                      }`} />
                    </div>
                    <span className={`text-[15px] font-semibold transition-colors duration-300 ${
                      isOpen ? 'text-brand-teal' : 'text-light-text dark:text-dark-text'
                    }`}>
                      {t(`q${key}`)}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className={`w-5 h-5 shrink-0 transition-colors duration-300 ${
                      isOpen ? 'text-brand-teal' : 'text-light-text-secondary dark:text-dark-text-secondary'
                    }`} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="px-6 pb-6 pl-[4.25rem] text-[14px] text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
                        {t(`a${key}`)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
