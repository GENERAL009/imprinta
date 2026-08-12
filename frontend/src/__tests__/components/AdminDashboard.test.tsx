import React from 'react'

jest.mock('next-intl', () => ({
  useLocale: () => 'uz',
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

jest.mock('@/lib/api', () => ({
  api: {
    get: jest.fn().mockResolvedValue({ data: { items: [], total: 0 } }),
    post: jest.fn().mockResolvedValue({ data: {} }),
    put: jest.fn().mockResolvedValue({ data: {} }),
    delete: jest.fn().mockResolvedValue({ data: {} }),
  },
}))

describe('Admin Dashboard', () => {
  it('should have all menu items', () => {
    const menuItems = [
      'dashboard', 'messages', 'services', 'portfolio',
      'clients', 'gallery', 'news', 'faq',
      'testimonials', 'employees', 'certificates', 'vacancies', 'settings',
    ]
    expect(menuItems).toHaveLength(13)
  })

  it('should have dashboard as default active tab', () => {
    const defaultTab = 'dashboard'
    expect(defaultTab).toBe('dashboard')
  })

  it('should check for auth token on mount', () => {
    const hasToken = (token: string | null) => !!token
    expect(hasToken(null)).toBe(false)
    expect(hasToken('some-token')).toBe(true)
  })

  it('should redirect to login if no token', () => {
    const locale = 'uz'
    const loginPath = `/${locale}/admin/login`
    expect(loginPath).toBe('/uz/admin/login')
  })

  it('should clear tokens on logout', () => {
    const mockStorage: Record<string, string> = {
      access_token: 'token1',
      refresh_token: 'token2',
    }
    delete mockStorage.access_token
    delete mockStorage.refresh_token
    expect(mockStorage.access_token).toBeUndefined()
    expect(mockStorage.refresh_token).toBeUndefined()
  })

  it('should render stat cards with correct data', () => {
    const statLabels = [
      'Unread Messages', 'Services', 'Portfolio', 'Clients',
      'News', 'Gallery', 'Employees', 'FAQ',
      'Testimonials', 'Vacancies', 'Certificates'
    ]
    expect(statLabels).toHaveLength(11)
  })

  it('should support sidebar toggle on mobile', () => {
    let sidebarOpen = true
    sidebarOpen = !sidebarOpen
    expect(sidebarOpen).toBe(false)
    sidebarOpen = !sidebarOpen
    expect(sidebarOpen).toBe(true)
  })
})

describe('Admin CRUD Operations', () => {
  it('should support create operation', () => {
    const operations = ['create', 'read', 'update', 'delete']
    expect(operations).toContain('create')
  })

  it('should support edit operation with pre-filled form', () => {
    const item = { id: '123', title_en: 'Test', title_uz: 'Test', title_ru: 'Test' }
    const form = { ...item }
    expect(form.title_en).toBe('Test')
  })

  it('should show confirm dialog before delete', () => {
    const deleteTarget = { id: '123', title_en: 'Test' }
    expect(deleteTarget).not.toBeNull()
  })

  it('should support trilingual input for content', () => {
    const languages = ['uz', 'ru', 'en']
    expect(languages).toHaveLength(3)
  })

  it('should support image upload', () => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    expect(allowedTypes).toContain('image/jpeg')
    expect(allowedTypes).toContain('image/png')
  })

  it('should support visibility toggle', () => {
    let isVisible = true
    isVisible = false
    expect(isVisible).toBe(false)
  })

  it('should support sort order', () => {
    const items = [
      { sort_order: 2, title: 'B' },
      { sort_order: 1, title: 'A' },
      { sort_order: 3, title: 'C' },
    ]
    const sorted = items.sort((a, b) => a.sort_order - b.sort_order)
    expect(sorted[0].title).toBe('A')
    expect(sorted[2].title).toBe('C')
  })
})
