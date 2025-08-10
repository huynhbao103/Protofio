'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import avarta from '@/public/images/avarta.jpg'

interface ProfileData {
  name: string
  title: string
  avatar: string
}

function Home() {
  const [profile, setProfile] = useState<ProfileData | null>(null)

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
    }
  }
  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream-primary to-orange-50 dark:from-dark-bg dark:to-dark-card">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto text-center px-4"
      >
        {/* Hero Section */}
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
                    alt={profile.name || 'Huỳnh Quốc Bảo'}
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      // Fallback to static image if profile avatar fails
                      e.currentTarget.style.display = 'none'
                      const nextElement = e.currentTarget.nextElementSibling as HTMLElement
                      if (nextElement) {
                        nextElement.style.display = 'block'
                      }
                    }}
                  />
                ) : null}
                <Image 
                  src={avarta} 
                  alt="Huỳnh Quốc Bảo" 
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
              {profile?.name || 'Huỳnh Quốc Bảo'}
            </motion.h1>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-xl md:text-2xl text-orange-primary dark:text-orange-300 font-medium mb-6"
            >
              {profile?.title || 'Frontend Developer'}
            </motion.p>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="text-brown-600 dark:text-dark-text-secondary text-lg leading-relaxed max-w-2xl mx-auto"
            >
              Đam mê tạo ra những trải nghiệm web hiện đại và tương tác. 
              Chuyên về React, Next.js và các công nghệ frontend tiên tiến.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault()
                const element = document.getElementById('contact')
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              className="px-8 py-3 bg-orange-primary hover:bg-brown-primary text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              <span>💬</span>
              Liên hệ với tôi
            </motion.a>
            
            <motion.a
              href="#about"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault()
                const element = document.getElementById('about')
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              className="px-8 py-3 border-2 border-orange-primary text-orange-primary hover:bg-orange-primary hover:text-white rounded-lg font-medium transition-all duration-300 flex items-center gap-2"
            >
              <span>👋</span>
              Tìm hiểu thêm
            </motion.a>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Home
