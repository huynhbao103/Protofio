'use client'

import { motion } from 'framer-motion'
import { useI18n } from '@/contexts/I18nContext'

export default function ValueProps() {
  const { t } = useI18n()

  return (
    <section id="value" className="py-20 bg-gradient-to-br from-cream-primary to-orange-50 dark:from-dark-bg dark:to-dark-card">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-brown-primary dark:text-orange-300 mb-4">
            {t.value.heading}
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-orange-primary to-brown-primary mx-auto rounded-full mb-6" />
          <p className="text-brown-600 dark:text-dark-text-secondary text-lg max-w-3xl mx-auto">
            {t.value.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5 mb-12">
          {t.value.items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
              className="p-6 rounded-2xl bg-white-primary dark:bg-dark-card border border-brown-200/40 dark:border-orange-500/20 shadow-sm"
            >
              <h3 className="text-xl font-bold text-brown-primary dark:text-orange-300 mb-2">
                {item.title}
              </h3>
              <p className="text-brown-600 dark:text-dark-text-secondary leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-orange-primary/30 dark:border-orange-500/40 bg-white-primary dark:bg-dark-card p-8 md:p-10"
        >
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-orange-primary/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-10 w-48 h-48 rounded-full bg-brown-primary/10 blur-2xl pointer-events-none" />

          <div className="relative grid lg:grid-cols-[1.2fr_1fr] gap-8 items-start">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-orange-primary mb-3">
                <span className="w-2 h-2 rounded-full bg-orange-primary animate-pulse" />
                AI × Engineering
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-brown-primary dark:text-orange-300 mb-4">
                {t.value.aiTitle}
              </h3>
              <p className="text-brown-600 dark:text-dark-text-secondary leading-relaxed text-lg">
                {t.value.aiBody}
              </p>
            </div>

            <ul className="space-y-3">
              {t.value.aiPoints.map((point, index) => (
                <motion.li
                  key={point}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + index * 0.08, duration: 0.4 }}
                  className="flex gap-3 items-start p-3 rounded-xl bg-cream-primary/80 dark:bg-dark-bg/60 border border-brown-200/30 dark:border-orange-500/15"
                >
                  <span className="mt-0.5 text-orange-primary font-bold">✓</span>
                  <span className="text-brown-700 dark:text-dark-text-secondary text-sm md:text-base leading-relaxed">
                    {point}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
