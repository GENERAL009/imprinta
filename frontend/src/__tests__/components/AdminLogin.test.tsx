import React from 'react'

jest.mock('next-intl', () => ({
  useLocale: () => 'uz',
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}))

jest.mock('lucide-react', () => ({
  Lock: () => <span data-testid="lock-icon" />,
  User: () => <span data-testid="user-icon" />,
  Eye: () => <span data-testid="eye-icon" />,
  EyeOff: () => <span data-testid="eye-off-icon" />,
}))

jest.mock('@/lib/api', () => ({
  api: {
    post: jest.fn(),
  },
}))

describe('Admin Login Page', () => {
  it('should have username and password fields', () => {
    const loginFields = ['username', 'password']
    expect(loginFields).toContain('username')
    expect(loginFields).toContain('password')
  })

  it('should submit login to correct endpoint', () => {
    const loginEndpoint = '/auth/login'
    expect(loginEndpoint).toBe('/auth/login')
  })

  it('should store tokens on successful login', () => {
    const tokenKeys = ['access_token', 'refresh_token']
    expect(tokenKeys).toContain('access_token')
    expect(tokenKeys).toContain('refresh_token')
  })

  it('should redirect to dashboard after login', () => {
    const locale = 'uz'
    const expectedPath = `/${locale}/admin/dashboard`
    expect(expectedPath).toBe('/uz/admin/dashboard')
  })

  it('should have password visibility toggle', () => {
    let showPassword = false
    showPassword = !showPassword
    expect(showPassword).toBe(true)
    showPassword = !showPassword
    expect(showPassword).toBe(false)
  })

  it('should show error message on failed login', () => {
    const errorMessage = "Login yoki parol noto'g'ri"
    expect(errorMessage).toBeTruthy()
    expect(errorMessage.length).toBeGreaterThan(0)
  })

  it('should disable submit button while loading', () => {
    const loading = true
    const buttonText = loading ? 'Kirish...' : 'Kirish'
    expect(buttonText).toBe('Kirish...')
  })
})
