"use client"

import { useEffect, useRef, useState } from "react"
import { Upload, X, Image as ImageIcon } from "lucide-react"

import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { Label } from "./ui/label"

type Props = {
  value?: File | null
  onChange: (file: File | null) => void

  label?: string
  error?: string
  initialUrl?: string | null
}

export function ImageUpload({
  value,
  onChange,
  label = "Image",
  error,
  initialUrl,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [preview, setPreview] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  /* ================= PREVIEW ================= */
  useEffect(() => {
    if (value) {
      const url = URL.createObjectURL(value)
      setPreview(url)
      return () => URL.revokeObjectURL(url)
    }

    setPreview(initialUrl ?? null)
  }, [value, initialUrl])

  /* ================= FILE HANDLER ================= */
  const handleFile = (file?: File | null) => {
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      return
    }

    onChange(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    handleFile(file)
  }

  const removeImage = () => {
    onChange(null)
    setPreview(null)
  }

  /* ================= EMPTY STATE ================= */
  if (!preview) {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>

        <Card
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDragActive(true)
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`
            relative flex flex-col items-center justify-center
            gap-2 p-10 border-2 border-dashed
            cursor-pointer transition-all rounded-xl
            hover:border-primary/60 hover:bg-muted/40
            ${dragActive ? "border-primary bg-muted/60 scale-[1.01]" : ""}
          `}
        >
          <Upload className="w-7 h-7 opacity-70" />

          <p className="text-sm font-medium">
            Upload or drag & drop image
          </p>

          <p className="text-xs text-muted-foreground">
            PNG, JPG, WEBP up to 5MB
          </p>

          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="mt-2"
          >
            Browse files
          </Button>
        </Card>

        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) =>
            handleFile(e.target.files?.[0])
          }
        />
      </div>
    )
  }

  /* ================= PREVIEW STATE ================= */
  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <div className="relative group w-full max-w-sm">

        <img
          src={preview}
          alt="upload-preview"
          className="
            w-full h-48 object-cover rounded-xl
            border shadow-sm
          "
        />

        {/* overlay */}
        <div className="
          absolute inset-0 bg-black/40
          opacity-0 group-hover:opacity-100
          transition flex items-center justify-center gap-2
          rounded-xl
        ">

          <Button
            type="button"
            size="icon"
            variant="secondary"
            onClick={() => inputRef.current?.click()}
          >
            <ImageIcon className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            size="icon"
            variant="destructive"
            onClick={removeImage}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) =>
          handleFile(e.target.files?.[0])
        }
      />
    </div>
  )
}