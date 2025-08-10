import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Contact from '@/models/Contact'
import { z } from 'zod'
import mongoose from 'mongoose'
import { sendContactNotification, sendContactConfirmation } from '@/lib/email'

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự').max(100, 'Tên không được quá 100 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  subject: z.string().min(5, 'Chủ đề phải có ít nhất 5 ký tự').max(200, 'Chủ đề không được quá 200 ký tự'),
  message: z.string().min(10, 'Tin nhắn phải có ít nhất 10 ký tự').max(2000, 'Tin nhắn không được quá 2000 ký tự')
})

// POST - Tạo tin nhắn mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('📝 Received contact form data:', body)
    
    // Validate dữ liệu
    const validatedData = contactSchema.parse(body)
    console.log('✅ Validation passed:', validatedData)
    
    // Kết nối database
    await connectDB()
    
    // Tạo tin nhắn mới
    const contact = new Contact(validatedData)
    await contact.save()
    
    // Always try to send emails if SMTP is configured
    let emailResults = {
      notification: false,
      confirmation: false,
      notificationError: null as string | null,
      confirmationError: null as string | null
    }

    try {
      // Check if SMTP is configured
      const smtpConfigured = !!(process.env.SMTP_USER && process.env.SMTP_PASS)
      
      console.log('📧 SMTP configured:', smtpConfigured)

      if (smtpConfigured) {
        console.log('📧 SMTP ready - attempting to send emails...')
        
        // Gửi email thông báo cho admin và xác nhận cho người gửi
        // Chạy song song để không làm chậm response
        const [notificationSent, confirmationSent] = await Promise.allSettled([
          sendContactNotification(validatedData),
          sendContactConfirmation(validatedData)
        ])
        
        emailResults = {
          notification: notificationSent.status === 'fulfilled' ? notificationSent.value : false,
          confirmation: confirmationSent.status === 'fulfilled' ? confirmationSent.value : false,
          notificationError: notificationSent.status === 'rejected' ? notificationSent.reason?.message : null,
          confirmationError: confirmationSent.status === 'rejected' ? confirmationSent.reason?.message : null
        }
        
        console.log('📧 Email send results:', emailResults)
      } else {
        console.log('📧 SMTP not configured - skipping email send')
        emailResults.notificationError = 'SMTP not configured (check .env file)'
        emailResults.confirmationError = 'SMTP not configured (check .env file)'
      }
    } catch (error) {
      console.error('❌ Error sending emails:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      emailResults.notificationError = `Email send failed: ${errorMessage}`
      emailResults.confirmationError = `Email send failed: ${errorMessage}`
    }
    
    console.log('📧 Email results:', emailResults)
    
    return NextResponse.json({
      success: true,
      message: 'Tin nhắn đã được gửi thành công!',
      data: {
        id: contact._id,
        createdAt: contact.createdAt
      },
      emailStatus: emailResults
    }, { status: 201 })
    
  } catch (error: any) {
    console.error('❌ Error creating contact:', error)
    
    if (error instanceof z.ZodError) {
      console.log('🔍 Validation errors:', error.errors)
      return NextResponse.json({
        success: false,
        error: 'Dữ liệu không hợp lệ',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }, { status: 400 })
    }
    
    return NextResponse.json({
      success: false,
      error: 'Có lỗi xảy ra khi gửi tin nhắn',
      details: error.message
    }, { status: 500 })
  }
}

// GET - Lấy danh sách tin nhắn (chỉ admin)
export async function GET(request: NextRequest) {
  try {
    // Note: Authentication check should be added for production use
    // For demo purposes, this endpoint is accessible without auth
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    
    await connectDB()
    
    const query: any = {}
    if (status) query.status = status
    
    const skip = (page - 1) * limit
    
    const [contacts, total] = await Promise.all([
      Contact.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Contact.countDocuments(query)
    ])
    
    return NextResponse.json({
      success: true,
      data: contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
    
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json({
      success: false,
      error: 'Có lỗi xảy ra khi lấy tin nhắn'
    }, { status: 500 })
  }
}


