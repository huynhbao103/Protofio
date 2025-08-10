'use client'

import React, { useState } from 'react'
import { Modal, Upload, Button, Image, message, Space, Tag, Popconfirm, Card, Divider, Switch, Progress, Alert, Tabs, Input } from 'antd'
import type { UploadFile, RcFile } from 'antd/es/upload/interface'
import { UploadOutlined, DeleteOutlined, EyeOutlined, StarOutlined, StarFilled, PlayCircleOutlined, ScissorOutlined, YoutubeOutlined } from '@ant-design/icons'
import { Project } from '@/types/project'
import { projectApi } from '@/lib/api'


const { Dragger } = Upload
const { TabPane } = Tabs
const { TextArea } = Input

interface MediaManagerProps {
  project: Project
  open: boolean
  onClose: () => void
  onMediaUpdate: (projectId: string, media: any) => void
}

interface MediaItem {
  _id: string
  path: string
  type: 'image' | 'video'
  isMain?: boolean
  filename?: string
  originalName?: string
  size?: number
  mimeType?: string
  publicId?: string
  cloudinaryData?: {
    public_id: string
    secure_url: string
    width?: number
    height?: number
    format: string
    duration?: number
  }
  youtubeData?: {
    youtube_id: string
    original_url: string
    title: string
  }
}

