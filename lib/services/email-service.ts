interface EmailData {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  templateId?: string
  templateData?: Record<string, any>
}

interface EmailTemplate {
  welcome: string
  transaction_success: string
  transaction_failed: string
  wallet_credit: string
  password_reset: string
  otp_verification: string
  low_balance: string
  promotional: string
}

class EmailService {
  private apiKey: string
  private fromEmail: string
  private fromName: string
  private baseUrl = 'https://api.sendgrid.com/v3'

  constructor() {
    this.apiKey = process.env.SENDGRID_API_KEY || ''
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@vtopup.com'
    this.fromName = process.env.FROM_NAME || 'VTopup'
  }

  // Send email using SendGrid
  async sendEmail(data: EmailData) {
    try {
      if (!this.apiKey) {
        throw new Error('Email API key not configured')
      }

      const recipients = Array.isArray(data.to) ? data.to : [data.to]

      const emailData = {
        personalizations: recipients.map(email => ({
          to: [{ email }],
          dynamic_template_data: data.templateData || {}
        })),
        from: {
          email: this.fromEmail,
          name: this.fromName
        },
        subject: data.subject,
        content: data.html ? [
          {
            type: 'text/html',
            value: data.html
          }
        ] : undefined,
        template_id: data.templateId
      }

      const response = await fetch(`${this.baseUrl}/mail/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Email sending failed: ${error}`)
      }

      return {
        success: true,
        data: {
          messageId: response.headers.get('x-message-id'),
          status: 'sent'
        }
      }
    } catch (error) {
      console.error('Email sending error:', error)
      return { success: false, error: error.message }
    }
  }

  // Send welcome email
  async sendWelcomeEmail(email: string, userData: any) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to VTopup</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to VTopup!</h1>
          </div>
          <div class="content">
            <h2>Hello ${userData.firstName}!</h2>
            <p>Thank you for joining VTopup, your trusted partner for airtime and data purchases.</p>
            <p>Your account has been successfully created. You can now:</p>
            <ul>
              <li>Purchase airtime for all networks</li>
              <li>Buy data bundles at discounted rates</li>
              <li>Pay electricity and cable TV bills</li>
              <li>Track all your transactions</li>
            </ul>
            <p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">
                Get Started
              </a>
            </p>
            <p>If you have any questions, feel free to contact our support team.</p>
            <p>Best regards,<br>The VTopup Team</p>
          </div>
        </div>
      </body>
      </html>
    `

    return this.sendEmail({
      to: email,
      subject: 'Welcome to VTopup - Your Account is Ready!',
      html
    })
  }

  // Send transaction success email
  async sendTransactionSuccessEmail(email: string, transactionData: any) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Transaction Successful</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .transaction-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .success-icon { font-size: 48px; color: #10b981; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="success-icon">✓</div>
            <h1>Transaction Successful!</h1>
          </div>
          <div class="content">
            <p>Your transaction has been completed successfully.</p>
            <div class="transaction-details">
              <h3>Transaction Details:</h3>
              <p><strong>Service:</strong> ${transactionData.service_type}</p>
              <p><strong>Amount:</strong> ₦${transactionData.amount}</p>
              <p><strong>Phone Number:</strong> ${transactionData.phone_number}</p>
              <p><strong>Reference:</strong> ${transactionData.reference}</p>
              <p><strong>Date:</strong> ${new Date(transactionData.created_at).toLocaleString()}</p>
              <p><strong>Status:</strong> <span style="color: #10b981;">Successful</span></p>
            </div>
            <p>Thank you for using VTopup!</p>
            <p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/history" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">
                View Transaction History
              </a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `

    return this.sendEmail({
      to: email,
      subject: `Transaction Successful - ${transactionData.reference}`,
      html
    })
  }

  // Send transaction failed email
  async sendTransactionFailedEmail(email: string, transactionData: any) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Transaction Failed</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ef4444; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .transaction-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .error-icon { font-size: 48px; color: #ef4444; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="error-icon">✗</div>
            <h1>Transaction Failed</h1>
          </div>
          <div class="content">
            <p>We're sorry, but your transaction could not be completed.</p>
            <div class="transaction-details">
              <h3>Transaction Details:</h3>
              <p><strong>Service:</strong> ${transactionData.service_type}</p>
              <p><strong>Amount:</strong> ₦${transactionData.amount}</p>
              <p><strong>Phone Number:</strong> ${transactionData.phone_number}</p>
              <p><strong>Reference:</strong> ${transactionData.reference}</p>
              <p><strong>Date:</strong> ${new Date(transactionData.created_at).toLocaleString()}</p>
              <p><strong>Status:</strong> <span style="color: #ef4444;">Failed</span></p>
              <p><strong>Reason:</strong> ${transactionData.failure_reason || 'Unknown error'}</p>
            </div>
            <p>Your wallet has been refunded if any amount was deducted.</p>
            <p>If you continue to experience issues, please contact our support team.</p>
            <p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/support" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `

    return this.sendEmail({
      to: email,
      subject: `Transaction Failed - ${transactionData.reference}`,
      html
    })
  }

  // Send wallet credit notification
  async sendWalletCreditEmail(email: string, creditData: any) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Wallet Credited</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .credit-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Wallet Credited!</h1>
          </div>
          <div class="content">
            <p>Your VTopup wallet has been successfully credited.</p>
            <div class="credit-details">
              <h3>Credit Details:</h3>
              <p><strong>Amount Credited:</strong> ₦${creditData.amount}</p>
              <p><strong>New Balance:</strong> ₦${creditData.new_balance}</p>
              <p><strong>Reference:</strong> ${creditData.reference}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <p>You can now use your wallet balance to purchase airtime, data, and pay bills.</p>
            <p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">
                Start Shopping
              </a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `

    return this.sendEmail({
      to: email,
      subject: 'Wallet Credited Successfully',
      html
    })
  }

  // Send OTP email
  async sendOTPEmail(email: string, otp: string) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Verification Code</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .otp-code { font-size: 32px; font-weight: bold; text-align: center; background: white; padding: 20px; border-radius: 5px; margin: 20px 0; letter-spacing: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Verification Code</h1>
          </div>
          <div class="content">
            <p>Your VTopup verification code is:</p>
            <div class="otp-code">${otp}</div>
            <p>This code will expire in 10 minutes. Do not share this code with anyone.</p>
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `

    return this.sendEmail({
      to: email,
      subject: 'Your VTopup Verification Code',
      html
    })
  }

  // Send password reset email
  async sendPasswordResetEmail(email: string, resetToken: string) {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Reset Your Password</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Reset Your Password</h1>
          </div>
          <div class="content">
            <p>You requested to reset your VTopup account password.</p>
            <p>Click the button below to reset your password:</p>
            <p>
              <a href="${resetUrl}" class="button">Reset Password</a>
            </p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this password reset, please ignore this email.</p>
            <p>For security reasons, please do not share this link with anyone.</p>
          </div>
        </div>
      </body>
      </html>
    `

    return this.sendEmail({
      to: email,
      subject: 'Reset Your VTopup Password',
      html
    })
  }

  // Send promotional email
  async sendPromotionalEmail(email: string, promoData: any) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${promoData.title}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f59e0b; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .promo-banner { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0; }
          .button { display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${promoData.title}</h1>
          </div>
          <div class="content">
            <div class="promo-banner">
              <h2>${promoData.discount}% OFF</h2>
              <p>${promoData.description}</p>
            </div>
            <p>Don't miss out on this amazing offer!</p>
            <p>Use promo code: <strong>${promoData.promoCode}</strong></p>
            <p>Valid until: ${new Date(promoData.expiryDate).toLocaleDateString()}</p>
            <p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">
                Shop Now
              </a>
            </p>
            <p><small>Terms and conditions apply. This offer cannot be combined with other promotions.</small></p>
          </div>
        </div>
      </body>
      </html>
    `

    return this.sendEmail({
      to: email,
      subject: promoData.title,
      html
    })
  }
}

export const emailService = new EmailService()
