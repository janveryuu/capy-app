"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface CozyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  loadingText?: string
}

export function CozyButton({ children, loading, loadingText, className, disabled, ...props }: CozyButtonProps) {
  return (
    <button
      disabled={loading || disabled}
      className={cn(
        "relative flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-[0_8px_20px_-8px_var(--primary)] transition-all",
        "hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_12px_28px_-8px_var(--primary)]",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30",
        "active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-80 disabled:hover:translate-y-0",
        className,
      )}
      {...props}
    >
      {loading && (
        <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
      )}
      <span>{loading ? (loadingText ?? "Loading…") : children}</span>
    </button>
  )
}
