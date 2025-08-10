'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { message } from 'antd'
import Cookies from 'js-cookie'

interface User {
  id: string
  username: string
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check authentication status
  const checkAuth = async () => {
    try {
      // Skip auth check in production
      if (process.env.NODE_ENV === 'production') {
        setUser(null)
        setLoading(false)
        return
      }
      
      const token = Cookies.get('auth-token')
      if (!token) {
        setUser(null)
        setLoading(false)
        return
      }

      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      })
      
      const data = await response.json()
      
      if (data.success) {
        setUser(data.data)
      } else {
        setUser(null)
        Cookies.remove('auth-token')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
      Cookies.remove('auth-token')
    } finally {
      setLoading(false)
    }
  }

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      })

      const data = await response.json()

      if (data.success) {
        setUser(data.data.user)
        // Cookie is set by the server
        message.success('Đăng nhập thành công!')
        return true
      } else {
        message.error(data.error || 'Đăng nhập thất bại')
        return false
      }
    } catch (error) {
      console.error('Login failed:', error)
      message.error('Có lỗi xảy ra khi đăng nhập')
      return false
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      
      setUser(null)
      Cookies.remove('auth-token')
      message.success('Đăng xuất thành công!')
    } catch (error) {
      console.error('Logout failed:', error)
      // Still clear local state even if API call fails
      setUser(null)
      Cookies.remove('auth-token')
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


