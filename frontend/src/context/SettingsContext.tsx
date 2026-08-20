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
        setSettings(res.data || {})
      })
      .catch(() => {})
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
