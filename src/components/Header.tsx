'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from 'antd'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { useAuth } from '@/contexts/AuthContext'
import { useI18n } from '@/contexts/I18nContext'
import { isLocalClient } from '@/lib/isLocal'
import LanguageSwitcher from './LanguageSwitcher'
import { scrollToId } from '@/lib/scroll'

function Header() {
  const [dark, setDark] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isLocal, setIsLocal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { t } = useI18n()

  const navItems = [
    { id: 'home', num: '01', label: t.nav.home },
    { id: 'about', num: '02', label: t.nav.about },
    { id: 'value', num: '03', label: t.nav.value },
    { id: 'skills', num: '04', label: t.nav.skills },
    { id: 'projects', num: '05', label: t.nav.projects },
    { id: 'contact', num: '06', label: t.nav.contact },
  ]

  useEffect(() => {
    setMounted(true)
    setIsLocal(isLocalClient())
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setDark(savedTheme === 'dark')
    } else {
      setDark(false)
      localStorage.setItem('theme', 'light')
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'value', 'skills', 'projects', 'contact']
      const scrollPosition = window.scrollY + 100
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full backdrop-blur-md bg-cream-primary/90 dark:bg-dark-bg/90 shadow-lg border-b border-brown-200/30 dark:border-dark-card/30 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex justify-between items-center max-w-6xl mx-auto gap-4">
          <Link href="/" className="group shrink-0">
            <h1 className="text-xl md:text-2xl font-bold text-brown-primary dark:text-dark-text group-hover:text-orange-primary transition-all duration-300">
              {t.common.name}
            </h1>
            <p className="text-brown-600 dark:text-dark-text-secondary mt-0.5 text-xs sm:text-sm font-medium">
              {t.common.title}
            </p>
          </Link>

          <div className="flex items-center gap-3 shrink-0">
            <nav className="hidden xl:flex items-center gap-1">
              {navItems.map((item, index) => {
                const active = activeSection === item.id
                return (
                  <motion.a
                    key={item.id}
                    href={`#${item.id}`}
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 * index, duration: 0.35 }}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToId(item.id)
                    }}
                    className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-200 cursor-pointer ${
                      active
                        ? 'bg-orange-primary/10 text-orange-primary dark:text-orange-300'
                        : 'text-brown-600 dark:text-dark-text-secondary hover:text-orange-primary hover:bg-orange-primary/5'
                    }`}
                  >
                    <span className="w-5 font-mono text-xs tabular-nums opacity-70">
                      {item.num}
                    </span>
                    <span>{item.label}</span>
                  </motion.a>
                )
              })}

              {isLocal && user && (
                <Link
                  href="/admin"
                  className={`ml-1 inline-flex items-center h-9 px-3 rounded-lg text-sm font-medium transition-colors ${
                    pathname === '/admin'
                      ? 'bg-brown-primary/10 text-brown-primary dark:text-orange-300'
                      : 'text-brown-600 dark:text-dark-text-secondary hover:text-orange-primary'
                  }`}
                >
                  {t.nav.admin}
                </Link>
              )}
            </nav>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-brown-600 dark:text-dark-text-secondary"
              aria-label="Menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <motion.div animate={mobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} className="w-full h-0.5 bg-current" />
                <motion.div animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }} className="w-full h-0.5 bg-current" />
                <motion.div animate={mobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} className="w-full h-0.5 bg-current" />
              </div>
            </button>

            {isLocal && user && (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-xs text-brown-600 dark:text-dark-text-secondary">
                  <UserOutlined className="mr-1" />
                  {user.username}
                </span>
                <Button type="text" icon={<LogoutOutlined />} onClick={logout} size="small">
                  {t.nav.logout}
                </Button>
              </div>
            )}

            <LanguageSwitcher />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDark((d) => !d)}
              className="p-2.5 rounded-full bg-brown-100 dark:bg-dark-card shadow hover:shadow-md border border-brown-300/50 dark:border-orange-500/30"
              aria-label={dark ? t.common.lightMode : t.common.darkMode}
            >
              <span className="text-lg">{mounted ? (dark ? '🌙' : '☀️') : '☀️'}</span>
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden border-t border-brown-200/30 dark:border-dark-card/30 bg-cream-primary/95 dark:bg-dark-bg/95 backdrop-blur-md"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navItems.map((item) => {
                const active = activeSection === item.id
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToId(item.id)
                      setMobileMenuOpen(false)
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                      active
                        ? 'bg-orange-primary/10 text-orange-primary'
                        : 'text-brown-600 dark:text-dark-text-secondary'
                    }`}
                  >
                    <span className="w-6 font-mono text-xs tabular-nums opacity-70">{item.num}</span>
                    <span>{item.label}</span>
                  </a>
                )
              })}

              {isLocal && (
                <div className="pt-3 mt-2 border-t border-brown-200/30 dark:border-dark-card/30 space-y-1">
                  {user ? (
                    <>
                      <Link href="/admin" className="block px-4 py-3 rounded-lg text-sm" onClick={() => setMobileMenuOpen(false)}>
                        {t.nav.admin}
                      </Link>
                      <button
                        className="block w-full text-left px-4 py-3 rounded-lg text-sm text-red-600"
                        onClick={() => {
                          logout()
                          setMobileMenuOpen(false)
                        }}
                      >
                        {t.nav.logout}
                      </button>
                    </>
                  ) : (
                    <Link href="/login" className="block px-4 py-3 rounded-lg text-sm" onClick={() => setMobileMenuOpen(false)}>
                      {t.nav.login}
                    </Link>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Header
