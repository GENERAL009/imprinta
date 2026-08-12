'use client'

import { useNationalIdentity } from '@/context/NationalIdentityContext'

interface PortfolioFrameProps {
  active?: boolean
}

export function PortfolioFrame({ active = false }: PortfolioFrameProps) {
  const { enabled } = useNationalIdentity()
  if (!enabled) return null

  return (
    <div
      className={`absolute inset-0 pointer-events-none transition-opacity duration-500 z-10 hidden sm:block ${active ? 'opacity-100' : 'opacity-0'}`}
      style={{ opacity: active ? 'var(--national-ornament-opacity)' : 0 }}
    >
      {/* Top-left: rounded arch corner from logo */}
      <svg className="absolute top-3 left-3 w-10 h-10" viewBox="0 0 40 40" fill="none">
        <path d="M4 20 L4 10 Q4 4 10 4 L20 4" stroke="var(--national-turquoise)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 4 Q10 8 12 4" stroke="var(--national-turquoise)" strokeWidth="0.6" />
        <path d="M5 9 L7 7 L9 9 L7 11 Z" fill="var(--national-gold)" />
      </svg>
      {/* Top-right: mirrored */}
      <svg className="absolute top-3 right-3 w-10 h-10" viewBox="0 0 40 40" fill="none">
        <path d="M20 4 L30 4 Q36 4 36 10 L36 20" stroke="var(--national-turquoise)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M28 4 Q30 8 32 4" stroke="var(--national-turquoise)" strokeWidth="0.6" />
        <path d="M31 9 L33 7 L35 9 L33 11 Z" fill="var(--national-gold)" />
      </svg>
      {/* Bottom-left */}
      <svg className="absolute bottom-3 left-3 w-10 h-10" viewBox="0 0 40 40" fill="none">
        <path d="M4 20 L4 30 Q4 36 10 36 L20 36" stroke="var(--national-turquoise)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 36 Q10 32 12 36" stroke="var(--national-turquoise)" strokeWidth="0.6" />
        <path d="M5 29 L7 31 L9 29 L7 27 Z" fill="var(--national-gold)" />
      </svg>
      {/* Bottom-right */}
      <svg className="absolute bottom-3 right-3 w-10 h-10" viewBox="0 0 40 40" fill="none">
        <path d="M36 20 L36 30 Q36 36 30 36 L20 36" stroke="var(--national-turquoise)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M28 36 Q30 32 32 36" stroke="var(--national-turquoise)" strokeWidth="0.6" />
        <path d="M31 29 L33 31 L35 29 L33 27 Z" fill="var(--national-gold)" />
      </svg>
    </div>
  )
}
