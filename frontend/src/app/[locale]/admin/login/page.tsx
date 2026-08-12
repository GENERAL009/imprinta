'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, User, Eye, EyeOff } from 'lucide-react'
import { api } from '@/lib/api'
import { useLocale } from 'next-intl'
import Image from 'next/image'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const locale = useLocale()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { username, password })
      localStorage.setItem('access_token', res.data.access_token)
      localStorage.setItem('refresh_token', res.data.refresh_token)
      router.push(`/${locale}/admin/dashboard`)
    } catch {
      setError('Login yoki parol noto\'g\'ri')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-brand-navy via-brand-navy-dark to-brand-navy relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-brand-teal/[0.06] blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-brand-gold/[0.04] blur-[80px]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,169,158,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,169,158,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="p-8 md:p-10 rounded-[2rem] bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] shadow-2xl">
          <div className="text-center mb-8">
            <div className="relative w-[60px] h-[60px] mx-auto mb-5">
              <Image
                src="/images/logo-icon.png"
                alt="ImPrinta"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-[13px] text-white/40 mt-2">Tizimga kirish</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/30 text-[14px] focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal/40 transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/30 text-[14px] focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal/40 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-[13px] text-center bg-red-500/[0.08] py-2 rounded-xl"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-brand-teal text-white font-semibold text-[15px]
                shadow-[0_8px_32px_rgba(0,169,158,0.35)]
                hover:shadow-[0_12px_40px_rgba(0,169,158,0.5)]
                hover:-translate-y-0.5 active:translate-y-0
                transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? 'Kirish...' : 'Kirish'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
