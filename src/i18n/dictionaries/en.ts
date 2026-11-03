import type { Dictionary } from '../types'

const en: Dictionary = {
  nav: {
    home: 'Home',
    about: 'About',
    value: 'Why hire',
    skills: 'Skills',
    projects: 'Projects',
    contact: 'Contact',
    admin: 'Admin',
    login: 'Login',
    logout: 'Logout',
  },
  common: {
    name: 'Huynh Quoc Bao',
    title: 'Frontend Developer',
    language: 'Language',
    darkMode: 'Dark mode',
    lightMode: 'Light mode',
  },
  home: {
    contactCta: 'Contact me',
    learnMore: 'Learn more',
    shortBio:
      'Frontend Developer with 1 year of practical experience building and maintaining web apps for internal enterprise systems and customer-facing products. Proficient in React.js, Next.js, and TypeScript; experienced in API integration and frontend troubleshooting.',
    downloadCv: 'Download CV',
  },
  impact: {
    heading: 'Proof at a glance',
    items: [
      { value: '1+', label: 'Years of hands-on experience' },
      { value: 'KR', label: 'Remote with Korean company and clients' },
      { value: 'AI', label: 'AI-powered productivity workflow' },
    ],
  },
  about: {
    heading: 'About Me',
    greeting: 'Hi! I am',
    studentNote:
      'Graduated in Software Engineering from HUFLIT (2022–2026). Currently focused on building modern web applications and real-world products.',
    mainSkills: 'Core skills:',
    experience: 'Experience',
    education: 'Education',
    bio: 'Frontend Developer with 1 year of practical experience building and maintaining web applications for internal enterprise systems and customer-facing products. Proficient in React.js, Next.js, and TypeScript, with experience integrating APIs and resolving frontend technical issues.',
    experienceItems: [
      {
        title: 'Frontend Developer',
        company: 'KKAL Entertainment Company Limited',
        period: '09/2025 – Present',
        description:
          'Worked remotely with a South Korean software team on internal business systems and customer-facing apps for Korean clients. Built and maintained UI components, interactive features, and API integrations with React, Next.js, JavaScript, and TypeScript; improved performance and reliability through optimization and troubleshooting.',
      },
    ],
    educationItems: [
      {
        degree: 'Bachelor of Information Technology / Software Engineering',
        institution: 'Ho Chi Minh University of Foreign Languages and Information Technology (HUFLIT)',
        period: '2022 – 2026',
        description: 'Graduated in Software Engineering with hands-on experience across multiple real-world software projects.',
      },
    ],
  },
  value: {
    heading: 'Why hire me',
    subtitle:
      'Not just clean UI — I bring shipping speed, product thinking, and a modern workflow your team can trust.',
    items: [
      {
        title: 'Ship real products',
        description: 'Experience on internal systems and customer-facing apps — not only personal demos.',
      },
      {
        title: 'Remote-ready',
        description: 'Cross-border collaboration with a Korean team: clear communication and on-time delivery.',
      },
      {
        title: 'Strong frontend + API fluent',
        description: 'React/Next/TypeScript focused; comfortable integrating REST APIs and handling UI-layer issues.',
      },
      {
        title: 'Optimize & troubleshoot',
        description: 'I measure performance, fix bugs fast, and keep the experience stable for users.',
      },
    ],
    aiTitle: 'AI-assisted coding — higher throughput',
    aiBody:
      'I use AI tools (Cursor, Copilot…) as a technical co-pilot: faster boilerplate, code review help, tests, and root-cause hunting — while I keep ownership of quality and architecture decisions.',
    aiPoints: [
      'Faster UI/component scaffolding and API wiring',
      'Quicker debugging, refactors, and test drafts',
      'Human-in-the-loop: AI suggests, I decide',
      'More time for UX, edge cases, and product value',
    ],
  },
  skills: {
    heading: 'Skills & Technologies',
    subtitle: 'Technologies and skills I use at work and in real projects',
    technologies: 'Technologies',
    categories: [
      {
        title: 'Frontend',
        skills: [
          { name: 'React.js', level: 85 },
          { name: 'Next.js', level: 85 },
          { name: 'TypeScript', level: 80 },
          { name: 'JavaScript', level: 80 },
          { name: 'HTML/CSS', level: 90 },
          { name: 'Tailwind CSS', level: 85 },
          { name: 'Ant Design', level: 80 },
        ],
      },
      {
        title: 'Backend & Database',
        skills: [
          { name: 'Node.js', level: 70 },
          { name: 'Express.js', level: 65 },
          { name: 'RESTful APIs', level: 80 },
          { name: 'MongoDB', level: 75 },
          { name: 'PostgreSQL / SQL Server', level: 60 },
          { name: 'Supabase', level: 65 },
        ],
      },
      {
        title: 'Tools & Others',
        skills: [
          { name: 'Git / GitHub', level: 85 },
          { name: 'VS Code / Cursor', level: 90 },
          { name: 'Responsive Design', level: 85 },
        ],
      },
    ],
    tags: [
      'React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Express.js',
      'MongoDB', 'PostgreSQL', 'Supabase', 'Ant Design', 'Tailwind CSS', 'GitHub',
    ],
  },
  projects: {
    heading: 'Projects',
    subtitle: 'Selected projects from my CV and shipped portfolio work',
    featuredHeading: 'Featured projects from CV',
    featuredSubtitle: 'Two key projects that show real shipping and production workflow experience',
    moreHeading: 'More portfolio projects',
    loading: 'Loading projects...',
    technologiesUsed: 'Technologies Used:',
    viewCode: 'View Code',
    liveDemo: 'Live Demo',
    activeProject: 'Active Project',
    noPreview: 'No Preview',
    inDevelopment: 'Project in development',
    empty: 'No projects found',
    reload: 'Reload',
    connectionError: 'Connection error',
    retry: 'Retry',
    demoNotice: 'Using demo data',
    demoDescription: 'Currently showing demo data. Please check the database connection for live data.',
    fetchError: 'Unable to load projects',
    demoFallback: 'Showing demo data. Please check the database connection.',
    featured: [
      {
        name: 'AI Food Recommendation System',
        role: 'Graduation Project | Full-stack Developer',
        period: '05/2025 – 08/2025',
        summary:
          'AI-powered food recommendation system using GPT and LangGraph, with dedicated UIs per feature and contribution to recommendation architecture.',
        highlights: [
          'Built an AI recommendation system with GPT and LangGraph',
          'Designed and implemented interfaces for different application features',
          'Contributed to architecture and integration of AI-driven recommendations',
        ],
        stack: ['React', 'Next.js', 'TypeScript', 'GPT', 'LangGraph', 'Node.js'],
      },
      {
        name: 'Document Management System — Nam Sai Gon',
        role: 'Frontend Developer',
        period: '12/2024 – 12/2025',
        summary:
          'Document management platform supporting cross-department workflows: approval, routing, deadlines, and API-backed operations.',
        highlights: [
          'Developed frontend for multi-department document workflows',
          'Implemented approval, routing, and deadline-management interfaces',
          'Integrated frontend with APIs for document operations and workflows',
        ],
        stack: ['React', 'TypeScript', 'REST API', 'Ant Design'],
      },
    ],
  },
  contact: {
    heading: 'Get In Touch',
    subtitle: 'Open to Frontend roles. Send an interview invite anytime.',
    infoTitle: 'Contact information',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    addressValue: 'Tan Phu Ward, Ho Chi Minh City',
    connect: 'Connect with me',
    formTitle: 'Send a message',
    name: 'Full name',
    namePlaceholder: 'Enter your full name',
    nameRequired: 'Please enter your name!',
    emailLabel: 'Email',
    emailPlaceholder: 'Enter your email address',
    emailRequired: 'Please enter your email!',
    emailInvalid: 'Invalid email!',
    subject: 'Subject',
    subjectPlaceholder: 'Message subject',
    subjectRequired: 'Please enter a subject!',
    message: 'Message',
    messagePlaceholder: 'Write your message...',
    messageRequired: 'Please enter a message!',
    send: 'Send message',
    sending: 'Sending...',
    success: 'Thank you! Your message has been sent successfully. I will get back to you soon.',
    error: 'Something went wrong while sending the message.',
    genericError: 'Something went wrong. Please try again later.',
  },
}

export default en
