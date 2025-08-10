import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Contact from '@/models/Contact'
import { Types } from 'mongoose'

// GET - Lấy chi tiết tin nhắn
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({
        success: false,
        error: 'ID không hợp lệ'
      }, { status: 400 })
    }
    
    await connectDB()
    
    const contact = await Contact.findById(params.id)
    
    if (!contact) {
      return NextResponse.json({
        success: false,
        error: 'Không tìm thấy tin nhắn'
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: contact
    })
    
  } catch (error) {
    console.error('Error fetching contact:', error)
    return NextResponse.json({
      success: false,
      error: 'Có lỗi xảy ra'
    }, { status: 500 })
  }
}

// PATCH - Cập nhật trạng thái tin nhắn
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({
        success: false,
        error: 'ID không hợp lệ'
      }, { status: 400 })
    }
    
    const { status } = await request.json()
    
    if (!['NEW', 'READ', 'REPLIED'].includes(status)) {
      return NextResponse.json({
        success: false,
        error: 'Trạng thái không hợp lệ'
      }, { status: 400 })
    }
    
    await connectDB()
    
    const contact = await Contact.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    )
    
    if (!contact) {
      return NextResponse.json({
        success: false,
        error: 'Không tìm thấy tin nhắn'
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: contact
    })
    
  } catch (error) {
    console.error('Error updating contact:', error)
    return NextResponse.json({
      success: false,
      error: 'Có lỗi xảy ra'
    }, { status: 500 })
  }
}

// DELETE - Xóa tin nhắn
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({
        success: false,
        error: 'ID không hợp lệ'
      }, { status: 400 })
    }
    
    await connectDB()
    
    const contact = await Contact.findByIdAndDelete(params.id)
    
    if (!contact) {
      return NextResponse.json({
        success: false,
        error: 'Không tìm thấy tin nhắn'
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Đã xóa tin nhắn thành công'
    })
    
  } catch (error) {
    console.error('Error deleting contact:', error)
    return NextResponse.json({
      success: false,
      error: 'Có lỗi xảy ra'
    }, { status: 500 })
  }
}
