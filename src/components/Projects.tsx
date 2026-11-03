'use client'

import React, { useState, useEffect } from 'react'
import { Button, Empty, Spin, message, Alert } from 'antd'
import { motion } from 'framer-motion'
import { Project } from '@/types/project'
import { projectApi } from '@/lib/api'
import { useI18n } from '@/contexts/I18nContext'
import { pickLocalized } from '@/lib/i18nContent'

function Projects() {
  const { t, locale } = useI18n()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await projectApi.getAll()
      setProjects(data)
    } catch (err: any) {
      const errorMessage = err.message || t.projects.fetchError
      setError(errorMessage)
      message.error(errorMessage)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="projects" className="min-h-screen py-20 bg-white-primary dark:bg-dark-bg">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-brown-primary dark:text-dark-text">
            {t.projects.heading}
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-orange-primary to-brown-primary mx-auto rounded-full mb-4" />
          <p className="text-brown-600 dark:text-dark-text-secondary text-lg max-w-2xl mx-auto">
            {t.projects.subtitle}
          </p>
        </div>

        {/* Featured from CV */}
        <div className="mb-16">
          <div className="mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-brown-primary dark:text-orange-300 mb-2">
              {t.projects.featuredHeading}
            </h3>
            <p className="text-brown-600 dark:text-dark-text-secondary">
              {t.projects.featuredSubtitle}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {t.projects.featured.map((project, index) => (
              <motion.article
                key={project.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="p-6 md:p-7 rounded-2xl bg-cream-primary dark:bg-dark-card border border-brown-200/40 dark:border-orange-500/20 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                  <h4 className="text-xl font-bold text-brown-primary dark:text-dark-text leading-snug">
                    {project.name}
                  </h4>
                  <span className="shrink-0 text-xs font-mono text-orange-primary dark:text-orange-300 bg-orange-100/80 dark:bg-orange-900/30 px-2.5 py-1 rounded-full">
                    {project.period}
                  </span>
                </div>
                <p className="text-sm font-semibold text-brown-600 dark:text-dark-text-secondary mb-3">
                  {project.role}
                </p>
                <p className="text-brown-600 dark:text-dark-text-secondary leading-relaxed mb-4">
                  {project.summary}
                </p>
                <ul className="space-y-2 mb-5">
                  {project.highlights.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-brown-700 dark:text-dark-text-secondary">
                      <span className="text-orange-primary mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 text-xs font-medium rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-200/60 dark:border-orange-700/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* DB projects */}
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-brown-primary dark:text-orange-300 mb-8">
            {t.projects.moreHeading}
          </h3>

          {error && (
            <Alert
              className="mb-8"
              message={t.projects.connectionError}
              description={
                <div>
                  <p>{error}</p>
                  <Button type="primary" onClick={fetchProjects} className="mt-2">
                    {t.projects.retry}
                  </Button>
                </div>
              }
              type="error"
              showIcon
              closable
              onClose={() => setError(null)}
            />
          )}

          {loading ? (
            <div className="text-center py-12">
              <Spin size="large" />
              <p className="mt-4 text-brown-600 dark:text-dark-text-secondary">{t.projects.loading}</p>
            </div>
          ) : projects.length > 0 ? (
            <div className="space-y-16">
              {projects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className={`flex flex-col lg:flex-row gap-8 lg:gap-12 items-center ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  <div className="w-full lg:w-1/2">
                    <div className="relative group">
                      {project.images && project.images.length > 0 ? (
                        <div className="relative aspect-video overflow-hidden rounded-2xl shadow-2xl">
                          <img
                            src={
                              project.mainImage
                                ? project.images.find((img) => img.path === project.mainImage)?.path ||
                                  project.images[0].path
                                : project.images.find((img) => img.isMain)?.path || project.images[0].path
                            }
                            alt={pickLocalized(locale, project.name, project.nameEn)}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-gradient-to-br from-orange-100 via-brown-100 to-orange-200 dark:from-orange-900/30 dark:via-brown-900/30 dark:to-orange-800/30 rounded-2xl shadow-2xl flex items-center justify-center">
                          <div className="text-center text-brown-500 dark:text-orange-400">
                            <div className="text-6xl mb-4">💻</div>
                            <div className="text-lg font-medium">{t.projects.noPreview}</div>
                            <div className="text-sm opacity-70">{t.projects.inDevelopment}</div>
                          </div>
                        </div>
                      )}
                      <div className="absolute -top-4 -right-4 bg-orange-primary text-white px-4 py-2 rounded-full shadow-lg font-medium text-sm">
                        #{index + 1}
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-1/2 space-y-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-orange-primary font-mono text-sm font-bold">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <h3 className="text-3xl lg:text-4xl font-bold text-brown-primary dark:text-dark-text">
                          {pickLocalized(locale, project.name, project.nameEn)}
                        </h3>
                      </div>
                      <div className="h-1 w-20 bg-gradient-to-r from-orange-primary to-brown-primary rounded-full" />
                    </div>

                    <p className="text-brown-600 dark:text-dark-text-secondary text-lg leading-relaxed">
                      {pickLocalized(locale, project.description, project.descriptionEn)}
                    </p>

                    <div>
                      <h4 className="text-brown-700 dark:text-dark-text font-semibold text-lg mb-3">
                        {t.projects.technologiesUsed}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium border border-orange-200 dark:border-orange-700/30"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-brown-primary hover:bg-orange-primary text-white rounded-xl font-medium transition-all shadow-lg"
                        >
                          {t.projects.viewCode}
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-primary hover:bg-brown-primary text-white rounded-xl font-medium transition-all shadow-lg"
                        >
                          {t.projects.liveDemo}
                        </a>
                      )}
                    </div>

                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      {project.status === 'ACTIVE' ? t.projects.activeProject : project.status}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Empty description={t.projects.empty} image={Empty.PRESENTED_IMAGE_SIMPLE}>
                <Button type="primary" onClick={fetchProjects}>
                  {t.projects.reload}
                </Button>
              </Empty>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Projects
