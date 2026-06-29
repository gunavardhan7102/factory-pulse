"use client"

import { Machine } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EHIBreakdown } from "./ehi-breakdown"
import { FailureAnalysisDisplay } from "./failure-analysis"
import { Calendar, Wrench, Zap, Wind, Droplets } from "lucide-react"

interface AssetDetailPanelProps {
  machine: Machine
}

export function AssetDetailPanel({ machine }: AssetDetailPanelProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Not available"
    return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  const getCriticalityColor = (criticality?: string) => {
    switch (criticality) {
      case "Critical":
        return "bg-red-100 text-red-800"
      case "High":
        return "bg-orange-100 text-orange-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      {/* Asset Identification */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{machine.name}</CardTitle>
              <CardDescription className="mt-1">{machine.type}</CardDescription>
            </div>
            <Badge className={getCriticalityColor(machine.criticality)}>
              {machine.criticality || "Unclassified"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Equipment ID</p>
              <p className="text-sm font-medium">{machine.id}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Serial Number</p>
              <p className="text-sm font-medium">{machine.serialNumber || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-medium">{machine.location}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Hierarchy</p>
              <p className="text-sm font-medium">
                {machine.plant && machine.line ? `${machine.plant} / ${machine.line}` : "Not assigned"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Maintenance Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="size-3" />
                Last Maintenance
              </div>
              <p className="text-sm font-medium">{formatDate(machine.lastMaintenanceDate)}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Wrench className="size-3" />
                Next Scheduled
              </div>
              <p className="text-sm font-medium">{formatDate(machine.nextScheduledMaintenance)}</p>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            <p>Installation: {formatDate(machine.installDate)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">MTBF (Mean Time Between Failures)</p>
              <p className="text-sm font-medium">{machine.mtbf?.toLocaleString() || "N/A"} hours</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">MTTR (Mean Time To Repair)</p>
              <p className="text-sm font-medium">{machine.mttr || "N/A"} hours</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Availability</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{machine.availability?.toFixed(1) || "N/A"}%</p>
                <div className="h-1.5 w-20 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500" 
                    style={{ width: `${(machine.availability || 0) * 0.01}` }}
                  />
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Runtime Hours</p>
              <p className="text-sm font-medium">{machine.runtimeHours.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Sensor Data */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Current Sensor Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Zap className="size-4 text-yellow-600" />
              <div>
                <p className="text-xs text-muted-foreground">Temperature</p>
                <p className="text-sm font-medium">{machine.temperature}°C</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Wind className="size-4 text-blue-600" />
              <div>
                <p className="text-xs text-muted-foreground">Vibration</p>
                <p className="text-sm font-medium">{machine.vibration} mm/s</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="size-4 text-orange-600" />
              <div>
                <p className="text-xs text-muted-foreground">Current Draw</p>
                <p className="text-sm font-medium">{machine.currentDraw}A</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Droplets className="size-4 text-green-600" />
              <div>
                <p className="text-xs text-muted-foreground">Remaining Useful Life</p>
                <p className="text-sm font-medium">{machine.remainingUsefulLife} days</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Equipment Health Index */}
      {machine.ehi && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Health Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <EHIBreakdown ehi={machine.ehi} />
          </CardContent>
        </Card>
      )}

      {/* Failure Analysis */}
      {machine.failureAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Failure Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <FailureAnalysisDisplay failures={machine.failureAnalysis} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
