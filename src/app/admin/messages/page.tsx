'use client'

import React from 'react'
import { motion } from 'framer-motion'
import ContactMessages from '@/components/ContactMessages'
import { Button } from 'antd'
import Link from 'next/link'
import { ArrowLeftOutlined } from '@ant-design/icons'

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-primary to-orange-50 dark:from-dark-bg dark:to-dark-card py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <Link href="/admin">
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                className="text-brown-primary dark:text-orange-300"
              >
                Quay lại Admin Panel
              </Button>
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold text-brown-primary dark:text-orange-300">
            Quản lý Tin nhắn Liên hệ
          </h1>
          <p className="text-brown-600 dark:text-dark-text-secondary mt-2">
            Xem và quản lý các tin nhắn từ khách hàng
          </p>
        </motion.div>

        <ContactMessages />
      </div>
    </div>
  )
}
