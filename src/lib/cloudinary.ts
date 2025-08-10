import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary

// Helper function to upload image to Cloudinary
export const uploadImageToCloudinary = async (
  file: Express.Multer.File,
  folder: string = 'protofio-portfolio'
): Promise<{
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  bytes: number
}> => {
  try {
    // Convert buffer to base64
    const b64 = Buffer.from(file.buffer).toString('base64')
    const dataURI = `data:${file.mimetype};base64,${b64}`

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder,
      resource_type: 'auto',
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    })

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('Failed to upload image to Cloudinary')
  }
}

// Helper function to upload video to Cloudinary
export const uploadVideoToCloudinary = async (
  file: Express.Multer.File,
  folder: string = 'protofio-portfolio/videos'
): Promise<{
  public_id: string
  secure_url: string
  duration: number
  format: string
  bytes: number
}> => {
  try {
    // Check file size - Reduced limit to 50MB for better compatibility
    if (file.size > 50 * 1024 * 1024) { // 50MB limit - Better for smaller videos
      throw new Error(`File too large: ${(file.size / (1024 * 1024)).toFixed(2)}MB. Maximum allowed size is 50MB for better compatibility.`)
    }

    console.log(`🎥 Starting video upload: ${file.originalname} (${(file.size / (1024 * 1024)).toFixed(2)}MB)`)

    // For medium files, use streaming upload with small chunks
    if (file.size > 25 * 1024 * 1024) {
      console.log(`📦 Using streaming upload for medium file: ${(file.size / (1024 * 1024)).toFixed(2)}MB`)
      
      // Use streaming upload for medium files
      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'video',
            // Small chunks for better success rate
            chunk_size: 2000000, // 2MB chunks
            // Use async processing
            eager_async: true,
            eager_notification_url: undefined,
            // Add longer timeout for medium files
            timeout: 600000, // 10 minutes timeout
            // Disable eager transformations
            transformation: undefined,
          },
          (error, result) => {
            if (error) {
              reject(error)
            } else {
              resolve(result)
            }
          }
        )

        // Write buffer to stream
        uploadStream.end(file.buffer)
      })

      console.log(`✅ Video uploaded successfully with streaming upload: ${result.secure_url}`)
      
      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        duration: result.duration || 0,
        format: result.format,
        bytes: result.bytes
      }
    } else {
      // For smaller files, use regular upload
      console.log(`📤 Using regular upload for file: ${(file.size / (1024 * 1024)).toFixed(2)}MB`)
      
      // Convert buffer to base64 for smaller files
      const b64 = Buffer.from(file.buffer).toString('base64')
      const dataURI = `data:${file.mimetype};base64,${b64}`

      const result = await cloudinary.uploader.upload(dataURI, {
        folder,
        resource_type: 'video',
        eager_async: true,
        eager_notification_url: undefined,
        chunk_size: 5000000, // 5MB chunks
        timeout: 120000, // 2 minutes timeout
        transformation: undefined
      })

      console.log(`✅ Video uploaded successfully: ${result.secure_url}`)

      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        duration: result.duration || 0,
        format: result.format,
        bytes: result.bytes
      }
    }
  } catch (error: any) {
    console.error('❌ Cloudinary video upload error:', error)
    
    // Provide more specific error messages
    if (error.message.includes('File too large')) {
      throw new Error(error.message)
    } else if (error.message.includes('timeout')) {
      throw new Error('Video upload timed out. Please try again or use a smaller file.')
    } else if (error.message.includes('quota')) {
      throw new Error('Cloudinary quota exceeded. Please try again later.')
    } else if (error.http_code === 413) {
      throw new Error(`File too large for Cloudinary upload. Maximum size is 50MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`)
    } else if (error.http_code === 400) {
      if (error.message.includes('too large to process synchronously')) {
        throw new Error('Video too large for synchronous processing. Using async processing instead.')
      } else if (error.message.includes('Unsupported video format')) {
        throw new Error('Video format not supported or file corrupted. Please check the video file.')
      } else {
        throw new Error(`Cloudinary processing error: ${error.message}`)
      }
    } else {
      throw new Error(`Failed to upload video to Cloudinary: ${error.message}`)
    }
  }
}

// New function to handle YouTube URLs
export const processYouTubeUrl = async (
  youtubeUrl: string,
  folder: string = 'protofio-portfolio/videos'
): Promise<{
  public_id: string
  secure_url: string
  duration: number
  format: string
  bytes: number
  youtube_id: string
  youtubeData: {
    youtube_id: string
    original_url: string
    title: string
  }
}> => {
  try {
    // Extract YouTube video ID from URL
    const youtubeId = extractYouTubeId(youtubeUrl)
    if (!youtubeId) {
      throw new Error('Invalid YouTube URL. Please provide a valid YouTube video link.')
    }

    console.log(`🎬 Processing YouTube video: ${youtubeId}`)

    // Get basic YouTube video information
    const videoData = await getBasicYouTubeVideoInfo(youtubeId)
    
    // Create a unique public_id for this YouTube video
    const publicId = `${folder}/youtube-${youtubeId}`
    
    // Create direct video URL
    const directUrl = `https://www.youtube.com/watch?v=${youtubeId}`
    
    const result = {
      public_id: publicId,
      secure_url: directUrl,
      duration: 0, // Simplified - no duration needed
      format: 'youtube',
      bytes: 0, // YouTube videos don't have file size
      youtube_id: youtubeId,
      youtubeData: {
        youtube_id: youtubeId,
        original_url: directUrl,
        title: videoData.title
      }
    }

    console.log(`✅ YouTube video processed successfully: ${result.secure_url}`)

    return result
  } catch (error: any) {
    console.error('❌ YouTube video processing error:', error)
    throw new Error(`Failed to process YouTube video: ${error.message}`)
  }
}

// Function to get basic YouTube video information
async function getBasicYouTubeVideoInfo(videoId: string) {
  // Just return basic info with fallback title
  return {
    title: `YouTube Video (${videoId})`
  }
}

// Helper function to extract YouTube video ID
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
    }
  }

  return null
}

// Helper function to delete file from Cloudinary
export const deleteFromCloudinary = async (public_id: string, resource_type: 'image' | 'video' = 'image'): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(public_id, { resource_type })
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    throw new Error('Failed to delete file from Cloudinary')
  }
}

// Helper function to get optimized image URL
export const getOptimizedImageUrl = (
  public_id: string,
  options: {
    width?: number
    height?: number
    quality?: string
    format?: string
    crop?: string
  } = {}
): string => {
  const { width, height, quality = 'auto:good', format = 'auto', crop = 'fill' } = options
  
  let transformation = ''
  if (width || height) {
    transformation += `w_${width || 'auto'},h_${height || 'auto'},c_${crop}/`
  }
  transformation += `q_${quality},f_${format}/`
  
  return cloudinary.url(public_id, {
    transformation: transformation ? [transformation] : undefined
  })
}
