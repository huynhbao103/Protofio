'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, Spin } from 'antd'

interface ProfileData {
  name: string
  title: string
  bio: string
  avatar: string
  skills: string[]
}

function About() {
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
        if (result.success) {
          setProfile(result.data)
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }


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
            <span className="font-mono text-lg text-orange-primary"></span> About Me
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '100px' }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="h-1 bg-gradient-to-r from-orange-primary to-brown-primary mx-auto rounded-full"
          />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Bio */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="relative">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="w-64 h-64 mx-auto lg:mx-0 rounded-2xl bg-gradient-to-br from-orange-primary to-brown-primary p-1"
              >
                <div className="w-full h-full rounded-2xl bg-cream-primary dark:bg-dark-card flex items-center justify-center overflow-hidden">
                  {profile?.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={profile.name || 'Profile Avatar'}
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e) => {
                        // Fallback to text avatar if image fails to load
                        e.currentTarget.style.display = 'none'
                        const nextElement = e.currentTarget.nextElementSibling as HTMLElement
                        if (nextElement) {
                          nextElement.style.display = 'flex'
                        }
                      }}
                    />
                  ) : null}
                  <div
                    className="w-full h-full flex items-center justify-center text-6xl font-bold text-brown-primary dark:text-orange-300"
                    style={{ display: profile?.avatar ? 'none' : 'flex' }}
                  >
                    {profile?.name ? profile.name.split(' ').map(n => n[0]).join('') : 'HB'}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-brown-600 dark:text-dark-text-secondary leading-relaxed">
                Xin chào! Tôi là <span className="font-semibold text-orange-primary">{profile?.name || 'Huỳnh Quốc Bảo'}</span>,
                một {profile?.title || 'Frontend Developer'} đam mê tạo ra những trải nghiệm web tuyệt vời.
              </p>

              <p className="text-brown-600 dark:text-dark-text-secondary leading-relaxed">
                Là sinh viên năm cuối của chuyên ngành Công nghệ Phần mền, tôi đam mê và tập trung vào việc phát triển các ứng dụng web.
              </p>
              <p className="text-brown-600 dark:text-dark-text-secondary leading-relaxed">
                Mỗi dự án đều là cơ hội để học hỏi và cải thiện kỹ năng của mình.
              </p>

              {profile?.skills && profile.skills.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-brown-primary dark:text-orange-300 font-semibold mb-3">Kỹ năng chính:</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
