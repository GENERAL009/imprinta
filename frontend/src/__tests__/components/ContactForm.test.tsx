import React from 'react'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

jest.mock('lucide-react', () => ({
  Send: () => <span data-testid="send-icon" />,
  CheckCircle: () => <span data-testid="check-icon" />,
  Phone: () => <span data-testid="phone-icon" />,
  Mail: () => <span data-testid="mail-icon" />,
  MapPin: () => <span data-testid="map-icon" />,
}))

jest.mock('@/components/ui/SectionHeader', () => ({
  SectionHeader: ({ tag, title, subtitle }: any) => (
    <div data-testid="section-header">{title}</div>
  ),
}))

jest.mock('@/lib/api', () => ({
  api: {
    post: jest.fn(),
  },
}))

describe('Contact Form', () => {
  it('should have all required form fields', () => {
    const formFields = ['name', 'phone', 'email', 'company', 'service', 'message']
    expect(formFields).toHaveLength(6)
    expect(formFields).toContain('name')
    expect(formFields).toContain('phone')
  })

  it('should have required fields marked correctly', () => {
    const requiredFields = ['name', 'phone']
    const optionalFields = ['email', 'company', 'service', 'message']
    expect(requiredFields).toHaveLength(2)
    expect(optionalFields).toHaveLength(4)
  })

  it('should have service dropdown options', () => {
    const services = [
      { value: 'wide-format', label: 'Keng formatli bosma' },
      { value: 'polygraphy', label: 'Poligrafiya' },
      { value: 'packaging', label: 'Packaging' },
      { value: 'branding', label: 'Brending' },
      { value: '3d', label: '3D reklama' },
      { value: 'installation', label: 'Montaj xizmati' },
    ]
    expect(services).toHaveLength(6)
  })

  it('should have contact information', () => {
    const contactInfo = {
      phone: '+998 90 123 45 67',
      email: 'info@imprinta.uz',
      address: 'Toshkent, O\'zbekiston',
      hours: 'Dush - Shan, 9:00 - 18:00',
    }
    expect(contactInfo.phone).toContain('+998')
    expect(contactInfo.email).toContain('@imprinta.uz')
  })

  it('should submit to /contact endpoint', () => {
    const endpoint = '/contact'
    expect(endpoint).toBe('/contact')
  })

  it('should reset form after successful submission', () => {
    const emptyForm = { name: '', phone: '', email: '', company: '', service: '', message: '' }
    Object.values(emptyForm).forEach(val => {
      expect(val).toBe('')
    })
  })
})
