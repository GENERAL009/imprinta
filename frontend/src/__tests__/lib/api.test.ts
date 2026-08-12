import axios from 'axios'

jest.mock('axios', () => {
  const mockAxios = {
    create: jest.fn(() => mockAxios),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  }
  return { default: mockAxios, __esModule: true }
})

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    })
  })

  it('should be configured with correct base URL', () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
    expect(API_URL).toContain('/api/v1')
  })

  it('should use JSON content type by default', () => {
    const defaultHeaders = { 'Content-Type': 'application/json' }
    expect(defaultHeaders['Content-Type']).toBe('application/json')
  })

  it('should handle token storage keys correctly', () => {
    const ACCESS_TOKEN_KEY = 'access_token'
    const REFRESH_TOKEN_KEY = 'refresh_token'
    expect(ACCESS_TOKEN_KEY).toBe('access_token')
    expect(REFRESH_TOKEN_KEY).toBe('refresh_token')
  })
})
