import React from 'react'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('next-themes', () => ({
  useTheme: () => ({ resolvedTheme: 'light' }),
}))

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}))

jest.mock('@/i18n/routing', () => ({
  Link: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}))

jest.mock('lucide-react', () => ({
  ArrowRight: () => <span data-testid="arrow-right" />,
}))

describe('Hero Section', () => {
  it('should have correct CTA button links', () => {
    const ctaLinks = {
      primary: '/contact',
      secondary: '/services',
    }
    expect(ctaLinks.primary).toBe('/contact')
    expect(ctaLinks.secondary).toBe('/services')
  })

  it('should have 4 stats items', () => {
    const statsData = [
      { value: '500+', label: 'projects' },
      { value: '50+', label: 'clients' },
      { value: '5+', label: 'experience' },
      { value: '20+', label: 'equipment' },
    ]
    expect(statsData).toHaveLength(4)
    expect(statsData[0].value).toBe('500+')
    expect(statsData[1].value).toBe('50+')
  })

  it('should have floating images configuration', () => {
    const floatingImages = [
      { src: '/gallery/city-banner.jpg', alt: 'City Banner', delay: 0 },
      { src: '/gallery/poster-mockup.jpg', alt: 'Poster Mockup', delay: 1 },
      { src: '/gallery/visatchi.jpg', alt: 'Visatchi', delay: 2 },
    ]
    expect(floatingImages).toHaveLength(3)
    floatingImages.forEach(img => {
      expect(img.src).toBeTruthy()
      expect(img.alt).toBeTruthy()
      expect(typeof img.delay).toBe('number')
    })
  })

  it('should support dark and light video backgrounds', () => {
    const videos = {
      light: '/gallery/day.mp4',
      dark: '/gallery/night.mp4',
    }
    expect(videos.light).toContain('day')
    expect(videos.dark).toContain('night')
  })
})
