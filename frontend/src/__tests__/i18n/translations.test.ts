import fs from 'fs'
import path from 'path'

describe('Internationalization (i18n)', () => {
  const messagesDir = path.join(process.cwd(), 'messages')

  it('should have translation files for all locales', () => {
    const locales = ['uz', 'ru', 'en']
    locales.forEach(locale => {
      const filePath = path.join(messagesDir, `${locale}.json`)
      expect(fs.existsSync(filePath)).toBe(true)
    })
  })

  it('should have valid JSON in all translation files', () => {
    const locales = ['uz', 'ru', 'en']
    locales.forEach(locale => {
      const filePath = path.join(messagesDir, `${locale}.json`)
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8')
        expect(() => JSON.parse(content)).not.toThrow()
      }
    })
  })

  it('should have same top-level keys in all locale files', () => {
    const locales = ['uz', 'ru', 'en']
    const keysByLocale: Record<string, string[]> = {}

    locales.forEach(locale => {
      const filePath = path.join(messagesDir, `${locale}.json`)
      if (fs.existsSync(filePath)) {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        keysByLocale[locale] = Object.keys(content).sort()
      }
    })

    const localeKeys = Object.keys(keysByLocale)
    if (localeKeys.length >= 2) {
      const referenceKeys = keysByLocale[localeKeys[0]]
      localeKeys.slice(1).forEach(locale => {
        expect(keysByLocale[locale]).toEqual(referenceKeys)
      })
    }
  })

  it('should have hero section translations', () => {
    const locales = ['uz', 'ru', 'en']
    locales.forEach(locale => {
      const filePath = path.join(messagesDir, `${locale}.json`)
      if (fs.existsSync(filePath)) {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        expect(content).toHaveProperty('hero')
      }
    })
  })

  it('should have contact section translations', () => {
    const locales = ['uz', 'ru', 'en']
    locales.forEach(locale => {
      const filePath = path.join(messagesDir, `${locale}.json`)
      if (fs.existsSync(filePath)) {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        expect(content).toHaveProperty('contact')
      }
    })
  })

  it('should not have empty translation values', () => {
    const locales = ['uz', 'ru', 'en']
    locales.forEach(locale => {
      const filePath = path.join(messagesDir, `${locale}.json`)
      if (fs.existsSync(filePath)) {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        const checkEmpty = (obj: any, prefix: string) => {
          Object.entries(obj).forEach(([key, value]) => {
            if (typeof value === 'string') {
              expect(value.length).toBeGreaterThan(0)
            } else if (typeof value === 'object' && value !== null) {
              checkEmpty(value, `${prefix}.${key}`)
            }
          })
        }
        checkEmpty(content, locale)
      }
    })
  })
})
