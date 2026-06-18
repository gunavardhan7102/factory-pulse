import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react"

interface KpiCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: { value: string; positive: boolean }
  accent?: "primary" | "success" | "warning" | "destructive"
  hint?: string
}

const accentMap = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning-foreground",
  destructive: "bg-destructive/10 text-destructive",
}

export function KpiCard({ label, value, icon: Icon, trend, accent = "primary", hint }: KpiCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className="text-2xl font-semibold tracking-tight text-foreground">{value}</span>
        </div>
        <div className={cn("flex size-10 items-center justify-center rounded-lg", accentMap[accent])}>
          <Icon className="size-5" />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        {trend ? (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium",
              trend.positive ? "text-success" : "text-destructive",
            )}
          >
            {trend.positive ? (
              <ArrowUpRight className="size-3.5" />
            ) : (
              <ArrowDownRight className="size-3.5" />
            )}
            {trend.value}
          </span>
        ) : null}
        {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
      </div>
    </Card>
  )
}
