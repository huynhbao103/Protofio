import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import mongoose from 'mongoose'

// Settings Schema
const SettingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'Huỳnh Quốc Bảo Portfolio' },
  siteDescription: { type: String, default: 'Frontend Developer Portfolio' },
  adminEmail: { type: String, default: 'admin@example.com' },
  emailNotificationsEnabled: { type: Boolean, default: false },
  mongodbEnabled: { type: Boolean, default: true },
  updatedAt: { type: Date, default: Date.now }
})

// Get or create Settings model
let Settings: mongoose.Model<any>
try {
  Settings = mongoose.model('Settings')
} catch {
  Settings = mongoose.model('Settings', SettingsSchema)
}

// GET /api/admin/settings - Get current settings
export async function GET(request: NextRequest) {
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

    // Get settings or create default
    let settings = await Settings.findOne()
    if (!settings) {
      settings = new Settings({
        siteName: 'Huỳnh Quốc Bảo Portfolio',
        siteDescription: 'Frontend Developer Portfolio',
        adminEmail: 'admin@example.com',
        emailNotificationsEnabled: checkEmailConfigured(),
        mongodbEnabled: true
      })
      await settings.save()
    }

    return NextResponse.json({
      success: true,
      data: settings
    })

  } catch (error: any) {
    console.error('❌ Error fetching settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// POST /api/admin/settings - Update settings
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
    console.log('📝 Updating settings:', body)

    await connectDB()

    // Get existing settings or create new
    let settings = await Settings.findOne()
    if (!settings) {
      settings = new Settings()
    }

    // Update fields
    if (body.siteName !== undefined) settings.siteName = body.siteName
    if (body.siteDescription !== undefined) settings.siteDescription = body.siteDescription
    if (body.adminEmail !== undefined) settings.adminEmail = body.adminEmail
    if (body.emailNotificationsEnabled !== undefined) {
      // Check if email is configured before enabling
      if (body.emailNotificationsEnabled && !checkEmailConfigured()) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Cannot enable email notifications: SMTP not configured. Please check EMAIL_SETUP_GUIDE.md' 
          },
          { status: 400 }
        )
      }
      settings.emailNotificationsEnabled = body.emailNotificationsEnabled
    }
    if (body.mongodbEnabled !== undefined) settings.mongodbEnabled = body.mongodbEnabled

    settings.updatedAt = new Date()
    await settings.save()

    console.log('✅ Settings updated successfully')

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    })

  } catch (error: any) {
    console.error('❌ Error updating settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update settings', details: error.message },
      { status: 500 }
    )
  }
}

// Helper function to check if email is configured
function checkEmailConfigured(): boolean {
  return !!(process.env.SMTP_USER && process.env.SMTP_PASS)
}

// Helper function to get system status
function getSystemStatus() {
  try {
    const emailConfigured = checkEmailConfigured()
    const mongoConnected = mongoose.connection.readyState === 1

    return {
      success: true,
      data: {
        emailService: {
          configured: emailConfigured,
          status: emailConfigured ? 'configured' : 'not_configured'
        },
        database: {
          connected: mongoConnected,
          status: mongoConnected ? 'connected' : 'disconnected'
        },
        apiRoutes: {
          status: 'operational'
        }
      }
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to check system status'
    }
  }
}
