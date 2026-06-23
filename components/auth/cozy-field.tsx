"use client"

import type React from "react"
import { useId, useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface CozyFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon: React.ReactNode
  hint?: string
}

export function CozyField({ label, icon, hint, type = "text", className, ...props }: CozyFieldProps) {
  const id = useId()
  const [show, setShow] = useState(false)
  const isPassword = type === "password"
  const inputType = isPassword ? (show ? "text" : "password") : type

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="px-1 text-sm font-bold text-foreground/80">
        {label}
      </Label>
      <div className="group relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
          {icon}
        </span>
        <input
          id={id}
          type={inputType}
          className={cn(
            "w-full rounded-2xl border border-input bg-card/80 py-3 pl-11 pr-4 text-sm font-medium text-foreground shadow-sm outline-none transition-all placeholder:font-normal placeholder:text-muted-foreground/70",
            "hover:border-primary/30 focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/15",
            isPassword && "pr-12",
            className,
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>
      {hint && <p className="px-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}
