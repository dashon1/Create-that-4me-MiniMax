import React from 'react'

interface SafeImageProps {
  src: any
  alt?: string
  className?: string
  fallbackText?: string
  width?: number
  height?: number
}

export function SafeImage({ 
  src, 
  alt = 'Generated content', 
  className = '', 
  fallbackText = 'Generated content',
  width = 1024,
  height = 1024
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = React.useState<string | null>(null)

  React.useEffect(() => {
    const toImageSrc = (value: any): string => {
      // If you accidentally pass an object/array, recover
      if (typeof value === "object" && value) {
        // common shapes from APIs
        if (value.publicUrl) return value.publicUrl
        if (value.url)       return value.url
        if (value.src)       return value.src
        // not recognizable → fallback
        return createPlaceholder(fallbackText, width, height)
      }
      if (typeof value !== "string" || !value.trim()) {
        return createPlaceholder(fallbackText, width, height)
      }
      const s = value.trim()

      // Already a data URI or blob
      if (s.startsWith("data:") || s.startsWith("blob:")) return s

      // Looks like a bare placeholder "1024x1024?text=..." → convert to data URI
      if (/^\d{2,4}x\d{2,4}\?text=/i.test(s)) {
        const txt = decodeURIComponent(s.split("?text=")[1] || fallbackText)
        return createPlaceholder(txt, width, height)
      }

      // Same-origin absolute path
      if (s.startsWith("/")) return s

      // Full http(s) URL, keep it
      if (/^https?:\/\//i.test(s)) return s

      // Relative file like "imgs/robot.jpg"
      return "/" + s.replace(/^\/+/, "")
    }

    setCurrentSrc(toImageSrc(src))
  }, [src, fallbackText, width, height])

  const handleError = () => {
    setCurrentSrc(createPlaceholder(fallbackText, width, height))
  }

  if (!currentSrc) {
    return (
      <div 
        className={`bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white ${className}`}
        style={{ width: width, height: height }}
      >
        <span className="text-sm font-medium">Loading...</span>
      </div>
    )
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
      style={{ 
        width: width, 
        height: height,
        maxWidth: '100%',
        objectFit: 'cover'
      }}
    />
  )
}

function createPlaceholder(text: string, width: number, height: number): string {
  const esc = (s: string) => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#4f46e5"/>
        <stop offset="100%" stop-color="#9333ea"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <text x="50%" y="50%" font-family="system-ui,Segoe UI,Roboto" font-size="${Math.floor(width/16)}"
      fill="white" text-anchor="middle" dominant-baseline="middle">${esc(text)}</text>
  </svg>`
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg)
}
