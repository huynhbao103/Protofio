import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import Project from '@/models/Project'

// DELETE /api/projects/[id]/media/[mediaId] - Delete media from project (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; mediaId: string } }
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

    const { id, mediaId } = params

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(mediaId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project ID or media ID' },
        { status: 400 }
      )
    }

    // Connect to database
    await connectDB()

    // Find project
    const project = await Project.findById(id)
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    console.log(`🗑️ Deleting media ${mediaId} from project: ${id}`)

    // Find and remove media from images array
    const imageIndex = project.images.findIndex((img: any) => img._id.toString() === mediaId)
    if (imageIndex !== -1) {
      const deletedImage = project.images[imageIndex]
      
      // If this was the main image, reset mainImage and isMain
      if (deletedImage.isMain) {
        project.mainImage = undefined
      }
      
      project.images.splice(imageIndex, 1)
      console.log(`✅ Image deleted: ${deletedImage.filename}`)
    }

    // Find and remove media from videos array
    const videoIndex = project.videos.findIndex((vid: any) => vid._id.toString() === mediaId)
    if (videoIndex !== -1) {
      const deletedVideo = project.videos[videoIndex]
      
      // If this was the main video, reset mainImage and isMain
      if (deletedVideo.isMain || project.mainImage === deletedVideo.path) {
        project.mainImage = undefined
      }
      
      project.videos.splice(videoIndex, 1)
      console.log(`✅ Video deleted: ${deletedVideo.filename}`)
    }

    // If no media was found
    if (imageIndex === -1 && videoIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Media not found' },
        { status: 404 }
      )
    }

    await project.save()

    console.log(`✅ Media deleted successfully from project: ${id}`)

    return NextResponse.json({
      success: true,
      message: 'Media deleted successfully',
      deletedMediaId: mediaId,
      projectId: id
    })

  } catch (error: any) {
    console.error('❌ Error deleting media:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete media', details: error.message },
      { status: 500 }
    )
  }
}

// PATCH /api/projects/[id]/media/[mediaId] - Update media (set as main, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; mediaId: string } }
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

    const { id, mediaId } = params
    const { action } = await request.json()

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(mediaId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project ID or media ID' },
        { status: 400 }
      )
    }

    // Connect to database
    await connectDB()

    // Find project
    const project = await Project.findById(id)
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    if (action === 'setMain') {
      console.log(`⭐ Setting media ${mediaId} as main for project: ${id}`)

      // Find media in images array
      const imageIndex = project.images.findIndex((img: any) => img._id.toString() === mediaId)
      if (imageIndex !== -1) {
        // Reset all images and videos to not main
        project.images.forEach((img: any) => {
          img.isMain = false
        })
        project.videos.forEach((vid: any) => {
          vid.isMain = false
        })
        
        // Set this image as main
        project.images[imageIndex].isMain = true
        project.mainImage = project.images[imageIndex].path
        
        await project.save()
        
        console.log(`✅ Main image set successfully for project: ${id}`)
        
        return NextResponse.json({
          success: true,
          message: 'Main image set successfully',
          mainImage: project.images[imageIndex],
          projectId: id
        })
      }

      // Find media in videos array
      const videoIndex = project.videos.findIndex((vid: any) => vid._id.toString() === mediaId)
      if (videoIndex !== -1) {
        // Reset all images and videos to not main
        project.images.forEach((img: any) => {
          img.isMain = false
        })
        project.videos.forEach((vid: any) => {
          vid.isMain = false
        })
        
        // Set this video as main
        project.videos[videoIndex].isMain = true
        project.mainImage = project.videos[videoIndex].path
        
        await project.save()
        
        console.log(`✅ Main video set successfully for project: ${id}`)
        
        return NextResponse.json({
          success: true,
          message: 'Main video set successfully',
          mainVideo: project.videos[videoIndex],
          projectId: id
        })
      }

      return NextResponse.json(
        { success: false, error: 'Media not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error: any) {
    console.error('❌ Error updating media:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update media', details: error.message },
      { status: 500 }
    )
  }
}
