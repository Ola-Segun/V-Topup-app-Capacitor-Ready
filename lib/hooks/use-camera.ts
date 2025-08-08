import { useState } from 'react'
import { cameraService, CameraResult, QRCodeResult } from '@/lib/services/camera-service'

export function useCamera() {
  const [isLoading, setIsLoading] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)

  const requestPermission = async () => {
    setIsLoading(true)
    try {
      const permission = await cameraService.requestCameraPermission()
      setHasPermission(permission)
      return permission
    } finally {
      setIsLoading(false)
    }
  }

  const capturePhoto = async (): Promise<CameraResult> => {
    setIsLoading(true)
    try {
      return await cameraService.capturePhoto()
    } finally {
      setIsLoading(false)
    }
  }

  const scanQRCode = async (): Promise<QRCodeResult | null> => {
    setIsLoading(true)
    try {
      return await cameraService.scanQRCode()
    } finally {
      setIsLoading(false)
    }
  }

  const scanDocument = async (): Promise<CameraResult> => {
    setIsLoading(true)
    try {
      return await cameraService.scanDocument()
    } finally {
      setIsLoading(false)
    }
  }

  const uploadDocument = async (file: File, type: 'id' | 'utility_bill' | 'selfie'): Promise<CameraResult> => {
    setIsLoading(true)
    try {
      return await cameraService.uploadDocument(file, type)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    hasPermission,
    requestPermission,
    capturePhoto,
    scanQRCode,
    scanDocument,
    uploadDocument
  }
}
