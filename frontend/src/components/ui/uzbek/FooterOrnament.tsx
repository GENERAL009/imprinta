'use client'

import { useNationalIdentity } from '@/context/NationalIdentityContext'

export function FooterOrnament() {
  const { enabled } = useNationalIdentity()
  if (!enabled) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Top border - interlocking arch chain derived from logo */}
      <svg
        className="absolute inset-x-0 top-0 w-full h-5"
        viewBox="0 0 1200 20"
        fill="none"
        preserveAspectRatio="none"
        style={{ opacity: 'var(--national-border-opacity)' }}
      >
        {/* Repeating arch pattern from logo geometry */}
        {Array.from({ length: 30 }).map((_, i) => (
          <g key={i}>
            <path
              d={`M${i * 40} 14 Q${i * 40 + 10} 4 ${i * 40 + 20} 14 Q${i * 40 + 30} 4 ${i * 40 + 40} 14`}
              stroke="var(--national-turquoise)"
              strokeWidth="0.6"
            />
            <path
              d={`M${i * 40 + 18} 10 L${i * 40 + 20} 8 L${i * 40 + 22} 10 L${i * 40 + 20} 12 Z`}
              fill="var(--national-gold)"
              fillOpacity="0.5"
            />
          </g>
        ))}
      </svg>

      {/* Bottom-right - large quatrefoil from logo */}
      <svg
        className="absolute bottom-8 right-8 w-[180px] h-[180px] hidden lg:block"
        viewBox="0 0 180 180"
        fill="none"
        style={{ opacity: 'calc(var(--national-pattern-opacity) * 1.5)' }}
      >
        {/* Outer quatrefoil shape */}
        <path
          d="M90 20 Q120 20 120 50 L120 65 Q120 75 110 75 Q120 75 120 85 L120 100 Q120 130 90 130 Q60 130 60 100 L60 85 Q60 75 70 75 Q60 75 60 65 L60 50 Q60 20 90 20 Z"
          stroke="var(--national-turquoise)"
          strokeWidth="1"
        />
        {/* Top arch */}
        <path d="M82 40 Q90 30 98 40 L98 52 Q90 62 82 52 Z" stroke="var(--national-blue)" strokeWidth="0.7" />
        {/* Bottom arch */}
        <path d="M82 98 Q90 108 98 98 L98 110 Q90 120 82 110 Z" stroke="var(--national-blue)" strokeWidth="0.7" />
        {/* Left C-shape */}
        <path d="M50 62 Q50 70 58 70 L58 80 Q50 80 50 88" stroke="var(--national-blue)" strokeWidth="0.6" />
        {/* Right C-shape */}
        <path d="M130 62 Q130 70 122 70 L122 80 Q130 80 130 88" stroke="var(--national-blue)" strokeWidth="0.6" />
        {/* Diamond accents */}
        <path d="M72 75 L76 71 L80 75 L76 79 Z" fill="var(--national-gold)" />
        <path d="M100 75 L104 71 L108 75 L104 79 Z" fill="var(--national-gold)" />
        <path d="M88 55 L90 53 L92 55 L90 57 Z" fill="var(--national-gold)" fillOpacity="0.7" />
        <path d="M88 95 L90 93 L92 95 L90 97 Z" fill="var(--national-gold)" fillOpacity="0.7" />
        {/* Outer rounded cross extensions */}
        <path d="M90 10 Q95 10 95 15 L95 20" stroke="var(--national-turquoise)" strokeWidth="0.5" />
        <path d="M90 10 Q85 10 85 15 L85 20" stroke="var(--national-turquoise)" strokeWidth="0.5" />
        <path d="M90 140 Q95 140 95 135 L95 130" stroke="var(--national-turquoise)" strokeWidth="0.5" />
        <path d="M90 140 Q85 140 85 135 L85 130" stroke="var(--national-turquoise)" strokeWidth="0.5" />
      </svg>

      {/* Bottom-left - small interlocking C-shapes */}
      <svg
        className="absolute bottom-12 left-8 w-[90px] h-[90px] hidden md:block"
        viewBox="0 0 90 90"
        fill="none"
        style={{ opacity: 'calc(var(--national-pattern-opacity) * 2)' }}
      >
        {/* Interlocking C-shapes from logo */}
        <path d="M25 30 Q25 40 35 40 L55 40 Q65 40 65 30" stroke="var(--national-turquoise)" strokeWidth="0.8" />
        <path d="M25 60 Q25 50 35 50 L55 50 Q65 50 65 60" stroke="var(--national-turquoise)" strokeWidth="0.8" />
        <path d="M30 25 Q40 25 40 35 L40 55 Q40 65 30 65" stroke="var(--national-blue)" strokeWidth="0.6" />
        <path d="M60 25 Q50 25 50 35 L50 55 Q50 65 60 65" stroke="var(--national-blue)" strokeWidth="0.6" />
        {/* Center diamond */}
        <path d="M43 45 L45 42 L47 45 L45 48 Z" fill="var(--national-gold)" />
      </svg>
    </div>
  )
}
