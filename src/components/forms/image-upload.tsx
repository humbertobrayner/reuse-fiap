"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Upload, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageFile {
  file: File
  preview: string
  id: string
}

interface ImageUploadProps {
  value: ImageFile[]
  onChange: (files: ImageFile[]) => void
  maxFiles?: number
  maxSizeMB?: number
  className?: string
}

export function ImageUpload({ value = [], onChange, maxFiles = 8, maxSizeMB = 8, className }: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const newFiles: ImageFile[] = []
    const maxSizeBytes = maxSizeMB * 1024 * 1024

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        if (file.size <= maxSizeBytes) {
          const id = Math.random().toString(36).substr(2, 9)
          const preview = URL.createObjectURL(file)
          newFiles.push({ file, preview, id })
        }
      }
    })

    const totalFiles = value.length + newFiles.length
    const filesToAdd = totalFiles > maxFiles ? newFiles.slice(0, maxFiles - value.length) : newFiles

    onChange([...value, ...filesToAdd])
  }

  const removeFile = (id: string) => {
    const fileToRemove = value.find((f) => f.id === id)
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.preview)
    }
    onChange(value.filter((f) => f.id !== id))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <Card
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer",
          isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          value.length >= maxFiles && "opacity-50 cursor-not-allowed",
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => value.length < maxFiles && fileInputRef.current?.click()}
      >
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <ImageIcon className="h-10 w-10 text-muted-foreground mb-4" />
          <div className="space-y-2">
            <p className="text-sm font-medium">
              {value.length >= maxFiles ? `Máximo de ${maxFiles} imagens atingido` : "Clique ou arraste imagens aqui"}
            </p>
            <p className="text-xs text-muted-foreground">PNG, JPG até {maxSizeMB}MB cada</p>
          </div>

          {value.length < maxFiles && (
            <Button variant="outline" size="sm" className="mt-4 bg-transparent">
              <Upload className="h-4 w-4 mr-2" />
              Selecionar imagens
            </Button>
          )}
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      {/* Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {value.map((imageFile, index) => (
            <div key={imageFile.id} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                <img
                  src={imageFile.preview || "/placeholder.svg"}
                  alt={`Upload ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </div>

              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(imageFile.id)
                }}
              >
                <X className="h-3 w-3" />
              </Button>

              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                  Principal
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {value.length}/{maxFiles} imagens • A primeira imagem será a principal
      </p>
    </div>
  )
}
