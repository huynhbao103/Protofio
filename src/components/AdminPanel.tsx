'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card, Input, Form, Modal, message, Popconfirm, Upload, Image, Spin, Space, Tag, Tooltip, Table, Switch, Tabs, Avatar, Divider, Radio } from 'antd'
import type { UploadFile, RcFile } from 'antd/es/upload/interface'
import { PlusOutlined, UploadOutlined, EyeOutlined, DeleteOutlined, EditOutlined, SettingOutlined, SearchOutlined, UserOutlined, PictureOutlined, VideoCameraOutlined, MailOutlined, DashboardOutlined, ScissorOutlined } from '@ant-design/icons'
import { Project, ProjectFormData } from '@/types/project'
import { projectApi } from '@/lib/api'
import MediaManager from './MediaManager'
import ContactMessages from './ContactMessages'
import Dashboard from './Dashboard'

const { Dragger } = Upload
const { TabPane } = Tabs

function AdminPanel() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [mediaManagerOpen, setMediaManagerOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [uploading, setUploading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [profileImage, setProfileImage] = useState<string>('')
  const [form] = Form.useForm()

  // Load projects and profile on component mount
  useEffect(() => {
    fetchProjects()
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data.avatar) {
          setProfileImage(result.data.avatar)
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const data = await projectApi.getAllAdmin()
      setProjects(data)
    } catch (error: any) {
      console.error('Error fetching projects:', error)
      message.error('Không thể tải danh sách dự án')
    } finally {
      setLoading(false)
    }
  }

  const normalizeStatus = (status?: string): 'ACTIVE' | 'INACTIVE' =>
    status === 'INACTIVE' || status === 'ARCHIVED' || status === 'DRAFT'
      ? 'INACTIVE'
      : 'ACTIVE'

  const showModal = (project: Project | null = null) => {
    setEditingProject(project)
    setIsModalOpen(true)
    if (project) {
      form.setFieldsValue({
        name: project.name,
        description: project.description,
        nameEn: project.nameEn || '',
        descriptionEn: project.descriptionEn || '',
        technologies: project.technologies.join(', '),
        githubUrl: project.githubUrl,
        liveUrl: project.liveUrl,
        priority: project.priority,
        status: normalizeStatus(project.status),
        inactiveReason: project.inactiveReason || '',
      })
    } else {
      form.setFieldsValue({
        name: '',
        description: '',
        nameEn: '',
        descriptionEn: '',
        technologies: '',
        githubUrl: '',
        liveUrl: '',
        priority: undefined,
        status: 'ACTIVE',
        inactiveReason: '',
      })
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setEditingProject(null)
    form.resetFields()
  }

  const handleSubmit = async (values: ProjectFormData) => {
    try {
      console.log('Form values received:', values)

      const status: 'ACTIVE' | 'INACTIVE' =
        values.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE'
      const inactiveReason =
        status === 'INACTIVE' ? (values.inactiveReason || '').trim() : ''

      if (status === 'INACTIVE' && inactiveReason.length < 3) {
        message.error('Inactive phải có lý do (ít nhất 3 ký tự)!')
        return
      }

      const projectData: ProjectFormData = {
        ...values,
        status,
        inactiveReason: status === 'INACTIVE' ? inactiveReason : '',
      }

      console.log('Sending project data to API:', projectData)

      if (editingProject) {
        // Update existing project - convert technologies to array for update
        const updateData = {
          ...projectData,
          technologies: projectData.technologies.split(',').map(tech => tech.trim()).filter(Boolean)
        }
        await projectApi.update(editingProject._id, updateData)
        message.success('Cập nhật dự án thành công!')
      } else {
        // Add new project - send raw form data
        await projectApi.create(projectData)
        message.success('Thêm dự án mới thành công!')
      }
      
      handleCancel()
      fetchProjects() // Refresh the list
    } catch (error: any) {
      console.error('Error saving project:', error)
      
      // Handle validation errors
      if (error.details && Array.isArray(error.details)) {
        const errorMessages = error.details.join(', ')
        message.error(`Lỗi validation: ${errorMessages}`)
      } else if (error.error) {
        message.error(error.error)
      } else {
        message.error(error.message || 'Có lỗi xảy ra!')
      }
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await projectApi.delete(id)
      message.success('Xóa dự án thành công!')
      fetchProjects() // Refresh the list
    } catch (error: any) {
      console.error('Error deleting project:', error)
      message.error(error.message || 'Không thể xóa dự án')
    }
  }

  // Filter projects based on search
  const filteredProjects = projects.filter(project => {
    const q = searchText.toLowerCase()
    return (
      project.name.toLowerCase().includes(q) ||
      project.description.toLowerCase().includes(q) ||
      (project.nameEn || '').toLowerCase().includes(q) ||
      (project.descriptionEn || '').toLowerCase().includes(q) ||
      project.technologies.some(tech => tech.toLowerCase().includes(q))
    )
  })

  const showMediaManager = (project: Project) => {
    setSelectedProject(project)
    setMediaManagerOpen(true)
  }

  const handleProfileImageUpload = async (file: RcFile) => {
    try {
      setUploading(true)
      
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      
      if (result.success) {
        setProfileImage(result.data.avatar)
        message.success('Cập nhật avatar thành công!')
      } else {
        message.error(result.error || 'Lỗi upload avatar')
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      message.error('Không thể cập nhật avatar')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spin size="large" />
        <span className="ml-4 text-brown-600 dark:text-dark-text-secondary">
          Đang tải dự án...
        </span>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-brown-primary dark:text-orange-300 mb-2">
              🚀 Quản lý dự án
            </h1>
            <p className="text-brown-600 dark:text-gray-300 text-lg">
              Thêm, chỉnh sửa và quản lý các dự án của bạn ({projects.length} dự án)
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Input.Search
              placeholder="Tìm kiếm dự án..."
              allowClear
              size="large"
              prefix={<SearchOutlined />}
              style={{ width: 280 }}
              onChange={(e) => setSearchText(e.target.value)}
              className="rounded-lg"
            />
            
            <div className="flex items-center gap-3">
              <Tooltip title={`Chuyển sang ${viewMode === 'grid' ? 'bảng' : 'lưới'}`}>
                <Switch
                  checkedChildren="📋"
                  unCheckedChildren="⚏"
                  checked={viewMode === 'table'}
                  onChange={(checked) => setViewMode(checked ? 'table' : 'grid')}
                />
              </Tooltip>
              
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => showModal()}
                size="large"
                className="bg-orange-primary hover:bg-green-primary border-none shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ borderRadius: '12px' }}
              >
                Thêm dự án
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs Navigation */}
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        className="mb-6"
        items={[
          {
            key: 'dashboard',
            label: (
              <span className="flex items-center gap-2">
                <DashboardOutlined />
                Dashboard
              </span>
            ),
            children: <Dashboard />
          },
          {
            key: 'projects',
            label: (
              <span className="flex items-center gap-2">
                <PictureOutlined />
                Dự án ({projects.length})
              </span>
            ),
            children: (
              // Projects Display
              filteredProjects.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="text-center py-16"
                >
                  <div className="text-6xl mb-4">📁</div>
                  <h3 className="text-xl font-semibold text-brown-600 dark:text-dark-text-secondary mb-2">
                    Chưa có dự án nào
                  </h3>
                  <p className="text-brown-500 dark:text-gray-400 mb-6">
                    Bắt đầu tạo dự án đầu tiên của bạn!
                  </p>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => showModal()}
                    size="large"
                    className="bg-orange-primary hover:bg-green-primary border-none"
                    style={{ borderRadius: '12px' }}
                  >
                    Tạo dự án đầu tiên
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                  <AnimatePresence>
                    {filteredProjects.map((project, index) => (
                    <motion.div
                      key={project._id}
                      initial={{ opacity: 0, scale: 0.8, y: 50 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -50 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                    >
                      <Card
                        className="h-full bg-white-primary dark:bg-dark-card border border-brown-200/50 dark:border-orange-500/30 shadow-lg hover:shadow-xl hover:border-orange-primary/60 transition-all duration-300"
                        style={{ borderRadius: '16px' }}
                        styles={{ body: { padding: '24px' } }}
                        cover={
                          project.images.length > 0 ? (
                            <div className="relative aspect-video overflow-hidden">
                              <Image
                                src={project.mainImage 
                                  ? project.images.find(img => img.path === project.mainImage)?.path || project.images[0].path
                                  : project.images.find(img => img.isMain)?.path || project.images[0].path
                                }
                                alt={project.name}
                                width="100%"
                                height="200px"
                                className="object-cover"
                                style={{ borderRadius: '16px 16px 0 0' }}
                                preview={false}
                              />
                              <div className="absolute top-2 right-2 flex gap-1">
                                {project.images.length > 0 && (
                                  <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                                    📸 {project.images.length}
                                  </span>
                                )}
                                {project.videos.length > 0 && (
                                  <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                                    🎥 {project.videos.length}
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="aspect-video bg-gradient-to-br from-orange-100 to-brown-100 dark:from-orange-900/30 dark:to-brown-900/30 flex items-center justify-center">
                              <div className="text-center text-brown-400 dark:text-orange-400">
                                <div className="text-4xl mb-2">📁</div>
                                <div className="text-sm">No preview</div>
                              </div>
                            </div>
                          )
                        }
                        title={
                          <div className="text-lg font-bold text-brown-primary dark:text-dark-text">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="truncate">{project.name}</span>
                              <Tag
                                color={normalizeStatus(project.status) === 'ACTIVE' ? 'success' : 'default'}
                                className="shrink-0 m-0"
                              >
                                {normalizeStatus(project.status)}
                              </Tag>
                            </div>
                            {project.nameEn && (
                              <div className="text-xs font-medium text-brown-500 dark:text-dark-text-secondary truncate mt-0.5">
                                EN: {project.nameEn}
                              </div>
                            )}
                          </div>
                        }
                        extra={
                          <div className="flex gap-2">
                            <Button
                              size="small"
                              icon={<UploadOutlined />}
                              onClick={() => showMediaManager(project)}
                              className="border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                              style={{ borderRadius: '8px' }}
                              title="Quản lý Media"
                            />
                            <Button
                              size="small"
                              icon={<EyeOutlined />}
                              onClick={() => showModal(project)}
                              className="border-orange-primary text-orange-primary hover:bg-orange-50 dark:hover:bg-orange-900/20"
                              style={{ borderRadius: '8px' }}
                              title="Edit"
                            />
                            <Popconfirm
                              title="Xóa dự án"
                              description="Bạn có chắc chắn muốn xóa dự án này?"
                              onConfirm={() => handleDelete(project._id)}
                              okText="Có"
                              cancelText="Không"
                            >
                              <Button
                                size="small"
                                danger
                                icon={<DeleteOutlined />}
                                className="border-red-500 text-red-500 hover:bg-red-900/20"
                                style={{ borderRadius: '8px' }}
                                title="Delete"
                              />
                            </Popconfirm>
                          </div>
                        }
                      >
                        <div className="space-y-3">
                          {normalizeStatus(project.status) === 'INACTIVE' && project.inactiveReason && (
                            <div className="text-xs text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-700/40 rounded-lg px-2.5 py-2">
                              <span className="font-semibold">Lý do inactive: </span>
                              {project.inactiveReason}
                            </div>
                          )}
                          <p className="text-brown-600 dark:text-dark-text-secondary text-sm leading-relaxed line-clamp-3">
                            <span className="block">{project.description}</span>
                            {project.descriptionEn && (
                              <span className="block mt-2 text-xs opacity-80 border-t border-brown-200/40 pt-2">
                                EN: {project.descriptionEn}
                              </span>
                            )}
                          </p>
                          
                          {project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {project.technologies.map((tech, techIndex) => (
                                <span
                                  key={techIndex}
                                  className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs rounded-full"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="flex gap-2">
                            {project.liveUrl && (
                              <Button
                                type="primary"
                                href={project.liveUrl}
                                target="_blank"
                                size="small"
                                className="bg-orange-primary hover:bg-green-primary border-none flex-1"
                                style={{ borderRadius: '6px' }}
                              >
                                Live Demo
                              </Button>
                            )}
                            {project.githubUrl && (
                              <Button
                                href={project.githubUrl}
                                target="_blank"
                                size="small"
                                className="border-brown-300 text-brown-600 hover:border-orange-primary hover:text-orange-primary flex-1"
                                style={{ borderRadius: '6px' }}
                              >
                                GitHub
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )
            )
          },
          {
            key: 'messages',
            label: (
              <span className="flex items-center gap-2">
                <MailOutlined />
                Tin nhắn liên hệ
              </span>
            ),
            children: <ContactMessages />
          },
          {
            key: 'profile',
            label: (
              <span className="flex items-center gap-2">
                <UserOutlined />
                Profile
              </span>
            ),
            children: (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto"
              >
                <Card className="bg-white-primary dark:bg-dark-card border border-brown-200/50 dark:border-orange-500/30">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-brown-primary dark:text-orange-300 mb-4">
                      👤 Cập nhật Profile
                    </h3>
                    
                    {/* Profile Image */}
                    <div className="mb-6">
                      <Avatar
                        size={120}
                        src={profileImage}
                        icon={<UserOutlined />}
                        className="border-4 border-orange-200 dark:border-orange-700"
                      />
                      <div className="mt-4">
                        <Upload
                          beforeUpload={() => false}
                          onChange={(info) => {
                            if (info.fileList[0]?.originFileObj) {
                              handleProfileImageUpload(info.fileList[0].originFileObj)
                            }
                          }}
                          accept="image/*"
                          showUploadList={false}
                        >
                          <Button 
                            icon={<UploadOutlined />}
                            loading={uploading}
                            className="border-orange-primary text-orange-primary hover:bg-orange-50 dark:hover:bg-orange-900/20"
                          >
                            {uploading ? 'Đang upload...' : 'Cập nhật ảnh'}
                          </Button>
                        </Upload>
                      </div>
                    </div>

                    <Divider />

                    {/* Profile Form */}
                    <Form layout="vertical" className="text-left">
                      <Form.Item label="Tên hiển thị" name="displayName">
                        <Input 
                          placeholder="Nhập tên hiển thị"
                          size="large"
                          style={{ borderRadius: '8px' }}
                        />
                      </Form.Item>
                      
                      <Form.Item label="Tiêu đề (VI)" name="title">
                        <Input 
                          placeholder="Ví dụ: Frontend Developer"
                          size="large"
                          style={{ borderRadius: '8px' }}
                        />
                      </Form.Item>

                      <Form.Item label="Title (EN)" name="titleEn">
                        <Input 
                          placeholder="e.g. Frontend Developer"
                          size="large"
                          style={{ borderRadius: '8px' }}
                        />
                      </Form.Item>
                      
                      <Form.Item label="Mô tả ngắn (VI)" name="bio">
                        <Input.TextArea 
                          placeholder="Mô tả ngắn bằng tiếng Việt"
                          rows={3}
                          style={{ borderRadius: '8px' }}
                        />
                      </Form.Item>

                      <Form.Item label="Short bio (EN)" name="bioEn">
                        <Input.TextArea 
                          placeholder="Short bio in English"
                          rows={3}
                          style={{ borderRadius: '8px' }}
                        />
                      </Form.Item>
                      
                      <Form.Item label="Email" name="email">
                        <Input 
                          placeholder="your.email@example.com"
                          size="large"
                          style={{ borderRadius: '8px' }}
                        />
                      </Form.Item>
                      
                      <Form.Item label="Website" name="website">
                        <Input 
                          placeholder="https://your-website.com"
                          size="large"
                          style={{ borderRadius: '8px' }}
                        />
                      </Form.Item>
                      
                      <Form.Item className="mb-0">
                        <Button 
                          type="primary" 
                          htmlType="submit"
                          size="large"
                          className="bg-orange-primary hover:bg-green-primary border-none w-full"
                          style={{ borderRadius: '8px' }}
                        >
                          Cập nhật Profile
                        </Button>
                      </Form.Item>
                    </Form>
                  </div>
                </Card>
              </motion.div>
            )
          }
        ]}
      />

      {/* Project Form Modal */}
      <Modal
        title={editingProject ? 'Chỉnh sửa dự án' : 'Thêm dự án mới'}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={820}
        className="custom-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Divider orientation="left" plain>
            Nội dung tiếng Việt
          </Divider>

          <Form.Item
            label="Tên dự án (VI)"
            name="name"
            rules={[
              { required: true, message: 'Vui lòng nhập tên dự án!' },
              { min: 3, message: 'Tên dự án phải có ít nhất 3 ký tự!' },
              { max: 100, message: 'Tên dự án không được quá 100 ký tự!' }
            ]}
          >
            <Input
              placeholder="Nhập tên dự án bằng tiếng Việt"
              size="large"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            label="Mô tả (VI)"
            name="description"
            rules={[
              { required: true, message: 'Vui lòng nhập mô tả dự án!' },
              { min: 10, message: 'Mô tả phải có ít nhất 10 ký tự!' },
              { max: 1000, message: 'Mô tả không được quá 1000 ký tự!' }
            ]}
          >
            <Input.TextArea
              placeholder="Mô tả chi tiết bằng tiếng Việt..."
              rows={4}
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Divider orientation="left" plain>
            English content
          </Divider>

          <Form.Item
            label="Project name (EN)"
            name="nameEn"
            rules={[{ max: 100, message: 'Max 100 characters' }]}
          >
            <Input
              placeholder="Enter project name in English"
              size="large"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            label="Description (EN)"
            name="descriptionEn"
            rules={[{ max: 1000, message: 'Max 1000 characters' }]}
          >
            <Input.TextArea
              placeholder="Detailed project description in English..."
              rows={4}
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Divider orientation="left" plain>
            Thông tin chung
          </Divider>

          <Form.Item
            label="Công nghệ sử dụng"
            name="technologies"
            rules={[
              { required: true, message: 'Vui lòng nhập công nghệ sử dụng!' }
            ]}
          >
            <Input
              placeholder="React, Next.js, TypeScript, MongoDB (phân cách bằng dấu phẩy)"
              size="large"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            label="GitHub Repository"
            name="githubUrl"
            rules={[
              {
                pattern: /^https:\/\/github\.com\/.+/,
                message: 'URL GitHub không hợp lệ!'
              }
            ]}
          >
            <Input
              placeholder="https://github.com/username/repository"
              size="large"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            label="Live Demo URL"
            name="liveUrl"
            rules={[
              {
                pattern: /^https?:\/\/.+/,
                message: 'URL không hợp lệ!'
              },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve()
                  if (value.includes('github.com')) {
                    return Promise.reject(new Error('Live Demo URL không được là GitHub URL!'))
                  }
                  return Promise.resolve()
                }
              }
            ]}
          >
            <Input
              placeholder="https://your-project.com"
              size="large"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            label="Độ ưu tiên"
            name="priority"
            rules={[
              {
                type: 'number',
                min: 0,
                max: 100,
                message: 'Độ ưu tiên phải từ 0-100!',
                transform: (value) => {
                  if (value === '' || value === undefined || value === null) return undefined
                  return Number(value)
                },
                validator: (_, value) => {
                  if (value === '' || value === undefined || value === null) return Promise.resolve()
                  const num = Number(value)
                  if (isNaN(num)) return Promise.reject(new Error('Độ ưu tiên phải là số!'))
                  if (num < 0 || num > 100) return Promise.reject(new Error('Độ ưu tiên phải từ 0-100!'))
                  if (!Number.isInteger(num)) {
                    return Promise.reject(new Error('Độ ưu tiên phải là số nguyên!'))
                  }
                  // Check if it's a reasonable priority value
                  if (num > 0 && num < 10) {
                    return Promise.resolve() // Allow low priority
                  }
                  if (num >= 10 && num <= 90) {
                    return Promise.resolve() // Allow medium priority
                  }
                  if (num > 90 && num <= 100) {
                    return Promise.resolve() // Allow high priority
                  }
                  return Promise.resolve()
                }
              }
            ]}
          >
            <Input
              type="number"
              placeholder="0-100 (càng cao càng ưu tiên)"
              size="large"
              style={{ borderRadius: '8px' }}
              min={0}
              max={100}
            />
          </Form.Item>

          <Form.Item
            label="Trạng thái hiển thị"
            name="status"
            rules={[{ required: true, message: 'Chọn trạng thái!' }]}
            initialValue="ACTIVE"
          >
            <Radio.Group size="large">
              <Radio.Button value="ACTIVE">Active</Radio.Button>
              <Radio.Button value="INACTIVE">Inactive</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prev, cur) => prev.status !== cur.status}
          >
            {({ getFieldValue }) =>
              getFieldValue('status') === 'INACTIVE' ? (
                <Form.Item
                  label="Lý do inactive"
                  name="inactiveReason"
                  rules={[
                    { required: true, message: 'Inactive phải có lý do!' },
                    { min: 3, message: 'Lý do ít nhất 3 ký tự!' },
                    { max: 500, message: 'Tối đa 500 ký tự!' },
                  ]}
                  extra="Project inactive sẽ không hiện trên portfolio công khai."
                >
                  <Input.TextArea
                    placeholder="VD: Dự án cũ, đang refactor, thay bằng phiên bản mới..."
                    rows={3}
                    style={{ borderRadius: '8px' }}
                    maxLength={500}
                    showCount
                  />
                </Form.Item>
              ) : null
            }
          </Form.Item>

          <Form.Item className="mb-0 pt-4">
            <div className="flex gap-3 justify-end">
              <Button
                onClick={handleCancel}
                size="large"
                style={{ borderRadius: '8px' }}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="bg-orange-primary hover:bg-green-primary border-none"
                style={{ borderRadius: '8px' }}
                onClick={() => {
                  console.log('Submit button clicked')
                  console.log('Form values:', form.getFieldsValue())
                  console.log('Form is valid:', form.isFieldsValidating())
                  console.log('Form errors:', form.getFieldsError())
                }}
              >
                {editingProject ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Media Manager */}
      {selectedProject && (
        <MediaManager
          project={selectedProject}
          open={mediaManagerOpen}
          onClose={() => {
            setMediaManagerOpen(false)
            setSelectedProject(null)
          }}
          onMediaUpdate={(projectId, media) => {
            // Handle media updates (deletion, main image setting, etc.)
            console.log('Media updated for project:', projectId, media)
            
            // Handle specific media update cases
            if (media.deletedMediaId) {
              // Media was deleted, refresh projects
              fetchProjects()
            } else if (media.mainImage || media.mainVideo) {
              // Main media was set, refresh projects
              fetchProjects()
            } else if (media._id) {
              // New media was added (including YouTube video), refresh projects
              fetchProjects()
            } else {
              // Fallback: refresh projects
              fetchProjects()
            }
          }}
        />
      )}
    </motion.div>
  )
}

export default AdminPanel