function MediaManager({ project, open, onClose, onMediaUpdate }: MediaManagerProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadFiles, setUploadFiles] = useState<RcFile[]>([])
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [previewType, setPreviewType] = useState<'image' | 'video'>('image')
  const [isMain, setIsMain] = useState(false)
  const [enableVideoSplitting, setEnableVideoSplitting] = useState(true)
  const [splittingProgress, setSplittingProgress] = useState(0)
  const [isSplitting, setIsSplitting] = useState(false)
  
  // New state for YouTube functionality
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [youtubeLoading, setYoutubeLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('upload')

  const handlePreview = (media: MediaItem) => {
    setPreviewImage(media.path)
    setPreviewTitle(`${project.name} - ${media.filename || media.originalName || 'Media'}`)
    setPreviewType(media.type)
    setPreviewVisible(true)
  }

  const handleVideoProcessing = async (files: RcFile[]) => {
    setIsSplitting(true)
    setSplittingProgress(0)
    
    try {
      const processedFiles: RcFile[] = []
      const oversizedVideos: RcFile[] = []
      let processedCount = 0
      
      for (const file of files) {
        if (file.type.startsWith('video/')) {
          if (file.size > 100 * 1024 * 1024) { // 100MB limit
            oversizedVideos.push(file)
            continue
          } else if (file.size > 25 * 1024 * 1024) {
            message.warning(`Video ${file.name} lớn (${(file.size / (1024 * 1024)).toFixed(2)}MB). Sẽ sử dụng streaming upload với chunk size nhỏ.`)
          }
        }
        processedFiles.push(file)
        
        processedCount++
        setSplittingProgress((processedCount / files.length) * 100)
      }
      
      // Handle oversized videos
      if (oversizedVideos.length > 0) {
        const videoNames = oversizedVideos.map(f => `${f.name} (${(f.size / (1024 * 1024)).toFixed(2)}MB)`).join(', ')
        
        message.warning(
          `Phát hiện video quá lớn: ${videoNames}. Video trên 100MB không thể upload trực tiếp.`,
          5
        )
        
        // Auto-switch to YouTube tab for oversized videos
        if (oversizedVideos.length === files.length) {
          // All files are oversized, switch to YouTube tab
          setActiveTab('youtube')
          message.info('Đã chuyển sang tab YouTube để thêm video từ YouTube thay thế.', 3)
        } else if (oversizedVideos.length > 0) {
          // Some files are oversized, show option
          Modal.confirm({
            title: 'Video quá lớn phát hiện',
            content: `Video ${videoNames} quá 100MB và không thể upload trực tiếp. Bạn có muốn chuyển sang tab YouTube để thêm video từ YouTube thay thế không?`,
            okText: 'Chuyển sang YouTube',
            cancelText: 'Tiếp tục với file nhỏ hơn',
            onOk: () => {
              setActiveTab('youtube')
              setUploadFiles(processedFiles) // Keep only valid files
            },
            onCancel: () => {
              setUploadFiles(processedFiles) // Keep only valid files
            }
          })
          return
        }
      }
      
      setUploadFiles(processedFiles)
      message.success(`Xử lý hoàn tất! Tổng cộng ${processedFiles.length} file để upload`)
      
    } catch (error: any) {
      console.error('Video processing error:', error)
      message.error(`Lỗi khi xử lý video: ${error.message}`)
    } finally {
      setIsSplitting(false)
      setSplittingProgress(0)
    }
  }

  // New function to handle file size validation before upload
  const validateFileSize = (file: RcFile): boolean => {
    if (file.type.startsWith('video/') && file.size > 100 * 1024 * 1024) {
      message.error(`File ${file.name} quá lớn (${(file.size / (1024 * 1024)).toFixed(2)}MB). Video trên 100MB không thể upload trực tiếp. Hãy sử dụng tab YouTube.`)
      return false
    }
    return true
  }

  const handleFileChange = ({ fileList }: { fileList: any[] }) => {
    const files = fileList.map((f: any) => f.originFileObj).filter(Boolean) as RcFile[]
    if (files.length > 0) {
      // Validate file sizes
      const validFiles = files.filter(validateFileSize)
      if (validFiles.length !== files.length) {
        const invalidCount = files.length - validFiles.length
        message.warning(`${invalidCount} file không hợp lệ do kích thước quá lớn. Hãy sử dụng tab YouTube cho video lớn.`)
      }
      setUploadFiles(validFiles)
    }
  }

  const handleUpload = async () => {
    if (uploadFiles.length === 0) return

    setUploading(true)
    try {
      const response = await projectApi.uploadFiles(project._id, uploadFiles, isMain)
      
      message.success('Upload thành công!')
      setUploadFiles([])
      setIsMain(false)
      onMediaUpdate(project._id, response)
    } catch (error: any) {
      console.error('Upload error:', error)
      message.error(`Lỗi upload: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteMedia = async (mediaId: string) => {
    try {
      await projectApi.deleteMedia(project._id, mediaId)
      
      message.success('Xóa media thành công!')
      onMediaUpdate(project._id, { deletedMediaId: mediaId })
    } catch (error: any) {
      console.error('Delete error:', error)
      message.error(`Lỗi xóa: ${error.message}`)
    }
  }

  const handleSetMainImage = async (mediaId: string) => {
    try {
      const response = await projectApi.setMainImage(project._id, mediaId)
      
      message.success('Đặt media chính thành công!')
      onMediaUpdate(project._id, response)
    } catch (error: any) {
      console.error('Set main media error:', error)
      message.error(`Lỗi: ${error.message}`)
    }
  }

  // New function to handle YouTube URL submission
  const handleYouTubeSubmit = async () => {
    if (!youtubeUrl.trim()) {
      message.error('Vui lòng nhập YouTube URL')
      return
    }

    setYoutubeLoading(true)
    try {
      const response = await fetch(`/api/projects/${project._id}/youtube`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          youtubeUrl: youtubeUrl.trim(),
          isMain
        }),
      })

      const result = await response.json()

      if (result.success) {
        message.success('YouTube video đã được thêm thành công!')
        setYoutubeUrl('')
        setIsMain(false)
        
        // Refresh media list
        onMediaUpdate(project._id, result.video)
        
        // Switch back to upload tab
        setActiveTab('upload')
      } else {
        message.error(`Lỗi: ${result.error}`)
      }
    } catch (error: any) {
      console.error('YouTube submission error:', error)
      message.error(`Lỗi khi thêm YouTube video: ${error.message}`)
    } finally {
      setYoutubeLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  

  const allMedia: MediaItem[] = [
    ...project.images.map(img => ({
      _id: img._id,
      path: img.path,
      type: 'image' as const,
      isMain: img.isMain,
      filename: img.filename,
      originalName: img.originalName,
      size: img.size,
      mimeType: img.mimeType,
      cloudinaryData: img.cloudinaryData
    })),
    ...project.videos.map(vid => ({
      _id: vid._id,
      path: vid.path,
      type: 'video' as const,
      isMain: vid.isMain,
      filename: vid.filename,
      originalName: vid.originalName,
      size: vid.size,
      mimeType: vid.mimeType,
      cloudinaryData: vid.cloudinaryData,
      youtubeData: vid.youtubeData
    }))
  ]

  return (
    <Modal
      title={`📁 Quản lý Media - ${project.name}`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      className="media-manager-modal"
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="📤 Upload Files" key="upload">
          <Card title="📤 Tải lên Files" className="mb-4">
            <Alert
              message="Giới hạn File Size"
              description="• Hình ảnh: Không giới hạn • Video: Tối đa 100MB • Video 25MB-100MB: Sử dụng streaming upload • Video >100MB: Sử dụng tab YouTube"
              type="info"
              showIcon
              className="mb-4"
            />
            <Dragger
              multiple
              fileList={uploadFiles}
              beforeUpload={() => false}
              onChange={handleFileChange}
              accept="image/*,video/*"
              disabled={uploading}
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined className="text-4xl text-orange-primary" />
              </p>
              <p className="ant-upload-text text-brown-primary dark:text-dark-text">
                Kéo thả hoặc click để chọn files
              </p>
              <p className="ant-upload-hint text-brown-600 dark:text-dark-text-secondary">
                Hỗ trợ: JPG, PNG, GIF, WebP, MP4, WebM, OGG. Tối đa 100MB/file.
              </p>
              <p className="ant-upload-hint text-xs text-orange-600 mt-1">
                💡 Tip: Video files lớn (25MB-100MB) sẽ được xử lý với streaming upload để đảm bảo thành công!
              </p>
              <p className="ant-upload-hint text-xs text-red-600 mt-1">
                ⚠️ Lưu ý: Video trên 100MB không thể upload trực tiếp. Hãy sử dụng tab YouTube để thêm video từ YouTube thay thế.
              </p>
            </Dragger>
            
            {uploadFiles.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  Đã chọn {uploadFiles.length} file(s):
                </p>
                
                {/* Video Processing Options */}
                {uploadFiles.some(file => file.type.startsWith('video/') && file.size > 25 * 1024 * 1024) && (
                  <Alert
                    message="Phát hiện video lớn"
                    description="Video files lớn (25MB-100MB) sẽ sử dụng streaming upload với chunk size nhỏ để tối ưu hóa. Quá trình có thể mất nhiều thời gian hơn."
                    type="info"
                    showIcon
                    className="mb-4"
                  />
                )}
                
                <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
                  {uploadFiles.map((file, index) => {
                    const isMediumVideo = file.type.startsWith('video/') && file.size > 25 * 1024 * 1024 && file.size <= 100 * 1024 * 1024
                    const isLargeVideo = file.type.startsWith('video/') && file.size > 100 * 1024 * 1024
                    
                    return (
                      <div key={index} className={`flex items-center justify-between p-2 rounded border ${
                        isMediumVideo ? 'bg-orange-50 border-orange-200' : 
                        isLargeVideo ? 'bg-red-50 border-red-200' : 'bg-white'
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${
                            isMediumVideo ? 'text-orange-700' : 
                            isLargeVideo ? 'text-red-700' : ''
                          }`}>
                            {file.name}
                          </span>
                          <Tag color={file.type.startsWith('image/') ? 'blue' : 'green'}>
                            {file.type.startsWith('image/') ? '📸' : '🎥'}
                          </Tag>
                          {isMediumVideo && (
                            <Tag color="orange" icon={<ScissorOutlined />}>
                              Streaming upload
                            </Tag>
                          )}
                          {isLargeVideo && (
                            <Tag color="red" icon={<YoutubeOutlined />}>
                              Quá lớn - Dùng YouTube
                            </Tag>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </span>
                      </div>
                    )
                  })}
                </div>
                
                {/* Main Image Option */}
                <div className="mb-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isMain}
                      onChange={(e) => setIsMain(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">
                      Đặt file đầu tiên làm media chính của project
                    </span>
                  </label>
                </div>
                
                <Button
                  type="primary"
                  onClick={handleUpload}
                  loading={uploading}
                  disabled={uploading || isSplitting}
                  className="w-full"
                  icon={<UploadOutlined />}
                >
                  {uploading ? 'Đang tải lên...' : 'Tải lên Files'}
                </Button>
              </div>
            )}
          </Card>
        </TabPane>

        <TabPane tab="🎬 YouTube Video" key="youtube">
          <Card title="🎬 Thêm YouTube Video" className="mb-4">
            <Alert
              message="Khi nào sử dụng YouTube?"
              description="Sử dụng tab này khi: 1) Video quá 100MB không thể upload trực tiếp, 2) Muốn thêm video từ YouTube, 3) Muốn tiết kiệm băng thông và thời gian upload."
              type="info"
              showIcon
              className="mb-4"
            />
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube URL
                </label>
                <TextArea
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  rows={3}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Hỗ trợ: youtube.com/watch?v=, youtu.be/, youtube.com/embed/
                </p>
              </div>

              {/* Main Image Option */}
              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isMain}
                    onChange={(e) => setIsMain(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                                    <span className="text-sm text-gray-700">
                    Đặt video này làm media chính của project
                  </span>
                </label>
              </div>

              <Button
                type="primary"
                onClick={handleYouTubeSubmit}
                loading={youtubeLoading}
                disabled={!youtubeUrl.trim() || youtubeLoading}
                className="w-full"
                icon={<YoutubeOutlined />}
              >
                {youtubeLoading ? 'Đang xử lý...' : 'Thêm YouTube Video'}
              </Button>
            </div>
          </Card>
        </TabPane>
      </Tabs>

      {/* Media Display Section */}
      <Card title={`📁 Media hiện tại (${allMedia.length})`}>
        {allMedia.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Chưa có media nào</p>
            <p className="text-sm">Hãy upload files hoặc thêm YouTube video</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allMedia.map((media) => (
              <div key={media._id} className="relative">
                {media.youtubeData ? (
                  <Card
                    hoverable
                    className="h-full cursor-pointer"
                    onClick={() => window.open(media.youtubeData!.original_url, '_blank')}
                    cover={
                      <div className="h-32 bg-red-50 flex items-center justify-center">
                        <div className="text-center">
                          <YoutubeOutlined className="text-4xl text-red-500 mb-2" />
                          <div className="text-sm text-gray-600">YouTube Video</div>
                        </div>
                      </div>
                    }
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium truncate" title={media.youtubeData.title}>
                          {media.youtubeData.title}
                        </span>
                        <Tag color="red">🎥</Tag>
                      </div>
                      
                      <p className="text-xs text-gray-500">
                        Nhấp để xem trên YouTube
                      </p>
                      
                      {media.isMain && (
                        <Tag color="orange" icon={<StarFilled />}>
                          Media chính
                        </Tag>
                      )}
                    </div>
                    
                    <Divider className="my-3" />
                    
                    <Space size="small" className="w-full justify-center">
                      <Button
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePreview(media)
                        }}
                        title="Xem thông tin"
                      />
                      
                      {!media.isMain && (
                        <Button
                          size="small"
                          icon={<StarOutlined />}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSetMainImage(media._id)
                          }}
                          className="text-orange-500 border-orange-500 hover:bg-orange-50"
                          title="Đặt làm media chính"
                        />
                      )}
                      
                      <Popconfirm
                        title="Xóa video này?"
                        description="Hành động này không thể hoàn tác"
                        onConfirm={() => handleDeleteMedia(media._id)}
                        okText="Xóa"
                        cancelText="Hủy"
                      >
                        <Button
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          className="border-red-500 text-red-500 hover:bg-red-50"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Popconfirm>
                    </Space>
                  </Card>
                ) : (
                  <Card
                    hoverable
                    className="h-full"
                    cover={
                      media.type === 'image' ? (
                        <Image
                          alt={media.filename || 'Media'}
                          src={media.path}
                          className="h-32 object-cover"
                          preview={false}
                        />
                      ) : (
                        <div className="h-32 bg-gray-100 flex items-center justify-center">
                          <PlayCircleOutlined className="text-4xl text-gray-400" />
                        </div>
                      )
                    }
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium truncate">
                          {media.filename || media.originalName || 'Unnamed'}
                        </span>
                        <Tag color={media.type === 'image' ? 'blue' : 'green'}>
                          {media.type === 'image' ? '📸' : '🎥'}
                        </Tag>
                      </div>
                      
                      {media.size && media.size > 0 ? (
                        <p className="text-xs text-gray-500">
                          {formatFileSize(media.size)}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-500">
                          Video
                        </p>
                      )}
                      
                      {media.isMain && (
                        <Tag color="orange" icon={<StarFilled />}>
                          Media chính
                        </Tag>
                      )}
                    </div>
                    
                    <Divider className="my-3" />
                    
                    <Space size="small" className="w-full justify-center">
                      <Button
                        size="small"
                        icon={media.type === 'video' ? <PlayCircleOutlined /> : <EyeOutlined />}
                        onClick={() => handlePreview(media)}
                        title={media.type === 'video' ? 'Xem video' : 'Xem ảnh'}
                      />
                      
                      {!media.isMain && (
                        <Button
                          size="small"
                          icon={<StarOutlined />}
                          onClick={() => handleSetMainImage(media._id)}
                          className="text-orange-500 border-orange-500 hover:bg-orange-50"
                          title="Đặt làm media chính"
                        />
                      )}
                      
                      <Popconfirm
                        title="Xóa media này?"
                        description="Hành động này không thể hoàn tác"
                        onConfirm={() => handleDeleteMedia(media._id)}
                        okText="Xóa"
                        cancelText="Hủy"
                      >
                        <Button
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          className="border-red-500 text-red-500 hover:bg-red-50"
                        />
                      </Popconfirm>
                    </Space>
                  </Card>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Media Stats */}
      <Card title="📊 Thống kê Media" className="bg-blue-50 mt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-white rounded border">
            <div className="text-2xl font-bold text-blue-600">{project.images.length}</div>
            <div className="text-sm text-gray-600">Hình ảnh</div>
          </div>
          <div className="p-3 bg-white rounded border">
            <div className="text-2xl font-bold text-green-600">{project.videos.length}</div>
            <div className="text-sm text-gray-600">Video</div>
            <div className="text-xs text-gray-500">
              {project.videos.filter(v => v.youtubeData).length} YouTube
            </div>
          </div>
          <div className="p-3 bg-white rounded border">
            <div className="text-2xl font-bold text-orange-600">
              {project.images.filter(img => img.isMain).length + project.videos.filter(v => v.isMain).length}
            </div>
            <div className="text-sm text-gray-600">Media chính</div>
          </div>
          <div className="p-3 bg-white rounded border">
            <div className="text-2xl font-bold text-purple-600">{allMedia.length}</div>
            <div className="text-sm text-gray-600">Tổng cộng</div>
          </div>
        </div>
      </Card>

      {/* Preview Modal */}
      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width="80%"
        style={{ maxWidth: '1000px' }}
        className="media-preview-modal"
      >
        <div className="text-center">
          {previewType === 'image' ? (
            <img
              alt="preview"
              style={{ width: '100%', borderRadius: '8px' }}
              src={previewImage}
            />
          ) : previewImage.includes('youtube.com/watch') ? (
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-red-800 mb-2">🎬 YouTube Video</h3>
                <p className="text-red-700">
                  Video này được lấy trực tiếp từ YouTube. Bạn có thể xem video gốc bằng cách click vào link bên dưới.
                </p>
              </div>
              <div className="flex justify-center">
                <a
                  href={previewImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <YoutubeOutlined className="mr-2" />
                  Xem video trên YouTube
                </a>
              </div>
            </div>
          ) : (
            <video
              controls
              style={{ width: '100%', borderRadius: '8px' }}
              src={previewImage}
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </Modal>
    </Modal>
  )
}

export default MediaManager
