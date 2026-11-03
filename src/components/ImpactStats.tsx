'use client'

import { motion } from 'framer-motion'
import { useI18n } from '@/contexts/I18nContext'

export default function ImpactStats() {
  const { t } = useI18n()

  return (
    <section
      aria-label={t.impact.heading}
      className="py-10 md:py-14 bg-gradient-to-r from-brown-primary via-orange-primary to-brown-primary"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-10">
          {t.impact.items.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.45 }}
              className="text-center text-white px-2"
            >
              <div className="text-3xl md:text-4xl font-bold font-mono mb-2 tracking-tight">
                {item.value}
              </div>
              <p className="text-sm md:text-base text-white/90 leading-snug">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
