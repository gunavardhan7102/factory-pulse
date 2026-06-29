"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, Minus } from "lucide-react"
import { HealthExplanation } from "@/lib/data"
import { cn } from "@/lib/utils"

interface HealthExplanationProps {
  explanation: HealthExplanation
  compact?: boolean
}

export function HealthExplanationComponent({ explanation, compact = false }: HealthExplanationProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "up":
      case "poor":
      case "negative":
        return "text-destructive"
      case "down":
      case "good":
      case "positive":
        return "text-success"
      case "stable":
      case "fair":
      case "neutral":
        return "text-warning"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    if (status === "up") return <ArrowUp className="size-3" />
    if (status === "down") return <ArrowDown className="size-3" />
    return <Minus className="size-3" />
  }

  if (compact) {
    return (
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Last Updated: {explanation.lastUpdated}</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {Object.entries(explanation.contributors).map(([key, data]) => (
            <div
              key={key}
              className="flex items-center justify-between rounded bg-secondary/50 px-2 py-1"
            >
              <span className="text-xs capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
              <div className={cn("flex items-center gap-1", getStatusColor(data.status as string))}>
                <span className="text-xs font-medium">{data.value}%</span>
                {getStatusIcon(data.status as string)}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Health Breakdown</CardTitle>
        <CardDescription>Last Updated: {explanation.lastUpdated}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {/* Temperature */}
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium">Temperature</p>
              <p className="text-xs text-muted-foreground">Current: {explanation.contributors.temperature.value}°C</p>
            </div>
            <div className={cn("flex flex-col items-center gap-1", getStatusColor(explanation.contributors.temperature.status))}>
              <span className="text-xs font-semibold">
                {explanation.contributors.temperature.change > 0 ? "+" : ""}
                {explanation.contributors.temperature.change}°C
              </span>
              {getStatusIcon(explanation.contributors.temperature.status)}
            </div>
          </div>

          {/* Vibration */}
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium">Vibration</p>
              <p className="text-xs text-muted-foreground">Current: {explanation.contributors.vibration.value} mm/s</p>
            </div>
            <div className={cn("flex flex-col items-center gap-1", getStatusColor(explanation.contributors.vibration.status))}>
              <span className="text-xs font-semibold">
                {explanation.contributors.vibration.change > 0 ? "+" : ""}
                {explanation.contributors.vibration.change}%
              </span>
              {getStatusIcon(explanation.contributors.vibration.status)}
            </div>
          </div>

          {/* Current Draw */}
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium">Current Draw</p>
              <p className="text-xs text-muted-foreground">Current: {explanation.contributors.current.value}A</p>
            </div>
            <div className={cn("flex flex-col items-center gap-1", getStatusColor(explanation.contributors.current.status))}>
              <span className="text-xs font-semibold">
                {explanation.contributors.current.change > 0 ? "+" : ""}
                {explanation.contributors.current.change}%
              </span>
              {getStatusIcon(explanation.contributors.current.status)}
            </div>
          </div>

          {/* Maintenance History */}
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium">Maintenance History</p>
              <p className="text-xs text-muted-foreground">Status: {explanation.contributors.maintenanceHistory.status}</p>
            </div>
            <div className={cn("flex items-center gap-1", getStatusColor(explanation.contributors.maintenanceHistory.status))}>
              <span className="text-xs font-semibold">{explanation.contributors.maintenanceHistory.value}%</span>
            </div>
          </div>

          {/* AI Prediction */}
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium">AI Prediction</p>
              <p className="text-xs text-muted-foreground">Confidence: {explanation.contributors.aiPrediction.status}</p>
            </div>
            <div className={cn("flex items-center gap-1", getStatusColor(explanation.contributors.aiPrediction.status))}>
              <span className="text-xs font-semibold">{explanation.contributors.aiPrediction.value}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
