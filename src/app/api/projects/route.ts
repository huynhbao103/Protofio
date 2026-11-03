import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Project from '@/models/Project'
import mongoose from 'mongoose'

// GET /api/projects - Public: ACTIVE only. Admin (?all=1 + auth): all statuses
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Fetching projects...')
    
    await connectDB()
    console.log('✅ Database connected')

    const wantAll = request.nextUrl.searchParams.get('all') === '1'
    const token = request.cookies.get('auth-token')?.value
    const isAdmin = Boolean(token && token.startsWith('demo-jwt-token-'))

    const filter = wantAll && isAdmin ? {} : { status: 'ACTIVE' }
    
    const projects = await Project.find(filter)
      .populate('createdBy', 'username')
      .sort({ priority: -1, createdAt: -1 })
      .lean()
    
    console.log(`📊 Found ${projects.length} projects`)
    
    return NextResponse.json({
      success: true,
      data: projects,
      count: projects.length
    })
  } catch (error: any) {
    console.error('❌ Error fetching projects:', error)
    
    // Return specific error messages
    if (error.message.includes('ECONNREFUSED')) {
      return NextResponse.json(
        { success: false, error: 'Database connection failed. Please check if MongoDB is running.' },
        { status: 503 }
      )
    }
    
    if (error.message.includes('ENOTFOUND')) {
      return NextResponse.json(
        { success: false, error: 'Database host not found. Please check MONGODB_URI configuration.' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects', details: error.message },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create new project (admin only)
export async function POST(request: NextRequest) {
  try {
    console.log('📝 Creating new project...')
    
    // Demo authentication check
    const token = request.cookies.get('auth-token')?.value
    if (!token || !token.startsWith('demo-jwt-token-')) {
      return NextResponse.json(
        { success: false, error: 'Access denied. Please login first.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log('📋 API received body:', body)
    
    const {
      name,
      description,
      nameEn,
      descriptionEn,
      technologies,
      githubUrl,
      liveUrl,
      priority = 0,
      status = 'ACTIVE',
      inactiveReason,
    } = body

    if (!name || !description || !technologies) {
      return NextResponse.json(
        { success: false, error: 'Name, description and technologies are required' },
        { status: 400 }
      )
    }

    const nextStatus = status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE'
    const reason =
      typeof inactiveReason === 'string' ? inactiveReason.trim() : ''
    if (nextStatus === 'INACTIVE' && reason.length < 3) {
      return NextResponse.json(
        { success: false, error: 'Inactive projects require a reason (min 3 characters)' },
        { status: 400 }
      )
    }

    // Convert technologies string to array if needed
    const techArray = Array.isArray(technologies) 
      ? technologies 
      : technologies.split(',').map((tech: string) => tech.trim()).filter(Boolean)
    
    console.log('🔧 Technologies processing:', { original: technologies, processed: techArray })

    // Clean and validate URLs
    const cleanGithubUrl = githubUrl ? githubUrl.trim() : ''
    const cleanLiveUrl = liveUrl ? liveUrl.trim() : ''

    // Log the data being processed
    console.log('📝 Creating project with data:', {
      name,
      description,
      technologies: techArray,
      githubUrl: cleanGithubUrl,
      liveUrl: cleanLiveUrl,
      priority,
      status
    })

    await connectDB()
    console.log('✅ Database connected for project creation')
    
    // Tạo admin user ID (demo)
    const adminUserId = new mongoose.Types.ObjectId()
    
    const project = new Project({
      name,
      description,
      nameEn: typeof nameEn === 'string' ? nameEn.trim() : undefined,
      descriptionEn: typeof descriptionEn === 'string' ? descriptionEn.trim() : undefined,
      technologies: techArray,
      githubUrl: cleanGithubUrl || undefined,
      liveUrl: cleanLiveUrl || undefined,
      priority: priority ? parseInt(priority) : 0,
      status: nextStatus,
      inactiveReason: nextStatus === 'INACTIVE' ? reason : undefined,
      createdBy: adminUserId,
      images: [],
      videos: [],
    })
    
    await project.save()
    console.log('💾 Project saved successfully')
    
    await project.populate('createdBy', 'username')
    
    return NextResponse.json({
      success: true,
      data: project,
      message: 'Project created successfully',
    })
  } catch (error: any) {
    console.error('❌ Error creating project:', error)
    
    // Handle validation errors specifically
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed', 
          details: validationErrors 
        },
        { status: 400 }
      )
    }
    
    // Handle database connection errors
    if (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database connection failed. Please check MongoDB configuration.' 
        },
        { status: 503 }
      )
    }
    
    // Handle other errors
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create project',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}


