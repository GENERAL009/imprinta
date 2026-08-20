'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api } from '@/lib/api'

interface SettingsContextType {
  settings: Record<string, any>
  loading: boolean
}

const SettingsContext = createContext<SettingsContextType>({
  settings: {},
  loading: true,
})

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/settings')
      .then(res => {
        const data = res.data || {}
        console.log('[SettingsContext] Loaded settings:', data)
        setSettings(data)
      })
      .catch((err) => {
        console.error('[SettingsContext] Failed to load settings:', err)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
