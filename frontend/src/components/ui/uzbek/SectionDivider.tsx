'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useNationalIdentity } from '@/context/NationalIdentityContext'

interface SectionDividerProps {
  variant?: 'default' | 'gold' | 'teal'
  className?: string
}

export function SectionDivider({ variant = 'default', className = '' }: SectionDividerProps) {
  const { enabled } = useNationalIdentity()
  const prefersReducedMotion = useReducedMotion()
  if (!enabled) return null

  return (
    <div className={`relative w-full h-12 items-center justify-center overflow-hidden hidden sm:flex ${className}`}>
      <svg
        className="w-full max-w-[700px] h-12"
        viewBox="0 0 700 48"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        style={{ opacity: 'var(--national-ornament-opacity)' }}
      >
        {/* Left line with arch terminals */}
        <line x1="0" y1="24" x2="260" y2="24" stroke="var(--national-turquoise)" strokeWidth="0.8" />
        <path d="M255 20 Q260 16 265 20 L265 28 Q260 32 255 28 Z" fill="none" stroke="var(--national-turquoise)" strokeWidth="0.7" />

        {/* Right line with arch terminals */}
        <line x1="440" y1="24" x2="700" y2="24" stroke="var(--national-turquoise)" strokeWidth="0.8" />
        <path d="M435 20 Q440 16 445 20 L445 28 Q440 32 435 28 Z" fill="none" stroke="var(--national-turquoise)" strokeWidth="0.7" />

        {/* Central ornament - derived from logo's quatrefoil + arch geometry */}
        {prefersReducedMotion ? (
          <g>
            {/* Outer rounded quatrefoil frame */}
            <path d="M350 8 Q362 8 362 16 L362 20 Q362 24 358 24 Q362 24 362 28 L362 32 Q362 40 350 40 Q338 40 338 32 L338 28 Q338 24 342 24 Q338 24 338 20 L338 16 Q338 8 350 8 Z" fill="none" stroke="var(--national-turquoise)" strokeWidth="0.8" />
            {/* Inner arch shape (logo's navy arch) */}
            <path d="M346 18 Q350 14 354 18 L354 22 Q350 26 346 22 Z" fill="none" stroke="var(--national-blue)" strokeWidth="0.7" />
            <path d="M346 26 Q350 30 354 26 L354 30 Q350 34 346 30 Z" fill="none" stroke="var(--national-blue)" strokeWidth="0.7" />
            {/* Diamond accents */}
            <path d="M340 24 L342 22 L344 24 L342 26 Z" fill="var(--national-gold)" />
            <path d="M356 24 L358 22 L360 24 L358 26 Z" fill="var(--national-gold)" />
          </g>
        ) : (
          <motion.g
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '350px 24px' }}
          >
            <path d="M350 8 Q362 8 362 16 L362 20 Q362 24 358 24 Q362 24 362 28 L362 32 Q362 40 350 40 Q338 40 338 32 L338 28 Q338 24 342 24 Q338 24 338 20 L338 16 Q338 8 350 8 Z" fill="none" stroke="var(--national-turquoise)" strokeWidth="0.8" />
            <path d="M346 18 Q350 14 354 18 L354 22 Q350 26 346 22 Z" fill="none" stroke="var(--national-blue)" strokeWidth="0.7" />
            <path d="M346 26 Q350 30 354 26 L354 30 Q350 34 346 30 Z" fill="none" stroke="var(--national-blue)" strokeWidth="0.7" />
            <path d="M340 24 L342 22 L344 24 L342 26 Z" fill="var(--national-gold)" />
            <path d="M356 24 L358 22 L360 24 L358 26 Z" fill="var(--national-gold)" />
          </motion.g>
        )}

        {/* Small repeated arch motifs along lines */}
        <path d="M80 22 Q84 18 88 22" fill="none" stroke="var(--national-turquoise)" strokeWidth="0.5" />
        <path d="M170 22 Q174 18 178 22" fill="none" stroke="var(--national-turquoise)" strokeWidth="0.5" />
        <path d="M522 22 Q526 18 530 22" fill="none" stroke="var(--national-turquoise)" strokeWidth="0.5" />
        <path d="M612 22 Q616 18 620 22" fill="none" stroke="var(--national-turquoise)" strokeWidth="0.5" />

        {/* Tiny diamond dots */}
        <path d="M125 24 L127 22 L129 24 L127 26 Z" fill="var(--national-gold)" fillOpacity="0.6" />
        <path d="M571 24 L573 22 L575 24 L573 26 Z" fill="var(--national-gold)" fillOpacity="0.6" />
      </svg>
    </div>
  )
}
