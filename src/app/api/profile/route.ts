import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Profile from '@/models/Profile'
import { uploadImageToCloudinary } from '@/lib/cloudinary'

// GET /api/profile - Get profile data
export async function GET() {
  try {
    await connectDB()

    // Get profile (should be only one)
    let profile = await Profile.findOne()
    
    // If no profile exists, create default one
    if (!profile) {
      profile = new Profile({
        name: 'Huỳnh Quốc Bảo',
        title: 'Frontend Developer',
        bio: 'Passionate frontend developer creating amazing web experiences.',
        email: 'admin@example.com',
        avatar: '/default-avatar.jpg',
        skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js'],
        experience: [
          {
            title: 'Frontend Developer',
            company: 'Freelance',
            period: '2023 - Present',
            description: 'Developing modern web applications using React and Next.js'
          }
        ],
        education: [
          {
            degree: 'Bachelor of Software Engineering',
            institution: 'University of Technology',
            period: '2020 - 2024',
            description: 'Specialized in web development and software engineering'
          }
        ]
      })
      await profile.save()
    }

    return NextResponse.json({
      success: true,
      data: profile
    })

  } catch (error: any) {
    console.error('❌ Error fetching profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// POST /api/profile - Update profile data
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

    const body = await request.json()
    console.log('📝 Updating profile:', body)

    await connectDB()

    // Get existing profile or create new one
    let profile = await Profile.findOne()
    if (!profile) {
      profile = new Profile()
    }

    // Update fields
    if (body.name !== undefined) profile.name = body.name
    if (body.title !== undefined) profile.title = body.title
    if (body.bio !== undefined) profile.bio = body.bio
    if (body.email !== undefined) profile.email = body.email
    if (body.phone !== undefined) profile.phone = body.phone
    if (body.location !== undefined) profile.location = body.location
    if (body.website !== undefined) profile.website = body.website
    if (body.github !== undefined) profile.github = body.github
    if (body.facebook !== undefined) profile.facebook = body.facebook
    if (body.linkedin !== undefined) profile.linkedin = body.linkedin
    if (body.skills !== undefined) profile.skills = body.skills
    if (body.experience !== undefined) profile.experience = body.experience
    if (body.education !== undefined) profile.education = body.education

    await profile.save()

    console.log('✅ Profile updated successfully')

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: profile
    })

  } catch (error: any) {
    console.error('❌ Error updating profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update profile', details: error.message },
      { status: 500 }
    )
  }
}
