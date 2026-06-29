"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingDown, TrendingUp, Minus, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

interface AiExplanationItem {
  factor: string
  change: number
  status: "up" | "down" | "stable"
  description?: string
}

interface AiExplanationProps {
  factors: AiExplanationItem[]
  recommendation?: string
  confidence?: number
  compact?: boolean
}

export function AiExplanation({ factors, recommendation, confidence = 85, compact = false }: AiExplanationProps) {
  const getTrendIcon = (status: string) => {
    if (status === "up") return <TrendingUp className="size-4 text-destructive" />
    if (status === "down") return <TrendingDown className="size-4 text-success" />
    return <Minus className="size-4 text-muted-foreground" />
  }

  const getStatusColor = (status: string) => {
    if (status === "up") return "text-destructive"
    if (status === "down") return "text-success"
    return "text-muted-foreground"
  }

  if (compact) {
    return (
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground">Key Factors Contributing to Health Prediction:</p>
        <div className="space-y-1">
          {factors.slice(0, 3).map((factor, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              {getTrendIcon(factor.status)}
              <span className={cn("flex-1", getStatusColor(factor.status))}>
                {factor.factor} {factor.change > 0 ? "+" : ""}{factor.change}%
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">AI Analysis & Prediction</CardTitle>
        <CardDescription>Factors contributing to the failure prediction (Confidence: {confidence}%)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Confidence Score */}
        <div className="space-y-2 rounded-lg bg-primary/10 p-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Prediction Confidence</p>
            <Badge className="bg-primary/20 text-primary">{confidence}%</Badge>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-primary/20">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${confidence}%` }} />
          </div>
        </div>

        {/* Contributing Factors */}
        <div className="space-y-3">
          <p className="text-sm font-medium">Contributing Factors</p>
          {factors.map((factor, idx) => (
            <div key={idx} className="flex items-start gap-3 rounded-lg border border-border p-3">
              <div className="mt-0.5">{getTrendIcon(factor.status)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{factor.factor}</span>
                  <Badge variant="outline" className={cn("text-xs", getStatusColor(factor.status))}>
                    {factor.change > 0 ? "+" : ""}{factor.change}%
                  </Badge>
                </div>
                {factor.description && <p className="mt-1 text-xs text-muted-foreground">{factor.description}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Recommendation */}
        {recommendation && (
          <div className="space-y-2 rounded-lg bg-warning/10 p-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="size-4 text-warning" />
              <p className="font-medium text-sm">Recommendation</p>
            </div>
            <p className="text-sm text-warning/90">{recommendation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
