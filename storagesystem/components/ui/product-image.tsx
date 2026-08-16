"use client"

import React, { useState, useEffect } from "react"
import { Package, ImageOff } from "lucide-react"
import { tauriApi } from "@/lib/tauri-api"

interface ProductImageProps {
  src?: string | null
  alt: string
  className?: string
  fallbackClassName?: string
  showPlaceholder?: boolean
  onClick?: () => void
}

export function ProductImage({
  src,
  alt,
  className = "w-full h-full object-cover",
  fallbackClassName = "w-full h-full bg-muted flex items-center justify-center text-muted-foreground",
  showPlaceholder = true,
  onClick,
}: ProductImageProps) {
  const [resolvedSrc, setResolvedSrc] = useState<string | null>(null)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    setHasError(false)

    if (!src || src.trim() === "") {
      setResolvedSrc(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    tauriApi
      .resolveImageSrc(src)
      .then((url) => {
        if (isMounted) {
          setResolvedSrc(url)
          setIsLoading(false)
        }
      })
      .catch(() => {
        if (isMounted) {
          setHasError(true)
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [src])

  if (isLoading) {
    return (
      <div className={`${fallbackClassName} animate-pulse`}>
        <Package className="w-5 h-5 opacity-40 animate-pulse" />
      </div>
    )
  }

  if (hasError || !resolvedSrc) {
    if (!showPlaceholder) return null
    return (
      <div className={fallbackClassName} onClick={onClick}>
        {hasError ? (
          <ImageOff className="w-5 h-5 opacity-50" />
        ) : (
          <Package className="w-5 h-5 opacity-50" />
        )}
      </div>
    )
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setHasError(true)}
      onClick={onClick}
    />
  )
}
