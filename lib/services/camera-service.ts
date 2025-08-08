export interface CameraResult {
  success: boolean
  data?: string
  error?: string
}

export interface QRCodeResult {
  text: string
  format: string
}

export class CameraService {
  private stream: MediaStream | null = null

  async requestCameraPermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      
      // Stop the stream immediately, we just wanted to check permission
      stream.getTracks().forEach(track => track.stop())
      return true
    } catch (error) {
      console.error('Camera permission denied:', error)
      return false
    }
  }

  async capturePhoto(): Promise<CameraResult> {
    try {
      const hasPermission = await this.requestCameraPermission()
      if (!hasPermission) {
        return { success: false, error: 'Camera permission denied' }
      }

      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })

      // Create video element
      const video = document.createElement('video')
      video.srcObject = this.stream
      video.autoplay = true
      video.playsInline = true

      // Wait for video to be ready
      await new Promise((resolve) => {
        video.onloadedmetadata = resolve
      })

      // Create canvas and capture frame
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')!
      
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      context.drawImage(video, 0, 0)
      
      // Convert to base64
      const dataURL = canvas.toDataURL('image/jpeg', 0.8)
      
      // Stop camera
      this.stopCamera()
      
      return { success: true, data: dataURL }
    } catch (error) {
      this.stopCamera()
      return { success: false, error: error.message }
    }
  }

  async scanQRCode(): Promise<QRCodeResult | null> {
    try {
      const hasPermission = await this.requestCameraPermission()
      if (!hasPermission) {
        throw new Error('Camera permission denied')
      }

      // For demo purposes, we'll simulate QR code scanning
      // In production, use a library like @zxing/library or jsQR
      return new Promise((resolve, reject) => {
        // Simulate QR code detection after 3 seconds
        setTimeout(() => {
          const mockQRData = {
            text: 'vtopup://pay?amount=1000&recipient=08012345678',
            format: 'QR_CODE'
          }
          resolve(mockQRData)
        }, 3000)
      })
    } catch (error) {
      console.error('QR code scanning failed:', error)
      return null
    }
  }

  async scanDocument(): Promise<CameraResult> {
    try {
      const photo = await this.capturePhoto()
      
      if (!photo.success) {
        return photo
      }

      // In production, integrate with OCR service like Google Vision API
      // For demo, we'll return the captured image
      return {
        success: true,
        data: photo.data
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop())
      this.stream = null
    }
  }

  async uploadDocument(file: File, type: 'id' | 'utility_bill' | 'selfie'): Promise<CameraResult> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const response = await fetch('/api/upload/document', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()
      return { success: true, data: result.url }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

// Export singleton instance
export const cameraService = new CameraService()
