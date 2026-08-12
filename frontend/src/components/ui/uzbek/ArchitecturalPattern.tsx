'use client'

import { useNationalIdentity } from '@/context/NationalIdentityContext'

interface ArchitecturalPatternProps {
  className?: string
  variant?: 'light' | 'dark'
}

export function ArchitecturalPattern({ className = '', variant = 'light' }: ArchitecturalPatternProps) {
  const { enabled } = useNationalIdentity()
  if (!enabled) return null

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ opacity: 'var(--national-pattern-opacity)' }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={`imprinta-tile-${variant}`} x="0" y="0" width="140" height="140" patternUnits="userSpaceOnUse">
            {/* Central quatrefoil - derived from logo shape */}
            <path
              d="M70 30 Q82 30 82 42 L82 50 Q82 58 78 58 Q82 58 82 62 L82 70 Q82 82 70 82 Q58 82 58 70 L58 62 Q58 58 62 58 Q58 58 58 50 L58 42 Q58 30 70 30 Z"
              fill="none"
              stroke="var(--national-turquoise)"
              strokeWidth="0.7"
            />
            {/* Inner arches (logo's navy arches - top and bottom) */}
            <path d="M66 42 Q70 37 74 42 L74 48 Q70 53 66 48 Z" fill="none" stroke="var(--national-blue)" strokeWidth="0.5" />
            <path d="M66 64 Q70 69 74 64 L74 70 Q70 75 66 70 Z" fill="none" stroke="var(--national-blue)" strokeWidth="0.5" />
            {/* Side C-shapes (logo's interlocking C) */}
            <path d="M52 52 Q52 56 56 56 L56 60 Q52 60 52 64" fill="none" stroke="var(--national-blue)" strokeWidth="0.5" />
            <path d="M88 52 Q88 56 84 56 L84 60 Q88 60 88 64" fill="none" stroke="var(--national-blue)" strokeWidth="0.5" />
            {/* Diamond accents (logo's gold diamonds) */}
            <path d="M62 56 L64 54 L66 56 L64 58 Z" fill="var(--national-gold)" fillOpacity="0.7" />
            <path d="M74 56 L76 54 L78 56 L76 58 Z" fill="var(--national-gold)" fillOpacity="0.7" />
            <path d="M70 46 L72 44 L74 46 L72 48 Z" fill="var(--national-gold)" fillOpacity="0.5" />
            <path d="M70 66 L72 64 L74 66 L72 68 Z" fill="var(--national-gold)" fillOpacity="0.5" />
            {/* Corner dots */}
            <circle cx="0" cy="0" r="1.5" fill="var(--national-turquoise)" fillOpacity="0.3" />
            <circle cx="140" cy="0" r="1.5" fill="var(--national-turquoise)" fillOpacity="0.3" />
            <circle cx="0" cy="140" r="1.5" fill="var(--national-turquoise)" fillOpacity="0.3" />
            <circle cx="140" cy="140" r="1.5" fill="var(--national-turquoise)" fillOpacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#imprinta-tile-${variant})`} />
      </svg>
    </div>
  )
}
