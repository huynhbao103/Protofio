'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, Table, Button, Tag, Space, Modal, message, Popconfirm, Input, DatePicker, Select, Avatar, Tooltip, Badge } from 'antd'
import { EyeOutlined, DeleteOutlined, MailOutlined, UserOutlined, ClockCircleOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons'
import { contactApi } from '@/lib/api'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

// Cấu hình dayjs plugins
dayjs.extend(relativeTime)

const { Search } = Input
const { RangePicker } = DatePicker

interface ContactMessage {
  _id: string
  name: string
  email: string
  subject: string
  message: string
  createdAt: string
  status: 'new' | 'read' | 'replied' | 'archived'
  ipAddress?: string
  userAgent?: string
}

interface ContactMessagesProps {
  className?: string
}

function ContactMessages({ className }: ContactMessagesProps) {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const data = await contactApi.getAll()
      setMessages(data)
    } catch (error: any) {
      console.error('Error fetching messages:', error)
      message.error('Không thể tải danh sách tin nhắn')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMessage = async (id: string) => {
    try {
      await contactApi.delete(id)
      message.success('Xóa tin nhắn thành công!')
      fetchMessages()
    } catch (error: any) {
      console.error('Error deleting message:', error)
      message.error('Không thể xóa tin nhắn')
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await contactApi.updateStatus(id, status)
      message.success('Cập nhật trạng thái thành công!')
      fetchMessages()
    } catch (error: any) {
      console.error('Error updating status:', error)
      message.error('Không thể cập nhật trạng thái')
    }
  }

  const showPreview = (message: ContactMessage) => {
    setSelectedMessage(message)
    setPreviewVisible(true)
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return '🆕'
      case 'read': return '👁️'
      case 'replied': return '✅'
      case 'archived': return '📁'
      default: return '❓'
    }
  }

  // Filter messages based on search, status, and date range
  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.name.toLowerCase().includes(searchText.toLowerCase()) ||
      message.email.toLowerCase().includes(searchText.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchText.toLowerCase()) ||
      message.message.toLowerCase().includes(searchText.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter
    
    const matchesDate = !dateRange || (
      dayjs(message.createdAt).isAfter(dateRange[0], 'day') &&
      dayjs(message.createdAt).isBefore(dateRange[1], 'day')
    )
    
    return matchesSearch && matchesStatus && matchesDate
  })

  const columns = [
    {
      title: 'Người gửi',
      key: 'sender',
      render: (text: string, record: ContactMessage) => (
        <div className="flex items-center gap-3">
          <Avatar 
            icon={<UserOutlined />} 
            className="bg-orange-100 text-orange-600"
          />
          <div>
            <div className="font-medium text-brown-primary dark:text-dark-text">
              {record.name}
            </div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'subject',
      key: 'subject',
      render: (text: string) => (
        <div className="max-w-xs truncate" title={text}>
          {text}
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (text: string, record: ContactMessage) => (
        <Select
          value={record.status}
          onChange={(value) => handleStatusChange(record._id, value)}
          style={{ width: 120 }}
          size="small"
        >
          <Select.Option value="new">🆕 Mới</Select.Option>
          <Select.Option value="read">👁️ Đã đọc</Select.Option>
          <Select.Option value="replied">✅ Đã trả lời</Select.Option>
          <Select.Option value="archived">📁 Đã lưu trữ</Select.Option>
        </Select>
      ),
    },
    {
      title: 'Thời gian',
      key: 'createdAt',
      render: (text: string, record: ContactMessage) => (
        <div className="text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <ClockCircleOutlined />
            {dayjs(record.createdAt).format('DD/MM/YYYY HH:mm')}
          </div>
          <div className="text-xs">
            {dayjs(record.createdAt).fromNow()}
          </div>
        </div>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (text: string, record: ContactMessage) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => showPreview(record)}
            className="text-blue-500 border-blue-500 hover:bg-blue-50"
            title="Xem chi tiết"
          />
          <Popconfirm
            title="Xóa tin nhắn này?"
            description="Hành động này không thể hoàn tác"
            onConfirm={() => handleDeleteMessage(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              className="border-red-500 text-red-500 hover:bg-red-50"
              title="Xóa"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const stats = {
    total: messages.length,
    new: messages.filter(m => m.status === 'new').length,
    read: messages.filter(m => m.status === 'read').length,
    replied: messages.filter(m => m.status === 'replied').length,
    archived: messages.filter(m => m.status === 'archived').length,
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
            📧 Quản lý tin nhắn liên hệ
          </h1>
          <p className="text-brown-600 dark:text-gray-300 text-lg">
            Quản lý và phản hồi các tin nhắn từ khách hàng ({stats.total} tin nhắn)
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="text-center bg-blue-50 border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-blue-600">Tổng cộng</div>
          </Card>
          <Card className="text-center bg-red-50 border-red-200">
            <div className="text-2xl font-bold text-red-600">{stats.new}</div>
            <div className="text-sm text-red-600">Mới</div>
          </Card>
          <Card className="text-center bg-blue-50 border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{stats.read}</div>
            <div className="text-sm text-blue-600">Đã đọc</div>
          </Card>
          <Card className="text-center bg-green-50 border-green-200">
            <div className="text-2xl font-bold text-green-600">{stats.replied}</div>
            <div className="text-sm text-green-600">Đã trả lời</div>
          </Card>
          <Card className="text-center bg-gray-50 border-gray-200">
            <div className="text-2xl font-bold text-gray-600">{stats.archived}</div>
            <div className="text-sm text-gray-600">Đã lưu trữ</div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-gray-50 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <Search
              placeholder="Tìm kiếm tin nhắn..."
              allowClear
              size="large"
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
              onChange={(e) => setSearchText(e.target.value)}
              className="rounded-lg"
            />
            
            <Select
              placeholder="Trạng thái"
              style={{ width: 150 }}
              value={statusFilter}
              onChange={setStatusFilter}
              size="large"
            >
              <Select.Option value="all">Tất cả</Select.Option>
              <Select.Option value="new">🆕 Mới</Select.Option>
              <Select.Option value="read">👁️ Đã đọc</Select.Option>
              <Select.Option value="replied">✅ Đã trả lời</Select.Option>
              <Select.Option value="archived">📁 Đã lưu trữ</Select.Option>
            </Select>
            
            <Button
              icon={<FilterOutlined />}
              onClick={() => {
                setSearchText('')
                setStatusFilter('all')
                setDateRange(null)
              }}
              size="large"
            >
              Xóa bộ lọc
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Messages Table */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <Card>
          <Table
            columns={columns}
            dataSource={filteredMessages}
            rowKey="_id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} của ${total} tin nhắn`,
            }}
            scroll={{ x: 1000 }}
          />
        </Card>
      </motion.div>

      {/* Message Preview Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <MailOutlined className="text-orange-500" />
            Chi tiết tin nhắn
          </div>
        }
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={700}
        className="message-preview-modal"
      >
        {selectedMessage && (
          <div className="space-y-4">
            {/* Sender Info */}
            <Card className="bg-blue-50 border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <Avatar 
                  icon={<UserOutlined />} 
                  size={48}
                  className="bg-orange-100 text-orange-600"
                />
                <div>
                  <div className="text-lg font-bold text-brown-primary">
                    {selectedMessage.name}
                  </div>
                  <div className="text-blue-600">{selectedMessage.email}</div>
                  <div className="text-sm text-gray-500">
                    {dayjs(selectedMessage.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Tag color={getStatusColor(selectedMessage.status)}>
                  {getStatusIcon(selectedMessage.status)} {getStatusText(selectedMessage.status)}
                </Tag>
                {selectedMessage.ipAddress && (
                  <Tag color="gray">IP: {selectedMessage.ipAddress}</Tag>
                )}
              </div>
            </Card>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiêu đề:
              </label>
              <div className="p-3 bg-gray-50 rounded border text-brown-primary font-medium">
                {selectedMessage.subject}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nội dung tin nhắn:
              </label>
              <div className="p-3 bg-gray-50 rounded border text-brown-600 whitespace-pre-wrap">
                {selectedMessage.message}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button
                type="primary"
                icon={<MailOutlined />}
                className="bg-orange-primary hover:bg-green-primary border-none"
                onClick={() => {
                  // TODO: Implement reply functionality
                  message.info('Tính năng trả lời email sẽ được phát triển sau')
                }}
              >
                Trả lời email
              </Button>
              
              <Select
                placeholder="Cập nhật trạng thái"
                style={{ width: 200 }}
                value={selectedMessage.status}
                onChange={(value) => {
                  handleStatusChange(selectedMessage._id, value)
                  setPreviewVisible(false)
                }}
              >
                <Select.Option value="new">🆕 Mới</Select.Option>
                <Select.Option value="read">👁️ Đã đọc</Select.Option>
                <Select.Option value="replied">✅ Đã trả lời</Select.Option>
                <Select.Option value="archived">📁 Đã lưu trữ</Select.Option>
              </Select>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  )
}

export default ContactMessages
