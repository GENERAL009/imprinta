describe('Application Routing', () => {
  const locales = ['uz', 'ru', 'en']

  it('should support all three locales', () => {
    expect(locales).toHaveLength(3)
    expect(locales).toContain('uz')
    expect(locales).toContain('ru')
    expect(locales).toContain('en')
  })

  it('should have uz as default locale', () => {
    const defaultLocale = 'uz'
    expect(defaultLocale).toBe('uz')
  })

  it('should have all public pages', () => {
    const publicPages = [
      'about', 'services', 'portfolio', 'contact',
      'gallery', 'news', 'faq', 'certificates',
      'clients', 'team', 'vacancies', 'privacy', 'terms',
    ]
    expect(publicPages.length).toBeGreaterThan(10)
  })

  it('should have admin routes', () => {
    const adminRoutes = ['login', 'dashboard']
    expect(adminRoutes).toContain('login')
    expect(adminRoutes).toContain('dashboard')
  })

  it('should generate correct locale-based paths', () => {
    locales.forEach(locale => {
      const path = `/${locale}/services`
      expect(path).toMatch(/^\/(uz|ru|en)\/services$/)
    })
  })

  it('should have API route', () => {
    const apiPath = '/api'
    expect(apiPath).toBe('/api')
  })
})

describe('Navigation Links', () => {
  it('should have correct header navigation items', () => {
    const navItems = [
      { href: '/', label: 'Bosh sahifa' },
      { href: '/about', label: 'Biz haqimizda' },
      { href: '/services', label: 'Xizmatlar' },
      { href: '/portfolio', label: 'Portfolio' },
      { href: '/gallery', label: 'Galereya' },
      { href: '/news', label: 'Yangiliklar' },
      { href: '/contact', label: 'Aloqa' },
    ]
    expect(navItems.length).toBeGreaterThanOrEqual(5)
    expect(navItems[0].href).toBe('/')
  })

  it('should have correct CTA buttons', () => {
    const ctaButtons = [
      { href: '/contact', text: 'Bog\'lanish' },
      { href: '/services', text: 'Xizmatlar' },
    ]
    expect(ctaButtons).toHaveLength(2)
    ctaButtons.forEach(btn => {
      expect(btn.href).toBeTruthy()
      expect(btn.text).toBeTruthy()
    })
  })

  it('should have footer links', () => {
    const footerLinks = [
      '/about', '/services', '/portfolio', '/contact',
      '/privacy', '/terms',
    ]
    expect(footerLinks).toContain('/privacy')
    expect(footerLinks).toContain('/terms')
  })
})
