import { cn } from "@/lib/utils"
import type { MachineStatus, FailureProbability } from "@/lib/data"

const statusStyles: Record<MachineStatus, string> = {
  healthy: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/15 text-warning-foreground border-warning/30",
  critical: "bg-destructive/10 text-destructive border-destructive/20",
}

const statusDot: Record<MachineStatus, string> = {
  healthy: "bg-success",
  warning: "bg-warning",
  critical: "bg-destructive",
}

const statusLabel: Record<MachineStatus, string> = {
  healthy: "Healthy",
  warning: "Warning",
  critical: "Critical",
}

export function StatusBadge({ status, className }: { status: MachineStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status],
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", statusDot[status])} />
      {statusLabel[status]}
    </span>
  )
}

const probStyles: Record<FailureProbability, string> = {
  Low: "bg-success/10 text-success border-success/20",
  Medium: "bg-warning/15 text-warning-foreground border-warning/30",
  High: "bg-destructive/10 text-destructive border-destructive/20",
}

export function ProbabilityBadge({ value }: { value: FailureProbability }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        probStyles[value],
      )}
    >
      {value}
    </span>
  )
}
