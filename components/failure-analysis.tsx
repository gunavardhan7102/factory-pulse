import { FailureAnalysis } from "@/lib/data"
import { AlertTriangle, Clock, Wrench } from "lucide-react"

interface FailureAnalysisProps {
  failures?: FailureAnalysis[]
  compact?: boolean
}

export function FailureAnalysisDisplay({ failures, compact = false }: FailureAnalysisProps) {
  if (!failures || failures.length === 0) {
    return <div className="text-sm text-muted-foreground">No potential failure modes identified</div>
  }

  if (compact) {
    return (
      <div className="space-y-2">
        {failures.map((failure, idx) => (
          <div key={idx} className="flex items-start gap-2 p-2 rounded border border-border bg-card/50">
            <AlertTriangle className="size-4 mt-0.5 text-amber-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">{failure.mode}</p>
              <p className="text-xs text-muted-foreground">{failure.probability}% probability</p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-foreground">Potential Failure Modes</p>
        <p className="text-xs text-muted-foreground">{failures.length} mode(s) predicted based on historical data</p>
      </div>

      <div className="space-y-3">
        {failures.map((failure, idx) => (
          <div key={idx} className="border border-border rounded-lg p-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 min-w-0">
                <AlertTriangle className="size-4 mt-1 text-amber-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{failure.mode}</p>
                  <p className="text-xs text-muted-foreground">{failure.rootCause}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-lg font-bold text-amber-600">{failure.probability}%</p>
                <p className="text-xs text-muted-foreground">probability</p>
              </div>
            </div>

            {/* Affected systems */}
            {failure.affectedSystems.length > 0 && (
              <div className="text-xs space-y-1 bg-gray-50 p-2 rounded">
                <p className="font-medium text-foreground">Affected Systems:</p>
                <ul className="space-y-0.5 text-muted-foreground">
                  {failure.affectedSystems.map((system) => (
                    <li key={system} className="flex items-center gap-1">
                      <span className="text-xs">•</span> {system}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Time to failure */}
            <div className="flex items-center gap-2 text-xs">
              <Clock className="size-3 text-orange-500" />
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">{failure.timeToFailure}</span> hours to potential failure
              </span>
            </div>

            {/* Recommended action */}
            <div className="flex items-start gap-2 text-xs bg-blue-50 p-2 rounded">
              <Wrench className="size-3 mt-0.5 text-blue-600 flex-shrink-0" />
              <p className="text-blue-900">{failure.recommendedAction}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
