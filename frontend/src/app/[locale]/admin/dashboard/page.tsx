'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, FileText, Briefcase, Users, Image as ImageIcon,
  MessageSquare, Settings, LogOut, Menu, X, Newspaper,
  Award, HelpCircle, Building2, Star, Plus, Edit3, Trash2,
  Upload, Eye, EyeOff, Check, ChevronDown, Search,
  Mail, Phone, Globe, MapPin, DollarSign, Calendar,
  GraduationCap, BriefcaseBusiness, Save, RefreshCw
} from 'lucide-react'
import { api } from '@/lib/api'
import { useLocale } from 'next-intl'

// ============================================================
// TYPES
// ============================================================

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
}

// ============================================================
// REUSABLE COMPONENTS
// ============================================================

function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  if (!open) return null
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  }
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 pb-10 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative w-full ${sizeClasses[size]} mx-4 bg-white dark:bg-[#1a1750] rounded-2xl shadow-2xl border border-gray-200 dark:border-white/[0.08] overflow-hidden`}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/[0.08]">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

function ConfirmDialog({ open, onClose, onConfirm, title, message }: ConfirmDialogProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white dark:bg-[#1a1750] rounded-2xl shadow-2xl border border-gray-200 dark:border-white/[0.08] p-6 max-w-md w-full mx-4"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors">
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function ImageUploader({ value, onChange, label }: { value: string; onChange: (url: string) => void; label?: string }) {
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      onChange(res.data.url || res.data.file_url || res.data.path || '')
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
      <div className="flex items-center gap-3">
        {value && (
          <div className="w-16 h-16 rounded-lg border border-gray-200 dark:border-white/10 overflow-hidden bg-gray-50 dark:bg-white/5 flex-shrink-0">
            <img src={value} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1">
          <input type="file" ref={fileRef} onChange={handleUpload} accept="image/*" className="hidden" />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
          {value && (
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="mt-2 w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400"
              placeholder="Or paste URL..."
            />
          )}
          {!value && (
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="mt-2 w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400"
              placeholder="Or paste image URL..."
            />
          )}
        </div>
      </div>
    </div>
  )
}

function TrilingualInput({ label, valueUz, valueRu, valueEn, onChangeUz, onChangeRu, onChangeEn, textarea }: {
  label: string
  valueUz: string
  valueRu: string
  valueEn: string
  onChangeUz: (v: string) => void
  onChangeRu: (v: string) => void
  onChangeEn: (v: string) => void
  textarea?: boolean
}) {
  const [activeLang, setActiveLang] = useState<'uz' | 'ru' | 'en'>('en')
  const InputComp = textarea ? 'textarea' : 'input'
  const value = activeLang === 'uz' ? valueUz : activeLang === 'ru' ? valueRu : valueEn
  const handler = activeLang === 'uz' ? onChangeUz : activeLang === 'ru' ? onChangeRu : onChangeEn

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <div className="flex gap-1">
          {(['en', 'ru', 'uz'] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setActiveLang(lang)}
              className={`px-2 py-0.5 text-xs rounded font-medium transition-colors ${
                activeLang === lang
                  ? 'bg-[#00a99e] text-white'
                  : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400'
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <InputComp
        value={value}
        onChange={(e: any) => handler(e.target.value)}
        className={`w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a99e]/50 focus:border-[#00a99e] outline-none transition-all ${textarea ? 'min-h-[100px] resize-y' : ''}`}
        placeholder={`${label} (${activeLang.toUpperCase()})`}
      />
    </div>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      {children}
    </div>
  )
}

function TextInput({ value, onChange, placeholder, type = 'text' }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a99e]/50 focus:border-[#00a99e] outline-none transition-all"
    />
  )
}

function SelectInput({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00a99e]/50 focus:border-[#00a99e] outline-none transition-all"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}

function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors ${value ? 'bg-[#00a99e]' : 'bg-gray-300 dark:bg-white/20'}`}
      >
        <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-5' : ''}`} />
      </div>
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
    </label>
  )
}

// ============================================================
// MENU CONFIG
// ============================================================

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', key: 'dashboard' },
  { icon: MessageSquare, label: 'Messages', key: 'messages' },
  { icon: Briefcase, label: 'Services', key: 'services' },
  { icon: FileText, label: 'Portfolio', key: 'portfolio' },
  { icon: Building2, label: 'Clients', key: 'clients' },
  { icon: MapPin, label: 'Region Clients', key: 'region-clients' },
  { icon: ImageIcon, label: 'Gallery', key: 'gallery' },
  { icon: Newspaper, label: 'Blog', key: 'news' },
  { icon: HelpCircle, label: 'FAQ', key: 'faq' },
  { icon: Star, label: 'Testimonials', key: 'testimonials' },
  { icon: Users, label: 'Employees', key: 'employees' },
  { icon: Award, label: 'Certificates', key: 'certificates' },
  { icon: BriefcaseBusiness, label: 'Vacancies', key: 'vacancies' },
  { icon: Globe, label: 'Social Links', key: 'social' },
  { icon: Settings, label: 'Settings', key: 'settings' },
]

// ============================================================
// MAIN COMPONENT
// ============================================================

interface Notification {
  id: string
  name: string
  message: string
  time: string
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [notifications, setNotifications] = useState<Notification[]>([])
  const router = useRouter()
  const locale = useLocale()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push(`/${locale}/admin/login`)
    }
  }, [locale, router])

  // WebSocket connection for real-time notifications
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = window.location.hostname
    const port = host === 'localhost' ? ':8000' : ''
    const wsUrl = `${protocol}//${host}${port}/ws/notifications`

    let ws: WebSocket | null = null
    let reconnectTimer: NodeJS.Timeout

    const connect = () => {
      ws = new WebSocket(wsUrl)

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === 'new_message') {
            const notif: Notification = {
              id: data.data.id,
              name: data.data.name,
              message: data.data.message || data.data.service || 'Yangi xabar',
              time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
            }
            setNotifications(prev => [notif, ...prev].slice(0, 10))

            // Play notification sound
            try {
              const audio = new Audio('/sounds/notification.mp3')
              audio.volume = 0.5
              audio.play().catch(() => {})
            } catch {}
          }
        } catch {}
      }

      ws.onclose = () => {
        reconnectTimer = setTimeout(connect, 3000)
      }

      ws.onerror = () => {
        ws?.close()
      }
    }

    connect()

    return () => {
      clearTimeout(reconnectTimer)
      ws?.close()
    }
  }, [])

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    router.push(`/${locale}/admin/login`)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0c0a2e] flex">
      {/* Sidebar Overlay on mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-[#1a1750] border-r border-gray-100 dark:border-white/[0.08] transition-transform duration-300 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-64'}`}>
        <div className="flex items-center gap-3 px-6 h-16 border-b border-gray-100 dark:border-white/[0.08] flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1b1464] to-[#00a99e] flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">IP</span>
          </div>
          <span className="font-bold text-gray-900 dark:text-white">ImPrinta Admin</span>
        </div>
        <nav className="p-3 space-y-0.5 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.key}
                onClick={() => { setActiveTab(item.key); setSidebarOpen(false) }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.key
                    ? 'bg-[#00a99e]/10 text-[#00a99e] shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {item.label}
              </button>
            )
          })}
        </nav>
        <div className="p-3 border-t border-gray-100 dark:border-white/[0.08]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-x-hidden">
        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-white/80 dark:bg-[#0c0a2e]/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/[0.08] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white capitalize">{activeTab}</h1>
          </div>
        </div>

        {/* Tab content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && <DashboardPanel />}
              {activeTab === 'messages' && <MessagesPanel />}
              {activeTab === 'services' && <ServicesPanel />}
              {activeTab === 'portfolio' && <PortfolioPanel />}
              {activeTab === 'clients' && <ClientsPanel />}
              {activeTab === 'region-clients' && <RegionClientsPanel />}
              {activeTab === 'gallery' && <GalleryPanel />}
              {activeTab === 'news' && <NewsPanel />}
              {activeTab === 'faq' && <FAQPanel />}
              {activeTab === 'testimonials' && <TestimonialsPanel />}
              {activeTab === 'employees' && <EmployeesPanel />}
              {activeTab === 'certificates' && <CertificatesPanel />}
              {activeTab === 'vacancies' && <VacanciesPanel />}
              {activeTab === 'social' && <SocialLinksPanel />}
              {activeTab === 'settings' && <SettingsPanel />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Notification Toasts */}
      <div className="fixed top-4 right-4 z-[200] space-y-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto bg-white dark:bg-[#1a1750] rounded-2xl border border-gray-100 dark:border-white/[0.08] shadow-xl p-4 flex items-start gap-3"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#00a99e]/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#00a99e]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {notif.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                  {notif.message}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                  {notif.time}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { setActiveTab('messages'); dismissNotification(notif.id) }}
                  className="p-1.5 rounded-lg text-[#00a99e] hover:bg-[#00a99e]/10 transition-colors"
                  title="Ko'rish"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => dismissNotification(notif.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                  title="Yopish"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ============================================================
// DASHBOARD PANEL
// ============================================================

function DashboardPanel() {
  const [stats, setStats] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [msgs, svcs, portfolio, clients, news, gallery, employees, faq, testimonials, vacancies, certs] = await Promise.allSettled([
        api.get('/contact/unread-count'),
        api.get('/services/all'),
        api.get('/portfolio/all'),
        api.get('/clients'),
        api.get('/news'),
        api.get('/gallery'),
        api.get('/employees'),
        api.get('/faq'),
        api.get('/testimonials'),
        api.get('/vacancies'),
        api.get('/certificates'),
      ])
      setStats({
        messages: msgs.status === 'fulfilled' ? (msgs.value.data.count ?? msgs.value.data.unread_count ?? 0) : 0,
        services: svcs.status === 'fulfilled' ? (svcs.value.data.length ?? svcs.value.data.total ?? 0) : 0,
        portfolio: portfolio.status === 'fulfilled' ? (portfolio.value.data.length ?? portfolio.value.data.total ?? 0) : 0,
        clients: clients.status === 'fulfilled' ? (clients.value.data.length ?? clients.value.data.total ?? 0) : 0,
        news: news.status === 'fulfilled' ? (news.value.data.length ?? news.value.data.total ?? 0) : 0,
        gallery: gallery.status === 'fulfilled' ? (gallery.value.data.length ?? gallery.value.data.total ?? 0) : 0,
        employees: employees.status === 'fulfilled' ? (employees.value.data.length ?? employees.value.data.total ?? 0) : 0,
        faq: faq.status === 'fulfilled' ? (faq.value.data.length ?? faq.value.data.total ?? 0) : 0,
        testimonials: testimonials.status === 'fulfilled' ? (testimonials.value.data.length ?? testimonials.value.data.total ?? 0) : 0,
        vacancies: vacancies.status === 'fulfilled' ? (vacancies.value.data.length ?? vacancies.value.data.total ?? 0) : 0,
        certificates: certs.status === 'fulfilled' ? (certs.value.data.length ?? certs.value.data.total ?? 0) : 0,
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { label: 'Unread Messages', value: stats.messages, icon: MessageSquare, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10' },
    { label: 'Services', value: stats.services, icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { label: 'Portfolio', value: stats.portfolio, icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
    { label: 'Clients', value: stats.clients, icon: Building2, color: 'text-[#00a99e]', bg: 'bg-[#00a99e]/10' },
    { label: 'News', value: stats.news, icon: Newspaper, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' },
    { label: 'Gallery', value: stats.gallery, icon: ImageIcon, color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-500/10' },
    { label: 'Employees', value: stats.employees, icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
    { label: 'FAQ', value: stats.faq, icon: HelpCircle, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-500/10' },
    { label: 'Testimonials', value: stats.testimonials, icon: Star, color: 'text-[#f9b13b]', bg: 'bg-[#f9b13b]/10' },
    { label: 'Vacancies', value: stats.vacancies, icon: BriefcaseBusiness, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-500/10' },
    { label: 'Certificates', value: stats.certificates, icon: Award, color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-500/10' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="w-6 h-6 animate-spin text-[#00a99e]" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {statCards.map((card, i) => {
        const Icon = card.icon
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-5 rounded-2xl bg-white dark:bg-[#1a1750] border border-gray-100 dark:border-white/[0.08] shadow-sm"
          >
            <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{card.value ?? 0}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{card.label}</div>
          </motion.div>
        )
      })}
    </div>
  )
}

// ============================================================
// MESSAGES PANEL
// ============================================================

function MessagesPanel() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<any>(null)

  useEffect(() => { loadMessages() }, [])

  const loadMessages = async () => {
    setLoading(true)
    try {
      const res = await api.get('/contact')
      setMessages(Array.isArray(res.data) ? res.data : res.data.items || res.data.data || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const markAsRead = async (id: number) => {
    try {
      await api.put(`/contact/${id}/read`)
      setMessages((prev) => prev.map((m) => m.id === id ? { ...m, is_read: true } : m))
    } catch (err) { console.error(err) }
  }

  const deleteMessage = async () => {
    if (!deleteTarget) return
    try {
      await api.delete(`/contact/${deleteTarget.id}`)
      setMessages((prev) => prev.filter((m) => m.id !== deleteTarget.id))
    } catch (err) { console.error(err) }
    finally { setDeleteTarget(null) }
  }

  if (loading) return <div className="flex justify-center py-20"><RefreshCw className="w-6 h-6 animate-spin text-[#00a99e]" /></div>

  return (
    <div>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={deleteMessage} title="Delete Message" message="Are you sure you want to delete this message?" />
      <div className="space-y-3">
        {messages.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-10">No messages found.</p>}
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-5 rounded-xl border transition-all ${msg.is_read ? 'bg-white dark:bg-[#1a1750] border-gray-100 dark:border-white/[0.08]' : 'bg-[#00a99e]/5 dark:bg-[#00a99e]/10 border-[#00a99e]/20'}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900 dark:text-white">{msg.name}</span>
                  {!msg.is_read && <span className="px-2 py-0.5 text-xs rounded-full bg-[#00a99e] text-white font-medium">New</span>}
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {msg.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{msg.email}</span>}
                  {msg.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{msg.phone}</span>}
                  {msg.company && <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" />{msg.company}</span>}
                </div>
                {msg.service && <div className="text-xs text-[#00a99e] mb-1">Service: {msg.service}</div>}
                <p className="text-gray-700 dark:text-gray-300 text-sm">{msg.message}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {!msg.is_read && (
                  <button onClick={() => markAsRead(msg.id)} className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-500/10 text-green-600 transition-colors" title="Mark as read">
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => setDeleteTarget(msg)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// SERVICES PANEL
// ============================================================

function ServicesPanel() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [form, setForm] = useState<any>({})

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/services/all')
      setItems(Array.isArray(res.data) ? res.data : res.data.items || res.data.data || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const openCreate = () => {
    setEditItem(null)
    setForm({ title_uz: '', title_ru: '', title_en: '', description_uz: '', description_ru: '', description_en: '', icon: '', image: '', slug: '', is_featured: false, is_visible: true, sort_order: 0 })
    setModalOpen(true)
  }

  const openEdit = (item: any) => {
    setEditItem(item)
    setForm({ ...item })
    setModalOpen(true)
  }

  const handleSave = async () => {
    try {
      if (editItem) {
        await api.put(`/services/${editItem.id}`, form)
      } else {
        await api.post('/services', form)
      }
      setModalOpen(false)
      load()
    } catch (err) { console.error(err) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await api.delete(`/services/${deleteTarget.id}`)
      load()
    } catch (err) { console.error(err) }
    finally { setDeleteTarget(null) }
  }

  if (loading) return <div className="flex justify-center py-20"><RefreshCw className="w-6 h-6 animate-spin text-[#00a99e]" /></div>

  return (
    <div>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Service" message="Are you sure you want to delete this service?" />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Service' : 'Create Service'} size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <TrilingualInput label="Title" valueUz={form.title_uz || ''} valueRu={form.title_ru || ''} valueEn={form.title_en || ''} onChangeUz={(v) => setForm({ ...form, title_uz: v })} onChangeRu={(v) => setForm({ ...form, title_ru: v })} onChangeEn={(v) => setForm({ ...form, title_en: v })} />
          </div>
          <div className="md:col-span-2">
            <TrilingualInput label="Description" valueUz={form.description_uz || ''} valueRu={form.description_ru || ''} valueEn={form.description_en || ''} onChangeUz={(v) => setForm({ ...form, description_uz: v })} onChangeRu={(v) => setForm({ ...form, description_ru: v })} onChangeEn={(v) => setForm({ ...form, description_en: v })} textarea />
          </div>
          <FormField label="Icon"><TextInput value={form.icon || ''} onChange={(v) => setForm({ ...form, icon: v })} placeholder="Icon name or SVG" /></FormField>
          <FormField label="Slug"><TextInput value={form.slug || ''} onChange={(v) => setForm({ ...form, slug: v })} placeholder="service-slug" /></FormField>
          <div className="md:col-span-2"><ImageUploader value={form.image || ''} onChange={(v) => setForm({ ...form, image: v })} label="Image" /></div>
          <FormField label="Sort Order"><TextInput value={String(form.sort_order || 0)} onChange={(v) => setForm({ ...form, sort_order: parseInt(v) || 0 })} type="number" /></FormField>
          <div className="flex flex-col gap-3 justify-center">
            <Toggle value={form.is_featured || false} onChange={(v) => setForm({ ...form, is_featured: v })} label="Featured" />
            <Toggle value={form.is_visible !== false} onChange={(v) => setForm({ ...form, is_visible: v })} label="Visible" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-white/[0.08]">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-[#00a99e] text-white hover:bg-[#008f86] transition-colors font-medium flex items-center gap-2"><Save className="w-4 h-4" />Save</button>
        </div>
      </Modal>

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">{items.length} services</p>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00a99e] text-white hover:bg-[#008f86] transition-colors font-medium text-sm">
          <Plus className="w-4 h-4" />Add Service
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-white/[0.08]">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-white/5">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Title</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Slug</th>
              <th className="px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400">Featured</th>
              <th className="px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400">Visible</th>
              <th className="px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400">Order</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/[0.08]">
            {items.map((item) => (
              <tr key={item.id} className="bg-white dark:bg-[#1a1750] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{item.title_en || item.title_uz || '-'}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{item.slug || '-'}</td>
                <td className="px-4 py-3 text-center">{item.is_featured ? <Check className="w-4 h-4 text-[#00a99e] mx-auto" /> : '-'}</td>
                <td className="px-4 py-3 text-center">{item.is_visible !== false ? <Eye className="w-4 h-4 text-green-500 mx-auto" /> : <EyeOff className="w-4 h-4 text-gray-400 mx-auto" />}</td>
                <td className="px-4 py-3 text-center text-gray-500">{item.sort_order ?? 0}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 text-blue-500 transition-colors"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteTarget(item)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ============================================================
// PORTFOLIO PANEL
// ============================================================

function PortfolioPanel() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [form, setForm] = useState<any>({})

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/portfolio/all')
      setItems(Array.isArray(res.data) ? res.data : res.data.items || res.data.data || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const openCreate = () => {
    setEditItem(null)
    setForm({ title_uz: '', title_ru: '', title_en: '', description_uz: '', description_ru: '', description_en: '', image: '', images: '[]', category_id: '', client: '', slug: '', is_featured: false, is_visible: true, sort_order: 0, status: 'published' })
    setModalOpen(true)
  }

  const openEdit = (item: any) => {
    setEditItem(item)
    setForm({ ...item, images: typeof item.images === 'string' ? item.images : JSON.stringify(item.images || []) })
    setModalOpen(true)
  }

  const handleSave = async () => {
    try {
      const payload = { ...form, images: typeof form.images === 'string' ? JSON.parse(form.images || '[]') : form.images }
      if (editItem) {
        await api.put(`/portfolio/${editItem.id}`, payload)
      } else {
        await api.post('/portfolio', payload)
      }
      setModalOpen(false)
      load()
    } catch (err) { console.error(err) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try { await api.delete(`/portfolio/${deleteTarget.id}`); load() }
    catch (err) { console.error(err) }
    finally { setDeleteTarget(null) }
  }

  if (loading) return <div className="flex justify-center py-20"><RefreshCw className="w-6 h-6 animate-spin text-[#00a99e]" /></div>

  return (
    <div>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Portfolio Item" message="Are you sure you want to delete this portfolio item?" />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Portfolio' : 'Create Portfolio'} size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2"><TrilingualInput label="Title" valueUz={form.title_uz || ''} valueRu={form.title_ru || ''} valueEn={form.title_en || ''} onChangeUz={(v) => setForm({ ...form, title_uz: v })} onChangeRu={(v) => setForm({ ...form, title_ru: v })} onChangeEn={(v) => setForm({ ...form, title_en: v })} /></div>
          <div className="md:col-span-2"><TrilingualInput label="Description" valueUz={form.description_uz || ''} valueRu={form.description_ru || ''} valueEn={form.description_en || ''} onChangeUz={(v) => setForm({ ...form, description_uz: v })} onChangeRu={(v) => setForm({ ...form, description_ru: v })} onChangeEn={(v) => setForm({ ...form, description_en: v })} textarea /></div>
          <FormField label="Slug"><TextInput value={form.slug || ''} onChange={(v) => setForm({ ...form, slug: v })} placeholder="portfolio-slug" /></FormField>
          <FormField label="Client"><TextInput value={form.client || ''} onChange={(v) => setForm({ ...form, client: v })} placeholder="Client name" /></FormField>
          <FormField label="Category ID"><TextInput value={form.category_id || ''} onChange={(v) => setForm({ ...form, category_id: v })} /></FormField>
          <FormField label="Status"><SelectInput value={form.status || 'published'} onChange={(v) => setForm({ ...form, status: v })} options={[{ value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }]} /></FormField>
          <div className="md:col-span-2"><ImageUploader value={form.image || ''} onChange={(v) => setForm({ ...form, image: v })} label="Main Image" /></div>
          <div className="md:col-span-2"><FormField label="Additional Images (JSON array of URLs)"><textarea value={form.images || '[]'} onChange={(e) => setForm({ ...form, images: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white min-h-[60px] text-sm font-mono" /></FormField></div>
          <FormField label="Sort Order"><TextInput value={String(form.sort_order || 0)} onChange={(v) => setForm({ ...form, sort_order: parseInt(v) || 0 })} type="number" /></FormField>
          <div className="flex flex-col gap-3 justify-center">
            <Toggle value={form.is_featured || false} onChange={(v) => setForm({ ...form, is_featured: v })} label="Featured" />
            <Toggle value={form.is_visible !== false} onChange={(v) => setForm({ ...form, is_visible: v })} label="Visible" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-white/[0.08]">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-[#00a99e] text-white hover:bg-[#008f86] transition-colors font-medium flex items-center gap-2"><Save className="w-4 h-4" />Save</button>
        </div>
      </Modal>

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">{items.length} portfolio items</p>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00a99e] text-white hover:bg-[#008f86] transition-colors font-medium text-sm"><Plus className="w-4 h-4" />Add Portfolio</button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-white/[0.08]">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-white/5">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Image</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Title</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Client</th>
              <th className="px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400">Status</th>
              <th className="px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400">Visible</th>
              <th className="px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400">Order</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/[0.08]">
            {items.map((item) => (
              <tr key={item.id} className="bg-white dark:bg-[#1a1750] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <td className="px-4 py-3">{item.image ? <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/10" />}</td>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{item.title_en || item.title_uz || '-'}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{item.client || '-'}</td>
                <td className="px-4 py-3 text-center"><span className={`px-2 py-0.5 text-xs rounded-full font-medium ${item.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400'}`}>{item.status || 'draft'}</span></td>
                <td className="px-4 py-3 text-center">{item.is_visible !== false ? <Eye className="w-4 h-4 text-green-500 mx-auto" /> : <EyeOff className="w-4 h-4 text-gray-400 mx-auto" />}</td>
                <td className="px-4 py-3 text-center text-gray-500">{item.sort_order ?? 0}</td>
                <td className="px-4 py-3"><div className="flex gap-1 justify-end"><button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 text-blue-500 transition-colors"><Edit3 className="w-4 h-4" /></button><button onClick={() => setDeleteTarget(item)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ============================================================
// CLIENT DISPLAY TOGGLE (Logo vs Text mode)
// ============================================================

function ClientDisplayToggle() {
  const [logosEnabled, setLogosEnabled] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSetting()
  }, [])

  const loadSetting = async () => {
    try {
      const res = await api.get('/settings')
      const data = res.data || {}
      if (data['client_display_logos'] !== undefined) {
        setLogosEnabled(data['client_display_logos'] === true || data['client_display_logos'] === 'true')
      }
    } catch {}
  }

  const toggle = async () => {
    const next = !logosEnabled
    setLogosEnabled(next)
    setSaving(true)
    try {
      await api.put('/settings', { key: 'client_display_logos', value: next, type: 'boolean', group: 'clients' })
    } catch (err) {
      console.error(err)
      setLogosEnabled(!next)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mb-6 rounded-xl bg-white dark:bg-[#1a1750] border border-gray-100 dark:border-white/[0.08] p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Carousel Display Mode</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {logosEnabled ? 'Showing client logos in carousel' : 'Showing client names as text in carousel'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-medium ${!logosEnabled ? 'text-[#00a99e]' : 'text-gray-400'}`}>Text</span>
          <button
            onClick={toggle}
            disabled={saving}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${logosEnabled ? 'bg-[#00a99e]' : 'bg-gray-300 dark:bg-gray-600'} ${saving ? 'opacity-50' : ''}`}
          >
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${logosEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
          <span className={`text-xs font-medium ${logosEnabled ? 'text-[#00a99e]' : 'text-gray-400'}`}>Logo</span>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// CLIENTS PANEL (Polished - Brand Logos Management)
// ============================================================

function ClientsPanel() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [form, setForm] = useState<any>({})
  const [filter, setFilter] = useState<'all' | 'partners' | 'clients'>('all')

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/clients/all')
      setItems(Array.isArray(res.data) ? res.data : res.data.items || res.data.data || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const openCreate = () => {
    setEditItem(null)
    setForm({ name: '', logo: '', website: '', is_partner: false, is_visible: true, sort_order: 0, show_text: true, show_logo: true })
    setModalOpen(true)
  }

  const openEdit = (item: any) => {
    setEditItem(item)
    setForm({ ...item })
    setModalOpen(true)
  }

  const handleSave = async () => {
    try {
      if (editItem) {
        await api.put(`/clients/${editItem.id}`, form)
      } else {
        await api.post('/clients', form)
      }
      setModalOpen(false)
      load()
    } catch (err) { console.error(err) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try { await api.delete(`/clients/${deleteTarget.id}`); load() }
    catch (err) { console.error(err) }
    finally { setDeleteTarget(null) }
  }

  const filteredItems = items.filter((item) => {
    if (filter === 'partners') return item.is_partner
    if (filter === 'clients') return !item.is_partner
    return true
  })

  if (loading) return <div className="flex justify-center py-20"><RefreshCw className="w-6 h-6 animate-spin text-[#00a99e]" /></div>

  return (
    <div>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Client" message="Are you sure you want to remove this brand/client?" />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Client / Brand' : 'Add New Client / Brand'} size="md">
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-[#00a99e]/5 dark:bg-[#00a99e]/10 border border-[#00a99e]/20">
            <p className="text-sm text-[#00a99e] font-medium mb-1">Brand Logo Management</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Partners marked as "Trusted Partner" will have their logos displayed on the main page hero section.</p>
          </div>
          <FormField label="Company Name">
            <TextInput value={form.name || ''} onChange={(v) => setForm({ ...form, name: v })} placeholder="e.g., UzumBank, Coca-Cola" />
          </FormField>
          <ImageUploader value={form.logo || ''} onChange={(v) => setForm({ ...form, logo: v })} label="Company Logo" />
          <FormField label="Website URL">
            <TextInput value={form.website || ''} onChange={(v) => setForm({ ...form, website: v })} placeholder="https://company.com" />
          </FormField>
          <FormField label="Sort Order">
            <TextInput value={String(form.sort_order || 0)} onChange={(v) => setForm({ ...form, sort_order: parseInt(v) || 0 })} type="number" />
          </FormField>
          <div className="flex flex-col gap-3">
            <Toggle value={form.is_partner || false} onChange={(v) => setForm({ ...form, is_partner: v })} label="Trusted Partner (logo on main page)" />
            <Toggle value={form.is_visible !== false} onChange={(v) => setForm({ ...form, is_visible: v })} label="Visible on website" />
          </div>
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Display on Site</p>
            <div className="flex flex-col gap-3">
              <Toggle value={form.show_text !== false} onChange={(v) => setForm({ ...form, show_text: v })} label="Show company name (text)" />
              <Toggle value={form.show_logo !== false} onChange={(v) => setForm({ ...form, show_logo: v })} label="Show company logo (image)" />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-white/[0.08]">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-[#00a99e] text-white hover:bg-[#008f86] transition-colors font-medium flex items-center gap-2"><Save className="w-4 h-4" />Save Brand</button>
        </div>
      </Modal>

      {/* Display Mode Toggle */}
      <ClientDisplayToggle />

      {/* Header with filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-gray-200 dark:border-white/10 overflow-hidden">
            {(['all', 'partners', 'clients'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors capitalize ${filter === f ? 'bg-[#00a99e] text-white' : 'bg-white dark:bg-[#1a1750] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}
              >
                {f === 'all' ? `All (${items.length})` : f === 'partners' ? `Partners (${items.filter(i => i.is_partner).length})` : `Clients (${items.filter(i => !i.is_partner).length})`}
              </button>
            ))}
          </div>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00a99e] text-white hover:bg-[#008f86] transition-colors font-medium text-sm">
          <Plus className="w-4 h-4" />Add Brand
        </button>
      </div>

      {/* Brand Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="group relative p-5 rounded-xl bg-white dark:bg-[#1a1750] border border-gray-100 dark:border-white/[0.08] shadow-sm hover:shadow-md transition-all"
          >
            {/* Partner badge */}
            {item.is_partner && (
              <div className="absolute top-3 right-3">
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-[#f9b13b]/10 text-[#f9b13b] font-bold uppercase tracking-wider">Partner</span>
              </div>
            )}
            {/* Logo */}
            <div className="w-full h-20 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center mb-4 overflow-hidden">
              {item.logo ? (
                <img src={item.logo} alt={item.name} className="max-w-full max-h-full object-contain p-2" />
              ) : (
                <Building2 className="w-8 h-8 text-gray-300 dark:text-gray-600" />
              )}
            </div>
            {/* Info */}
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 truncate">{item.name}</h3>
            {item.website && (
              <a href={item.website} target="_blank" rel="noopener noreferrer" className="text-xs text-[#00a99e] hover:underline truncate block mb-2">
                {item.website.replace(/^https?:\/\//, '')}
              </a>
            )}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              {item.is_visible !== false ? <Eye className="w-3 h-3 text-green-500" /> : <EyeOff className="w-3 h-3" />}
              <span>Order: {item.sort_order ?? 0}</span>
            </div>
            {/* Actions */}
            <div className="absolute bottom-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
              <button onClick={() => setDeleteTarget(item)} className="p-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16">
          <Building2 className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No brands found. Add your first client or partner.</p>
        </div>
      )}
    </div>
  )
}

// ============================================================
// REGION CLIENTS PANEL
// ============================================================

const REGIONS_LIST = [
  { id: 'buxoro', name: 'Buxoro viloyati' },
  { id: 'xorazm', name: 'Xorazm viloyati' },
  { id: 'qoraqalpogiston', name: "Qoraqalpog'iston Respublikasi" },
  { id: 'navoiy', name: 'Navoiy viloyati' },
  { id: 'samarqand', name: 'Samarqand viloyati' },
  { id: 'qashqadaryo', name: "Qashqadaryo viloyati" },
  { id: 'surxondaryo', name: 'Surxondaryo viloyati' },
  { id: 'andijon', name: 'Andijon viloyati' },
  { id: 'fargona', name: "Farg'ona viloyati" },
  { id: 'namangan', name: 'Namangan viloyati' },
  { id: 'jizzax', name: 'Jizzax viloyati' },
  { id: 'sirdaryo', name: 'Sirdaryo viloyati' },
  { id: 'toshkent', name: 'Toshkent viloyati' },
]

function RegionClientsPanel() {
  const [items, setItems] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [form, setForm] = useState<any>({})
  const [filterRegion, setFilterRegion] = useState<string>('all')

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const [rcRes, clRes] = await Promise.all([
        api.get('/region-clients/all'),
        api.get('/clients/all'),
      ])
      setItems(Array.isArray(rcRes.data) ? rcRes.data : rcRes.data.items || [])
      setClients(Array.isArray(clRes.data) ? clRes.data : clRes.data.items || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const openCreate = () => {
    setEditItem(null)
    setForm({ region_id: '', client_id: '', description_uz: '', description_ru: '', description_en: '', image: '', sort_order: 0, is_visible: true })
    setModalOpen(true)
  }

  const openEdit = (item: any) => {
    setEditItem(item)
    setForm({ ...item })
    setModalOpen(true)
  }

  const handleSave = async () => {
    try {
      if (editItem) {
        await api.put(`/region-clients/${editItem.id}`, form)
      } else {
        await api.post('/region-clients', form)
      }
      setModalOpen(false)
      load()
    } catch (err) { console.error(err) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try { await api.delete(`/region-clients/${deleteTarget.id}`); load() }
    catch (err) { console.error(err) }
    finally { setDeleteTarget(null) }
  }

  const getClientName = (clientId: string) => {
    const c = clients.find((cl: any) => cl.id === clientId)
    return c ? c.name : clientId
  }

  const getRegionName = (regionId: string) => {
    const r = REGIONS_LIST.find(reg => reg.id === regionId)
    return r ? r.name : regionId
  }

  const filteredItems = filterRegion === 'all' ? items : items.filter(i => i.region_id === filterRegion)

  if (loading) return <div className="flex justify-center py-20"><RefreshCw className="w-6 h-6 animate-spin text-[#00a99e]" /></div>

  return (
    <div>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Region Client" message="Are you sure you want to remove this region-client mapping?" />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Region Client' : 'Add Region Client'} size="md">
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-[#00a99e]/5 dark:bg-[#00a99e]/10 border border-[#00a99e]/20">
            <p className="text-sm text-[#00a99e] font-medium mb-1">Region-Client Mapping</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Link a client/company to a region on the interactive map. Users clicking a region will see linked clients.</p>
          </div>
          <FormField label="Region (Viloyat)">
            <SelectInput
              value={form.region_id || ''}
              onChange={(v) => setForm({ ...form, region_id: v })}
              options={[{ value: '', label: '-- Select Region --' }, ...REGIONS_LIST.map(r => ({ value: r.id, label: r.name }))]}
            />
          </FormField>
          <FormField label="Client (Company)">
            <SelectInput
              value={form.client_id || ''}
              onChange={(v) => setForm({ ...form, client_id: v })}
              options={[{ value: '', label: '-- Select Client --' }, ...clients.map((c: any) => ({ value: c.id, label: c.name }))]}
            />
          </FormField>
          <FormField label="Description (UZ)">
            <textarea
              value={form.description_uz || ''}
              onChange={(e) => setForm({ ...form, description_uz: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#00a99e]/50 focus:border-[#00a99e] outline-none resize-none"
              placeholder="Viloyatdagi client haqida qisqacha..."
            />
          </FormField>
          <FormField label="Description (RU)">
            <textarea
              value={form.description_ru || ''}
              onChange={(e) => setForm({ ...form, description_ru: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#00a99e]/50 focus:border-[#00a99e] outline-none resize-none"
              placeholder="Краткое описание клиента в регионе..."
            />
          </FormField>
          <FormField label="Description (EN)">
            <textarea
              value={form.description_en || ''}
              onChange={(e) => setForm({ ...form, description_en: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#00a99e]/50 focus:border-[#00a99e] outline-none resize-none"
              placeholder="Brief description of client in region..."
            />
          </FormField>
          <ImageUploader value={form.image || ''} onChange={(v) => setForm({ ...form, image: v })} label="Region Client Image (optional)" />
          <FormField label="Sort Order">
            <TextInput value={String(form.sort_order || 0)} onChange={(v) => setForm({ ...form, sort_order: parseInt(v) || 0 })} type="number" />
          </FormField>
          <Toggle value={form.is_visible !== false} onChange={(v) => setForm({ ...form, is_visible: v })} label="Visible on map" />
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-white/[0.08]">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-[#00a99e] text-white hover:bg-[#008f86] transition-colors font-medium flex items-center gap-2"><Save className="w-4 h-4" />Save</button>
        </div>
      </Modal>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <SelectInput
            value={filterRegion}
            onChange={(v) => setFilterRegion(v)}
            options={[{ value: 'all', label: `All Regions (${items.length})` }, ...REGIONS_LIST.map(r => ({ value: r.id, label: `${r.name} (${items.filter(i => i.region_id === r.id).length})` }))]}
          />
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00a99e] text-white hover:bg-[#008f86] transition-colors font-medium text-sm">
          <Plus className="w-4 h-4" />Add Region Client
        </button>
      </div>

      <div className="space-y-3">
        {filteredItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="group relative flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-[#1a1750] border border-gray-100 dark:border-white/[0.08] shadow-sm hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
              {item.client?.logo ? (
                <img src={item.client.logo} alt="" className="max-w-full max-h-full object-contain p-1" />
              ) : (
                <MapPin className="w-5 h-5 text-gray-300 dark:text-gray-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{item.client?.name || getClientName(item.client_id)}</h3>
              <p className="text-xs text-[#00a99e]">{getRegionName(item.region_id)}</p>
              {item.description_uz && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{item.description_uz}</p>}
            </div>
            <div className="flex items-center gap-2">
              {item.is_visible !== false ? <Eye className="w-3.5 h-3.5 text-green-500" /> : <EyeOff className="w-3.5 h-3.5 text-gray-400" />}
              <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
              <button onClick={() => setDeleteTarget(item)} className="p-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16">
          <MapPin className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No region-client mappings found. Add the first one.</p>
        </div>
      )}
    </div>
  )
}

// ============================================================
// GALLERY PANEL
// ============================================================

function GalleryPanel() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [form, setForm] = useState<any>({})

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/gallery')
      setItems(Array.isArray(res.data) ? res.data : res.data.items || res.data.data || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const openCreate = () => {
    setEditItem(null)
    setForm({ title_uz: '', title_ru: '', title_en: '', image: '', category: '', is_visible: true, sort_order: 0 })
    setModalOpen(true)
  }

  const openEdit = (item: any) => { setEditItem(item); setForm({ ...item }); setModalOpen(true) }

  const handleSave = async () => {
    try {
      if (editItem) { await api.put(`/gallery/${editItem.id}`, form) }
      else { await api.post('/gallery', form) }
      setModalOpen(false); load()
    } catch (err) { console.error(err) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try { await api.delete(`/gallery/${deleteTarget.id}`); load() }
    catch (err) { console.error(err) }
    finally { setDeleteTarget(null) }
  }

  if (loading) return <div className="flex justify-center py-20"><RefreshCw className="w-6 h-6 animate-spin text-[#00a99e]" /></div>

  return (
    <div>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Gallery Item" message="Are you sure?" />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Gallery Item' : 'Add Gallery Item'} size="md">
        <div className="space-y-4">
          <TrilingualInput label="Title" valueUz={form.title_uz || ''} valueRu={form.title_ru || ''} valueEn={form.title_en || ''} onChangeUz={(v) => setForm({ ...form, title_uz: v })} onChangeRu={(v) => setForm({ ...form, title_ru: v })} onChangeEn={(v) => setForm({ ...form, title_en: v })} />
          <ImageUploader value={form.image || ''} onChange={(v) => setForm({ ...form, image: v })} label="Image" />
          <FormField label="Category"><TextInput value={form.category || ''} onChange={(v) => setForm({ ...form, category: v })} placeholder="Category" /></FormField>
          <FormField label="Sort Order"><TextInput value={String(form.sort_order || 0)} onChange={(v) => setForm({ ...form, sort_order: parseInt(v) || 0 })} type="number" /></FormField>
          <Toggle value={form.is_visible !== false} onChange={(v) => setForm({ ...form, is_visible: v })} label="Visible" />
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-white/[0.08]">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-[#00a99e] text-white hover:bg-[#008f86] transition-colors font-medium flex items-center gap-2"><Save className="w-4 h-4" />Save</button>
        </div>
      </Modal>

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">{items.length} gallery items</p>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00a99e] text-white hover:bg-[#008f86] transition-colors font-medium text-sm"><Plus className="w-4 h-4" />Add Image</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map((item) => (
          <div key={item.id} className="group relative rounded-xl overflow-hidden border border-gray-100 dark:border-white/[0.08] bg-white dark:bg-[#1a1750]">
            <div className="aspect-square bg-gray-100 dark:bg-white/5">
              {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-8 h-8 text-gray-300" /></div>}
            </div>
            <div className="p-2">
              <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{item.title_en || item.title_uz || 'Untitled'}</p>
              {item.category && <p className="text-[10px] text-gray-500">{item.category}</p>}
            </div>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(item)} className="p-1 rounded bg-white/90 dark:bg-black/50 text-blue-500 shadow-sm"><Edit3 className="w-3 h-3" /></button>
              <button onClick={() => setDeleteTarget(item)} className="p-1 rounded bg-white/90 dark:bg-black/50 text-red-500 shadow-sm"><Trash2 className="w-3 h-3" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// NEWS PANEL
// ============================================================

function NewsPanel() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [form, setForm] = useState<any>({})

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/news')
      setItems(Array.isArray(res.data) ? res.data : res.data.items || res.data.data || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const openCreate = () => {
    setEditItem(null)
    setForm({ title_uz: '', title_ru: '', title_en: '', content_uz: '', content_ru: '', content_en: '', excerpt_uz: '', excerpt_ru: '', excerpt_en: '', image: '', slug: '', status: 'published', is_visible: true })
    setModalOpen(true)
  }

  const openEdit = (item: any) => { setEditItem(item); setForm({ ...item }); setModalOpen(true) }

  const handleSave = async () => {
    try {
      if (editItem) { await api.put(`/news/${editItem.id}`, form) }
      else { await api.post('/news', form) }
      setModalOpen(false); load()
    } catch (err) { console.error(err) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try { await api.delete(`/news/${deleteTarget.id}`); load() }
    catch (err) { console.error(err) }
    finally { setDeleteTarget(null) }
  }

  if (loading) return <div className="flex justify-center py-20"><RefreshCw className="w-6 h-6 animate-spin text-[#00a99e]" /></div>

  return (
    <div>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Blog Post" message="Are you sure?" />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Blog Post' : 'Create Blog Post'} size="xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2"><TrilingualInput label="Title" valueUz={form.title_uz || ''} valueRu={form.title_ru || ''} valueEn={form.title_en || ''} onChangeUz={(v) => setForm({ ...form, title_uz: v })} onChangeRu={(v) => setForm({ ...form, title_ru: v })} onChangeEn={(v) => setForm({ ...form, title_en: v })} /></div>
          <div className="md:col-span-2"><TrilingualInput label="Excerpt" valueUz={form.excerpt_uz || ''} valueRu={form.excerpt_ru || ''} valueEn={form.excerpt_en || ''} onChangeUz={(v) => setForm({ ...form, excerpt_uz: v })} onChangeRu={(v) => setForm({ ...form, excerpt_ru: v })} onChangeEn={(v) => setForm({ ...form, excerpt_en: v })} textarea /></div>
          <div className="md:col-span-2"><TrilingualInput label="Content" valueUz={form.content_uz || ''} valueRu={form.content_ru || ''} valueEn={form.content_en || ''} onChangeUz={(v) => setForm({ ...form, content_uz: v })} onChangeRu={(v) => setForm({ ...form, content_ru: v })} onChangeEn={(v) => setForm({ ...form, content_en: v })} textarea /></div>
          <FormField label="Slug"><TextInput value={form.slug || ''} onChange={(v) => setForm({ ...form, slug: v })} placeholder="news-slug" /></FormField>
          <FormField label="Status"><SelectInput value={form.status || 'published'} onChange={(v) => setForm({ ...form, status: v })} options={[{ value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }]} /></FormField>
          <div className="md:col-span-2"><ImageUploader value={form.image || ''} onChange={(v) => setForm({ ...form, image: v })} label="Cover Image" /></div>
          <Toggle value={form.is_visible !== false} onChange={(v) => setForm({ ...form, is_visible: v })} label="Visible" />
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-white/[0.08]">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-[#00a99e] text-white hover:bg-[#008f86] transition-colors font-medium flex items-center gap-2"><Save className="w-4 h-4" />Save</button>
        </div>
      </Modal>

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">{items.length} articles</p>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00a99e] text-white hover:bg-[#008f86] transition-colors font-medium text-sm"><Plus className="w-4 h-4" />Add Blog Post</button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-white/[0.08]">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-white/5"><tr>
            <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Image</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Title</th>
            <th className="px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400">Status</th>
            <th className="px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400">Visible</th>
            <th className="px-4 py-3 text-right font-medium text-gray-500 dark:text-gray-400">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/[0.08]">
            {items.map((item) => (
              <tr key={item.id} className="bg-white dark:bg-[#1a1750] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <td className="px-4 py-3">{item.image ? <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/10" />}</td>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{item.title_en || item.title_uz || '-'}</td>
                <td className="px-4 py-3 text-center"><span className={`px-2 py-0.5 text-xs rounded-full font-medium ${item.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400'}`}>{item.status || 'draft'}</span></td>
                <td className="px-4 py-3 text-center">{item.is_visible !== false ? <Eye className="w-4 h-4 text-green-500 mx-auto" /> : <EyeOff className="w-4 h-4 text-gray-400 mx-auto" />}</td>
                <td className="px-4 py-3"><div className="flex gap-1 justify-end"><button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 text-blue-500 transition-colors"><Edit3 className="w-4 h-4" /></button><button onClick={() => setDeleteTarget(item)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ============================================================
// FAQ PANEL
// ============================================================

function FAQPanel() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [form, setForm] = useState<any>({})

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/faq')
      setItems(Array.isArray(res.data) ? res.data : res.data.items || res.data.data || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const openCreate = () => {
    setEditItem(null)
    setForm({ question_uz: '', question_ru: '', question_en: '', answer_uz: '', answer_ru: '', answer_en: '', category: '', is_visible: true, sort_order: 0 })
    setModalOpen(true)
  }

  const openEdit = (item: any) => { setEditItem(item); setForm({ ...item }); setModalOpen(true) }

  const handleSave = async () => {
    try {
      if (editItem) { await api.put(`/faq/${editItem.id}`, form) }
      else { await api.post('/faq', form) }
      setModalOpen(false); load()
    } catch (err) { console.error(err) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try { await api.delete(`/faq/${deleteTarget.id}`); load() }
    catch (err) { console.error(err) }
    finally { setDeleteTarget(null) }
  }

  if (loading) return <div className="flex justify-center py-20"><RefreshCw className="w-6 h-6 animate-spin text-[#00a99e]" /></div>

  return (
    <div>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete FAQ" message="Are you sure?" />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit FAQ' : 'Create FAQ'} size="lg">
        <div className="space-y-4">
          <TrilingualInput label="Question" valueUz={form.question_uz || ''} valueRu={form.question_ru || ''} valueEn={form.question_en || ''} onChangeUz={(v) => setForm({ ...form, question_uz: v })} onChangeRu={(v) => setForm({ ...form, question_ru: v })} onChangeEn={(v) => setForm({ ...form, question_en: v })} />
          <TrilingualInput label="Answer" valueUz={form.answer_uz || ''} valueRu={form.answer_ru || ''} valueEn={form.answer_en || ''} onChangeUz={(v) => setForm({ ...form, answer_uz: v })} onChangeRu={(v) => setForm({ ...form, answer_ru: v })} onChangeEn={(v) => setForm({ ...form, answer_en: v })} textarea />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Category"><TextInput value={form.category || ''} onChange={(v) => setForm({ ...form, category: v })} placeholder="Category" /></FormField>
            <FormField label="Sort Order"><TextInput value={String(form.sort_order || 0)} onChange={(v) => setForm({ ...form, sort_order: parseInt(v) || 0 })} type="number" /></FormField>
          </div>
          <Toggle value={form.is_visible !== false} onChange={(v) => setForm({ ...form, is_visible: v })} label="Visible" />
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-white/[0.08]">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-[#00a99e] text-white hover:bg-[#008f86] transition-colors font-medium flex items-center gap-2"><Save className="w-4 h-4" />Save</button>
        </div>
      </Modal>

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">{items.length} FAQ items</p>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00a99e] text-white hover:bg-[#008f86] transition-colors font-medium text-sm"><Plus className="w-4 h-4" />Add FAQ</button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="p-4 rounded-xl bg-white dark:bg-[#1a1750] border border-gray-100 dark:border-white/[0.08]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">{item.question_en || item.question_uz || '-'}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{item.answer_en || item.answer_uz || '-'}</p>
                <div className="flex gap-2 mt-2">
                  {item.category && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400">{item.category}</span>}
                  <span className="text-xs text-gray-400">Order: {item.sort_order ?? 0}</span>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 text-blue-500 transition-colors"><Edit3 className="w-4 h-4" /></button>
                <button onClick={() => setDeleteTarget(item)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// TESTIMONIALS PANEL
// ============================================================

function TestimonialsPanel() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [form, setForm] = useState<any>({})

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/testimonials')
      setItems(Array.isArray(res.data) ? res.data : res.data.items || res.data.data || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const openCreate = () => {
    setEditItem(null)
    setForm({ author_name: '', author_position: '', author_company: '', author_image: '', content_uz: '', content_ru: '', content_en: '', rating: 5 })
    setModalOpen(true)
  }

  const openEdit = (item: any) => { setEditItem(item); setForm({ ...item }); setModalOpen(true) }

  const handleSave = async () => {
    try {
      if (editItem) { await api.put(`/testimonials/${editItem.id}`, form) }
      else { await api.post('/testimonials', form) }
      setModalOpen(false); load()
    } catch (err) { console.error(err) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try { await api.delete(`/testimonials/${deleteTarget.id}`); load() }
    catch (err) { console.error(err) }
    finally { setDeleteTarget(null) }
  }

  if (loading) return <div className="flex justify-center py-20"><RefreshCw className="w-6 h-6 animate-spin text-[#00a99e]" /></div>

  return (
    <div>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Testimonial" message="Are you sure?" />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Testimonial' : 'Add Testimonial'} size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Author Name"><TextInput value={form.author_name || ''} onChange={(v) => setForm({ ...form, author_name: v })} placeholder="John Doe" /></FormField>
          <FormField label="Position"><TextInput value={form.author_position || ''} onChange={(v) => setForm({ ...form, author_position: v })} placeholder="CEO" /></FormField>
          <FormField label="Company"><TextInput value={form.author_company || ''} onChange={(v) => setForm({ ...form, author_company: v })} placeholder="Company Inc." /></FormField>
          <FormField label="Rating (1-5)"><TextInput value={String(form.rating || 5)} onChange={(v) => setForm({ ...form, rating: Math.min(5, Math.max(1, parseInt(v) || 5)) })} type="number" /></FormField>
          <div className="md:col-span-2"><ImageUploader value={form.author_image || ''} onChange={(v) => setForm({ ...form, author_image: v })} label="Author Photo" /></div>
          <div className="md:col-span-2"><TrilingualInput label="Content" valueUz={form.content_uz || ''} valueRu={form.content_ru || ''} valueEn={form.content_en || ''} onChangeUz={(v) => setForm({ ...form, content_uz: v })} onChangeRu={(v) => setForm({ ...form, content_ru: v })} onChangeEn={(v) => setForm({ ...form, content_en: v })} textarea /></div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-white/[0.08]">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-[#00a99e] text-white hover:bg-[#008f86] transition-colors font-medium flex items-center gap-2"><Save className="w-4 h-4" />Save</button>
        </div>
      </Modal>

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">{items.length} testimonials</p>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00a99e] text-white hover:bg-[#008f86] transition-colors font-medium text-sm"><Plus className="w-4 h-4" />Add Testimonial</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.id} className="p-5 rounded-xl bg-white dark:bg-[#1a1750] border border-gray-100 dark:border-white/[0.08]">
            <div className="flex items-start gap-3 mb-3">
              {item.author_image ? <img src={item.author_image} alt="" className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full bg-[#00a99e]/10 flex items-center justify-center"><Star className="w-5 h-5 text-[#00a99e]" /></div>}
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">{item.author_name}</h4>
                <p className="text-xs text-gray-500">{item.author_position}{item.author_company ? ` at ${item.author_company}` : ''}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(item)} className="p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-500/10 text-blue-500"><Edit3 className="w-3.5 h-3.5" /></button>
                <button onClick={() => setDeleteTarget(item)} className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{item.content_en || item.content_uz || '-'}</p>
            <div className="flex gap-0.5 mt-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`w-3.5 h-3.5 ${s <= (item.rating || 0) ? 'text-[#f9b13b] fill-[#f9b13b]' : 'text-gray-300'}`} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// EMPLOYEES PANEL
// ============================================================

function EmployeesPanel() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [form, setForm] = useState<any>({})

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/employees')
      setItems(Array.isArray(res.data) ? res.data : res.data.items || res.data.data || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const openCreate = () => {
    setEditItem(null)
    setForm({ name_uz: '', name_ru: '', name_en: '', position_uz: '', position_ru: '', position_en: '', image: '', bio_uz: '', bio_ru: '', bio_en: '' })
    setModalOpen(true)
  }

  const openEdit = (item: any) => { setEditItem(item); setForm({ ...item }); setModalOpen(true) }

  const handleSave = async () => {
    try {
      if (editItem) { await api.put(`/employees/${editItem.id}`, form) }
      else { await api.post('/employees', form) }
      setModalOpen(false); load()
    } catch (err) { console.error(err) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try { await api.delete(`/employees/${deleteTarget.id}`); load() }
    catch (err) { console.error(err) }
    finally { setDeleteTarget(null) }
  }

  if (loading) return <div className="flex justify-center py-20"><RefreshCw className="w-6 h-6 animate-spin text-[#00a99e]" /></div>

  return (
    <div>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Employee" message="Are you sure?" />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Employee' : 'Add Employee'} size="lg">
        <div className="space-y-4">
          <TrilingualInput label="Name" valueUz={form.name_uz || ''} valueRu={form.name_ru || ''} valueEn={form.name_en || ''} onChangeUz={(v) => setForm({ ...form, name_uz: v })} onChangeRu={(v) => setForm({ ...form, name_ru: v })} onChangeEn={(v) => setForm({ ...form, name_en: v })} />
          <TrilingualInput label="Position" valueUz={form.position_uz || ''} valueRu={form.position_ru || ''} valueEn={form.position_en || ''} onChangeUz={(v) => setForm({ ...form, position_uz: v })} onChangeRu={(v) => setForm({ ...form, position_ru: v })} onChangeEn={(v) => setForm({ ...form, position_en: v })} />
          <ImageUploader value={form.image || ''} onChange={(v) => setForm({ ...form, image: v })} label="Photo" />
          <TrilingualInput label="Bio" valueUz={form.bio_uz || ''} valueRu={form.bio_ru || ''} valueEn={form.bio_en || ''} onChangeUz={(v) => setForm({ ...form, bio_uz: v })} onChangeRu={(v) => setForm({ ...form, bio_ru: v })} onChangeEn={(v) => setForm({ ...form, bio_en: v })} textarea />
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-white/[0.08]">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-[#00a99e] text-white hover:bg-[#008f86] transition-colors font-medium flex items-center gap-2"><Save className="w-4 h-4" />Save</button>
        </div>
      </Modal>

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">{items.length} team members</p>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00a99e] text-white hover:bg-[#008f86] transition-colors font-medium text-sm"><Plus className="w-4 h-4" />Add Employee</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.id} className="group p-5 rounded-xl bg-white dark:bg-[#1a1750] border border-gray-100 dark:border-white/[0.08] text-center relative">
            <div className="w-20 h-20 rounded-full mx-auto mb-3 overflow-hidden bg-gray-100 dark:bg-white/10">
              {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover" /> : <Users className="w-8 h-8 text-gray-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white text-sm">{item.name_en || item.name_uz || '-'}</h4>
            <p className="text-xs text-[#00a99e]">{item.position_en || item.position_uz || '-'}</p>
            <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(item)} className="p-1 rounded bg-blue-50 dark:bg-blue-500/10 text-blue-500"><Edit3 className="w-3.5 h-3.5" /></button>
              <button onClick={() => setDeleteTarget(item)} className="p-1 rounded bg-red-50 dark:bg-red-500/10 text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// CERTIFICATES PANEL
// ============================================================

function CertificatesPanel() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [form, setForm] = useState<any>({})

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/certificates')
      setItems(Array.isArray(res.data) ? res.data : res.data.items || res.data.data || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const openCreate = () => {
    setEditItem(null)
    setForm({ title_uz: '', title_ru: '', title_en: '', image: '', issued_by: '', year: new Date().getFullYear() })
    setModalOpen(true)
  }

  const openEdit = (item: any) => { setEditItem(item); setForm({ ...item }); setModalOpen(true) }

  const handleSave = async () => {
    try {
      if (editItem) { await api.put(`/certificates/${editItem.id}`, form) }
      else { await api.post('/certificates', form) }
      setModalOpen(false); load()
    } catch (err) { console.error(err) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try { await api.delete(`/certificates/${deleteTarget.id}`); load() }
    catch (err) { console.error(err) }
    finally { setDeleteTarget(null) }
  }

  if (loading) return <div className="flex justify-center py-20"><RefreshCw className="w-6 h-6 animate-spin text-[#00a99e]" /></div>

  return (
    <div>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Certificate" message="Are you sure?" />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Certificate' : 'Add Certificate'} size="md">
        <div className="space-y-4">
          <TrilingualInput label="Title" valueUz={form.title_uz || ''} valueRu={form.title_ru || ''} valueEn={form.title_en || ''} onChangeUz={(v) => setForm({ ...form, title_uz: v })} onChangeRu={(v) => setForm({ ...form, title_ru: v })} onChangeEn={(v) => setForm({ ...form, title_en: v })} />
          <ImageUploader value={form.image || ''} onChange={(v) => setForm({ ...form, image: v })} label="Certificate Image" />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Issued By"><TextInput value={form.issued_by || ''} onChange={(v) => setForm({ ...form, issued_by: v })} placeholder="Organization" /></FormField>
            <FormField label="Year"><TextInput value={String(form.year || '')} onChange={(v) => setForm({ ...form, year: parseInt(v) || '' })} type="number" /></FormField>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-white/[0.08]">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-[#00a99e] text-white hover:bg-[#008f86] transition-colors font-medium flex items-center gap-2"><Save className="w-4 h-4" />Save</button>
        </div>
      </Modal>

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">{items.length} certificates</p>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00a99e] text-white hover:bg-[#008f86] transition-colors font-medium text-sm"><Plus className="w-4 h-4" />Add Certificate</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="group p-4 rounded-xl bg-white dark:bg-[#1a1750] border border-gray-100 dark:border-white/[0.08] relative">
            <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-50 dark:bg-white/5 mb-3">
              {item.image ? <img src={item.image} alt="" className="w-full h-full object-contain" /> : <div className="w-full h-full flex items-center justify-center"><Award className="w-10 h-10 text-gray-300" /></div>}
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">{item.title_en || item.title_uz || '-'}</h4>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {item.issued_by && <span>{item.issued_by}</span>}
              {item.year && <span className="flex items-center gap-0.5"><Calendar className="w-3 h-3" />{item.year}</span>}
            </div>
            <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(item)} className="p-1.5 rounded bg-white/90 dark:bg-black/50 text-blue-500 shadow-sm"><Edit3 className="w-3.5 h-3.5" /></button>
              <button onClick={() => setDeleteTarget(item)} className="p-1.5 rounded bg-white/90 dark:bg-black/50 text-red-500 shadow-sm"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// VACANCIES PANEL
// ============================================================

function VacanciesPanel() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [form, setForm] = useState<any>({})

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/vacancies')
      setItems(Array.isArray(res.data) ? res.data : res.data.items || res.data.data || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const openCreate = () => {
    setEditItem(null)
    setForm({ title_uz: '', title_ru: '', title_en: '', description_uz: '', description_ru: '', description_en: '', requirements_uz: '', requirements_ru: '', requirements_en: '', salary: '', location: '', type: 'full-time', status: 'active' })
    setModalOpen(true)
  }

  const openEdit = (item: any) => { setEditItem(item); setForm({ ...item }); setModalOpen(true) }

  const handleSave = async () => {
    try {
      if (editItem) { await api.put(`/vacancies/${editItem.id}`, form) }
      else { await api.post('/vacancies', form) }
      setModalOpen(false); load()
    } catch (err) { console.error(err) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try { await api.delete(`/vacancies/${deleteTarget.id}`); load() }
    catch (err) { console.error(err) }
    finally { setDeleteTarget(null) }
  }

  if (loading) return <div className="flex justify-center py-20"><RefreshCw className="w-6 h-6 animate-spin text-[#00a99e]" /></div>

  return (
    <div>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Vacancy" message="Are you sure?" />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Vacancy' : 'Create Vacancy'} size="lg">
        <div className="space-y-4">
          <TrilingualInput label="Title" valueUz={form.title_uz || ''} valueRu={form.title_ru || ''} valueEn={form.title_en || ''} onChangeUz={(v) => setForm({ ...form, title_uz: v })} onChangeRu={(v) => setForm({ ...form, title_ru: v })} onChangeEn={(v) => setForm({ ...form, title_en: v })} />
          <TrilingualInput label="Description" valueUz={form.description_uz || ''} valueRu={form.description_ru || ''} valueEn={form.description_en || ''} onChangeUz={(v) => setForm({ ...form, description_uz: v })} onChangeRu={(v) => setForm({ ...form, description_ru: v })} onChangeEn={(v) => setForm({ ...form, description_en: v })} textarea />
          <TrilingualInput label="Requirements" valueUz={form.requirements_uz || ''} valueRu={form.requirements_ru || ''} valueEn={form.requirements_en || ''} onChangeUz={(v) => setForm({ ...form, requirements_uz: v })} onChangeRu={(v) => setForm({ ...form, requirements_ru: v })} onChangeEn={(v) => setForm({ ...form, requirements_en: v })} textarea />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Salary"><TextInput value={form.salary || ''} onChange={(v) => setForm({ ...form, salary: v })} placeholder="e.g., $2000-3000" /></FormField>
            <FormField label="Location"><TextInput value={form.location || ''} onChange={(v) => setForm({ ...form, location: v })} placeholder="e.g., Tashkent" /></FormField>
            <FormField label="Type"><SelectInput value={form.type || 'full-time'} onChange={(v) => setForm({ ...form, type: v })} options={[{ value: 'full-time', label: 'Full-time' }, { value: 'part-time', label: 'Part-time' }, { value: 'remote', label: 'Remote' }, { value: 'contract', label: 'Contract' }, { value: 'internship', label: 'Internship' }]} /></FormField>
            <FormField label="Status"><SelectInput value={form.status || 'active'} onChange={(v) => setForm({ ...form, status: v })} options={[{ value: 'active', label: 'Active' }, { value: 'closed', label: 'Closed' }, { value: 'draft', label: 'Draft' }]} /></FormField>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-white/[0.08]">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-[#00a99e] text-white hover:bg-[#008f86] transition-colors font-medium flex items-center gap-2"><Save className="w-4 h-4" />Save</button>
        </div>
      </Modal>

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">{items.length} vacancies</p>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00a99e] text-white hover:bg-[#008f86] transition-colors font-medium text-sm"><Plus className="w-4 h-4" />Add Vacancy</button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-white/[0.08]">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-white/5"><tr>
            <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Title</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Location</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Salary</th>
            <th className="px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400">Type</th>
            <th className="px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400">Status</th>
            <th className="px-4 py-3 text-right font-medium text-gray-500 dark:text-gray-400">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/[0.08]">
            {items.map((item) => (
              <tr key={item.id} className="bg-white dark:bg-[#1a1750] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{item.title_en || item.title_uz || '-'}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400"><span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{item.location || '-'}</span></td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{item.salary || '-'}</td>
                <td className="px-4 py-3 text-center"><span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 font-medium">{item.type || '-'}</span></td>
                <td className="px-4 py-3 text-center"><span className={`px-2 py-0.5 text-xs rounded-full font-medium ${item.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : item.status === 'closed' ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' : 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-400'}`}>{item.status || 'draft'}</span></td>
                <td className="px-4 py-3"><div className="flex gap-1 justify-end"><button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 text-blue-500 transition-colors"><Edit3 className="w-4 h-4" /></button><button onClick={() => setDeleteTarget(item)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ============================================================
// SETTINGS PANEL
// ============================================================

function SiteDisplayToggles() {
  const [nationalEnabled, setNationalEnabled] = useState(true)

  useEffect(() => {
    const storedNational = localStorage.getItem('imprinta-national-identity')
    if (storedNational !== null) setNationalEnabled(storedNational === 'true')
  }, [])

  const toggleNational = () => {
    const next = !nationalEnabled
    setNationalEnabled(next)
    localStorage.setItem('imprinta-national-identity', String(next))
  }

  return (
    <div className="mb-6">
      <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3 px-1">Display Settings</h3>
      <div className="rounded-xl bg-white dark:bg-[#1a1750] border border-gray-100 dark:border-white/[0.08] divide-y divide-gray-100 dark:divide-white/[0.08]">
        <div className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Uzbek National Decorations</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Section dividers, patterns, footer ornament</p>
          </div>
          <button
            onClick={toggleNational}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${nationalEnabled ? 'bg-[#00a99e]' : 'bg-gray-300 dark:bg-gray-600'}`}
          >
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${nationalEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>
    </div>
  )
}

function PartnersTitleSettings() {
  const [titleUz, setTitleUz] = useState('')
  const [titleRu, setTitleRu] = useState('')
  const [titleEn, setTitleEn] = useState('')
  const [showTitle, setShowTitle] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    api.get('/settings').then(res => {
      const data = res.data || {}
      setTitleUz(data['partners_title_uz'] || 'Bizning Hamkorlar')
      setTitleRu(data['partners_title_ru'] || 'Наши Партнёры')
      setTitleEn(data['partners_title_en'] || 'Our Partners')
      setShowTitle(data['partners_title_visible'] !== 'false' && data['partners_title_visible'] !== false)
      setLoaded(true)
    }).catch(() => setLoaded(true))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put('/settings/bulk', [
        { key: 'partners_title_uz', value: titleUz, type: 'text', group: 'partners' },
        { key: 'partners_title_ru', value: titleRu, type: 'text', group: 'partners' },
        { key: 'partners_title_en', value: titleEn, type: 'text', group: 'partners' },
        { key: 'partners_title_visible', value: String(showTitle), type: 'boolean', group: 'partners' },
      ])
    } catch (err) { console.error(err) }
    finally { setSaving(false) }
  }

  if (!loaded) return null

  return (
    <div className="mb-6">
      <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3 px-1">Partners Section Title</h3>
      <div className="rounded-xl bg-white dark:bg-[#1a1750] border border-gray-100 dark:border-white/[0.08] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Show Title</p>
          <button
            onClick={() => setShowTitle(!showTitle)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${showTitle ? 'bg-[#00a99e]' : 'bg-gray-300 dark:bg-gray-600'}`}
          >
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${showTitle ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">UZ</label>
            <input value={titleUz} onChange={(e) => setTitleUz(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#00a99e]/50 focus:border-[#00a99e] outline-none" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">RU</label>
            <input value={titleRu} onChange={(e) => setTitleRu(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#00a99e]/50 focus:border-[#00a99e] outline-none" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">EN</label>
            <input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#00a99e]/50 focus:border-[#00a99e] outline-none" />
          </div>
        </div>
        <div className="flex justify-end">
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00a99e] text-white hover:bg-[#008f86] transition-colors font-medium text-sm disabled:opacity-50">
            <Save className="w-4 h-4" />{saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

interface SocialItem {
  id: string
  label: string
  url: string
  icon: string
}

function SocialLinksPanel() {
  const [items, setItems] = useState<SocialItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)

  useEffect(() => { loadLinks() }, [])

  const loadLinks = async () => {
    setLoading(true)
    try {
      const res = await api.get('/settings')
      const data = res.data || {}
      if (data['social.links'] && Array.isArray(data['social.links'])) {
        setItems(data['social.links'])
      }
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put('/settings', { key: 'social.links', value: items.filter(i => i.url.trim()), type: 'json', group: 'social' })
    } catch (err) { console.error(err) }
    finally { setSaving(false) }
  }

  const addItem = () => {
    setItems([...items, { id: crypto.randomUUID(), label: '', url: '', icon: '' }])
  }

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id))
  }

  const updateItem = (id: string, field: keyof SocialItem, value: string) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  const handleIconUpload = async (id: string, file: File) => {
    setUploading(id)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      const url = res.data?.url || res.data?.webp_url
      if (url) {
        updateItem(id, 'icon', url)
      }
    } catch (err) { console.error(err) }
    finally { setUploading(null) }
  }

  if (loading) return <div className="flex justify-center py-20"><RefreshCw className="w-6 h-6 animate-spin text-[#00a99e]" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">Ijtimoiy tarmoq havolalarini boshqaring</p>
        <div className="flex items-center gap-2">
          <button onClick={addItem} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors font-medium text-sm">
            <Plus className="w-4 h-4" /> Qo'shish
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00a99e] text-white hover:bg-[#008f86] transition-colors font-medium text-sm disabled:opacity-50">
            <Save className="w-4 h-4" />{saving ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <Globe className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">Hali ijtimoiy tarmoq havolasi yo'q</p>
          <button onClick={addItem} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00a99e] text-white hover:bg-[#008f86] transition-colors font-medium text-sm">
            <Plus className="w-4 h-4" /> Birinchi havolani qo'shing
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl bg-white dark:bg-[#1a1750] border border-gray-100 dark:border-white/[0.08] p-4">
              <div className="flex items-start gap-4">
                {/* Icon upload area */}
                <div className="flex-shrink-0">
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Icon</label>
                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleIconUpload(item.id, file)
                      }}
                    />
                    <div className="w-12 h-12 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 hover:border-[#00a99e] dark:hover:border-[#00a99e] flex items-center justify-center transition-colors overflow-hidden">
                      {uploading === item.id ? (
                        <RefreshCw className="w-5 h-5 animate-spin text-[#00a99e]" />
                      ) : item.icon ? (
                        <img src={item.icon} alt="" className="w-full h-full object-contain p-1" />
                      ) : (
                        <Upload className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </label>
                </div>

                {/* Label + URL */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Nomi</label>
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => updateItem(item.id, 'label', e.target.value)}
                      placeholder="Telegram"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#00a99e]/50 focus:border-[#00a99e] outline-none placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Havola (URL)</label>
                    <input
                      type="url"
                      value={item.url}
                      onChange={(e) => updateItem(item.id, 'url', e.target.value)}
                      placeholder="https://t.me/username"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#00a99e]/50 focus:border-[#00a99e] outline-none placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="mt-5 p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ContactInfoSettings() {
  const [phone, setPhone] = useState('')
  const [phone2, setPhone2] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [googleMaps, setGoogleMaps] = useState('')
  const [statsProjects, setStatsProjects] = useState('')
  const [statsClients, setStatsClients] = useState('')
  const [statsExperience, setStatsExperience] = useState('')
  const [statsEquipment, setStatsEquipment] = useState('')
  const [saving, setSaving] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    api.get('/settings').then(res => {
      const data = res.data || {}
      setPhone(data['contact_phone'] || data['phone'] || '')
      setPhone2(data['contact_phone2'] || data['phone2'] || '')
      setEmail(data['contact_email'] || data['email'] || '')
      setAddress(data['contact_address'] || data['address'] || '')
      setGoogleMaps(data['google_maps'] || '')
      setStatsProjects(data['stats_projects'] || '')
      setStatsClients(data['stats_clients'] || '')
      setStatsExperience(data['stats_experience'] || '')
      setStatsEquipment(data['stats_equipment'] || '')
      setLoaded(true)
    }).catch(() => setLoaded(true))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put('/settings/bulk', [
        { key: 'contact_phone', value: phone, type: 'text', group: 'contact' },
        { key: 'contact_phone2', value: phone2, type: 'text', group: 'contact' },
        { key: 'contact_email', value: email, type: 'text', group: 'contact' },
        { key: 'contact_address', value: address, type: 'text', group: 'contact' },
        { key: 'google_maps', value: googleMaps, type: 'text', group: 'contact' },
        { key: 'stats_projects', value: statsProjects, type: 'text', group: 'stats' },
        { key: 'stats_clients', value: statsClients, type: 'text', group: 'stats' },
        { key: 'stats_experience', value: statsExperience, type: 'text', group: 'stats' },
        { key: 'stats_equipment', value: statsEquipment, type: 'text', group: 'stats' },
      ])
    } catch (err) { console.error(err) }
    finally { setSaving(false) }
  }

  if (!loaded) return null

  return (
    <div className="mb-6 space-y-6">
      <div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3 px-1">Kontakt Ma&apos;lumotlari</h3>
        <div className="rounded-xl bg-white dark:bg-[#1a1750] border border-gray-100 dark:border-white/[0.08] p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Telefon (asosiy)</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+998 90 123 45 67" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#00a99e]/50 focus:border-[#00a99e] outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Telefon (qo&apos;shimcha)</label>
              <input value={phone2} onChange={(e) => setPhone2(e.target.value)} placeholder="+998 71 200 00 00" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#00a99e]/50 focus:border-[#00a99e] outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="info@imprinta.uz" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#00a99e]/50 focus:border-[#00a99e] outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Manzil</label>
              <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Toshkent, O'zbekiston" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#00a99e]/50 focus:border-[#00a99e] outline-none" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Google Maps URL</label>
            <input value={googleMaps} onChange={(e) => setGoogleMaps(e.target.value)} placeholder="https://maps.google.com/..." className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#00a99e]/50 focus:border-[#00a99e] outline-none" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3 px-1">Statistika (Hero Section)</h3>
        <div className="rounded-xl bg-white dark:bg-[#1a1750] border border-gray-100 dark:border-white/[0.08] p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Loyihalar</label>
              <input value={statsProjects} onChange={(e) => setStatsProjects(e.target.value)} placeholder="500+" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#00a99e]/50 focus:border-[#00a99e] outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Mijozlar</label>
              <input value={statsClients} onChange={(e) => setStatsClients(e.target.value)} placeholder="50+" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#00a99e]/50 focus:border-[#00a99e] outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Tajriba (yil)</label>
              <input value={statsExperience} onChange={(e) => setStatsExperience(e.target.value)} placeholder="5+" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#00a99e]/50 focus:border-[#00a99e] outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Jihozlar</label>
              <input value={statsEquipment} onChange={(e) => setStatsEquipment(e.target.value)} placeholder="20+" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#00a99e]/50 focus:border-[#00a99e] outline-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00a99e] text-white hover:bg-[#008f86] transition-colors font-medium text-sm disabled:opacity-50">
          <Save className="w-4 h-4" />{saving ? 'Saqlanmoqda...' : 'Saqlash'}
        </button>
      </div>
    </div>
  )
}

function SettingsPanel() {
  const [settings, setSettings] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editValues, setEditValues] = useState<Record<string, string>>({})

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/settings/grouped')
      setSettings(res.data)
      const flat: Record<string, string> = {}
      if (typeof res.data === 'object') {
        Object.entries(res.data).forEach(([group, items]: [string, any]) => {
          if (Array.isArray(items)) {
            items.forEach((item: any) => {
              if (typeof item.value === 'string' || typeof item.value === 'number') {
                flat[item.key || item.id] = String(item.value ?? '')
              }
            })
          } else if (typeof items === 'object') {
            Object.entries(items).forEach(([key, val]: [string, any]) => {
              if (typeof val !== 'object' || val === null) {
                flat[`${group}.${key}`] = String(val ?? '')
              } else if (typeof val === 'object' && val.value !== undefined && typeof val.value !== 'object') {
                flat[`${group}.${key}`] = String(val.value ?? '')
              }
            })
          }
        })
      }
      setEditValues(flat)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const updates = Object.entries(editValues).map(([key, value]) => ({ key, value }))
      await api.put('/settings/bulk', updates)
    } catch (err) {
      try {
        for (const [key, value] of Object.entries(editValues)) {
          await api.put('/settings', { key, value })
        }
      } catch (innerErr) { console.error(innerErr) }
    }
    finally { setSaving(false) }
  }

  if (loading) return <div className="flex justify-center py-20"><RefreshCw className="w-6 h-6 animate-spin text-[#00a99e]" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">Sayt sozlamalari</p>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00a99e] text-white hover:bg-[#008f86] transition-colors font-medium text-sm disabled:opacity-50">
          <Save className="w-4 h-4" />{saving ? 'Saqlanmoqda...' : 'Hammasini saqlash'}
        </button>
      </div>

      <ContactInfoSettings />
      <SiteDisplayToggles />
      <PartnersTitleSettings />

      {typeof settings === 'object' && Object.entries(settings).map(([group, items]: [string, any]) => (
        <div key={group} className="mb-6">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3 px-1">{group}</h3>
          <div className="rounded-xl bg-white dark:bg-[#1a1750] border border-gray-100 dark:border-white/[0.08] divide-y divide-gray-100 dark:divide-white/[0.08]">
            {Array.isArray(items) ? items.map((item: any) => (
              <div key={item.key || item.id} className="flex flex-col sm:flex-row sm:items-center gap-2 p-4">
                <div className="sm:w-1/3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label || item.key || item.id}</label>
                  {item.description && <p className="text-xs text-gray-400">{item.description}</p>}
                </div>
                <div className="sm:w-2/3">
                  <input
                    type="text"
                    value={editValues[item.key || item.id] || ''}
                    onChange={(e) => setEditValues({ ...editValues, [item.key || item.id]: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#00a99e]/50 focus:border-[#00a99e] outline-none"
                  />
                </div>
              </div>
            )) : typeof items === 'object' ? Object.entries(items).map(([key, val]: [string, any]) => (
              <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-2 p-4">
                <div className="sm:w-1/3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{key}</label>
                </div>
                <div className="sm:w-2/3">
                  <input
                    type="text"
                    value={editValues[`${group}.${key}`] || ''}
                    onChange={(e) => setEditValues({ ...editValues, [`${group}.${key}`]: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#00a99e]/50 focus:border-[#00a99e] outline-none"
                  />
                </div>
              </div>
            )) : null}
          </div>
        </div>
      ))}

      {Object.keys(settings).length === 0 && (
        <div className="text-center py-16">
          <Settings className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No settings found.</p>
        </div>
      )}
    </div>
  )
}
