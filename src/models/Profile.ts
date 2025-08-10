import mongoose, { Document, Schema } from 'mongoose'

export interface IProfile extends Document {
  name: string
  title: string
  bio: string
  avatar: string // Cloudinary URL
  email: string
  phone?: string
  location?: string
  website?: string
  github?: string
  facebook?: string
  linkedin?: string
  skills: string[]
  experience: {
    title: string
    company: string
    period: string
    description: string
  }[]
  education: {
    degree: string
    institution: string
    period: string
    description?: string
  }[]
  createdAt: Date
  updatedAt: Date
}

const ProfileSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
      default: 'Huỳnh Quốc Bảo'
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
      default: 'Frontend Developer'
    },
    bio: {
      type: String,
      maxlength: [1000, 'Bio cannot be more than 1000 characters'],
      default: 'Passionate frontend developer creating amazing web experiences.'
    },
    avatar: {
      type: String,
      required: [true, 'Avatar is required'],
      default: '/default-avatar.jpg' // Fallback avatar
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
    },
    phone: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      trim: true,
      default: 'Vietnam'
    },
    website: {
      type: String,
      trim: true
    },
    github: {
      type: String,
      trim: true
    },
    facebook: {
      type: String,
      trim: true
    },
    linkedin: {
      type: String,
      trim: true
    },
    skills: {
      type: [String],
      default: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS']
    },
    experience: [{
      title: {
        type: String,
        required: true,
        trim: true
      },
      company: {
        type: String,
        required: true,
        trim: true
      },
      period: {
        type: String,
        required: true,
        trim: true
      },
      description: {
        type: String,
        trim: true
      }
    }],
    education: [{
      degree: {
        type: String,
        required: true,
        trim: true
      },
      institution: {
        type: String,
        required: true,
        trim: true
      },
      period: {
        type: String,
        required: true,
        trim: true
      },
      description: {
        type: String,
        trim: true
      }
    }]
  },
  {
    timestamps: true
  }
)

// Indexes
ProfileSchema.index({ email: 1 }, { unique: true })

export default mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema)
