"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock, Zap } from "lucide-react"
import { FailureAnalysis } from "@/lib/data"
import { cn } from "@/lib/utils"

interface FailureModeDetailsProps {
  failureAnalysis: FailureAnalysis[]
  compact?: boolean
}

export function FailureModeDetails({ failureAnalysis, compact = false }: FailureModeDetailsProps) {
  if (!failureAnalysis || failureAnalysis.length === 0) {
    return <p className="text-xs text-muted-foreground">No failure modes detected</p>
  }

  if (compact) {
    const primary = failureAnalysis[0]
    return (
      <div className="rounded-lg border border-border bg-secondary/30 p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{primary.mode}</p>
            <p className="text-xs text-muted-foreground line-clamp-1">{primary.rootCause}</p>
          </div>
          <Badge
            variant="outline"
            className={cn(
              primary.probability >= 75
                ? "bg-destructive/10 text-destructive"
                : primary.probability >= 50
                  ? "bg-warning/10 text-warning"
                  : "bg-success/10 text-success"
            )}
          >
            {primary.probability}%
          </Badge>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Failure Mode Analysis</CardTitle>
        <CardDescription>Likely failure modes identified by AI</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {failureAnalysis.map((failure, idx) => (
          <div key={idx} className="rounded-lg border border-border p-4">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="size-4 text-warning" />
                  <h4 className="font-semibold">{failure.mode}</h4>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{failure.rootCause}</p>
              </div>
              <Badge
                className={cn(
                  "whitespace-nowrap",
                  failure.probability >= 75
                    ? "bg-destructive/10 text-destructive"
                    : failure.probability >= 50
                      ? "bg-warning/10 text-warning"
                      : "bg-success/10 text-success"
                )}
              >
                {failure.probability}%
              </Badge>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {/* Time to Failure */}
              <div className="flex items-center gap-2 rounded bg-secondary/50 p-2">
                <Clock className="size-4 text-muted-foreground" />
                <div className="text-xs">
                  <p className="font-medium">Est. Failure Time</p>
                  <p className="text-muted-foreground">
                    {failure.timeToFailure < 24
                      ? `${failure.timeToFailure}h`
                      : `${Math.round(failure.timeToFailure / 24)}d`}
                  </p>
                </div>
              </div>

              {/* Estimated Failure Date */}
              <div className="flex items-center gap-2 rounded bg-secondary/50 p-2">
                <Zap className="size-4 text-muted-foreground" />
                <div className="text-xs">
                  <p className="font-medium">Confidence</p>
                  <p className="text-muted-foreground">{failure.probability}%</p>
                </div>
              </div>
            </div>

            {/* Affected Systems */}
            <div className="mt-3 border-t border-border pt-3">
              <p className="mb-2 text-xs font-medium">Affected Systems:</p>
              <div className="flex flex-wrap gap-1">
                {failure.affectedSystems.map((system, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {system}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Recommended Action */}
            <div className="mt-3 rounded bg-primary/10 p-2">
              <p className="text-xs font-medium text-primary">Recommended Action:</p>
              <p className="mt-1 text-xs text-primary/80">{failure.recommendedAction}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
