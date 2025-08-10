import mongoose, { Document, Schema } from 'mongoose'

export interface IProjectImage {
  filename: string
  originalName: string
  path: string
  size: number
  mimeType: string
  isMain: boolean
  alt?: string
}

export interface IProjectVideo {
  filename: string
  originalName: string
  path: string
  size: number
  mimeType: string
  duration?: number
  thumbnail?: string
  isMain?: boolean
  isChunk?: boolean
  chunkIndex?: number
  totalChunks?: number
  cloudinaryData?: {
    public_id: string
    secure_url: string
    format: string
    duration?: number
    bytes?: number
  }
  youtubeData?: {
    youtube_id: string
    original_url: string
    title: string
  }
}

export interface IProject extends Document {
  name: string
  description: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  status: 'ACTIVE' | 'ARCHIVED' | 'DRAFT'
  priority: number
  images: IProjectImage[]
  videos: IProjectVideo[]
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const ProjectImageSchema: Schema = new Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  path: { type: String, required: true },
  size: { type: Number, required: true },
  mimeType: { type: String, required: true },
  isMain: { type: Boolean, default: false },
  alt: { type: String },
}, { _id: true })

const ProjectVideoSchema: Schema = new Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  path: { type: String, required: true },
  size: { type: Number, required: true },
  mimeType: { type: String, required: true },
  duration: { type: Number },
  thumbnail: { type: String },
  isMain: { type: Boolean, default: false },
  isChunk: { type: Boolean, default: false },
  chunkIndex: { type: Number },
  totalChunks: { type: Number },
  cloudinaryData: {
    public_id: { type: String },
    secure_url: { type: String },
    format: { type: String },
    duration: { type: Number },
    bytes: { type: Number }
  },
  youtubeData: {
    youtube_id: { type: String },
    original_url: { type: String },
    title: { type: String }
  }
}, { _id: true })

const ProjectSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a project name'],
      trim: true,
      maxlength: [100, 'Project name cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a project description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    technologies: {
      type: [String],
      required: [true, 'Please provide at least one technology'],
      validate: [arrayLimit, 'Technologies should have at least one item'],
    },
    githubUrl: {
      type: String,
      validate: {
        validator: function(v: string) {
          if (!v) return true // Allow empty
          // Clean the URL first
          const cleanUrl = v.trim()
          if (!cleanUrl) return true
          return /^https?:\/\/.+/.test(cleanUrl)
        },
        message: 'Please provide a valid URL starting with http:// or https://'
      }
    },
    liveUrl: {
      type: String,
      validate: {
        validator: function(v: string) {
          if (!v) return true // Allow empty
          // Clean the URL first
          const cleanUrl = v.trim()
          if (!cleanUrl) return true
          return /^https?:\/\/.+/.test(cleanUrl)
        },
        message: 'Please provide a valid URL starting with http:// or https://'
      }
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'ARCHIVED', 'DRAFT'],
      default: 'ACTIVE',
    },
    priority: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    images: [ProjectImageSchema],
    videos: [ProjectVideoSchema],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

function arrayLimit(val: string[]) {
  return val.length >= 1
}

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema)


