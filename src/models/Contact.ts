import mongoose, { Document, Schema } from 'mongoose'

export interface IContact extends Document {
  name: string
  email: string
  subject: string
  message: string
  status: 'NEW' | 'READ' | 'REPLIED'
  createdAt: Date
  updatedAt: Date
}

const ContactSchema = new Schema<IContact>({
  name: {
    type: String,
    required: [true, 'Tên là bắt buộc'],
    trim: true,
    maxlength: [100, 'Tên không được quá 100 ký tự']
  },
  email: {
    type: String,
    required: [true, 'Email là bắt buộc'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email không hợp lệ']
  },
  subject: {
    type: String,
    required: [true, 'Chủ đề là bắt buộc'],
    trim: true,
    maxlength: [200, 'Chủ đề không được quá 200 ký tự']
  },
  message: {
    type: String,
    required: [true, 'Tin nhắn là bắt buộc'],
    trim: true,
    maxlength: [2000, 'Tin nhắn không được quá 2000 ký tự']
  },
  status: {
    type: String,
    enum: ['NEW', 'READ', 'REPLIED'],
    default: 'NEW'
  }
}, {
  timestamps: true
})

// Indexes
ContactSchema.index({ createdAt: -1 })
ContactSchema.index({ status: 1 })
ContactSchema.index({ email: 1 })

export default mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema)
