import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { comparePassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // For demo, use simple admin credentials
    if (username === 'admin' && password === 'admin123') {
      const token = 'demo-jwt-token-' + Date.now()
      
      const response = NextResponse.json({
        success: true,
        data: {
          user: {
            id: 'admin-id',
            username: 'admin',
            role: 'admin',
          },
          token,
        },
        message: 'Login successful',
      })

      // Set demo cookie
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })

      return response
    }

    return NextResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    )

    // Uncomment below when MongoDB is ready
    // await connectDB()
    // const user = await User.findOne({ username })
    // if (!user) {
    //   return NextResponse.json(
    //     { success: false, error: 'Invalid credentials' },
    //     { status: 401 }
    //   )
    // }
    // const isValidPassword = await comparePassword(password, user.password)
    // if (!isValidPassword) {
    //   return NextResponse.json(
    //     { success: false, error: 'Invalid credentials' },
    //     { status: 401 }
    //   )
    // }
    // const token = generateToken({
    //   userId: user._id.toString(),
    //   username: user.username,
    //   role: user.role,
    // })
    // const response = NextResponse.json({
    //   success: true,
    //   data: {
    //     user: {
    //       id: user._id,
    //       username: user.username,
    //       role: user.role,
    //     },
    //     token,
    //   },
    //   message: 'Login successful',
    // })
    // response.cookies.set('auth-token', token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'strict',
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    // })
    // return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}


