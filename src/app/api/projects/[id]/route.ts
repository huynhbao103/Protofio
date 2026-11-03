import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Project from '@/models/Project'
import { requireAdmin } from '@/lib/auth'
import mongoose from 'mongoose'

// GET /api/projects/[id] - Get project by ID (public)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Connect to database
    await connectDB()

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project ID' },
        { status: 400 }
      )
    }

    // Find project by ID
    const project = await Project.findById(id)
      .populate('createdBy', 'username')
      .lean()

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    const token = request.cookies.get('auth-token')?.value
    const isAdmin = Boolean(token && token.startsWith('demo-jwt-token-'))
    if ((project as any).status !== 'ACTIVE' && !isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    console.log(`✅ Found project: ${(project as any).name}`)

    return NextResponse.json({
      success: true,
      data: project,
    })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

// PUT /api/projects/[id] - Update project (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Demo authentication check
    const token = request.cookies.get('auth-token')?.value
    if (!token || !token.startsWith('demo-jwt-token-')) {
      return NextResponse.json(
        { success: false, error: 'Access denied. Please login first.' },
        { status: 401 }
      )
    }

    const { id } = params
    const body = await request.json()
    const {
      name,
      description,
      nameEn,
      descriptionEn,
      technologies,
      githubUrl,
      liveUrl,
      priority,
      status,
      inactiveReason,
    } = body

    console.log('✏️ Updating project:', id, body)

    // Connect to database
    await connectDB()

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project ID' },
        { status: 400 }
      )
    }

    // Convert technologies string to array if needed
    const techArray = technologies ? (
      Array.isArray(technologies) 
        ? technologies 
        : technologies.split(',').map((tech: string) => tech.trim()).filter(Boolean)
    ) : undefined

    // Prepare update data
    const updateData: any = {}
    if (name) updateData.name = name
    if (description) updateData.description = description
    if (nameEn !== undefined) updateData.nameEn = nameEn
    if (descriptionEn !== undefined) updateData.descriptionEn = descriptionEn
    if (techArray) updateData.technologies = techArray
    if (githubUrl !== undefined) updateData.githubUrl = githubUrl
    if (liveUrl !== undefined) updateData.liveUrl = liveUrl
    if (priority !== undefined) updateData.priority = parseInt(priority)

    if (status !== undefined) {
      const nextStatus = status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE'
      const reason =
        typeof inactiveReason === 'string' ? inactiveReason.trim() : ''
      if (nextStatus === 'INACTIVE' && reason.length < 3) {
        return NextResponse.json(
          { success: false, error: 'Inactive projects require a reason (min 3 characters)' },
          { status: 400 }
        )
      }
      updateData.status = nextStatus
      updateData.inactiveReason =
        nextStatus === 'INACTIVE' ? reason : ''
    }

    updateData.updatedAt = new Date()

    // Find and update project ($set so new bilingual fields are persisted)
    const project = await Project.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('createdBy', 'username')

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    console.log(`✅ Project "${project.name}" updated successfully`)

    return NextResponse.json({
      success: true,
      data: project,
      message: 'Project updated successfully',
    })

    // Real MongoDB implementation (commented for demo)
    // await connectDB()
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return NextResponse.json(
    //     { success: false, error: 'Invalid project ID' },
    //     { status: 400 }
    //   )
    // }
    // const updateData: any = {}
    // if (name) updateData.name = name
    // if (description) updateData.description = description
    // if (technologies) {
    //   updateData.technologies = Array.isArray(technologies) 
    //     ? technologies 
    //     : technologies.split(',').map((tech: string) => tech.trim()).filter(Boolean)
    // }
    // if (githubUrl !== undefined) updateData.githubUrl = githubUrl
    // if (liveUrl !== undefined) updateData.liveUrl = liveUrl
    // if (priority !== undefined) updateData.priority = parseInt(priority)
    // if (status) updateData.status = status
    // const project = await Project.findByIdAndUpdate(
    //   id,
    //   updateData,
    //   { new: true, runValidators: true }
    // ).populate('createdBy', 'username')
    // if (!project) {
    //   return NextResponse.json(
    //     { success: false, error: 'Project not found' },
    //     { status: 404 }
    //   )
    // }
    // return NextResponse.json({
    //   success: true,
    //   data: project,
    //   message: 'Project updated successfully',
    // })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id] - Delete project (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Demo authentication check
    const token = request.cookies.get('auth-token')?.value
    if (!token || !token.startsWith('demo-jwt-token-')) {
      return NextResponse.json(
        { success: false, error: 'Access denied. Please login first.' },
        { status: 401 }
      )
    }

    const { id } = params

    console.log('🗑️ Deleting project:', id)

    // Connect to database
    await connectDB()

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project ID' },
        { status: 400 }
      )
    }

    // Find and delete project
    const project = await Project.findByIdAndDelete(id)
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    // Cleanup: Delete associated files from Cloudinary
    // This can be implemented with a cleanup service or scheduled job
    // For now, files remain in Cloudinary but project reference is removed
    console.log(`✅ Project "${project.name}" deleted successfully`)

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully',
      data: { deletedProject: project.name }
    })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}


