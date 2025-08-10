'use client'

import React, { useState } from 'react'
import { Form, Input, Button, Card, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'

interface LoginFormValues {
  username: string
  password: string
}

function LoginForm() {
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const [form] = Form.useForm()

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true)
    try {
      const success = await login(values.username, values.password)
      if (success) {
        form.resetFields()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream-primary to-orange-100 dark:from-dark-bg dark:to-dark-card p-4">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card
          className="shadow-2xl border border-brown-200/50 dark:border-orange-500/30 bg-white/95 dark:bg-dark-card/95 backdrop-blur-sm"
          style={{ borderRadius: '20px' }}
          bodyStyle={{ padding: '40px' }}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-orange-primary flex items-center justify-center">
              <UserOutlined className="text-2xl text-white" />
            </div>
            <h1 className="text-2xl font-bold text-brown-primary dark:text-orange-300 mb-2">
              Đăng nhập Admin
            </h1>
            <p className="text-brown-600 dark:text-dark-text-secondary">
              Vui lòng đăng nhập để quản lý dự án
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Form
              form={form}
              name="login"
              onFinish={onFinish}
              size="large"
              layout="vertical"
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
                  { min: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự!' },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="text-brown-400" />}
                  placeholder="Tên đăng nhập"
                  style={{ borderRadius: '10px' }}
                  className="border-brown-300 focus:border-orange-primary"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu!' },
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-brown-400" />}
                  placeholder="Mật khẩu"
                  style={{ borderRadius: '10px' }}
                  className="border-brown-300 focus:border-orange-primary"
                />
              </Form.Item>

              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="w-full bg-orange-primary hover:bg-green-primary border-none shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ 
                    height: '48px', 
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}
                >
                  {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </Button>
              </Form.Item>
            </Form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-brown-500 dark:text-dark-text-secondary">
              Demo credentials: <br/>
              <code className="bg-brown-100 dark:bg-orange-900/30 px-2 py-1 rounded text-xs">
                admin / admin123
              </code>
            </p>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  )
}

export default LoginForm


