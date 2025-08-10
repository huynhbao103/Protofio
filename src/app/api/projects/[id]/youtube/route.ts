import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import { processYouTubeUrl } from '@/lib/cloudinary'
import Project from '@/models/Project'

// POST /api/projects/[id]/youtube - Add YouTube video to project (admin only)
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
    const { youtubeUrl, isMain = false } = await request.json()

    if (!youtubeUrl) {
      return NextResponse.json(
        { success: false, error: 'YouTube URL is required' },
        { status: 400 }
      )
    }

    // Validate ObjectId
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

    console.log(`🎬 Adding YouTube video to project: ${id}`)

    // Process YouTube URL with Cloudinary
    const cloudinaryResult = await processYouTubeUrl(youtubeUrl)

    // Create video media object
    const videoMedia = {
      path: cloudinaryResult.secure_url,
      type: 'video' as const,
      filename: `youtube-${cloudinaryResult.youtube_id}`,
      originalName: cloudinaryResult.youtubeData.title || `YouTube Video (${cloudinaryResult.youtube_id})`,
      size: 0, // YouTube videos don't have file size
      mimeType: 'video/youtube',
      isMain: false, // Will be set to true if requested
      cloudinaryData: {
        public_id: cloudinaryResult.public_id,
        secure_url: cloudinaryResult.secure_url,
        format: cloudinaryResult.format,
        duration: cloudinaryResult.duration,
        bytes: 0
      },
      youtubeData: {
        youtube_id: cloudinaryResult.youtube_id,
        original_url: youtubeUrl,
        title: cloudinaryResult.youtubeData.title,
        description: '', // YouTube API doesn't provide description in basic info
        thumbnail: '', // YouTube API doesn't provide thumbnail in basic info
        channelTitle: '', // YouTube API doesn't provide channel title in basic info
        publishedAt: '', // YouTube API doesn't provide published date in basic info
        viewCount: 0, // YouTube API doesn't provide view count in basic info
        duration: 0 // YouTube API doesn't provide duration in basic info
      }
    }

    // Add to project videos
    project.videos.push(videoMedia)

    // Set as main if requested
    if (isMain) {
      // Reset all images and videos to not main
      project.images.forEach((img: any) => {
        img.isMain = false
      })
      project.videos.forEach((vid: any) => {
        vid.isMain = false
      })
      // Set this video as main
      videoMedia.isMain = true
    }

    await project.save()

    console.log(`✅ YouTube video added successfully to project: ${id}`)

    return NextResponse.json({
      success: true,
      message: 'YouTube video added successfully',
      data: {
        video: videoMedia,
        projectId: id
      }
    })

  } catch (error: any) {
    console.error('❌ Error adding YouTube video:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add YouTube video', details: error.message },
      { status: 500 }
    )
  }
}
