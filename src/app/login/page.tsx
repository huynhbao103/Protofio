'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import LoginForm from '@/components/LoginForm'
import { Spin } from 'antd'
import { isLocalClient } from '@/lib/isLocal'

export default function LoginPage() {
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

    if (!loading && user) {
      router.push('/admin')
    }
  }, [user, loading, router])

  if (!checkedLocal || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  if (!isLocal || user) return null

  return <LoginForm />
}
