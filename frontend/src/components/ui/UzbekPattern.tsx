'use client'

interface UzbekPatternProps {
  className?: string
  opacity?: number
}

export function UzbekPattern({ className = '', opacity = 0.03 }: UzbekPatternProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ opacity }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="uzbek-islimi" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            {/* Central medallion */}
            <circle cx="40" cy="40" r="12" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="40" cy="40" r="8" fill="none" stroke="currentColor" strokeWidth="0.3" />
            {/* Petal shapes */}
            <path d="M40 28 Q44 34 40 40 Q36 34 40 28Z" fill="currentColor" fillOpacity="0.3" />
            <path d="M40 52 Q44 46 40 40 Q36 46 40 52Z" fill="currentColor" fillOpacity="0.3" />
            <path d="M28 40 Q34 44 40 40 Q34 36 28 40Z" fill="currentColor" fillOpacity="0.3" />
            <path d="M52 40 Q46 44 40 40 Q46 36 52 40Z" fill="currentColor" fillOpacity="0.3" />
            {/* Corner dots */}
            <circle cx="0" cy="0" r="2" fill="currentColor" fillOpacity="0.2" />
            <circle cx="80" cy="0" r="2" fill="currentColor" fillOpacity="0.2" />
            <circle cx="0" cy="80" r="2" fill="currentColor" fillOpacity="0.2" />
            <circle cx="80" cy="80" r="2" fill="currentColor" fillOpacity="0.2" />
            {/* Diagonal connectors */}
            <path d="M0 0 Q20 10 28 28" fill="none" stroke="currentColor" strokeWidth="0.3" strokeOpacity="0.4" />
            <path d="M80 0 Q60 10 52 28" fill="none" stroke="currentColor" strokeWidth="0.3" strokeOpacity="0.4" />
            <path d="M0 80 Q20 70 28 52" fill="none" stroke="currentColor" strokeWidth="0.3" strokeOpacity="0.4" />
            <path d="M80 80 Q60 70 52 52" fill="none" stroke="currentColor" strokeWidth="0.3" strokeOpacity="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#uzbek-islimi)" />
      </svg>
    </div>
  )
}
