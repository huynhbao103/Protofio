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
            email: result.data.email,
            phone: result.data.phone,
            location: result.data.location
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
        body: formData
      })

      const result = await response.json()
      
      if (result.success) {
        message.success('Avatar đã được cập nhật!')
        setProfile(prev => prev ? { ...prev, avatar: result.data.avatar } : null)
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
        skills: profile?.skills || []
      }

      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData)
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
      const newSkills = profile.skills.filter(skill => skill !== skillToRemove)
      setProfile({ ...profile, skills: newSkills })
    }
  }

  return (
    <Card title="👤 Quản lý Profile" className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Avatar Section */}
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
          <p className="text-xs text-gray-500 mt-2">
            JPG, PNG (Max 5MB)
          </p>
        </div>

        {/* Form Section */}
        <div className="md:col-span-2">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="space-y-4"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <Form.Item
                label="Tên"
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
              >
                <Input placeholder="Nhập tên của bạn" />
              </Form.Item>

              <Form.Item
                label="Chức danh"
                name="title"
                rules={[{ required: true, message: 'Vui lòng nhập chức danh' }]}
              >
                <Input placeholder="VD: Frontend Developer" />
              </Form.Item>
            </div>

            <Form.Item
              label="Giới thiệu"
              name="bio"
            >
              <Input.TextArea 
                rows={3} 
                placeholder="Viết giới thiệu ngắn về bản thân..."
              />
            </Form.Item>

            <div className="grid md:grid-cols-2 gap-4">
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email' },
                  { type: 'email', message: 'Email không hợp lệ' }
                ]}
              >
                <Input placeholder="email@example.com" />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="phone"
              >
                <Input placeholder="0123456789" />
              </Form.Item>
            </div>

            <Form.Item
              label="Địa điểm"
              name="location"
            >
              <Input placeholder="VD: TP.HCM, Việt Nam" />
            </Form.Item>

            <Divider />

            {/* Skills Section */}
            <div>
              <label className="block text-sm font-medium mb-2">Kỹ năng</label>
              <div className="flex gap-2 mb-3">
                <Input
                  placeholder="Thêm kỹ năng mới..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onPressEnter={addSkill}
                />
                <Button onClick={addSkill} disabled={!skillInput.trim()}>
                  Thêm
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {profile?.skills?.map((skill, index) => (
                  <Tag
                    key={index}
                    closable
                    onClose={() => removeSkill(skill)}
                    color="orange"
                  >
                    {skill}
                  </Tag>
                ))}
              </div>
            </div>

            <Divider />

            <div className="flex justify-end">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<SaveOutlined />}
                size="large"
                className="bg-orange-primary hover:bg-orange-600"
              >
                Lưu Profile
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Card>
  )
}

export default ProfileManager
