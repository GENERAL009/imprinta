'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface SiteSettingsContextType {
  nationalIdentity: boolean
  setNationalIdentity: (v: boolean) => void
  showClientLogos: boolean
  setShowClientLogos: (v: boolean) => void
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  nationalIdentity: true,
  setNationalIdentity: () => {},
  showClientLogos: true,
  setShowClientLogos: () => {},
})

const NATIONAL_KEY = 'imprinta-national-identity'
const LOGOS_KEY = 'imprinta-client-logos'

export function NationalIdentityProvider({ children }: { children: ReactNode }) {
  const [nationalIdentity, setNationalIdentity] = useState(true)
  const [showClientLogos, setShowClientLogos] = useState(true)

  useEffect(() => {
    const storedNational = localStorage.getItem(NATIONAL_KEY)
    if (storedNational !== null) setNationalIdentity(storedNational === 'true')

    const storedLogos = localStorage.getItem(LOGOS_KEY)
    if (storedLogos !== null) setShowClientLogos(storedLogos === 'true')
  }, [])

  const handleNational = (v: boolean) => {
    setNationalIdentity(v)
    localStorage.setItem(NATIONAL_KEY, String(v))
  }

  const handleLogos = (v: boolean) => {
    setShowClientLogos(v)
    localStorage.setItem(LOGOS_KEY, String(v))
  }

  return (
    <SiteSettingsContext.Provider value={{
      nationalIdentity,
      setNationalIdentity: handleNational,
      showClientLogos,
      setShowClientLogos: handleLogos,
    }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export function useNationalIdentity() {
  const { nationalIdentity: enabled, setNationalIdentity: setEnabled } = useContext(SiteSettingsContext)
  return { enabled, setEnabled }
}

export function useClientLogos() {
  const { showClientLogos, setShowClientLogos } = useContext(SiteSettingsContext)
  return { showClientLogos, setShowClientLogos }
}
