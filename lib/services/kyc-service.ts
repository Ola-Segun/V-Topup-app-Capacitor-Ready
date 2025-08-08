import { createClient } from '@/lib/supabase/client'
import { emailService } from './email-service'
import { pushNotificationService } from './push-notification-service'

interface KYCDocument {
  id: string
  userId: string
  documentType: 'nin' | 'bvn' | 'passport' | 'drivers_license' | 'voters_card'
  documentNumber: string
  documentUrl: string
  status: 'pending' | 'approved' | 'rejected'
  rejectionReason?: string
  verifiedAt?: string
  verifiedBy?: string
}

interface KYCVerificationResult {
  isValid: boolean
  confidence: number
  extractedData: {
    name?: string
    dateOfBirth?: string
    gender?: string
    address?: string
    phoneNumber?: string
  }
  issues: string[]
}

class KYCService {
  private supabase = createClient()

  async uploadDocument(
    userId: string,
    documentType: string,
    documentNumber: string,
    file: File
  ): Promise<{ success: boolean; documentId?: string; error?: string }> {
    try {
      // Upload file to storage
      const fileName = `kyc/${userId}/${documentType}_${Date.now()}.${file.name.split('.').pop()}`
      
      const { data: uploadData, error: uploadError } = await this.supabase.storage
        .from('documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw new Error(`File upload failed: ${uploadError.message}`)
      }

      // Get public URL
      const { data: urlData } = this.supabase.storage
        .from('documents')
        .getPublicUrl(fileName)

      // Save document record
      const { data: document, error: dbError } = await this.supabase
        .from('kyc_documents')
        .insert({
          user_id: userId,
          document_type: documentType,
          document_number: documentNumber,
          document_url: urlData.publicUrl,
          status: 'pending'
        })
        .select()
        .single()

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`)
      }

      // Start automated verification process
      await this.startAutomatedVerification(document.id)

      // Send notification
      await pushNotificationService.sendNotification(
        userId,
        'Document Uploaded',
        `Your ${documentType.replace('_', ' ')} has been uploaded and is being verified.`,
        {
          type: 'kyc_upload',
          document_type: documentType,
          document_id: document.id
        }
      )

      return { success: true, documentId: document.id }
    } catch (error) {
      console.error('KYC document upload error:', error)
      return { success: false, error: error.message }
    }
  }

  async verifyDocument(documentId: string): Promise<KYCVerificationResult> {
    try {
      const { data: document } = await this.supabase
        .from('kyc_documents')
        .select('*')
        .eq('id', documentId)
        .single()

      if (!document) {
        throw new Error('Document not found')
      }

      // Perform different verification based on document type
      let result: KYCVerificationResult

      switch (document.document_type) {
        case 'nin':
          result = await this.verifyNIN(document.document_number, document.document_url)
          break
        case 'bvn':
          result = await this.verifyBVN(document.document_number, document.document_url)
          break
        case 'passport':
          result = await this.verifyPassport(document.document_number, document.document_url)
          break
        case 'drivers_license':
          result = await this.verifyDriversLicense(document.document_number, document.document_url)
          break
        case 'voters_card':
          result = await this.verifyVotersCard(document.document_number, document.document_url)
          break
        default:
          throw new Error(`Unsupported document type: ${document.document_type}`)
      }

      return result
    } catch (error) {
      console.error('Document verification error:', error)
      return {
        isValid: false,
        confidence: 0,
        extractedData: {},
        issues: [error.message]
      }
    }
  }

  private async verifyNIN(ninNumber: string, documentUrl: string): Promise<KYCVerificationResult> {
    try {
      // Call NIN verification API
      const response = await fetch('https://api.verified.africa/sfx-verify/v3/id-service/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'userid': process.env.VERIFIED_AFRICA_USER_ID || '',
          'apiKey': process.env.VERIFIED_AFRICA_API_KEY || ''
        },
        body: JSON.stringify({
          searchParameter: ninNumber,
          verificationType: 'NIN-SEARCH',
          transactionReference: `nin_${Date.now()}`
        })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'NIN verification failed')
      }

      // Extract data from response
      const extractedData = {
        name: `${data.data.firstname} ${data.data.lastname}`,
        dateOfBirth: data.data.birthdate,
        gender: data.data.gender,
        phoneNumber: data.data.telephoneno
      }

      // Perform OCR on uploaded document image
      const ocrResult = await this.performOCR(documentUrl)
      
      // Compare OCR results with API data
      const confidence = this.calculateConfidence(extractedData, ocrResult)
      const issues = this.identifyIssues(extractedData, ocrResult)

      return {
        isValid: confidence > 0.8 && issues.length === 0,
        confidence,
        extractedData,
        issues
      }
    } catch (error) {
      return {
        isValid: false,
        confidence: 0,
        extractedData: {},
        issues: [error.message]
      }
    }
  }

  private async verifyBVN(bvnNumber: string, documentUrl: string): Promise<KYCVerificationResult> {
    try {
      // Call BVN verification API
      const response = await fetch('https://api.verified.africa/sfx-verify/v3/id-service/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'userid': process.env.VERIFIED_AFRICA_USER_ID || '',
          'apiKey': process.env.VERIFIED_AFRICA_API_KEY || ''
        },
        body: JSON.stringify({
          searchParameter: bvnNumber,
          verificationType: 'BVN-SEARCH',
          transactionReference: `bvn_${Date.now()}`
        })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'BVN verification failed')
      }

      const extractedData = {
        name: `${data.data.firstName} ${data.data.lastName}`,
        dateOfBirth: data.data.dateOfBirth,
        gender: data.data.gender,
        phoneNumber: data.data.phoneNumber
      }

      return {
        isValid: true,
        confidence: 0.95,
        extractedData,
        issues: []
      }
    } catch (error) {
      return {
        isValid: false,
        confidence: 0,
        extractedData: {},
        issues: [error.message]
      }
    }
  }

  private async verifyPassport(passportNumber: string, documentUrl: string): Promise<KYCVerificationResult> {
    // Implement passport verification logic
    const ocrResult = await this.performOCR(documentUrl)
    
    return {
      isValid: ocrResult.passportNumber === passportNumber,
      confidence: 0.7,
      extractedData: ocrResult,
      issues: ocrResult.passportNumber !== passportNumber ? ['Passport number mismatch'] : []
    }
  }

  private async verifyDriversLicense(licenseNumber: string, documentUrl: string): Promise<KYCVerificationResult> {
    // Implement driver's license verification logic
    const ocrResult = await this.performOCR(documentUrl)
    
    return {
      isValid: ocrResult.licenseNumber === licenseNumber,
      confidence: 0.7,
      extractedData: ocrResult,
      issues: ocrResult.licenseNumber !== licenseNumber ? ['License number mismatch'] : []
    }
  }

  private async verifyVotersCard(votersCardNumber: string, documentUrl: string): Promise<KYCVerificationResult> {
    // Implement voter's card verification logic
    const ocrResult = await this.performOCR(documentUrl)
    
    return {
      isValid: ocrResult.votersCardNumber === votersCardNumber,
      confidence: 0.6,
      extractedData: ocrResult,
      issues: ocrResult.votersCardNumber !== votersCardNumber ? ['Voter\'s card number mismatch'] : []
    }
  }

  private async performOCR(imageUrl: string): Promise<any> {
    try {
      // Use Google Cloud Vision API or similar OCR service
      const response = await fetch('https://vision.googleapis.com/v1/images:annotate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GOOGLE_CLOUD_API_KEY}`
        },
        body: JSON.stringify({
          requests: [{
            image: { source: { imageUri: imageUrl } },
            features: [{ type: 'TEXT_DETECTION' }]
          }]
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error('OCR processing failed')
      }

      // Extract text and parse relevant information
      const text = data.responses[0]?.textAnnotations[0]?.description || ''
      
      return this.parseDocumentText(text)
    } catch (error) {
      console.error('OCR error:', error)
      return {}
    }
  }

