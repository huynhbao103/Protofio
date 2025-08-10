export interface ProjectImage {
  _id: string
  filename: string
  originalName: string
  path: string
  publicId: string
  size: number
  mimeType: string
  isMain: boolean
  alt?: string
  cloudinaryData?: {
    public_id: string
    secure_url: string
    width: number
    height: number
    format: string
  }
}

export interface ProjectVideo {
  _id: string
  filename: string
  originalName: string
  path: string
  publicId: string
  size: number
  mimeType: string
  duration?: number
  thumbnail?: string
  isChunk?: boolean
  chunkIndex?: number
  totalChunks?: number
  isMain?: boolean
  cloudinaryData?: {
    public_id: string
    secure_url: string
    format: string
    duration?: number
  }
  youtubeData?: {
    youtube_id: string
    original_url: string
    title: string
  }
}

export interface Project {
  _id: string
  name: string
  description: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  status: 'ACTIVE' | 'ARCHIVED' | 'DRAFT'
  priority: number
  mainImage?: string
  images: ProjectImage[]
  videos: ProjectVideo[]
  createdBy: {
    _id: string
    username: string
  }
  createdAt: string
  updatedAt: string
}

export interface ProjectFormData {
  name: string
  description: string
  technologies: string
  githubUrl?: string
  liveUrl?: string
  priority?: number
}


