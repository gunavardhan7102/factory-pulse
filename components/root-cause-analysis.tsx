"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RootCauseAnalysis } from "@/lib/data"
import { cn } from "@/lib/utils"

interface RootCauseAnalysisProps {
  causes: RootCauseAnalysis[]
  compact?: boolean
}

export function RootCauseAnalysisComponent({ causes, compact = false }: RootCauseAnalysisProps) {
  if (!causes || causes.length === 0) {
    return <p className="text-xs text-muted-foreground">No root causes identified</p>
  }

  const sortedCauses = [...causes].sort((a, b) => b.probability - a.probability)

  if (compact) {
    return (
      <div className="space-y-1">
        {sortedCauses.slice(0, 3).map((cause, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs">
            <span className="truncate text-muted-foreground">{cause.cause}</span>
            <span className="ml-2 font-medium">{cause.probability}%</span>
          </div>
        ))}
        {sortedCauses.length > 3 && (
          <p className="text-xs text-muted-foreground">+{sortedCauses.length - 3} more</p>
        )}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Root Cause Analysis</CardTitle>
        <CardDescription>AI-estimated failure causes (not certainties)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {sortedCauses.map((cause, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{cause.cause}</p>
              <span className="text-xs font-semibold text-muted-foreground">{cause.probability}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  cause.probability >= 75
                    ? "bg-destructive"
                    : cause.probability >= 50
                      ? "bg-warning"
                      : cause.probability >= 25
                        ? "bg-blue-500"
                        : "bg-muted-foreground"
                )}
                style={{ width: `${cause.probability}%` }}
              />
            </div>
          </div>
        ))}
        <div className="border-t border-border pt-3 text-xs text-muted-foreground">
          These are AI estimations based on sensor data patterns and historical maintenance records. They indicate probability, not certainty.
        </div>
      </CardContent>
    </Card>
  )
}