  private parseDocumentText(text: string): any {
    // Parse extracted text to identify document fields
    const lines = text.split('\n')
    const result: any = {}

    // Common patterns for different document types
    const patterns = {
      name: /(?:name|full name|surname|first name)[\s:]+([a-zA-Z\s]+)/i,
      dateOfBirth: /(?:date of birth|dob|born)[\s:]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/i,
      gender: /(?:gender|sex)[\s:]+([mf]|male|female)/i,
      ninNumber: /(?:nin|national identification number)[\s:]+(\d{11})/i,
      bvnNumber: /(?:bvn|bank verification number)[\s:]+(\d{11})/i,
      passportNumber: /(?:passport|passport number)[\s:]+([a-zA-Z]\d{8})/i,
      licenseNumber: /(?:license|license number)[\s:]+([a-zA-Z0-9]+)/i,
      votersCardNumber: /(?:vin|voter|voters card)[\s:]+([a-zA-Z0-9]+)/i
    }

    // Extract information using patterns
    for (const [key, pattern] of Object.entries(patterns)) {
      const match = text.match(pattern)
      if (match) {
        result[key] = match[1].trim()
      }
    }

    return result
  }

  private calculateConfidence(apiData: any, ocrData: any): number {
    let matches = 0
    let total = 0

    // Compare name
    if (apiData.name && ocrData.name) {
      total++
      if (this.similarityScore(apiData.name.toLowerCase(), ocrData.name.toLowerCase()) > 0.8) {
        matches++
      }
    }

    // Compare date of birth
    if (apiData.dateOfBirth && ocrData.dateOfBirth) {
      total++
      if (apiData.dateOfBirth === ocrData.dateOfBirth) {
        matches++
      }
    }

    // Compare gender
    if (apiData.gender && ocrData.gender) {
      total++
      if (apiData.gender.toLowerCase() === ocrData.gender.toLowerCase()) {
        matches++
      }
    }

    return total > 0 ? matches / total : 0
  }

