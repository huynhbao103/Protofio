import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Profile from '@/models/Profile'
import { uploadImageToCloudinary } from '@/lib/cloudinary'

// POST /api/profile/avatar - Upload avatar image
export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const token = request.cookies.get('auth-token')?.value
    if (!token || !token.startsWith('demo-jwt-token-')) {
      return NextResponse.json(
        { success: false, error: 'Access denied. Please login first.' },
        { status: 401 }
      )
    }

    await connectDB()

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('avatar') as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No avatar file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Avatar must be an image file' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Avatar file too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    console.log(`📸 Uploading avatar: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)}MB)`)

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Create mock file object for cloudinary
    const mockFile = {
      fieldname: 'avatar',
      originalname: file.name,
      encoding: '7bit',
      mimetype: file.type,
      buffer: buffer,
      size: buffer.length
    } as Express.Multer.File

    // Upload to Cloudinary
    const uploadResult = await uploadImageToCloudinary(mockFile, 'protofio-portfolio/profile')
    
    console.log(`✅ Avatar uploaded: ${uploadResult.secure_url}`)

    // Update profile with new avatar URL
    let profile = await Profile.findOne()
    if (!profile) {
      profile = new Profile()
    }

    profile.avatar = uploadResult.secure_url
    await profile.save()

    return NextResponse.json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        avatar: uploadResult.secure_url,
        cloudinaryData: {
          public_id: uploadResult.public_id,
          secure_url: uploadResult.secure_url,
          width: uploadResult.width,
          height: uploadResult.height,
          format: uploadResult.format
        }
      }
    })

  } catch (error: any) {
    console.error('❌ Error uploading avatar:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload avatar', details: error.message },
      { status: 500 }
    )
  }
}
