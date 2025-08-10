'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from 'antd'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { useAuth } from '@/contexts/AuthContext'

function Header() {
  const [dark, setDark] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const pathname = usePathname()
  const { user, logout } = useAuth()

  // Fix hydration issue - Default to Light Mode
  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      // Check localStorage first, then default to light mode
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        setDark(savedTheme === 'dark')
      } else {
        // Default to light mode instead of system preference
        setDark(false)
        localStorage.setItem('theme', 'light')
      }
    }
  }, [])

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'projects', 'contact']
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
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full backdrop-blur-md bg-cream-primary/90 dark:bg-dark-bg/90 shadow-lg border-b border-brown-200/30 dark:border-dark-card/30 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Link href="/" className="group">
              <h1 className="text-4xl font-bold text-brown-primary dark:text-dark-text group-hover:text-orange-primary transition-all duration-300">
                Huỳnh Quốc Bảo
              </h1>
              <p className="text-brown-600 dark:text-dark-text-secondary mt-1 text-sm font-medium">
                Frontend Developer
              </p>
            </Link>
          </motion.div>

          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center gap-6"
          >
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {[
                { id: 'home', label: '01. Home', href: '#home' },
                { id: 'about', label: '02. About', href: '#about' },
                { id: 'skills', label: '03. Skills', href: '#skills' },
                { id: 'projects', label: '04. Projects', href: '#projects' },
                { id: 'contact', label: '05. Contact', href: '#contact' },
              ].map((item, index) => (
                <motion.a
                  key={item.id}
                  href={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  onClick={(e) => {
                    e.preventDefault()
                    const element = document.getElementById(item.id)
                    if (element) {
                      element.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                      })
                    }
                  }}
                  className="group relative px-4 py-2 text-sm font-mono font-medium text-brown-600 dark:text-dark-text-secondary hover:text-orange-primary dark:hover:text-orange-300 transition-all duration-300 cursor-pointer"
                >
                  <span className="relative z-10">{item.label}</span>
                  <div className="absolute inset-0 rounded-lg bg-orange-primary/5 dark:bg-orange-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-orange-primary group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
              
              {user && process.env.NODE_ENV === 'development' && (
                <div className="flex items-center gap-2 ml-4">
                  <Link
                    href="/admin"
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      pathname === '/admin' 
                        ? 'bg-brown-primary/10 dark:bg-orange-primary/20 text-brown-primary dark:text-orange-300' 
                        : 'text-brown-600 dark:text-dark-text-secondary hover:text-brown-primary dark:hover:text-orange-300 hover:bg-brown-primary/5 dark:hover:bg-orange-primary/10'
                    }`}
                  >
                    📊 Admin
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-brown-600 dark:text-dark-text-secondary hover:text-orange-primary dark:hover:text-orange-300 transition-colors"
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <motion.div
                  animate={mobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                  className="w-full h-0.5 bg-current transition-all duration-300"
                />
                <motion.div
                  animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                  className="w-full h-0.5 bg-current transition-all duration-300"
                />
                <motion.div
                  animate={mobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                  className="w-full h-0.5 bg-current transition-all duration-300"
                />
              </div>
            </button>

            {user && (
              <div className="flex items-center gap-3">
                <div className="text-sm text-brown-600 dark:text-dark-text-secondary">
                  <UserOutlined className="mr-1" />
                  {user.username}
                </div>
                <Button
                  type="text"
                  icon={<LogoutOutlined />}
                  onClick={logout}
                  className="text-brown-600 dark:text-dark-text-secondary hover:text-orange-primary dark:hover:text-orange-300"
                  size="small"
                >
                  Đăng xuất
                </Button>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDark((d) => !d)}
              className="p-3 rounded-full bg-brown-100 dark:bg-dark-card shadow-lg hover:shadow-xl hover:bg-orange-100 dark:hover:bg-brown-800 transition-all duration-300 border border-brown-300/50 dark:border-orange-500/30"
              aria-label="Toggle dark mode"
            >
              <motion.span
                initial={false}
                animate={{ rotate: dark ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-xl block"
              >
                {mounted ? (dark ? '🌙' : '☀️') : '☀️'}
              </motion.span>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-cream-primary/95 dark:bg-dark-bg/95 backdrop-blur-md border-t border-brown-200/30 dark:border-dark-card/30"
          >
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col space-y-4">
                {[
                  { id: 'home', label: '01. Home', href: '#home' },
                  { id: 'about', label: '02. About', href: '#about' },
                  { id: 'skills', label: '03. Skills', href: '#skills' },
                  { id: 'portfolio', label: '04. Portfolio', href: '#portfolio' },
                  { id: 'contact', label: '05. Contact', href: '#contact' },
                ].map((item, index) => (
                  <motion.a
                    key={item.id}
                    href={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                    onClick={(e) => {
                      e.preventDefault()
                      const element = document.getElementById(item.id)
                      if (element) {
                        element.scrollIntoView({ 
                          behavior: 'smooth', 
                          block: 'start' 
                        })
                      }
                      setMobileMenuOpen(false)
                    }}
                    className={`block px-4 py-3 rounded-lg font-mono font-medium transition-all duration-300 ${
                      activeSection === item.id
                        ? 'bg-orange-primary/10 text-orange-primary dark:text-orange-300'
                        : 'text-brown-600 dark:text-dark-text-secondary hover:text-orange-primary dark:hover:text-orange-300 hover:bg-orange-primary/5'
                    }`}
                  >
                    {item.label}
                  </motion.a>
                ))}
                
                {user ? (
                  <div className="pt-4 border-t border-brown-200/30 dark:border-dark-card/30 space-y-3">
                    {process.env.NODE_ENV === 'development' && (
                      <Link
                        href="/admin"
                        className="block px-4 py-3 rounded-lg font-medium text-brown-600 dark:text-dark-text-secondary hover:text-orange-primary dark:hover:text-orange-300 hover:bg-orange-primary/5 transition-all duration-300"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout()
                        setMobileMenuOpen(false)
                      }}
                      className="block w-full text-left px-4 py-3 rounded-lg font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
                    >
                      Đăng xuất
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-brown-200/30 dark:border-dark-card/30">
                    <Link
                      href="/login"
                      className="block px-4 py-3 rounded-lg font-medium text-brown-600 dark:text-dark-text-secondary hover:text-orange-primary dark:hover:text-orange-300 hover:bg-orange-primary/5 transition-all duration-300"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Đăng nhập
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Header
