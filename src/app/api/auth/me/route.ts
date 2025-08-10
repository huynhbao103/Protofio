import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      )
    }

    // For demo, check for our simple token
    if (token.startsWith('demo-jwt-token-')) {
      return NextResponse.json({
        success: true,
        data: {
          id: 'admin-id',
          username: 'admin',
          role: 'admin',
        },
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid token' },
      { status: 401 }
    )

    // Uncomment below when MongoDB is ready
    // await connectDB()
    // const decoded = verifyToken(token)
    // if (!decoded) {
    //   return NextResponse.json(
    //     { success: false, error: 'Invalid token' },
    //     { status: 401 }
    //   )
    // }
    // const user = await User.findById(decoded.userId).select('-password')
    // if (!user) {
    //   return NextResponse.json(
    //     { success: false, error: 'User not found' },
    //     { status: 404 }
    //   )
    // }
    // return NextResponse.json({
    //   success: true,
    //   data: {
    //     id: user._id,
    //     username: user.username,
    //     role: user.role,
    //   },
    // })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}


