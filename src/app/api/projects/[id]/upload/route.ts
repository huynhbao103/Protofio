import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import { upload } from '@/lib/upload'
import { uploadImageToCloudinary, uploadVideoToCloudinary } from '@/lib/cloudinary'
import Project from '@/models/Project'

// POST /api/projects/[id]/upload - Upload files for project (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authentication check
    const token = request.cookies.get('auth-token')?.value
    if (!token || !token.startsWith('demo-jwt-token-')) {
      return NextResponse.json(
        { success: false, error: 'Access denied. Please login first.' },
        { status: 401 }
      )
    }

    const { id } = params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project ID' },
        { status: 400 }
      )
    }

    // Connect to database
    await connectDB()

    // Check if project exists
    const project = await Project.findById(id)
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const isMain = formData.get('isMain') === 'true'

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      )
    }

           // Check file size limits - Increased to 100MB for better user experience
       const oversizedFiles = files.filter(file => file.size > 100 * 1024 * 1024) // 100MB limit
       
       if (oversizedFiles.length > 0) {
         const fileNames = oversizedFiles.map(f => `${f.name} (${(f.size / (1024 * 1024)).toFixed(2)}MB)`).join(', ')
         return NextResponse.json(
           { success: false, error: `Files too large: ${fileNames}. Maximum allowed size is 100MB per file. For videos larger than 100MB, please use the YouTube tab to add videos from YouTube instead.` },
           { status: 400 }
         )
       }
       
      // Log warning for medium files that will use streaming upload
      const mediumFiles = files.filter(file => file.size > 25 * 1024 * 1024 && file.size <= 100 * 1024 * 1024) // 25MB-100MB threshold for streaming upload
      
      if (mediumFiles.length > 0) {
        const fileNames = mediumFiles.map(f => `${f.name} (${(f.size / (1024 * 1024)).toFixed(2)}MB)`).join(', ')
        console.log(`📦 Medium files detected, will use streaming upload: ${fileNames}`)
      }

    console.log(`🚀 Uploading ${files.length} files to Cloudinary for project: ${id}`)

    const uploadedFiles = []
    const errors = []

    // Group files by type
    const images = files.filter(f => f.type.startsWith('image/'))
    const videos = files.filter(f => f.type.startsWith('video/'))
    
    console.log(`📊 File analysis: ${images.length} images, ${videos.length} videos`)

    // Process each file
    for (const file of files) {
      try {
        // Convert File to Buffer for multer processing
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        
        // Create a mock file object for multer processing
        const mockFile = {
          fieldname: 'files',
          originalname: file.name,
          encoding: '7bit',
          mimetype: file.type,
          buffer: buffer,
          size: buffer.length
        } as Express.Multer.File

        let uploadResult: any

        // Upload based on file type
        if (file.type.startsWith('image/')) {
          console.log(`🖼️ Starting image upload: ${file.name}`)
          uploadResult = await uploadImageToCloudinary(mockFile, `protofio-portfolio/projects/${id}`)
          console.log(`✅ Image uploaded: ${uploadResult.secure_url}`)
        } else if (file.type.startsWith('video/')) {
          console.log(`🎥 Starting video upload: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)}MB)`)
          
          // Add timeout for video uploads
          const uploadPromise = uploadVideoToCloudinary(mockFile, `protofio-portfolio/projects/${id}/videos`)
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Upload timeout after 5 minutes')), 5 * 60 * 1000)
          )
          
          uploadResult = await Promise.race([uploadPromise, timeoutPromise])
          console.log(`✅ Video uploaded: ${uploadResult.secure_url}`)
        } else {
          errors.push(`Invalid file type: ${file.name}`)
          continue
        }

        // Create file record
        
        const fileRecord: {
          _id: mongoose.Types.ObjectId
          filename: string
          originalName: string
          path: string
          publicId: string
          size: number
          mimeType: string
          isMain: boolean
          cloudinaryData: {
            public_id: string
            secure_url: string
            width: number
            height: number
            format: string
            duration?: number
          }
        } = {
          _id: new mongoose.Types.ObjectId(),
          filename: file.name,
          originalName: file.name,
          path: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          size: uploadResult.bytes,
          mimeType: file.type,
          isMain: isMain && uploadedFiles.length === 0, // First file is main if isMain is true
          cloudinaryData: {
            public_id: uploadResult.public_id,
            secure_url: uploadResult.secure_url,
            width: uploadResult.width,
            height: uploadResult.height,
            format: uploadResult.format,
            duration: uploadResult.duration
          }
        }

        uploadedFiles.push(fileRecord)

      } catch (error: any) {
        console.error(`❌ Error uploading ${file.name}:`, error.message)
        errors.push(`Failed to upload ${file.name}: ${error.message}`)
      }
    }

    if (uploadedFiles.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files were uploaded successfully', errors },
        { status: 500 }
      )
    }

    // Update project with new files
    const updateData: any = {}
    
    if (uploadedFiles.some(f => f.isMain)) {
      // Reset all existing media to not main
      project.images.forEach((img: any) => {
        img.isMain = false
      })
      project.videos.forEach((vid: any) => {
        vid.isMain = false
      })
      
      // Update main image
      const mainFile = uploadedFiles.find(f => f.isMain)
      if (mainFile) {
        updateData.mainImage = mainFile.path
      }
    }

    // Add new files to project
    if (!project.images) project.images = []
    if (!project.videos) project.videos = []
    
    const newImages = uploadedFiles.filter(f => f.mimeType.startsWith('image/'))
    const newVideos = uploadedFiles.filter(f => f.mimeType.startsWith('video/'))
    
    if (newImages.length > 0) {
      project.images.push(...newImages)
    }
    
    if (newVideos.length > 0) {
      project.videos.push(...newVideos)
    }

    await project.save()

    console.log(`✅ Successfully uploaded ${uploadedFiles.length} files to project ${id}`)

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${uploadedFiles.length} files`,
      data: {
        uploadedFiles,
        errors: errors.length > 0 ? errors : undefined
      }
    })

  } catch (error: any) {
    console.error('❌ Error in upload route:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload files', details: error.message },
      { status: 500 }
    )
  }
}


