'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Form, Input, Button, message } from 'antd'
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, GithubOutlined, FacebookOutlined, GoogleOutlined } from '@ant-design/icons'
import { useI18n } from '@/contexts/I18nContext'

function Contact() {
  const { t } = useI18n()
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const result = await response.json()
      if (result.success) {
        message.success(t.contact.success)
        form.resetFields()
      } else if (result.details && Array.isArray(result.details)) {
        result.details.forEach((detail: any) => message.error(`${detail.field}: ${detail.message}`))
      } else {
        message.error(result.error || t.contact.error)
      }
    } catch (error) {
      console.error('Error submitting contact form:', error)
      message.error(t.contact.genericError)
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    { icon: <MailOutlined className="text-2xl" />, title: t.contact.email, value: 'huynhbao103@gmail.com', link: 'mailto:huynhbao103@gmail.com' },
    { icon: <PhoneOutlined className="text-2xl" />, title: t.contact.phone, value: '0907670054', link: 'tel:+84907670054' },
    { icon: <EnvironmentOutlined className="text-2xl" />, title: t.contact.address, value: t.contact.addressValue, link: '#' },
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
          <h2 className="text-4xl md:text-5xl font-bold text-brown-primary dark:text-orange-300 mb-4">{t.contact.heading}</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-orange-primary to-brown-primary mx-auto rounded-full" />
          <p className="text-brown-600 dark:text-dark-text-secondary text-lg mt-6 max-w-2xl mx-auto">{t.contact.subtitle}</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-bold text-brown-primary dark:text-orange-300">{t.contact.infoTitle}</h3>
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={info.title}
                  href={info.link}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02, x: 8 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-cream-primary dark:bg-dark-card border border-brown-200/30 dark:border-orange-500/20 hover:shadow-lg transition-all group"
                >
                  <div className="text-orange-primary dark:text-orange-300 group-hover:scale-110 transition-transform">{info.icon}</div>
                  <div>
                    <h4 className="font-semibold text-brown-primary dark:text-dark-text">{info.title}</h4>
                    <p className="text-brown-600 dark:text-dark-text-secondary">{info.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>

            <div>
              <h4 className="font-semibold text-brown-primary dark:text-orange-300 mb-4">{t.contact.connect}</h4>
              <div className="flex gap-4">
                {[
                  { name: 'GitHub', url: githubUrl, icon: <GithubOutlined className="text-lg" /> },
                  { name: 'Facebook', url: facebookUrl, icon: <FacebookOutlined className="text-lg" /> },
                  { name: 'Gmail', url: emailUrl, icon: <GoogleOutlined className="text-lg" /> },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-orange-primary hover:bg-brown-primary text-white rounded-full flex items-center justify-center shadow-lg transition-all"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-cream-primary dark:bg-dark-card rounded-2xl p-8 shadow-lg border border-brown-200/30 dark:border-orange-500/20"
          >
            <h3 className="text-2xl font-bold text-brown-primary dark:text-orange-300 mb-6">{t.contact.formTitle}</h3>
            <Form form={form} onFinish={handleSubmit} layout="vertical" className="space-y-4">
              <Form.Item name="name" label={t.contact.name} rules={[{ required: true, message: t.contact.nameRequired }]}>
                <Input placeholder={t.contact.namePlaceholder} size="large" className="rounded-lg" />
              </Form.Item>
              <Form.Item
                name="email"
                label={t.contact.emailLabel}
                rules={[
                  { required: true, message: t.contact.emailRequired },
                  { type: 'email', message: t.contact.emailInvalid },
                ]}
              >
                <Input placeholder={t.contact.emailPlaceholder} size="large" className="rounded-lg" />
              </Form.Item>
              <Form.Item name="subject" label={t.contact.subject} rules={[{ required: true, message: t.contact.subjectRequired }]}>
                <Input placeholder={t.contact.subjectPlaceholder} size="large" className="rounded-lg" />
              </Form.Item>
              <Form.Item name="message" label={t.contact.message} rules={[{ required: true, message: t.contact.messageRequired }]}>
                <Input.TextArea placeholder={t.contact.messagePlaceholder} rows={5} className="rounded-lg" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  className="w-full bg-orange-primary hover:bg-brown-primary border-none rounded-lg h-12 font-semibold"
                >
                  {loading ? t.contact.sending : t.contact.send}
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
