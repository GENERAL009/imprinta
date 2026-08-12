'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useNationalIdentity } from '@/context/NationalIdentityContext'

export function HeroDecoration() {
  const { enabled } = useNationalIdentity()
  const prefersReducedMotion = useReducedMotion()
  if (!enabled) return null

  const fadeIn = prefersReducedMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
    : { initial: { opacity: 0 }, animate: { opacity: 1 } }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Right side - large quatrefoil composition from logo */}
      <motion.svg
        {...fadeIn}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute top-[15%] right-[-3%] w-[400px] h-[450px] hidden lg:block"
        style={{ opacity: 'var(--national-pattern-opacity)' }}
        viewBox="0 0 300 350"
        fill="none"
      >
        {/* Main quatrefoil */}
        <path
          d="M150 40 Q190 40 190 80 L190 110 Q190 130 170 130 Q190 130 190 150 L190 180 Q190 220 150 220 Q110 220 110 180 L110 150 Q110 130 130 130 Q110 130 110 110 L110 80 Q110 40 150 40 Z"
          stroke="var(--national-turquoise)"
          strokeWidth="1"
        />
        {/* Top arch */}
        <path d="M140 65 Q150 50 160 65 L160 85 Q150 100 140 85 Z" stroke="var(--national-blue)" strokeWidth="0.7" />
        {/* Bottom arch */}
        <path d="M140 175 Q150 190 160 175 L160 195 Q150 210 140 195 Z" stroke="var(--national-blue)" strokeWidth="0.7" />
        {/* Left C-shape */}
        <path d="M90 100 Q90 115 105 115 L105 145 Q90 145 90 160" stroke="var(--national-blue)" strokeWidth="0.6" />
        {/* Right C-shape */}
        <path d="M210 100 Q210 115 195 115 L195 145 Q210 145 210 160" stroke="var(--national-blue)" strokeWidth="0.6" />
        {/* Diamond accents */}
        <path d="M125 130 L130 125 L135 130 L130 135 Z" fill="var(--national-gold)" />
        <path d="M165 130 L170 125 L175 130 L170 135 Z" fill="var(--national-gold)" />
        <path d="M148 88 L150 86 L152 88 L150 90 Z" fill="var(--national-gold)" fillOpacity="0.7" />
        <path d="M148 172 L150 170 L152 172 L150 174 Z" fill="var(--national-gold)" fillOpacity="0.7" />
        {/* Extensions - rounded cross arms */}
        <path d="M150 25 Q155 25 155 30 L155 40" stroke="var(--national-turquoise)" strokeWidth="0.5" />
        <path d="M150 25 Q145 25 145 30 L145 40" stroke="var(--national-turquoise)" strokeWidth="0.5" />
        <path d="M150 235 Q155 235 155 230 L155 220" stroke="var(--national-turquoise)" strokeWidth="0.5" />
        <path d="M150 235 Q145 235 145 230 L145 220" stroke="var(--national-turquoise)" strokeWidth="0.5" />
        {/* Vertical extension below */}
        <line x1="150" y1="240" x2="150" y2="320" stroke="var(--national-turquoise)" strokeWidth="0.3" />
        <path d="M148 280 L150 278 L152 280 L150 282 Z" fill="var(--national-gold)" fillOpacity="0.4" />
      </motion.svg>

      {/* Left side - small interlocking geometry */}
      <motion.svg
        {...fadeIn}
        transition={{ duration: 2, delay: 1 }}
        className="absolute bottom-[20%] left-[-2%] w-[200px] h-[200px] hidden md:block"
        style={{ opacity: 'var(--national-pattern-opacity)' }}
        viewBox="0 0 160 160"
        fill="none"
      >
        {/* Interlocking C-shapes */}
        <path d="M50 50 Q50 65 65 65 L95 65 Q110 65 110 50" stroke="var(--national-turquoise)" strokeWidth="0.8" />
        <path d="M50 110 Q50 95 65 95 L95 95 Q110 95 110 110" stroke="var(--national-turquoise)" strokeWidth="0.8" />
        <path d="M50 50 Q65 50 65 65 L65 95 Q65 110 50 110" stroke="var(--national-blue)" strokeWidth="0.6" />
        <path d="M110 50 Q95 50 95 65 L95 95 Q95 110 110 110" stroke="var(--national-blue)" strokeWidth="0.6" />
        {/* Center diamonds */}
        <path d="M76 80 L80 75 L84 80 L80 85 Z" fill="var(--national-gold)" fillOpacity="0.6" />
        <path d="M70 70 L72 68 L74 70 L72 72 Z" fill="var(--national-gold)" fillOpacity="0.4" />
        <path d="M86 70 L88 68 L90 70 L88 72 Z" fill="var(--national-gold)" fillOpacity="0.4" />
        <path d="M70 90 L72 88 L74 90 L72 92 Z" fill="var(--national-gold)" fillOpacity="0.4" />
        <path d="M86 90 L88 88 L90 90 L88 92 Z" fill="var(--national-gold)" fillOpacity="0.4" />
      </motion.svg>

      {/* Floating diamond dots */}
      {!prefersReducedMotion && (
        <>
          <motion.div
            animate={{ y: [-4, 4, -4], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[35%] right-[12%] hidden lg:block"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1 L9 6 L6 11 L3 6 Z" fill="var(--national-gold)" fillOpacity="0.3" />
            </svg>
          </motion.div>
          <motion.div
            animate={{ y: [4, -4, 4], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[55%] right-[22%] hidden lg:block"
          >
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M4 0 L6 4 L4 8 L2 4 Z" fill="var(--national-turquoise)" fillOpacity="0.25" />
            </svg>
          </motion.div>
        </>
      )}
    </div>
  )
}
