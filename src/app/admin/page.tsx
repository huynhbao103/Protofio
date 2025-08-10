'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import AdminPanel from '@/components/AdminPanel'
import { Spin } from 'antd'

export default function AdminPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect to home in production
    if (process.env.NODE_ENV === 'production') {
      router.push('/')
      return
    }
    
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
        <p className="ml-4 text-brown-600 dark:text-dark-text-secondary">
          Checking authentication...
        </p>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  return <AdminPanel />
}