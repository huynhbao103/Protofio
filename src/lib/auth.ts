import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET!

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable')
}

export interface TokenPayload {
  userId: string
  username: string
  role: string
}

// Generate JWT token
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

// Verify JWT token
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch (error) {
    return null
  }
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// Compare password
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Get token from request
export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  // Also check for token in cookies
  const token = request.cookies.get('auth-token')?.value
  return token || null
}

// Middleware to verify authentication
export function requireAuth(handler: Function) {
  return async (request: NextRequest, context?: any) => {
    const token = getTokenFromRequest(request)
    
    if (!token) {
      return Response.json(
        { success: false, error: 'Access denied. No token provided.' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return Response.json(
        { success: false, error: 'Invalid token.' },
        { status: 401 }
      )
    }

    // Add user info to request
    ;(request as any).user = decoded

    return handler(request, context)
  }
}

// Middleware to require admin role
export function requireAdmin(handler: Function) {
  return requireAuth(async (request: NextRequest, context?: any) => {
    const user = (request as any).user
    
    if (user.role !== 'admin') {
      return Response.json(
        { success: false, error: 'Access denied. Admin role required.' },
        { status: 403 }
      )
    }

    return handler(request, context)
  })
}


