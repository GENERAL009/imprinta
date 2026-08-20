import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ImPrinta',
  description: 'Professional Printing Solutions',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
