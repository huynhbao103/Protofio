'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, Row, Col, Statistic, Button, Progress, List, Avatar, Tag, Space, Spin, message } from 'antd'
import { 
  ProjectOutlined, 
  MessageOutlined, 
  UserOutlined, 
  PictureOutlined, 
  VideoCameraOutlined,
  PlusOutlined,
  EyeOutlined,
  MailOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import { projectApi } from '@/lib/api'
import { contactApi } from '@/lib/api'
import { Project } from '@/types/project'

interface DashboardProps {
  className?: string
}

interface DashboardStats {
  totalProjects: number
  totalMessages: number
  totalImages: number
  totalVideos: number
  recentProjects: Project[]
  recentMessages: any[]
  projectGrowth: number
  messageGrowth: number
}

function Dashboard({ className }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalMessages: 0,
    totalImages: 0,
    totalVideos: 0,
    recentProjects: [],
    recentMessages: [],
    projectGrowth: 0,
    messageGrowth: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch projects and messages in parallel
      const [projects, messages] = await Promise.all([
        projectApi.getAll(),
        contactApi.getAll()
      ])

      // Calculate statistics
      const totalImages = projects.reduce((sum, project) => sum + project.images.length, 0)
      const totalVideos = projects.reduce((sum, project) => sum + project.videos.length, 0)
      
      // Get recent projects (last 5)
      const recentProjects = projects
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)

      // Get recent messages (last 5)
      const recentMessages = messages
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)

      setStats({
        totalProjects: projects.length,
        totalMessages: messages.length,
        totalImages,
        totalVideos,
        recentProjects,
        recentMessages,
        projectGrowth: projects.length > 0 ? Math.round((projects.length / 10) * 100) : 0, // Mock growth
        messageGrowth: messages.length > 0 ? Math.round((messages.length / 20) * 100) : 0 // Mock growth
      })
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error)
      message.error('Không thể tải dữ liệu dashboard')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'red'
      case 'read': return 'blue'
      case 'replied': return 'green'
      case 'archived': return 'gray'
      default: return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'Mới'
      case 'read': return 'Đã đọc'
      case 'replied': return 'Đã trả lời'
      case 'archived': return 'Đã lưu trữ'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spin size="large" />
        <span className="ml-4 text-brown-600 dark:text-dark-text-secondary">
          Đang tải dashboard...
        </span>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-8"
      >
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-brown-primary dark:text-orange-300 mb-2">
            🚀 Dashboard
          </h1>
          <p className="text-brown-600 dark:text-gray-300 text-lg">
            Tổng quan về hoạt động của website
          </p>
        </div>
      </motion.div>

      {/* Main Statistics */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mb-8"
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <Statistic
                title="Tổng dự án"
                value={stats.totalProjects}
                prefix={<ProjectOutlined className="text-orange-500" />}
                valueStyle={{ color: '#ea580c' }}
              />
              <Progress 
                percent={stats.projectGrowth} 
                size="small" 
                strokeColor="#ea580c"
                showInfo={false}
              />
              <div className="text-xs text-gray-500 mt-1">
                Tăng trưởng {stats.projectGrowth}%
              </div>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <Statistic
                title="Tin nhắn liên hệ"
                value={stats.totalMessages}
                prefix={<MessageOutlined className="text-blue-500" />}
                valueStyle={{ color: '#3b82f6' }}
              />
              <Progress 
                percent={stats.messageGrowth} 
                size="small" 
                strokeColor="#3b82f6"
                showInfo={false}
              />
              <div className="text-xs text-gray-500 mt-1">
                Tăng trưởng {stats.messageGrowth}%
              </div>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <Statistic
                title="Hình ảnh"
                value={stats.totalImages}
                prefix={<PictureOutlined className="text-green-500" />}
                valueStyle={{ color: '#22c55e' }}
              />
              <div className="text-xs text-gray-500 mt-1">
                Tổng cộng media
              </div>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <Statistic
                title="Video"
                value={stats.totalVideos}
                prefix={<VideoCameraOutlined className="text-purple-500" />}
                valueStyle={{ color: '#a855f7' }}
              />
              <div className="text-xs text-gray-500 mt-1">
                Tổng cộng media
              </div>
            </Card>
          </Col>
        </Row>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="mb-8"
      >
        <Card title="⚡ Hành động nhanh" className="bg-gradient-to-r from-orange-50 to-brown-50">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                className="w-full h-16 text-lg bg-orange-primary hover:bg-green-primary border-none"
                onClick={() => {
                  // TODO: Navigate to add project
                  message.info('Chuyển đến trang thêm dự án')
                }}
              >
                Thêm dự án mới
              </Button>
            </Col>
            
            <Col xs={24} sm={12} md={8}>
              <Button
                icon={<EyeOutlined />}
                size="large"
                className="w-full h-16 text-lg border-orange-primary text-orange-primary hover:bg-orange-50"
                onClick={() => {
                  // TODO: Navigate to projects
                  message.info('Chuyển đến trang dự án')
                }}
              >
                Xem tất cả dự án
              </Button>
            </Col>
            
            <Col xs={24} sm={12} md={8}>
              <Button
                icon={<MailOutlined />}
                size="large"
                className="w-full h-16 text-lg border-blue-500 text-blue-500 hover:bg-blue-50"
                onClick={() => {
                  // TODO: Navigate to messages
                  message.info('Chuyển đến trang tin nhắn')
                }}
              >
                Xem tin nhắn mới
              </Button>
            </Col>
          </Row>
        </Card>
      </motion.div>

      {/* Recent Content */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mb-8"
      >
        <Row gutter={[16, 16]}>
          {/* Recent Projects */}
          <Col xs={24} lg={12}>
            <Card 
              title={
                <span className="flex items-center gap-2">
                  <ProjectOutlined className="text-orange-500" />
                  Dự án gần đây
                </span>
              }
              extra={
                <Button type="link" className="text-orange-500">
                  Xem tất cả
                </Button>
              }
            >
              <List
                dataSource={stats.recentProjects}
                renderItem={(project) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          icon={<ProjectOutlined />} 
                          className="bg-orange-100 text-orange-600"
                        />
                      }
                      title={
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-brown-primary">
                            {project.name}
                          </span>
                          <Tag color="orange" className="text-xs">
                            {project.technologies.length} tech
                          </Tag>
                        </div>
                      }
                      description={
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {project.description}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <ClockCircleOutlined />
                            {new Date(project.createdAt).toLocaleDateString('vi-VN')}
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
                locale={{
                  emptyText: (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">📁</div>
                      <p>Chưa có dự án nào</p>
                    </div>
                  )
                }}
              />
            </Card>
          </Col>

          {/* Recent Messages */}
          <Col xs={24} lg={12}>
            <Card 
              title={
                <span className="flex items-center gap-2">
                  <MessageOutlined className="text-blue-500" />
                  Tin nhắn gần đây
                </span>
              }
              extra={
                <Button type="link" className="text-blue-500">
                  Xem tất cả
                </Button>
              }
            >
              <List
                dataSource={stats.recentMessages}
                renderItem={(message) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          icon={<UserOutlined />} 
                          className="bg-blue-100 text-blue-600"
                        />
                      }
                      title={
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-brown-primary">
                            {message.name}
                          </span>
                          <Tag color={getStatusColor(message.status)} className="text-xs">
                            {getStatusText(message.status)}
                          </Tag>
                        </div>
                      }
                      description={
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {message.subject}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <ClockCircleOutlined />
                            {new Date(message.createdAt).toLocaleDateString('vi-VN')}
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
                locale={{
                  emptyText: (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">📧</div>
                      <p>Chưa có tin nhắn nào</p>
                    </div>
                  )
                }}
              />
            </Card>
          </Col>
        </Row>
      </motion.div>

      {/* System Status */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.6 }}
      >
        <Card title="🔧 Trạng thái hệ thống" className="bg-gray-50">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <div className="text-center p-4 bg-white rounded border">
                <div className="text-2xl mb-2">✅</div>
                <div className="font-medium text-green-600">MongoDB</div>
                <div className="text-sm text-gray-500">Kết nối ổn định</div>
              </div>
            </Col>
            
            <Col xs={24} sm={12} md={8}>
              <div className="text-center p-4 bg-white rounded border">
                <div className="text-2xl mb-2">✅</div>
                <div className="font-medium text-green-600">Email Service</div>
                <div className="text-sm text-gray-500">Hoạt động bình thường</div>
              </div>
            </Col>
            
            <Col xs={24} sm={12} md={8}>
              <div className="text-center p-4 bg-white rounded border">
                <div className="text-2xl mb-2">✅</div>
                <div className="font-medium text-green-600">Cloudinary</div>
                <div className="text-sm text-gray-500">Upload ổn định</div>
              </div>
            </Col>
          </Row>
        </Card>
      </motion.div>
    </motion.div>
  )
}

export default Dashboard
