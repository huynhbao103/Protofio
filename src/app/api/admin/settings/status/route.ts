import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import mongoose from 'mongoose'

// Helper function to check if email is configured
function checkEmailConfigured(): boolean {
  return !!(process.env.SMTP_USER && process.env.SMTP_PASS)
}

// GET /api/admin/settings/status - Get system status
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

    // Check database connection
    await connectDB()
    
    const emailConfigured = checkEmailConfigured()
    const mongoConnected = mongoose.connection.readyState === 1

    return NextResponse.json({
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
    })
  } catch (error: any) {
    console.error('❌ Error checking system status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check system status' },
      { status: 500 }
    )
  }
}
