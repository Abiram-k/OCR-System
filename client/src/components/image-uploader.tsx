"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, X, ImageIcon } from "lucide-react"
// import Image from "next/image"

interface ImageUploaderProps {
  title: string
  description: string
  onImageUpload: (imageUrl: string) => void
  currentImage: string | null
}

export default function ImageUploader({ title, description, onImageUpload, currentImage }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (!file.type.match("image.*")) {
      alert("Please upload an image file")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === "string") {
        onImageUpload(e.target.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    onImageUpload("")
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <Card className={`border-2 ${isDragging ? "border-primary border-dashed" : ""}`}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

        {!currentImage ? (
          <div
            className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors"
            onClick={triggerFileInput}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground text-center">Drag & drop an image here or click to browse</p>
          </div>
        ) : (
          <div className="relative h-48 w-full">
            <img
              src={currentImage || "/placeholder.svg"}
              alt={`${title} of Aadhaar card`}
              className="object-contain rounded-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 "
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant={currentImage ? "outline" : "default"} onClick={triggerFileInput} className="w-full  bg-green-600 hover:bg-green-500 cursor-pointer text-white hover:text-white">
          <ImageIcon className="mr-2 h-4 w-4" />
          {currentImage ? "Change Image" : "Upload Image"}
        </Button>
      </CardFooter>
    </Card>
  )
}
