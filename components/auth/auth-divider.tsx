export function AuthDivider({ label = "or with email" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3" aria-hidden="true">
      <span className="h-px flex-1 bg-border" />
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}
