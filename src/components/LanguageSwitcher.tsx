'use client'

import { motion } from 'framer-motion'
import { useI18n } from '@/contexts/I18nContext'
import type { Locale } from '@/i18n'

const options: { code: Locale; label: string }[] = [
  { code: 'vi', label: 'VI' },
  { code: 'en', label: 'EN' },
]

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n()

  return (
    <div
      className="inline-flex items-center rounded-full border border-brown-300/50 dark:border-orange-500/30 bg-brown-100/80 dark:bg-dark-card p-1 shadow-sm"
      role="group"
      aria-label={t.common.language}
    >
      {options.map((option) => {
        const active = locale === option.code
        return (
          <motion.button
            key={option.code}
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => setLocale(option.code)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
              active
                ? 'bg-orange-primary text-white shadow'
                : 'text-brown-600 dark:text-dark-text-secondary hover:text-orange-primary'
            }`}
            aria-pressed={active}
          >
            {option.label}
          </motion.button>
        )
      })}
    </div>
  )
}