  private identifyIssues(apiData: any, ocrData: any): string[] {
    const issues: string[] = []

    // Check for mismatches
    if (apiData.name && ocrData.name) {
      if (this.similarityScore(apiData.name.toLowerCase(), ocrData.name.toLowerCase()) < 0.8) {
        issues.push('Name mismatch between document and database')
      }
    }

    if (apiData.dateOfBirth && ocrData.dateOfBirth) {
      if (apiData.dateOfBirth !== ocrData.dateOfBirth) {
        issues.push('Date of birth mismatch')
      }
    }

    if (apiData.gender && ocrData.gender) {
      if (apiData.gender.toLowerCase() !== ocrData.gender.toLowerCase()) {
        issues.push('Gender mismatch')
      }
    }

    return issues
  }

  private similarityScore(str1: string, str2: string): number {
    // Simple Levenshtein distance-based similarity
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1
    
    if (longer.length === 0) return 1.0
    
    const distance = this.levenshteinDistance(longer, shorter)
    return (longer.length - distance) / longer.length
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = []

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }

    return matrix[str2.length][str1.length]
  }

  private async startAutomatedVerification(documentId: string) {
    try {
      // Perform automated verification
      const result = await this.verifyDocument(documentId)

      // Update document status based on verification result
      const status = result.isValid && result.confidence > 0.8 ? 'approved' : 'pending'
      
      await this.supabase
        .from('kyc_documents')
        .update({
          status,
          metadata: {
            verification_result: result,
            automated_check: true,
            verified_at: new Date().toISOString()
          }
        })
        .eq('id', documentId)

      // If verification failed, flag for manual review
      if (!result.isValid || result.confidence <= 0.8) {
        await this.flagForManualReview(documentId, result)
      } else {
        // Auto-approve if confidence is high
        await this.approveDocument(documentId, 'system')
      }

    } catch (error) {
      console.error('Automated verification error:', error)
      
      // Flag for manual review on error
      await this.flagForManualReview(documentId, {
        isValid: false,
        confidence: 0,
        extractedData: {},
        issues: ['Automated verification failed']
      })
    }
  }

  private async flagForManualReview(documentId: string, verificationResult: KYCVerificationResult) {
    await this.supabase
      .from('kyc_documents')
      .update({
        status: 'pending',
        metadata: {
          verification_result: verificationResult,
          requires_manual_review: true,
          flagged_at: new Date().toISOString()
        }
      })
      .eq('id', documentId)

    // Create admin notification
    await this.supabase
      .from('system_alerts')
      .insert({
        type: 'info',
        severity: 'medium',
        title: 'KYC Document Requires Review',
        message: `Document ${documentId} requires manual review. Issues: ${verificationResult.issues.join(', ')}`,
        source: 'kyc_service',
        metadata: { document_id: documentId }
      })
  }

  async approveDocument(documentId: string, approvedBy: string) {
    try {
      const { data: document } = await this.supabase
        .from('kyc_documents')
        .update({
          status: 'approved',
          verified_at: new Date().toISOString(),
          verified_by: approvedBy
        })
        .eq('id', documentId)
        .select('*, users(*)')
        .single()

      if (!document) {
        throw new Error('Document not found')
      }

      // Check if user has completed KYC (all required documents approved)
      const { data: userDocuments } = await this.supabase
        .from('kyc_documents')
        .select('document_type, status')
        .eq('user_id', document.user_id)

      const requiredDocuments = ['nin', 'bvn'] // Minimum required documents
      const approvedDocuments = userDocuments?.filter(d => d.status === 'approved').map(d => d.document_type) || []
      
      const kycCompleted = requiredDocuments.every(doc => approvedDocuments.includes(doc))

      if (kycCompleted) {
        // Update user KYC status
        await this.supabase
          .from('users')
          .update({ kyc_status: 'verified' })
          .eq('id', document.user_id)

        // Send completion notification
        await pushNotificationService.sendNotification(
          document.user_id,
          'KYC Verification Complete',
          'Your identity verification is complete! You now have full access to all features.',
          {
            type: 'kyc_completed',
            document_id: documentId
          }
        )

        // Send email
        if (document.users?.email) {
          await emailService.sendKYCCompletionEmail(document.users.email, {
            firstName: document.users.first_name,
            completedAt: new Date().toISOString()
          })
        }
      } else {
        // Send document approval notification
        await pushNotificationService.sendNotification(
          document.user_id,
          'Document Approved',
          `Your ${document.document_type.replace('_', ' ')} has been approved.`,
          {
            type: 'kyc_document_approved',
            document_type: document.document_type,
            document_id: documentId
          }
        )
      }

      return { success: true }
    } catch (error) {
      console.error('Document approval error:', error)
      return { success: false, error: error.message }
    }
  }

  async rejectDocument(documentId: string, rejectionReason: string, rejectedBy: string) {
    try {
      const { data: document } = await this.supabase
        .from('kyc_documents')
        .update({
          status: 'rejected',
          rejection_reason: rejectionReason,
          verified_at: new Date().toISOString(),
          verified_by: rejectedBy
        })
        .eq('id', documentId)
        .select('*, users(*)')
        .single()

      if (!document) {
        throw new Error('Document not found')
      }

      // Send rejection notification
      await pushNotificationService.sendNotification(
        document.user_id,
        'Document Rejected',
        `Your ${document.document_type.replace('_', ' ')} was rejected. Please upload a new document.`,
        {
          type: 'kyc_document_rejected',
          document_type: document.document_type,
          document_id: documentId,
          reason: rejectionReason
        }
      )

      // Send email
      if (document.users?.email) {
        await emailService.sendKYCRejectionEmail(document.users.email, {
          firstName: document.users.first_name,
          documentType: document.document_type.replace('_', ' '),
          rejectionReason,
          rejectedAt: new Date().toISOString()
        })
      }

      return { success: true }
    } catch (error) {
      console.error('Document rejection error:', error)
      return { success: false, error: error.message }
    }
  }

  async getKYCStatus(userId: string) {
    try {
      const { data: documents } = await this.supabase
        .from('kyc_documents')
        .select('document_type, status, rejection_reason, created_at, verified_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      const { data: user } = await this.supabase
        .from('users')
        .select('kyc_status')
        .eq('id', userId)
        .single()

      return {
        success: true,
        data: {
          overall_status: user?.kyc_status || 'pending',
          documents: documents || [],
          required_documents: ['nin', 'bvn'],
          optional_documents: ['passport', 'drivers_license', 'voters_card']
        }
      }
    } catch (error) {
      console.error('Get KYC status error:', error)
      return { success: false, error: error.message }
    }
  }
}

export const kycService = new KYCService()
