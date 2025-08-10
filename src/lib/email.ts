import nodemailer from 'nodemailer'

// Tạo transporter cho Gmail
const createTransporter = () => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP credentials not configured')
    return null
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS // App Password (không phải mật khẩu thường)
    }
  })
}

// Gửi email thông báo tin nhắn mới
export async function sendContactNotification(contactData: {
  name: string
  email: string
  subject: string
  message: string
}) {
  try {
    const transporter = createTransporter()
    if (!transporter) return false

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER, // Gửi về chính email của bạn
      subject: `🔔 [Portfolio] Tin nhắn mới từ ${contactData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #ff6b35, #a0522d); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">📬 Tin nhắn mới từ Portfolio</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="margin-bottom: 20px;">
              <h2 style="color: #333; margin-bottom: 15px; border-bottom: 2px solid #ff6b35; padding-bottom: 10px;">
                Thông tin người gửi
              </h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555; width: 100px;">Tên:</td>
                  <td style="padding: 8px 0; color: #333;">${contactData.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
                  <td style="padding: 8px 0;">
                    <a href="mailto:${contactData.email}" style="color: #ff6b35; text-decoration: none;">
                      ${contactData.email}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Chủ đề:</td>
                  <td style="padding: 8px 0; color: #333; font-weight: 600;">${contactData.subject}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Thời gian:</td>
                  <td style="padding: 8px 0; color: #666;">${new Date().toLocaleString('vi-VN')}</td>
                </tr>
              </table>
            </div>

            <div style="margin-bottom: 25px;">
              <h3 style="color: #333; margin-bottom: 15px; border-bottom: 2px solid #ff6b35; padding-bottom: 10px;">
                📝 Nội dung tin nhắn
              </h3>
              <div style="background: #f8f9fa; padding: 20px; border-left: 4px solid #ff6b35; border-radius: 5px; line-height: 1.6; color: #333;">
                ${contactData.message.replace(/\n/g, '<br>')}
              </div>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="mailto:${contactData.email}?subject=Re: ${encodeURIComponent(contactData.subject)}" 
                 style="background: #ff6b35; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                ✉️ Trả lời ngay
              </a>
              
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/messages" 
                 style="background: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin-left: 10px;">
                🔧 Quản lý Admin
              </a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
            <p>Email này được gửi tự động từ hệ thống Portfolio</p>
            <p>© ${new Date().getFullYear()} Huỳnh Quốc Bảo. All rights reserved.</p>
          </div>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)
    console.log('✅ Contact notification email sent successfully')
    return true

  } catch (error) {
    console.error('❌ Error sending contact notification:', error)
    return false
  }
}

// Gửi email xác nhận cho người gửi
export async function sendContactConfirmation(contactData: {
  name: string
  email: string
  subject: string
}) {
  try {
    const transporter = createTransporter()
    if (!transporter) return false

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: contactData.email,
      subject: `✅ Cảm ơn bạn đã liên hệ}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #28a745, #20c997); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">✅ Tin nhắn đã được gửi thành công!</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; line-height: 1.6; color: #333;">Xin chào <strong>${contactData.name}</strong>,</p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Cảm ơn bạn đã quan tâm và gửi tin nhắn đến tôi. Tôi đã nhận được tin nhắn với chủ đề 
              "<strong style="color: #ff6b35;">${contactData.subject}</strong>" và sẽ phản hồi lại trong thời gian sớm nhất.
            </p>
            
            <div style="background: #e7f3ff; padding: 15px; border-left: 4px solid #007bff; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #0066cc; font-weight: 600;"> Thông tin hữu ích:</p>
              <ul style="margin: 10px 0 0 0; color: #333;">
              
                <li>Nếu cần gấp, bạn có thể gọi trực tiếp: <strong>0907670054</strong></li>
                <li>Hoặc liên hệ qua Zalo: <strong>0907670054</strong></li>
              </ul>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #856404; font-weight: 600;"> Kết nối với tôi:</p>
              <div style="margin-top: 10px;">
                <a href="${process.env.NEXT_PUBLIC_GITHUB_URL}" style="color: #333; text-decoration: none; margin-right: 15px;">🔗 GitHub</a>
                <a href="${process.env.NEXT_PUBLIC_FACEBOOK_URL}" style="color: #1877f2; text-decoration: none; margin-right: 15px;">📘 Facebook</a>
                <a href="${process.env.NEXT_PUBLIC_EMAIL_URL}" style="color: #ea4335; text-decoration: none;">📧 Gmail</a>
              </div>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Một lần nữa, cảm ơn bạn đã liên hệ.
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Trân trọng,<br>
              <strong style="color: #ff6b35;">Huỳnh Quốc Bảo</strong><br>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
            <p>Email này được gửi tự động từ hệ thống</p>
            <p>© ${new Date().getFullYear()} Huỳnh Quốc Bảo. All rights reserved.</p>
          </div>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)
    console.log('✅ Contact confirmation email sent successfully')
    return true

  } catch (error) {
    console.error('❌ Error sending contact confirmation:', error)
    return false
  }
}
