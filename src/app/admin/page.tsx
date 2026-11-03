'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import AdminPanel from '@/components/AdminPanel'
import { Spin } from 'antd'
import { isLocalClient } from '@/lib/isLocal'

export default function AdminPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isLocal, setIsLocal] = useState(false)
  const [checkedLocal, setCheckedLocal] = useState(false)

  useEffect(() => {
    const local = isLocalClient()
    setIsLocal(local)
    setCheckedLocal(true)

    if (!local) {
      router.push('/')
      return
    }

    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (!checkedLocal || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
        <p className="ml-4 text-brown-600 dark:text-dark-text-secondary">
          Checking authentication...
        </p>
      </div>
    )
  }

  if (!isLocal || !user) return null

  return <AdminPanel />
}
