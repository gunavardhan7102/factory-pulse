"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MaintenanceWorkflowStep } from "@/lib/data"
import { CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface MaintenanceTimelineProps {
  steps: MaintenanceWorkflowStep[]
  currentStep?: number
}

export function MaintenanceTimeline({ steps, currentStep }: MaintenanceTimelineProps) {
  const timelineStages = [
    "Failure Prediction",
    "Maintenance Alert",
    "Work Order Created",
    "Technician Assigned",
    "Technician Accepted",
    "In Progress",
    "Completed",
    "Supervisor Verified",
    "Closed",
  ]

  const getStepStatus = (stage: string) => {
    const step = steps.find((s) => s.stage === stage)
    return step?.completed || false
  }

  const getCurrentStageIndex = () => {
    return timelineStages.findIndex(
      (stage) => !getStepStatus(stage) && steps.some((s) => s.stage === stage)
    )
  }

  const currentIndex = currentStep ?? getCurrentStageIndex()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Maintenance Workflow</CardTitle>
        <CardDescription>Track the maintenance process from prediction to completion</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Visual Timeline */}
        <div className="flex gap-1 overflow-x-auto pb-4 md:gap-2">
          {timelineStages.map((stage, idx) => {
            const isCompleted = getStepStatus(stage)
            const isCurrent = idx === currentIndex
            const isPast = idx < currentIndex

            return (
              <div key={idx} className="flex flex-col items-center gap-1">
                {/* Circle */}
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full border-2 transition-all md:size-10",
                    isCompleted || isPast
                      ? "border-success bg-success/10"
                      : isCurrent
                        ? "border-primary bg-primary/10"
                        : "border-muted-foreground bg-muted/10"
                  )}
                >
                  {isCompleted || isPast ? (
                    <CheckCircle2 className="size-4 text-success md:size-5" />
                  ) : isCurrent ? (
                    <Clock className="size-4 animate-pulse text-primary md:size-5" />
                  ) : (
                    <div className="size-2 rounded-full bg-muted-foreground md:size-2.5" />
                  )}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    "text-center text-xs font-medium transition-colors md:text-sm",
                    isCompleted || isPast ? "text-success" : isCurrent ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {stage.split(" ")[0]}
                </span>

                {/* Connector Line */}
                {idx < timelineStages.length - 1 && (
                  <div
                    className={cn(
                      "h-8 w-0.5 transition-colors md:h-10",
                      isCompleted || isPast ? "bg-success" : "bg-muted-foreground/30"
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Current Stage Info */}
        {steps.length > 0 && (
          <div className="mt-4 rounded-lg border border-border bg-secondary/30 p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="size-4 text-primary" />
              <div className="text-sm">
                <p className="font-medium">Current Stage: {steps[steps.length - 1]?.stage || "Unknown"}</p>
                {steps[steps.length - 1]?.timestamp && (
                  <p className="text-xs text-muted-foreground">
                    Last updated: {new Date(steps[steps.length - 1].timestamp!).toLocaleDateString()}
                  </p>
                )}
                {steps[steps.length - 1]?.notes && (
                  <p className="mt-1 text-xs text-muted-foreground">{steps[steps.length - 1].notes}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stages List */}
        <div className="space-y-2 border-t border-border pt-4">
          <p className="text-xs font-semibold uppercase text-muted-foreground">All Stages</p>
          <div className="space-y-1">
            {timelineStages.map((stage, idx) => {
              const step = steps.find((s) => s.stage === stage)
              const isCompleted = step?.completed || false

              return (
                <div
                  key={idx}
                  className={cn("flex items-center gap-2 rounded px-2 py-1 text-xs", isCompleted ? "bg-success/10" : "")}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="size-3 text-success" />
                  ) : (
                    <div className="size-3 rounded-full border border-muted-foreground" />
                  )}
                  <span className={isCompleted ? "text-success" : "text-muted-foreground"}>{stage}</span>
                  {step?.timestamp && <span className="ml-auto text-xs text-muted-foreground">{step.timestamp}</span>}
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
