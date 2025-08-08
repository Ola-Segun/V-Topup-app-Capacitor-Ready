interface SMSData {
  to: string
  message: string
  from?: string
}

interface BulkSMSData {
  recipients: string[]
  message: string
  from?: string
}

class SMSService {
  private apiKey: string
  private senderId: string
  private baseUrl = 'https://api.ng.termii.com/api'

  constructor() {
    this.apiKey = process.env.TERMII_API_KEY || ''
    this.senderId = process.env.TERMII_SENDER_ID || 'VTopup'
  }

  // Send single SMS
  async sendSMS(data: SMSData) {
    try {
      if (!this.apiKey) {
        throw new Error('SMS API key not configured')
      }

      const response = await fetch(`${this.baseUrl}/sms/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: data.to,
          from: data.from || this.senderId,
          sms: data.message,
          type: 'plain',
          api_key: this.apiKey,
          channel: 'generic'
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'SMS sending failed')
      }

      return {
        success: true,
        data: {
          messageId: result.message_id,
          status: result.status,
          balance: result.balance
        }
      }
    } catch (error) {
      console.error('SMS sending error:', error)
      return { success: false, error: error.message }
    }
  }

  // Send bulk SMS
  async sendBulkSMS(data: BulkSMSData) {
    try {
      if (!this.apiKey) {
        throw new Error('SMS API key not configured')
      }

      const response = await fetch(`${this.baseUrl}/sms/send/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: data.recipients,
          from: data.from || this.senderId,
          sms: data.message,
          type: 'plain',
          api_key: this.apiKey,
          channel: 'generic'
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Bulk SMS sending failed')
      }

      return {
        success: true,
        data: {
          messageId: result.message_id,
          status: result.status,
          balance: result.balance
        }
      }
    } catch (error) {
      console.error('Bulk SMS sending error:', error)
      return { success: false, error: error.message }
    }
  }

  // Send OTP
  async sendOTP(phoneNumber: string, otp: string) {
    const message = `Your VTopup verification code is: ${otp}. This code expires in 10 minutes. Do not share this code with anyone.`
    
    return this.sendSMS({
      to: phoneNumber,
      message
    })
  }

  // Send transaction notification
  async sendTransactionNotification(phoneNumber: string, transactionData: any) {
    const message = `Transaction Alert: Your ${transactionData.service_type} purchase of ₦${transactionData.amount} was ${transactionData.status}. Ref: ${transactionData.reference}. Thank you for using VTopup!`
    
    return this.sendSMS({
      to: phoneNumber,
      message
    })
  }

  // Send wallet credit notification
  async sendWalletCreditNotification(phoneNumber: string, amount: number, balance: number) {
    const message = `Wallet Alert: Your wallet has been credited with ₦${amount}. New balance: ₦${balance}. VTopup - Your trusted partner.`
    
    return this.sendSMS({
      to: phoneNumber,
      message
    })
  }

  // Send low balance alert
  async sendLowBalanceAlert(phoneNumber: string, balance: number) {
    const message = `Low Balance Alert: Your wallet balance is ₦${balance}. Fund your wallet to continue enjoying our services. VTopup`
    
    return this.sendSMS({
      to: phoneNumber,
      message
    })
  }

  // Send welcome SMS
  async sendWelcomeSMS(phoneNumber: string, firstName: string) {
    const message = `Welcome to VTopup, ${firstName}! Your account has been created successfully. Enjoy seamless airtime and data purchases. Download our app for the best experience.`
    
    return this.sendSMS({
      to: phoneNumber,
      message
    })
  }

  // Check SMS balance
  async checkBalance() {
    try {
      if (!this.apiKey) {
        throw new Error('SMS API key not configured')
      }

      const response = await fetch(`${this.baseUrl}/get-balance?api_key=${this.apiKey}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Balance check failed')
      }

      return {
        success: true,
        data: {
          balance: result.balance,
          currency: result.currency
        }
      }
    } catch (error) {
      console.error('SMS balance check error:', error)
      return { success: false, error: error.message }
    }
  }

  // Get SMS delivery status
  async getDeliveryStatus(messageId: string) {
    try {
      if (!this.apiKey) {
        throw new Error('SMS API key not configured')
      }

      const response = await fetch(`${this.baseUrl}/sms/inbox?api_key=${this.apiKey}&message_id=${messageId}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Status check failed')
      }

      return {
        success: true,
        data: result
      }
    } catch (error) {
      console.error('SMS status check error:', error)
      return { success: false, error: error.message }
    }
  }
}

export const smsService = new SMSService()
