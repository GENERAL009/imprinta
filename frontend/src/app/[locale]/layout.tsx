import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { LayoutWrapper } from '@/components/layout/LayoutWrapper'
import { NationalIdentityProvider } from '@/context/NationalIdentityContext'
import { SettingsProvider } from '@/context/SettingsContext'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ImPrinta — Professional Printing Solutions',
  description: 'High quality printing services in Uzbekistan',
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <SettingsProvider>
              <NationalIdentityProvider>
                <LayoutWrapper>{children}</LayoutWrapper>
              </NationalIdentityProvider>
            </SettingsProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
