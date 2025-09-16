"use client"

import { useState } from "react"

interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

export function useUploadProgress() {
  const [progress, setProgress] = useState<UploadProgress | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const startUpload = () => {
    setIsUploading(true)
    setProgress(null)
  }

  const updateProgress = (progressData: UploadProgress) => {
    setProgress(progressData)
  }

  const finishUpload = () => {
    setIsUploading(false)
    setProgress(null)
  }

  const resetProgress = () => {
    setIsUploading(false)
    setProgress(null)
  }

  return {
    progress,
    isUploading,
    startUpload,
    updateProgress,
    finishUpload,
    resetProgress,
  }
}
