'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Form, Input, Button, message } from 'antd'
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, GithubOutlined, FacebookOutlined, GoogleOutlined} from '@ant-design/icons'

function Contact() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL
  const emailUrl = process.env.NEXT_PUBLIC_EMAIL_URL 
  const facebookUrl = process.env.NEXT_PUBLIC_FACEBOOK_URL


  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values)
      })
      
      const result = await response.json()
      
      if (result.success) {
        message.success('Cảm ơn bạn! Tin nhắn đã được gửi thành công. Tôi sẽ liên hệ lại sớm nhất có thể.')
        form.resetFields()
        
        // Log email status
        if (result.emailStatus) {
          console.log('📧 Email Status:', result.emailStatus)
          if (!result.emailStatus.notification) {
            let warningMessage = 'Tin nhắn đã lưu nhưng email thông báo chưa được gửi.'
            
            // Provide specific reason if available
            if (result.emailStatus.notificationError) {
              if (result.emailStatus.notificationError.includes('SMTP not configured')) {
                warningMessage += ' Lý do: SMTP chưa được cấu hình trong file .env.'
              } else {
                warningMessage += ` Lý do: ${result.emailStatus.notificationError}`
              }
            }
            
            message.warning(warningMessage, 8) // Show for 8 seconds
            
            // Also show link to debug page
            setTimeout(() => {
              message.info(
                <span>
                  💡 Debug email system tại: <a href="/debug/email" target="_blank" className="text-blue-500 underline">/debug/email</a>
                </span>, 
                10
              )
            }, 1000)
          } else {
            // Email sent successfully - optional success message
            console.log('✅ Email notifications sent successfully')
          }
        }
      } else {
        // Show detailed validation errors
        if (result.details && Array.isArray(result.details)) {
          result.details.forEach((detail: any) => {
            message.error(`${detail.field}: ${detail.message}`)
          })
        } else {
          message.error(result.error || 'Có lỗi xảy ra khi gửi tin nhắn.')
        }
      }
    } catch (error) {
      console.error('Error submitting contact form:', error)
      message.error('Có lỗi xảy ra. Vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    {
      icon: <MailOutlined className="text-2xl" />,
      title: 'Email',
      value: 'huynhbao103@gmail.com',
      link: 'mailto:huynhbao103@gmail.com'
    },
    {
      icon: <PhoneOutlined className="text-2xl" />,
      title: 'Điện thoại',
      value: '0907670054',
      link: 'tel:+84907670054'
    },
    {
      icon: <EnvironmentOutlined className="text-2xl" />,
      title: 'Địa chỉ',
      value: 'TP. Hồ Chí Minh, Việt Nam',
      link: '#'
    }
  ]

  return (
    <section id="contact" className="min-h-screen py-20 bg-white-primary dark:bg-dark-bg">
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
            <span className="font-mono text-lg text-orange-primary"></span> Get In Touch
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '100px' }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="h-1 bg-gradient-to-r from-orange-primary to-brown-primary mx-auto rounded-full"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-brown-600 dark:text-dark-text-secondary text-lg mt-6 max-w-2xl mx-auto"
          >
           
            Hãy liên hệ với tôi!
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-brown-primary dark:text-orange-300 mb-6">
                Thông tin liên hệ
              </h3>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={info.title}
                  href={info.link}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 * index, duration: 0.5 }}
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-cream-primary dark:bg-dark-card border border-brown-200/30 dark:border-orange-500/20 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="text-orange-primary dark:text-orange-300 group-hover:scale-110 transition-transform duration-300">
                    {info.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-brown-primary dark:text-dark-text">
                      {info.title}
                    </h4>
                    <p className="text-brown-600 dark:text-dark-text-secondary">
                      {info.value}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="pt-8"
            >
              <h4 className="font-semibold text-brown-primary dark:text-orange-300 mb-4">
                Kết nối với tôi
              </h4>
               <div className="flex gap-4">
                 {[
                   { name: 'GitHub', url: githubUrl, icon: <GithubOutlined className="text-lg" /> },
                   { name: 'Facebook', url: facebookUrl, icon: <FacebookOutlined className="text-lg" /> },
                   { name: 'Gmail', url: emailUrl, icon: <GoogleOutlined className="text-lg" /> }
                 ].map((social, index) => (
                   <motion.a
                     key={social.name}
                     href={social.url}
                     target="_blank"
                     rel="noopener noreferrer"
                     initial={{ opacity: 0, scale: 0 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.1 * index, duration: 0.3 }}
                     whileHover={{ scale: 1.1, y: -2 }}
                     className="w-12 h-12 bg-orange-primary hover:bg-brown-primary text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
                   >
                     {social.icon}
                   </motion.a>
                 ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-cream-primary dark:bg-dark-card rounded-2xl p-8 shadow-lg border border-brown-200/30 dark:border-orange-500/20"
          >
            <h3 className="text-2xl font-bold text-brown-primary dark:text-orange-300 mb-6">
              Gửi tin nhắn
            </h3>
            
            <Form
              form={form}
              onFinish={handleSubmit}
              layout="vertical"
              className="space-y-4"
            >
              <Form.Item
                name="name"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
              >
                <Input
                  placeholder="Nhập họ và tên của bạn"
                  size="large"
                  className="rounded-lg bg-cream-primary dark:bg-dark-card border border-brown-300/40 dark:border-orange-500/20 text-brown-700 dark:text-dark-text placeholder:text-brown-400 dark:placeholder:text-dark-text-secondary"
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' }
                ]}
              >
                <Input
                  placeholder="Nhập địa chỉ email của bạn"
                  size="large"
                  className="rounded-lg bg-cream-primary dark:bg-dark-card border border-brown-300/40 dark:border-orange-500/20 text-brown-700 dark:text-dark-text placeholder:text-brown-400 dark:placeholder:text-dark-text-secondary"
                />
              </Form.Item>

              <Form.Item
                name="subject"
                label="Chủ đề"
                rules={[{ required: true, message: 'Vui lòng nhập chủ đề!' }]}
              >
                <Input
                  placeholder="Chủ đề tin nhắn"
                  size="large"
                  className="rounded-lg bg-cream-primary dark:bg-dark-card border border-brown-300/40 dark:border-orange-500/20 text-brown-700 dark:text-dark-text placeholder:text-brown-400 dark:placeholder:text-dark-text-secondary"
                />
              </Form.Item>

              <Form.Item
                name="message"
                label="Tin nhắn"
                rules={[{ required: true, message: 'Vui lòng nhập tin nhắn!' }]}
              >
                <Input.TextArea
                  placeholder="Nội dung tin nhắn..."
                  rows={5}
                  className="rounded-lg bg-cream-primary dark:bg-dark-card border border-brown-300/40 dark:border-orange-500/20 text-brown-700 dark:text-dark-text placeholder:text-brown-400 dark:placeholder:text-dark-text-secondary"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  className="w-full bg-orange-primary hover:bg-brown-primary border-none rounded-lg h-12 font-semibold"
                >
                  {loading ? 'Đang gửi...' : 'Gửi tin nhắn'}
                </Button>
              </Form.Item>
            </Form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact
