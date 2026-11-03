'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import avarta from '@/public/images/avarta.jpg'
import { useI18n } from '@/contexts/I18nContext'
import { CV_PATH, scrollToId } from '@/lib/scroll'
import { pickLocalized } from '@/lib/i18nContent'

interface ProfileData {
  name: string
  title: string
  titleEn?: string
  avatar: string
}

function Home() {
  const { t, locale } = useI18n()
  const [profile, setProfile] = useState<ProfileData | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const result = await response.json()
        if (result.success) setProfile(result.data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const displayName = profile?.name || t.common.name
  const displayTitle =
    pickLocalized(locale, profile?.title, profile?.titleEn) || t.common.title

  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream-primary to-orange-50 dark:from-dark-bg dark:to-dark-card">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-4xl mx-auto text-center px-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-12"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-8"
          >
            <div className="w-40 h-40 mx-auto mb-8 rounded-full bg-gradient-to-br from-orange-primary to-brown-primary p-1 shadow-2xl">
              <div className="w-full h-full rounded-full bg-cream-primary dark:bg-dark-card flex items-center justify-center overflow-hidden">
                {profile?.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={displayName}
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      const nextElement = e.currentTarget.nextElementSibling as HTMLElement
                      if (nextElement) nextElement.style.display = 'block'
                    }}
                  />
                ) : null}
                <Image
                  src={avarta}
                  alt={displayName}
                  width={150}
                  height={150}
                  className="rounded-full"
                  style={{ display: profile?.avatar ? 'none' : 'block' }}
                />
              </div>
            </div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-5xl md:text-6xl font-bold mb-4 text-brown-primary dark:text-dark-text"
            >
              {displayName}
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-xl md:text-2xl text-orange-primary dark:text-orange-300 font-medium mb-6"
            >
              {displayTitle}
            </motion.p>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="text-brown-600 dark:text-dark-text-secondary text-lg leading-relaxed max-w-2xl mx-auto"
            >
              {t.home.shortBio}
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap"
          >

            <motion.a
              href={CV_PATH}
              download="Frontend-developer_Huynh-Quoc-Bao.pdf"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 border-2 border-brown-primary text-brown-primary dark:border-orange-300 dark:text-orange-300 hover:bg-brown-primary hover:text-white dark:hover:bg-orange-primary dark:hover:text-white rounded-lg font-medium transition-all duration-300"
            >
              {t.home.downloadCv}
            </motion.a>

            <motion.a
              href="#value"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault()
                scrollToId('value')
              }}
              className="px-8 py-3 border-2 border-orange-primary text-orange-primary hover:bg-orange-primary hover:text-white rounded-lg font-medium transition-all duration-300"
            >
              {t.home.learnMore}
            </motion.a>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Home
