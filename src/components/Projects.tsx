'use client'

import React, { useState, useEffect } from 'react'
import { Button, Empty, Spin, message, Alert } from 'antd'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Project } from '@/types/project'
import { projectApi } from '@/lib/api'
import ProjectCard from './ProjectCard'

// Fallback demo projects
const DEMO_PROJECTS: Project[] = [
  {
    _id: 'demo-1',
    name: 'Portfolio Website',
    description: 'Personal portfolio website built with Next.js, TypeScript, and Tailwind CSS. Features responsive design, dark mode, and modern UI components.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    githubUrl: 'https://github.com/yourusername/portfolio',
    liveUrl: 'https://yourportfolio.com',
    status: 'ACTIVE',
    priority: 1,
    images: [],
    videos: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: { _id: 'admin', username: 'admin' }
  },
  {
    _id: 'demo-2',
    name: 'E-commerce Platform',
    description: 'Full-stack e-commerce application with user authentication, product management, shopping cart, and payment integration.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redux'],
    githubUrl: 'https://github.com/yourusername/ecommerce',
    liveUrl: 'https://yourecommerce.com',
    status: 'ACTIVE',
    priority: 2,
    images: [],
    videos: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: { _id: 'admin', username: 'admin' }
  },
  {
    _id: 'demo-3',
    name: 'Task Management App',
    description: 'Collaborative task management application with real-time updates, team collaboration, and progress tracking.',
    technologies: ['Vue.js', 'Firebase', 'Vuex', 'Vuetify'],
    githubUrl: 'https://github.com/yourusername/taskmanager',
    liveUrl: 'https://yourtaskmanager.com',
    status: 'ACTIVE',
    priority: 3,
    images: [],
    videos: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: { _id: 'admin', username: 'admin' }
  }
]

