'use client'

import React, { useState } from 'react'
import { Card, Button, Tag, Image, Modal } from 'antd'
import { motion } from 'framer-motion'
import { EyeOutlined, GithubOutlined, LinkOutlined, PlayCircleOutlined, YoutubeOutlined } from '@ant-design/icons'
import { Project } from '@/types/project'

interface ProjectCardProps {
  project: Project
  index: number
  onEdit?: (project: Project) => void
  onDelete?: (id: string) => void
  showActions?: boolean
}

function ProjectCard({ project, index, onEdit, onDelete, showActions = false }: ProjectCardProps) {
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  
  // Get main media (image or video) - prioritize videos over images
  const mainMedia = project.mainImage 
    ? [...project.images, ...project.videos].find(media => media.path === project.mainImage)
    : (() => {
        // First check if there's a main image
        const mainImage = project.images.find(img => img.isMain)
        if (mainImage) return mainImage
        
        // If no main image, prioritize videos over images
        if (project.videos.length > 0) {
          return project.videos[0]
        }
        
        // Fallback to first image if no videos
        return project.images[0]
      })()
  
  const hasMedia = project.images.length > 0 || project.videos.length > 0

  const handlePreview = (imagePath: string, title: string) => {
    setPreviewImage(imagePath)
    setPreviewTitle(title)
    setPreviewVisible(true)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -60, scale: 0.8 }}
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ 
          delay: 2.4 + index * 0.1, 
          duration: 0.5,
          type: "spring",
          stiffness: 100
        }}
        className="group h-full"
      >
        <Card
          className="h-full bg-white-primary dark:bg-dark-card border border-brown-200/50 dark:border-orange-500/30 shadow-lg group-hover:shadow-2xl group-hover:border-orange-primary/60 transition-all duration-500 overflow-hidden"
          style={{ borderRadius: '20px' }}
          bodyStyle={{ padding: '0' }}
          cover={
            mainMedia ? (
              <div className="relative aspect-video overflow-hidden">
                {mainMedia.path.includes('youtube.com/embed') ? (
                  // YouTube video display - SỬA LẠI ĐỂ HIỂN THỊ VIDEO THẬT
                  <iframe
                    src={mainMedia.path}
                    className="w-full h-full"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : mainMedia.mimeType?.startsWith('video/') ? (
                  <video
                    src={mainMedia.path}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    muted
                    loop
                    onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                    onMouseLeave={(e) => (e.target as HTMLVideoElement).pause()}
                  />
                ) : (
                  <Image
                    src={mainMedia.path}
                    alt={project.name}
                    width="100%"
                    height="100%"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    preview={false}
                  />
                )}
                
                {/* Media Indicators */}
                <div className="absolute top-3 right-3 flex gap-2">
                  {project.images.length > 0 && (
                    <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <span>📸</span>
                      {project.images.length}
                    </div>
                  )}
                  {project.videos.length > 0 && (
                    <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <span>🎥</span>
                      {project.videos.length}
                    </div>
                  )}
                </div>

                {/* Overlay for preview */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="primary"
                    shape="circle"
                    size="large"
                    icon={<EyeOutlined />}
                    onClick={() => handlePreview(mainMedia.path, project.name)}
                    className="bg-white/20 border-white/20 hover:bg-white/30"
                  />
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-gradient-to-br from-orange-100 to-brown-100 dark:from-orange-900/30 dark:to-brown-900/30 flex items-center justify-center">
                <div className="text-center text-brown-400 dark:text-orange-400">
                  <div className="text-4xl mb-2">📁</div>
                  <div className="text-sm">No preview available</div>
                </div>
              </div>
            )
          }
        >
          <div className="p-6 space-y-4">
            {/* Title */}
            <div>
              <h3 className="text-xl font-bold text-brown-primary dark:text-dark-text mb-2 line-clamp-1">
                {project.name}
              </h3>
              <p className="text-brown-600 dark:text-dark-text-secondary text-sm leading-relaxed line-clamp-3">
                {project.description}
              </p>
            </div>

            {/* Technologies */}
            {project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, techIndex) => (
                  <Tag
                    key={techIndex}
                    className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700/30 text-xs"
                  >
                    {tech}
                  </Tag>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              {project.liveUrl && (
                <Button
                  type="primary"
                  icon={<LinkOutlined />}
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-orange-primary hover:bg-green-primary border-none flex-1"
                  style={{ borderRadius: '8px' }}
                >
                  Live Demo
                </Button>
              )}
              
              {project.githubUrl && (
                <Button
                  icon={<GithubOutlined />}
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-brown-300 text-brown-600 hover:border-orange-primary hover:text-orange-primary dark:border-orange-500/30 dark:text-orange-300"
                  style={{ borderRadius: '8px' }}
                >
                  Code
                </Button>
              )}
            </div>

            {/* Admin Actions */}
            {showActions && (
              <div className="flex gap-2 pt-2 border-t border-brown-200/30 dark:border-orange-500/20">
                <Button
                  size="small"
                  onClick={() => onEdit?.(project)}
                  className="border-orange-primary text-orange-primary hover:bg-orange-50 dark:hover:bg-orange-900/20 flex-1"
                  style={{ borderRadius: '6px' }}
                >
                  ✏️ Edit
                </Button>
                <Button
                  size="small"
                  danger
                  onClick={() => onDelete?.(project._id)}
                  className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex-1"
                  style={{ borderRadius: '6px' }}
                >
                  🗑️ Delete
                </Button>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Preview Modal */}
      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width="80%"
        style={{ maxWidth: '1000px' }}
        className="project-preview-modal"
      >
        <div className="space-y-4">
          {previewImage.includes('youtube.com/embed') ? (
            <iframe
              width="100%"
              height="400"
              src={previewImage}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ borderRadius: '8px' }}
            />
          ) : previewImage.match(/\.(mp4|webm|ogg|mov)$/i) ? (
            <video
              controls
              style={{ width: '100%', borderRadius: '8px' }}
              src={previewImage}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              alt="preview"
              style={{ width: '100%', borderRadius: '8px' }}
              src={previewImage}
            />
          )}
          
          {/* Additional Images */}
          {project.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {project.images.slice(1, 5).map((image, idx) => (
                <img
                  key={image._id}
                  src={image.path}
                  alt={`${project.name} ${idx + 2}`}
                  className="w-full aspect-square object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => handlePreview(image.path, `${project.name} - Image ${idx + 2}`)}
                />
              ))}
            </div>
          )}

          {/* Videos */}
          {project.videos.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-brown-primary dark:text-orange-300">Videos</h4>
              <div className="grid grid-cols-1 gap-4">
                {project.videos.slice(0, 2).map((video) => (
                  video.path.includes('youtube.com/embed') ? (
                    <div key={video._id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-red-500">🎬</span>
                        <span className="text-sm text-gray-600">{video.filename || video.originalName}</span>
                        <Tag color="red" icon={<YoutubeOutlined />}>YouTube</Tag>
                      </div>
                      <iframe
                        width="100%"
                        height="200"
                        src={video.path}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ borderRadius: '8px' }}
                      />
                    </div>
                  ) : (
                    <div key={video._id}>
                      <video
                        src={video.path}
                        controls
                        className="w-full rounded"
                        style={{ maxHeight: '300px' }}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}

export default ProjectCard


