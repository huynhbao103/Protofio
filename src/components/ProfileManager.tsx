'use client'

import React, { useState, useEffect } from 'react'
import { Card, Form, Input, Button, Upload, message, Avatar, Divider, Tag, Space } from 'antd'
import { UserOutlined, UploadOutlined, SaveOutlined } from '@ant-design/icons'
import type { RcFile } from 'antd/es/upload/interface'

interface ProfileData {
  _id?: string
  name: string
  title: string
  bio: string
  titleEn?: string
  bioEn?: string
  locationEn?: string
  avatar: string
  email: string
  phone?: string
  location?: string
  skills: string[]
}

function ProfileManager() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [skillInput, setSkillInput] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setProfile(result.data)
          form.setFieldsValue({
            name: result.data.name,
            title: result.data.title,
            bio: result.data.bio,
            titleEn: result.data.titleEn || '',
            bioEn: result.data.bioEn || '',
            locationEn: result.data.locationEn || '',
            email: result.data.email,
            phone: result.data.phone,
            location: result.data.location,
          })
        }
      }
    } catch (error) {
      message.error('Không thể tải thông tin profile')
    }
  }

  const handleAvatarUpload = async (file: RcFile) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        message.success('Avatar đã được cập nhật!')
        setProfile((prev) => (prev ? { ...prev, avatar: result.data.avatar } : null))
      } else {
        message.error(result.error || 'Lỗi upload avatar')
      }
    } catch (error) {
      message.error('Lỗi upload avatar')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      const profileData = {
        ...values,
        skills: profile?.skills || [],
      }

      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      })

      const result = await response.json()

      if (result.success) {
        message.success('Profile đã được cập nhật!')
        setProfile(result.data)
      } else {
        message.error(result.error || 'Lỗi cập nhật profile')
      }
    } catch (error) {
      message.error('Lỗi cập nhật profile')
    } finally {
      setLoading(false)
    }
  }

  const addSkill = () => {
    if (skillInput.trim() && profile) {
      const newSkills = [...(profile.skills || []), skillInput.trim()]
      setProfile({ ...profile, skills: newSkills })
      setSkillInput('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    if (profile) {
      const newSkills = profile.skills.filter((skill) => skill !== skillToRemove)
      setProfile({ ...profile, skills: newSkills })
    }
  }

  return (
    <Card title="👤 Quản lý Profile (VI / EN)" className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="mb-4">
            <Avatar
              size={120}
              src={profile?.avatar}
              icon={<UserOutlined />}
              className="border-4 border-orange-200 dark:border-orange-700"
            />
          </div>
          <Upload
            beforeUpload={handleAvatarUpload}
            accept="image/*"
            showUploadList={false}
            disabled={uploading}
          >
            <Button
              icon={<UploadOutlined />}
              loading={uploading}
              className="border-orange-primary text-orange-primary hover:bg-orange-50"
            >
              {uploading ? 'Đang upload...' : 'Cập nhật Avatar'}
            </Button>
          </Upload>
          <p className="text-xs text-gray-500 mt-2">JPG, PNG (Max 5MB)</p>
        </div>

        <div className="md:col-span-2">
          <Form form={form} layout="vertical" onFinish={handleSubmit} className="space-y-4">
            <Form.Item
              label="Tên"
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
            >
              <Input placeholder="Nhập tên của bạn" />
            </Form.Item>

            <Divider orientation="left" plain>
              Tiếng Việt
            </Divider>

            <Form.Item
              label="Chức danh (VI)"
              name="title"
              rules={[{ required: true, message: 'Vui lòng nhập chức danh' }]}
            >
              <Input placeholder="VD: Frontend Developer" />
            </Form.Item>

            <Form.Item label="Giới thiệu (VI)" name="bio">
              <Input.TextArea rows={3} placeholder="Viết giới thiệu ngắn bằng tiếng Việt..." />
            </Form.Item>

            <Form.Item label="Địa điểm (VI)" name="location">
              <Input placeholder="VD: Phường Tân Phú, TP. Hồ Chí Minh" />
            </Form.Item>

            <Divider orientation="left" plain>
              English
            </Divider>

            <Form.Item label="Title (EN)" name="titleEn">
              <Input placeholder="e.g. Frontend Developer" />
            </Form.Item>

            <Form.Item label="Bio (EN)" name="bioEn">
              <Input.TextArea rows={3} placeholder="Short introduction in English..." />
            </Form.Item>

            <Form.Item label="Location (EN)" name="locationEn">
              <Input placeholder="e.g. Tan Phu Ward, Ho Chi Minh City" />
            </Form.Item>

            <Divider />

            <div className="grid md:grid-cols-2 gap-4">
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email' },
                  { type: 'email', message: 'Email không hợp lệ' },
                ]}
              >
                <Input placeholder="email@example.com" />
              </Form.Item>

              <Form.Item label="Số điện thoại" name="phone">
                <Input placeholder="0123456789" />
              </Form.Item>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Kỹ năng</label>
              <Space.Compact className="w-full mb-3">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Thêm kỹ năng"
                  onPressEnter={addSkill}
                />
                <Button type="primary" onClick={addSkill}>
                  Thêm
                </Button>
              </Space.Compact>
              <div className="flex flex-wrap gap-2">
                {(profile?.skills || []).map((skill) => (
                  <Tag key={skill} closable onClose={() => removeSkill(skill)} color="orange">
                    {skill}
                  </Tag>
                ))}
              </div>
            </div>

            <Form.Item className="mb-0 pt-4">
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
                size="large"
                className="bg-orange-primary hover:bg-brown-primary border-none w-full"
              >
                Lưu Profile (VI + EN)
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Card>
  )
}

export default ProfileManager
