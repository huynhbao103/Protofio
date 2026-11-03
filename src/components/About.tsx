'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Spin } from 'antd'
import { useI18n } from '@/contexts/I18nContext'
import { pickLocalized } from '@/lib/i18nContent'

interface ProfileData {
  name: string
  title: string
  titleEn?: string
  bio?: string
  bioEn?: string
  avatar: string
  skills: string[]
}

function About() {
  const { t, locale } = useI18n()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)

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
    } finally {
      setLoading(false)
    }
  }

  const name = profile?.name || t.common.name
  const title = pickLocalized(locale, profile?.title, profile?.titleEn) || t.common.title
  const bio = pickLocalized(locale, profile?.bio, profile?.bioEn) || t.about.bio
  const skills = profile?.skills?.length ? profile.skills : t.skills.tags

  if (loading) {
    return (
      <section id="about" className="py-20 bg-white-primary dark:bg-dark-bg">
        <div className="container mx-auto px-4 max-w-6xl flex items-center justify-center min-h-[400px]">
          <Spin size="large" />
        </div>
      </section>
    )
  }

  return (
    <section id="about" className="py-20 bg-white-primary dark:bg-dark-bg">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-brown-primary dark:text-orange-300 mb-4"
          >
            {t.about.heading}
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '100px' }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="h-1 bg-gradient-to-r from-orange-primary to-brown-primary mx-auto rounded-full"
          />
        </motion.div>

        {/* Intro: avatar + bio */}
        <div className="grid lg:grid-cols-[240px_1fr] gap-10 lg:gap-12 items-start mb-14">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mx-auto lg:mx-0"
          >
            <div className="w-56 h-56 sm:w-60 sm:h-60 rounded-2xl bg-gradient-to-br from-orange-primary to-brown-primary p-1">
              <div className="w-full h-full rounded-2xl bg-cream-primary dark:bg-dark-card flex items-center justify-center overflow-hidden">
                {profile?.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={name}
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      const nextElement = e.currentTarget.nextElementSibling as HTMLElement
                      if (nextElement) nextElement.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div
                  className="w-full h-full flex items-center justify-center text-6xl font-bold text-brown-primary dark:text-orange-300"
                  style={{ display: profile?.avatar ? 'none' : 'flex' }}
                >
                  {name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-4"
          >
            <p className="text-brown-600 dark:text-dark-text-secondary leading-relaxed text-lg">
              {t.about.greeting}{' '}
              <span className="font-semibold text-orange-primary">{name}</span>, {title}.
            </p>
            <p className="text-brown-600 dark:text-dark-text-secondary leading-relaxed">
              {bio}
            </p>
            <p className="text-brown-600 dark:text-dark-text-secondary leading-relaxed">
              {t.about.studentNote}
            </p>

            {skills.length > 0 && (
              <div className="pt-2">
                <h4 className="text-brown-primary dark:text-orange-300 font-semibold mb-3">
                  {t.about.mainSkills}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Experience + Education aligned side by side */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="flex flex-col h-full"
          >
            <h3 className="text-xl font-bold text-brown-primary dark:text-orange-300 mb-4 min-h-[28px]">
              {t.about.experience}
            </h3>
            <div className="flex-1 space-y-4">
              {t.about.experienceItems.map((item, index) => (
                <div
                  key={`${item.company}-${index}`}
                  className="h-full p-5 rounded-2xl bg-cream-primary dark:bg-dark-card border border-brown-200/30 dark:border-orange-500/20"
                >
                  <div className="flex flex-col gap-2 mb-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h4 className="font-semibold text-brown-primary dark:text-dark-text text-base leading-snug">
                        {item.title}
                      </h4>
                      <span className="shrink-0 text-xs sm:text-sm text-orange-primary dark:text-orange-300 font-mono bg-orange-100/70 dark:bg-orange-900/30 px-2.5 py-1 rounded-full">
                        {item.period}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-brown-600 dark:text-dark-text-secondary">
                      {item.company}
                    </p>
                  </div>
                  <p className="text-sm text-brown-600 dark:text-dark-text-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08, duration: 0.55 }}
            className="flex flex-col h-full"
          >
            <h3 className="text-xl font-bold text-brown-primary dark:text-orange-300 mb-4 min-h-[28px]">
              {t.about.education}
            </h3>
            <div className="flex-1 space-y-4">
              {t.about.educationItems.map((item, index) => (
                <div
                  key={`${item.institution}-${index}`}
                  className="h-full p-5 rounded-2xl bg-cream-primary dark:bg-dark-card border border-brown-200/30 dark:border-orange-500/20"
                >
                  <div className="flex flex-col gap-2 mb-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h4 className="font-semibold text-brown-primary dark:text-dark-text text-base leading-snug">
                        {item.degree}
                      </h4>
                      <span className="shrink-0 text-xs sm:text-sm text-orange-primary dark:text-orange-300 font-mono bg-orange-100/70 dark:bg-orange-900/30 px-2.5 py-1 rounded-full">
                        {item.period}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-brown-600 dark:text-dark-text-secondary">
                      {item.institution}
                    </p>
                  </div>
                  {item.description && (
                    <p className="text-sm text-brown-600 dark:text-dark-text-secondary leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