function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingDemoData, setUsingDemoData] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      setUsingDemoData(false)
      
      console.log('🔍 Fetching projects from API...')
      const data = await projectApi.getAll()
      console.log('✅ Projects fetched successfully:', data)
      
      setProjects(data)
    } catch (error: any) {
      console.error('❌ Error fetching projects:', error)
      
      // Show user-friendly error message
      const errorMessage = error.message || 'Không thể tải danh sách dự án'
      setError(errorMessage)
      message.error(errorMessage)
      
      // Fallback to demo data
      console.log('🔄 Falling back to demo data...')
      setProjects(DEMO_PROJECTS)
      setUsingDemoData(true)
      
      // Show info message about demo data
      message.info('Đang hiển thị dữ liệu demo. Vui lòng kiểm tra kết nối database.')
    } finally {
      setLoading(false)
    }
  }

  const retryFetch = () => {
    fetchProjects()
  }

  if (loading) {
    return (
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-5xl mx-auto mb-16 text-center py-12"
      >
        <Spin size="large" />
        <p className="mt-4 text-brown-600 dark:text-dark-text-secondary">
          Đang tải dự án...
        </p>
      </motion.section>
    )
  }

  return (
    <section id="projects" className="min-h-screen py-20 bg-white-primary dark:bg-dark-bg">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 max-w-6xl"
      >
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-brown-primary dark:text-dark-text">
            <span className="font-mono text-lg text-orange-primary"></span> Projects
          </h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '100px' }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="h-1 bg-gradient-to-r from-orange-primary to-brown-primary mx-auto rounded-full mb-4"
          />
          <p className="text-brown-600 dark:text-dark-text-secondary text-lg max-w-2xl mx-auto">
            Những dự án tôi đã thực hiện với đam mê và sự tận tâm
          </p>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Alert
              message="Lỗi kết nối"
              description={
                <div>
                  <p>{error}</p>
                  <Button 
                    type="primary" 
                    onClick={retryFetch}
                    className="mt-2"
                  >
                    Thử lại
                  </Button>
                </div>
              }
              type="error"
              showIcon
              closable
              onClose={() => setError(null)}
            />
          </motion.div>
        )}

        {/* Demo Data Notice */}
        {usingDemoData && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Alert
              message="Đang sử dụng dữ liệu demo"
              description="Dữ liệu hiện tại là demo. Vui lòng kiểm tra kết nối database để xem dữ liệu thực."
              type="info"
              showIcon
              closable
            />
          </motion.div>
        )}

        {/* Projects Layout - Alternating Left/Right */}
        {projects.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="space-y-20"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                className={`flex flex-col lg:flex-row gap-8 lg:gap-12 items-center ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Project Image/Media */}
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 + 0.3, duration: 0.6 }}
                  className="w-full lg:w-1/2"
                >
                  <div className="relative group">
                    {/* Main Image */}
                    {project.images && project.images.length > 0 ? (
                      <div className="relative aspect-video overflow-hidden rounded-2xl shadow-2xl">
                        <img
                          src={project.mainImage 
                            ? project.images.find(img => img.path === project.mainImage)?.path || project.images[0].path
                            : project.images.find(img => img.isMain)?.path || project.images[0].path
                          }
                          alt={project.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        
                        {/* Overlay with project info */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute bottom-4 left-4 right-4 text-white">
                            <div className="flex items-center gap-2 mb-2">
                              {project.images.length > 0 && (
                                <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
                                  📸 {project.images.length}
                                </span>
                              )}
                              {project.videos && project.videos.length > 0 && (
                                <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
                                  🎥 {project.videos.length}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-orange-100 via-brown-100 to-orange-200 dark:from-orange-900/30 dark:via-brown-900/30 dark:to-orange-800/30 rounded-2xl shadow-2xl flex items-center justify-center">
                        <div className="text-center text-brown-500 dark:text-orange-400">
                          <div className="text-6xl mb-4">💻</div>
                          <div className="text-lg font-medium">No Preview</div>
                          <div className="text-sm opacity-70">Project in development</div>
                        </div>
                      </div>
                    )}
                    
                    {/* Floating Tech Badge */}
                    <div className="absolute -top-4 -right-4 bg-orange-primary text-white px-4 py-2 rounded-full shadow-lg font-medium text-sm">
                      #{index + 1}
                    </div>
                  </div>
                </motion.div>

                {/* Project Content */}
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 + 0.5, duration: 0.6 }}
                  className="w-full lg:w-1/2 space-y-6"
                >
                  {/* Project Header */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-orange-primary font-mono text-sm font-bold">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3 className="text-3xl lg:text-4xl font-bold text-brown-primary dark:text-dark-text">
                        {project.name}
                      </h3>
                    </div>
                    
                    <div className="h-1 w-20 bg-gradient-to-r from-orange-primary to-brown-primary rounded-full"></div>
                  </div>

                  {/* Project Description */}
                  <p className="text-brown-600 dark:text-dark-text-secondary text-lg leading-relaxed">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="space-y-3">
                    <h4 className="text-brown-700 dark:text-dark-text font-semibold text-lg">
                      Technologies Used:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <motion.span
                          key={techIndex}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.2 + 0.7 + techIndex * 0.1, duration: 0.4 }}
                          className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium border border-orange-200 dark:border-orange-700/30"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Project Links */}
                  <div className="flex flex-wrap gap-4 pt-4">
                    {project.githubUrl && (
                      <motion.a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 + 0.9, duration: 0.5 }}
                        whileHover={{ y: -3 }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-brown-primary hover:bg-orange-primary text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        <span className="text-lg">📁</span>
                        View Code
                      </motion.a>
                    )}
                    
                    {project.liveUrl && (
                      <motion.a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 + 1.0, duration: 0.5 }}
                        whileHover={{ y: -3 }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-orange-primary hover:bg-brown-primary text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        <span className="text-lg">🌐</span>
                        Live Demo
                      </motion.a>
                    )}
                  </div>

                  {/* Project Status */}
                  <div className="pt-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      {project.status === 'ACTIVE' ? 'Active Project' : project.status}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-center py-16"
          >
            <Empty
              description="Không có dự án nào"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button type="primary" onClick={retryFetch}>
                Tải lại
              </Button>
            </Empty>
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}

export default Projects