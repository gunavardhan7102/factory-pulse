"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { TechnicianProfile } from "@/lib/data"
import { Star, CheckCircle2, AlertCircle, Zap } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface TechnicianAssignmentProps {
  technicians: TechnicianProfile[]
  recommendedId?: string
  onSelect?: (technicianId: string) => void
  compact?: boolean
}

export function TechnicianAssignment({
  technicians,
  recommendedId,
  onSelect,
  compact = false,
}: TechnicianAssignmentProps) {
  const [selectedId, setSelectedId] = useState<string | null>(recommendedId || null)

  const handleSelect = (id: string) => {
    setSelectedId(id)
    onSelect?.(id)
  }

  if (compact && technicians.length > 0) {
    const selected = technicians.find((t) => t.id === selectedId) || technicians[0]
    return (
      <div className="rounded-lg border border-border bg-secondary/30 p-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold">{selected.name}</p>
            <p className="text-xs text-muted-foreground">{selected.skills.slice(0, 2).join(", ")}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn("size-3", i < Math.floor(selected.rating || 0) ? "fill-warning text-warning" : "text-muted-foreground")}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{selected.workloadPercentage}% loaded</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Assign Technician</CardTitle>
        <CardDescription>AI recommends the best match based on skills and availability</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup value={selectedId || ""} onValueChange={handleSelect}>
          {technicians.map((tech, idx) => {
            const isRecommended = tech.id === recommendedId
            const isAvailable = tech.availability === "Available"

            return (
              <div key={tech.id} className="mb-3 flex items-start gap-3 rounded-lg border border-border p-3">
                <RadioGroupItem value={tech.id} id={tech.id} className="mt-1" />
                <Label htmlFor={tech.id} className="flex-1 cursor-pointer">
                  <div className="space-y-2">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{tech.name}</span>
                        {isRecommended && (
                          <Badge className="gap-1 bg-primary/20 text-primary">
                            <Zap className="size-3" />
                            AI Recommended
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "size-3",
                              i < Math.floor(tech.rating || 0) ? "fill-warning text-warning" : "text-muted-foreground"
                            )}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1">
                      {tech.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {tech.skills.length > 3 && <Badge variant="outline" className="text-xs">+{tech.skills.length - 3}</Badge>}
                    </div>

                    {/* Status and Workload */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        {isAvailable ? (
                          <CheckCircle2 className="size-3 text-success" />
                        ) : (
                          <AlertCircle className="size-3 text-warning" />
                        )}
                        <span className={isAvailable ? "text-success" : "text-warning"}>{tech.availability}</span>
                      </div>
                      <span className="text-muted-foreground">{tech.workloadPercentage}% workload</span>
                    </div>

                    {/* Match Percentage */}
                    {tech.matchPercentage && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium">Skill Match</span>
                          <span className="font-semibold">{tech.matchPercentage}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${tech.matchPercentage}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </Label>
              </div>
            )
          })}
        </RadioGroup>

        {selectedId && (
          <div className="flex gap-2 border-t border-border pt-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setSelectedId(null)
                onSelect?.("")
              }}
            >
              Clear Selection
            </Button>
            <Button className="flex-1">Assign Selected</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
