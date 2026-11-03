export type Locale = 'vi' | 'en'

export interface ExperienceCopy {
  title: string
  company: string
  period: string
  description: string
}

export interface EducationCopy {
  degree: string
  institution: string
  period: string
  description: string
}

export interface SkillCategoryCopy {
  title: string
  skills: { name: string; level: number }[]
}

export interface ValueItem {
  title: string
  description: string
}

export interface FeaturedProject {
  name: string
  role: string
  period: string
  summary: string
  highlights: string[]
  stack: string[]
}

export interface Dictionary {
  nav: {
    home: string
    about: string
    value: string
    skills: string
    projects: string
    contact: string
    admin: string
    login: string
    logout: string
  }
  common: {
    name: string
    title: string
    language: string
    darkMode: string
    lightMode: string
  }
  home: {
    contactCta: string
    learnMore: string
    shortBio: string
    downloadCv: string
  }
  impact: {
    heading: string
    items: { value: string; label: string }[]
  }
  about: {
    heading: string
    greeting: string
    studentNote: string
    mainSkills: string
    experience: string
    education: string
    bio: string
    experienceItems: ExperienceCopy[]
    educationItems: EducationCopy[]
  }
  value: {
    heading: string
    subtitle: string
    items: ValueItem[]
    aiTitle: string
    aiBody: string
    aiPoints: string[]
  }
  skills: {
    heading: string
    subtitle: string
    technologies: string
    categories: SkillCategoryCopy[]
    tags: string[]
  }
  projects: {
    heading: string
    subtitle: string
    featuredHeading: string
    featuredSubtitle: string
    moreHeading: string
    loading: string
    technologiesUsed: string
    viewCode: string
    liveDemo: string
    activeProject: string
    noPreview: string
    inDevelopment: string
    empty: string
    reload: string
    connectionError: string
    retry: string
    demoNotice: string
    demoDescription: string
    fetchError: string
    demoFallback: string
    featured: FeaturedProject[]
  }
  contact: {
    heading: string
    subtitle: string
    infoTitle: string
    email: string
    phone: string
    address: string
    addressValue: string
    connect: string
    formTitle: string
    name: string
    namePlaceholder: string
    nameRequired: string
    emailLabel: string
    emailPlaceholder: string
    emailRequired: string
    emailInvalid: string
    subject: string
    subjectPlaceholder: string
    subjectRequired: string
    message: string
    messagePlaceholder: string
    messageRequired: string
    send: string
    sending: string
    success: string
    error: string
    genericError: string
  }

}
