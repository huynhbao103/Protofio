import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { hashPassword } from '@/lib/auth'

// This endpoint creates the initial admin user
export async function POST() {
  try {
    await connectDB()

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' })
    if (existingAdmin) {
      return NextResponse.json(
        { success: false, error: 'Admin user already exists' },
        { status: 400 }
      )
    }

    const adminUsername = process.env.ADMIN_USERNAME || 'admin'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

    // Hash password
    const hashedPassword = await hashPassword(adminPassword)

    // Create admin user
    const adminUser = new User({
      username: adminUsername,
      password: hashedPassword,
      role: 'admin',
    })

    await adminUser.save()

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      data: {
        username: adminUsername,
        // Don't return password in response
      },
    })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create admin user' },
      { status: 500 }
    )
  }
}


