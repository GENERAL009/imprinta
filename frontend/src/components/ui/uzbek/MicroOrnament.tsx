'use client'

import { useNationalIdentity } from '@/context/NationalIdentityContext'

interface MicroOrnamentProps {
  position?: 'left' | 'right' | 'both'
  className?: string
}

export function MicroOrnament({ position = 'both', className = '' }: MicroOrnamentProps) {
  const { enabled } = useNationalIdentity()
  if (!enabled) return null

  const ornament = (
    <svg
      className="w-5 h-5 inline-block"
      viewBox="0 0 20 20"
      fill="none"
      style={{ opacity: 'var(--national-ornament-opacity)' }}
    >
      {/* Mini quatrefoil from logo geometry */}
      <path d="M10 3 Q13 3 13 6 L13 8 Q13 10 11 10 Q13 10 13 12 L13 14 Q13 17 10 17 Q7 17 7 14 L7 12 Q7 10 9 10 Q7 10 7 8 L7 6 Q7 3 10 3 Z" fill="none" stroke="var(--national-turquoise)" strokeWidth="0.6" />
      {/* Center diamond */}
      <path d="M9 10 L10 8.5 L11 10 L10 11.5 Z" fill="var(--national-gold)" />
    </svg>
  )

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {(position === 'left' || position === 'both') && ornament}
      {(position === 'right' || position === 'both') && ornament}
    </span>
  )
}
