import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'

// Configure multer to use memory storage for Cloudinary
const storage = multer.memoryStorage()

// File filter
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov']

  if (file.mimetype.startsWith('image/')) {
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only JPEG, PNG, GIF and WebP images are allowed'))
    }
  } else if (file.mimetype.startsWith('video/')) {
    if (allowedVideoTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only MP4, WebM, OGG, AVI and MOV videos are allowed'))
    }
  } else {
    cb(new Error('Only images and videos are allowed'))
  }
}

// Configure multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit (Cloudinary free plan limit)
    files: 10, // Max 10 files per upload
  }
})

// Helper function to get file info
export const getFileInfo = (file: Express.Multer.File) => {
  return {
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    buffer: file.buffer
  }
}


