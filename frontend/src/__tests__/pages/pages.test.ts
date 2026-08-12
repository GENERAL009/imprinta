import fs from 'fs'
import path from 'path'

describe('Page Structure', () => {
  const pagesDir = path.join(process.cwd(), 'src', 'app', '[locale]')

  it('should have main page.tsx', () => {
    const mainPage = path.join(pagesDir, 'page.tsx')
    expect(fs.existsSync(mainPage)).toBe(true)
  })

  it('should have layout.tsx', () => {
    const layout = path.join(pagesDir, 'layout.tsx')
    expect(fs.existsSync(layout)).toBe(true)
  })

  it('should have all required page directories', () => {
    const requiredPages = [
      'about', 'services', 'portfolio', 'contact',
      'gallery', 'news', 'faq', 'certificates',
      'clients', 'team', 'vacancies', 'privacy', 'terms',
    ]
    requiredPages.forEach(page => {
      const pageDir = path.join(pagesDir, page)
      expect(fs.existsSync(pageDir)).toBe(true)
    })
  })

  it('should have admin section with login and dashboard', () => {
    const adminDir = path.join(pagesDir, 'admin')
    expect(fs.existsSync(adminDir)).toBe(true)
    expect(fs.existsSync(path.join(adminDir, 'login', 'page.tsx'))).toBe(true)
    expect(fs.existsSync(path.join(adminDir, 'dashboard', 'page.tsx'))).toBe(true)
  })
})

describe('Component Structure', () => {
  const componentsDir = path.join(process.cwd(), 'src', 'components')

  it('should have sections directory', () => {
    expect(fs.existsSync(path.join(componentsDir, 'sections'))).toBe(true)
  })

  it('should have layout directory', () => {
    expect(fs.existsSync(path.join(componentsDir, 'layout'))).toBe(true)
  })

  it('should have ui directory', () => {
    expect(fs.existsSync(path.join(componentsDir, 'ui'))).toBe(true)
  })

  it('should have all section components', () => {
    const sections = [
      'Hero.tsx', 'About.tsx', 'Services.tsx', 'Portfolio.tsx',
      'ContactForm.tsx', 'FAQ.tsx', 'TrustedBy.tsx', 'CTA.tsx',
      'Location.tsx', 'Marquee.tsx',
    ]
    sections.forEach(section => {
      const filePath = path.join(componentsDir, 'sections', section)
      expect(fs.existsSync(filePath)).toBe(true)
    })
  })

  it('should have layout components', () => {
    const layoutComponents = ['Header.tsx', 'Footer.tsx', 'LayoutWrapper.tsx', 'ThemeProvider.tsx']
    layoutComponents.forEach(component => {
      const filePath = path.join(componentsDir, 'layout', component)
      expect(fs.existsSync(filePath)).toBe(true)
    })
  })
})
