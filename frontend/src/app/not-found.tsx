'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-light-bg dark:bg-dark-bg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="text-8xl md:text-9xl font-bold text-gradient mb-4">404</div>
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-light-text dark:text-dark-text">Page Not Found</h1>
        <p className="text-light-text-secondary dark:text-dark-text-secondary mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed or is temporarily unavailable.
        </p>
        <Link
          href="/"
          className="inline-flex px-8 py-4 rounded-full bg-brand-teal text-white font-semibold shadow-xl shadow-brand-teal/25 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
        >
          Go Home
        </Link>
      </motion.div>
    </div>
  )
}
