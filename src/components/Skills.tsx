'use client'

import React from 'react'
import { motion } from 'framer-motion'

function Skills() {
  const skillCategories = [
    {
      title: 'Frontend',
      skills: [
        { name: 'React', level: 80 },
        { name: 'Next.js', level: 85 },
        { name: 'TypeScript', level: 80 },
        { name: 'JavaScript', level: 60 },
        { name: 'HTML/CSS', level: 90 },
        { name: 'Tailwind CSS', level: 85 },
      ]
    },
    {
      title: 'Backend & Database',
      skills: [
        { name: 'Node.js', level: 60 },
        { name: 'Express.js', level: 60 },
        { name: 'MongoDB', level: 80 },
        { name: 'REST API', level: 60 },
      ]
    },
    {
      title: 'Tools & Others',
      skills: [
        { name: 'GitHub', level: 80 },
        { name: 'AI tools', level: 80 },
      ]
    }
  ]

  return (
    <section id="skills" className="min-h-screen py-20 bg-gradient-to-br from-cream-primary to-orange-50 dark:from-dark-bg dark:to-dark-card">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-brown-primary dark:text-orange-300 mb-4"
          >
                         <span className="font-mono text-lg text-orange-primary"></span> Skills & Technologies
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '100px' }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="h-1 bg-gradient-to-r from-orange-primary to-brown-primary mx-auto rounded-full"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-brown-600 dark:text-dark-text-secondary text-lg mt-6 max-w-2xl mx-auto"
          >
            Đây là những công nghệ và kỹ năng mà tôi đã học được và áp dụng trong các dự án
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.2, duration: 0.6 }}
              className="bg-white-primary dark:bg-dark-card rounded-2xl p-6 shadow-lg border border-brown-200/30 dark:border-orange-500/20 hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-xl font-bold text-brown-primary dark:text-orange-300 mb-6 text-center">
                {category.title}
              </h3>
              
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      delay: categoryIndex * 0.2 + skillIndex * 0.1, 
                      duration: 0.5 
                    }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-brown-600 dark:text-dark-text-secondary font-medium">
                        {skill.name}
                      </span>
                      <span className="text-sm text-orange-primary dark:text-orange-300 font-mono">
                        {skill.level}%
                      </span>
                    </div>
                    
                    <div className="relative h-2 bg-brown-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ 
                          delay: categoryIndex * 0.2 + skillIndex * 0.1 + 0.3,
                          duration: 0.8,
                          ease: "easeOut"
                        }}
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-orange-primary to-brown-primary rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Skills Icons */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold text-brown-primary dark:text-orange-300 mb-8 text-center">
           Technologies
          </h3>
          
          <div className="flex flex-wrap justify-center gap-4">
            {[
              'React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 
              'MongoDB', 'Ant Design', 'Tailwind CSS', 'GitHub',
              'AI tools'
            ].map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: 0.1 * index, 
                  duration: 0.3,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.1,
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                className="px-4 py-2 bg-orange-primary hover:bg-brown-primary text-white rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 cursor-default"
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Skills
