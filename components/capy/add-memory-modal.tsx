'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { X, Camera, Upload, Image as ImageIcon, MapPin, Type, Loader2 } from 'lucide-react'
import Image from 'next/image'

function resizeImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new window.Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_SIZE = 800
        let width = img.width
        let height = img.height
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width
            width = MAX_SIZE
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height
            height = MAX_SIZE
          }
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  })
}

export function AddMemoryModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean
  onClose: () => void
  onCreate: (data: { src: string; caption: string; location: string; rotate: number }) => Promise<void>
}) {
  const [mounted, setMounted] = useState(false)
  const [src, setSrc] = useState<string>('')
  const [caption, setCaption] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)

  const cameraInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  // Reset state when closed
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setSrc('')
        setCaption('')
        setLocation('')
        setLoading(false)
      }, 300)
    }
  }, [open])

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const base64 = await resizeImage(file)
    setSrc(base64)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!src || !caption || !location) return

    setLoading(true)
    const rotate = (Math.random() * 16) - 8 // random between -8 and 8
    
    await onCreate({ src, caption, location, rotate })
    setLoading(false)
    onClose()
  }

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Add memory"
            initial={{ y: 60, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            className="relative z-10 m-0 w-full max-w-[400px] overflow-hidden rounded-t-[2.5rem] border border-border bg-card p-6 shadow-[0_-10px_50px_-12px_rgba(120,80,40,0.4)] sm:m-4 sm:rounded-[2.5rem] sm:p-8"
          >
            <div className="mb-6 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-caramel">
                  <ImageIcon className="size-5" />
                  <span className="font-heading text-sm font-semibold uppercase tracking-wide">
                    New Memory
                  </span>
                </div>
                <h3 className="mt-1 font-heading text-2xl font-bold text-foreground">
                  Capture the moment
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!src ? (
                <div className="flex flex-col gap-3">
                  <div className="flex aspect-square w-full flex-col items-center justify-center gap-4 rounded-[1.5rem] border-2 border-dashed border-border/60 bg-secondary/30 p-6 text-center transition-colors">
                    <div className="grid size-12 place-items-center rounded-full bg-secondary text-muted-foreground">
                      <Camera className="size-6" />
                    </div>
                    <div>
                      <p className="font-heading text-lg font-bold text-foreground">Add a photo</p>
                      <p className="mt-1 text-xs text-muted-foreground">Take a quick snap or upload one</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      ref={cameraInputRef}
                      className="hidden"
                      onChange={handleFile}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFile}
                    />
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="flex flex-1 items-center justify-center gap-2 rounded-[1rem] bg-caramel/10 py-3 text-sm font-bold text-caramel transition-colors hover:bg-caramel/20"
                    >
                      <Camera className="size-4" /> Take photo
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-1 items-center justify-center gap-2 rounded-[1rem] bg-secondary py-3 text-sm font-bold text-foreground transition-colors hover:bg-secondary/80"
                    >
                      <Upload className="size-4" /> Upload
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border shadow-sm">
                    <Image
                      src={src}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setSrc('')}
                      className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                    >
                      <X className="size-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor="caption" className="flex items-center gap-1.5 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        <Type className="size-3.5" /> Caption
                      </label>
                      <input
                        id="caption"
                        required
                        maxLength={40}
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="e.g., Yuzu bath bliss"
                        className="w-full rounded-2xl border-none bg-secondary/60 px-4 py-3.5 text-sm font-semibold text-foreground placeholder:text-muted-foreground/60 focus:bg-secondary focus:ring-2 focus:ring-caramel focus:outline-none"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label htmlFor="location" className="flex items-center gap-1.5 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        <MapPin className="size-3.5" /> Location
                      </label>
                      <input
                        id="location"
                        required
                        maxLength={30}
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g., Hakone"
                        className="w-full rounded-2xl border-none bg-secondary/60 px-4 py-3.5 text-sm font-semibold text-foreground placeholder:text-muted-foreground/60 focus:bg-secondary focus:ring-2 focus:ring-caramel focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              <motion.button
                type="submit"
                disabled={!src || !caption || !location || loading}
                whileTap={src && caption && location && !loading ? { scale: 0.97 } : undefined}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-caramel py-4 font-heading text-base font-bold text-caramel-foreground shadow-sm transition-all hover:bg-caramel/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? <Loader2 className="size-5 animate-spin" /> : 'Save Memory'}
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
