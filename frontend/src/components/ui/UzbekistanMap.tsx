'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useLocale, useTranslations } from 'next-intl'
import { X, ChevronLeft, ChevronRight, Building2 } from 'lucide-react'
import { regions, SVG_VIEWBOX } from '@/assets/maps/uzbekistan-regions'
import type { RegionData } from '@/assets/maps/uzbekistan-regions'
import { api } from '@/lib/api'

interface RegionClientItem {
  id: string
  region_id: string
  client_id: string
  description_uz?: string
  description_ru?: string
  description_en?: string
  image?: string
  client?: {
    id: string
    name: string
    logo?: string
    website?: string
  }
}

interface UzbekistanMapProps {
  className?: string
}

function resolveImageUrl(url: string): string {
  if (!url) return ''
  if (url.startsWith('http')) return url
  const base = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8000'
  return `${base}${url}`
}

export function UzbekistanMap({ className = '' }: UzbekistanMapProps) {
  const [activeRegion, setActiveRegion] = useState<string | null>(null)
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  const [regionClients, setRegionClients] = useState<RegionClientItem[]>([])
  const [loadingClients, setLoadingClients] = useState(false)
  const [selectedClient, setSelectedClient] = useState<RegionClientItem | null>(null)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const locale = useLocale()
  const tMap = useTranslations('map')

  useEffect(() => { setMounted(true) }, [])

  const isDark = mounted && resolvedTheme === 'dark'
  const tooltipRegion = hoveredRegion || activeRegion
  const tooltipData = regions.find((r: RegionData) => r.id === tooltipRegion)

  const fetchRegionClients = useCallback(async (regionId: string) => {
    setLoadingClients(true)
    try {
      const res = await api.get(`/region-clients/by-region/${regionId}`)
      const items = Array.isArray(res.data) ? res.data : res.data.items || []
      setRegionClients(items)
    } catch {
      setRegionClients([])
    } finally {
      setLoadingClients(false)
    }
  }, [])

  const handleRegionClick = (region: RegionData) => {
    if (activeRegion === region.id) {
      setActiveRegion(null)
      setRegionClients([])
      setSelectedClient(null)
    } else {
      setActiveRegion(region.id)
      setSelectedClient(null)
      fetchRegionClients(region.id)
    }
  }

  const getDescription = (item: RegionClientItem) => {
    if (locale === 'ru') return item.description_ru || item.description_uz || item.description_en || ''
    if (locale === 'en') return item.description_en || item.description_uz || ''
    return item.description_uz || item.description_en || ''
  }

  const getCarouselImages = (item: RegionClientItem): string[] => {
    const images: string[] = []
    if (item.client?.logo) images.push(resolveImageUrl(item.client.logo))
    if (item.image) images.push(resolveImageUrl(item.image))
    return images
  }

  useEffect(() => {
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (!selectedClient) {
          setActiveRegion(null)
          setRegionClients([])
        }
      }
    }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('touchstart', handleOutside)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
    }
  }, [selectedClient])

  const regionFill = isDark ? '#162040' : '#c4d4e4'
  const regionStroke = isDark ? '#263860' : '#8ea8c4'
  const activeFill = '#00a99e'
  const activeStroke = '#00c9bc'
  const shadowFill = isDark ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.1)'

  const getTooltipStyle = (region: RegionData) => {
    const leftPct = (region.cx / 800) * 100
    const topPct = ((region.cy - 40) / 390) * 100
    let transform = 'translateX(-50%)'
    if (leftPct > 85) transform = 'translateX(-90%)'
    else if (leftPct < 15) transform = 'translateX(-10%)'
    return { left: `${leftPct}%`, top: `${Math.max(2, topPct)}%`, transform }
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative rounded-[2rem] bg-gradient-to-br from-[#edf2f7] to-[#dde4ed] dark:from-[#0c1528] dark:to-[#081020] border border-light-border dark:border-white/[0.06] shadow-xl dark:shadow-2xl dark:shadow-brand-teal/[0.04] p-4 sm:p-6 md:p-8">
        <div className="absolute inset-0 rounded-[2rem] overflow-hidden opacity-30 dark:opacity-40 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,169,158,0.15) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />

        <div className="absolute top-5 left-5 w-10 h-10 rounded-full border border-dashed border-brand-teal/20 dark:border-brand-teal/30 hidden sm:block" />

        <svg
          ref={svgRef}
          viewBox={SVG_VIEWBOX}
          className="relative w-full h-auto"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="region-depth">
              <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.15" />
            </filter>
            <filter id="region-active-glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feFlood floodColor="#00a99e" floodOpacity="0.4" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {regions.map((region: RegionData) => {
            const isActive = activeRegion === region.id
            return (
              <g key={region.id}>
                <path
                  d={region.path}
                  fill={shadowFill}
                  transform="translate(1.5, 3)"
                  strokeWidth="0"
                />
                <motion.path
                  d={region.path}
                  fill={isActive ? activeFill : regionFill}
                  stroke={isActive ? activeStroke : regionStroke}
                  strokeWidth={isActive ? 1.5 : 0.6}
                  strokeLinejoin="round"
                  className="cursor-pointer"
                  initial={false}
                  animate={
                    isActive && !prefersReducedMotion
                      ? { y: -2 }
                      : { y: 0 }
                  }
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  filter={isActive ? 'url(#region-active-glow)' : 'url(#region-depth)'}
                  onMouseEnter={() => setHoveredRegion(region.id)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  onClick={() => handleRegionClick(region)}
                  onTouchEnd={(e) => {
                    e.preventDefault()
                    handleRegionClick(region)
                  }}
                />
              </g>
            )
          })}

          <AnimatePresence>
            {tooltipData && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <line
                  x1={tooltipData.cx}
                  y1={tooltipData.cy - 10}
                  x2={tooltipData.cx}
                  y2={tooltipData.cy - 30}
                  stroke="#00a99e"
                  strokeWidth="1.2"
                  strokeDasharray="3 2"
                />
                <circle
                  cx={tooltipData.cx}
                  cy={tooltipData.cy - 10}
                  r="2.5"
                  fill="#00a99e"
                  stroke="#fff"
                  strokeWidth="0.8"
                />
              </motion.g>
            )}
          </AnimatePresence>
        </svg>

        {/* Region name tooltip - outside overflow-hidden */}
        <AnimatePresence>
          {tooltipData && (
            <motion.div
              key={tooltipData.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              className="absolute pointer-events-none z-20"
              style={getTooltipStyle(tooltipData)}
            >
              <div className="px-4 py-2 rounded-xl bg-white/95 dark:bg-[#162040]/95 backdrop-blur-sm border border-gray-200 dark:border-white/10 shadow-lg shadow-black/10 dark:shadow-black/30 text-[12px] sm:text-[13px] font-semibold text-brand-navy dark:text-white whitespace-nowrap">
                {tooltipData.name}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Region Clients Slide-Up Panel */}
      <AnimatePresence>
        {activeRegion && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 rounded-2xl bg-white/95 dark:bg-[#0f1a35]/95 backdrop-blur-md border border-gray-200 dark:border-white/[0.08] shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-white/[0.06]">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                {regions.find(r => r.id === activeRegion)?.name || activeRegion}
                {regionClients.length > 0 && (
                  <span className="ml-2 text-xs font-normal text-gray-400">({regionClients.length})</span>
                )}
              </h3>
              <button
                onClick={() => { setActiveRegion(null); setRegionClients([]); setSelectedClient(null) }}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {loadingClients ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" />
              </div>
            ) : regionClients.length === 0 ? (
              <div className="text-center py-8 px-4">
                <Building2 className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {tMap('noClients')}
                </p>
              </div>
            ) : (
              <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[240px] overflow-y-auto">
                {regionClients.map((item, i) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    onClick={() => { setSelectedClient(item); setCarouselIndex(0) }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.06] hover:border-brand-teal/40 hover:bg-brand-teal/[0.03] transition-all text-left group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {item.client?.logo ? (
                        <img src={resolveImageUrl(item.client.logo)} alt="" className="max-w-full max-h-full object-contain p-1" />
                      ) : (
                        <Building2 className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-brand-teal transition-colors">
                        {item.client?.name || 'Client'}
                      </p>
                      {getDescription(item) && (
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{getDescription(item)}</p>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Client Detail Modal */}
      <AnimatePresence>
        {selectedClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedClient(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-3xl bg-white dark:bg-[#111b38] rounded-2xl shadow-2xl border border-gray-200 dark:border-white/[0.08] overflow-hidden max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedClient(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-sm hover:bg-white dark:hover:bg-black/60 transition-colors"
              >
                <X className="w-5 h-5 text-gray-700 dark:text-white" />
              </button>

              <div className="flex flex-col md:flex-row">
                {/* Image Carousel (Left) */}
                <div className="md:w-1/2 relative bg-gray-50 dark:bg-white/[0.03]">
                  {(() => {
                    const images = getCarouselImages(selectedClient)
                    if (images.length === 0) return (
                      <div className="w-full aspect-square flex items-center justify-center">
                        <Building2 className="w-16 h-16 text-gray-200 dark:text-gray-700" />
                      </div>
                    )
                    return (
                      <div className="relative w-full aspect-square">
                        <img
                          src={images[carouselIndex]}
                          alt=""
                          className="w-full h-full object-contain p-6"
                        />
                        {images.length > 1 && (
                          <>
                            <button
                              onClick={() => setCarouselIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-sm hover:bg-white dark:hover:bg-black/60 transition-colors shadow-md"
                            >
                              <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-white" />
                            </button>
                            <button
                              onClick={() => setCarouselIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-sm hover:bg-white dark:hover:bg-black/60 transition-colors shadow-md"
                            >
                              <ChevronRight className="w-5 h-5 text-gray-700 dark:text-white" />
                            </button>
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                              {images.map((_, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setCarouselIndex(idx)}
                                  className={`w-2 h-2 rounded-full transition-all ${idx === carouselIndex ? 'bg-brand-teal w-5' : 'bg-gray-300 dark:bg-gray-600'}`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })()}
                </div>

                {/* Text Content (Right) */}
                <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedClient.client?.name || 'Client'}
                  </h2>
                  <p className="text-xs text-brand-teal font-medium mb-4">
                    {regions.find(r => r.id === selectedClient.region_id)?.name}
                  </p>
                  {getDescription(selectedClient) && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6 whitespace-pre-line">
                      {getDescription(selectedClient)}
                    </p>
                  )}
                  {selectedClient.client?.website && (
                    <a
                      href={selectedClient.client.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-brand-teal hover:underline font-medium"
                    >
                      {selectedClient.client.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
