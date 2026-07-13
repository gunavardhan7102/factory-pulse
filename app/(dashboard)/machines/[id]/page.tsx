"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { machines, workOrders } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  AlertTriangle,
  Calendar,
  Clock,
  Gauge,
  MapPin,
  Package,
  Thermometer,
  Zap,
  BarChart3,
  Home,
  ChevronLeft,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { FailureModeDetails } from "@/components/failure-mode-details"
import { RootCauseAnalysisComponent } from "@/components/root-cause-analysis"
import { MaintenanceTimeline } from "@/components/maintenance-timeline"
import { HealthExplanationComponent } from "@/components/health-explanation"
import { AiExplanation } from "@/components/ai-explanation"

export default function AssetDetailPage() {
  const params = useParams()
  const machineId = params.id as string
  const machine = machines.find((m) => m.id === machineId)
  const [activeTab, setActiveTab] = useState("overview")

  if (!machine) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Equipment Not Found</h1>
          <p className="mt-2 text-muted-foreground">The equipment you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/machines">
            <Button className="mt-4" variant="outline">
              Back to Equipment Fleet
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const equipmentWorkOrders = workOrders.filter((wo) => wo.machineId === machineId)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-success/10 text-success border-success/20"
      case "warning":
        return "bg-warning/10 text-warning border-warning/20"
      case "critical":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return ""
    }
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-secondary/30">
        <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
          <Link href="/">
            <Home className="size-4" />
          </Link>
          <span>/</span>
          <Link href="/machines" className="hover:text-foreground">
            Equipment Fleet
          </Link>
          <span>/</span>
          <span>{machine.name}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6 p-4 md:p-6">
        {/* Equipment Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link href="/machines" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
              <ChevronLeft className="size-4" />
              Back to Fleet
            </Link>
            <h1 className="mt-2 text-3xl font-bold">{machine.name}</h1>
            <p className="text-muted-foreground">{machine.type}</p>
          </div>
          <div className="flex gap-2">
            <Badge className={getStatusColor(machine.status)}>
              {machine.status.charAt(0).toUpperCase() + machine.status.slice(1)}
            </Badge>
            {machine.criticality && <Badge className={getCriticalityColor(machine.criticality)}>{machine.criticality}</Badge>}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Current Status Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Operational Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{machine.operationalStatus || "Running"}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Runtime: {machine.currentRuntime || Math.floor(machine.runtimeHours / 24)}h
              </p>
            </CardContent>
          </Card>

          {/* Health Index Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Equipment Health Index</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={cn("text-2xl font-bold", machine.ehi && machine.ehi.score >= 80 ? "text-success" : machine.ehi && machine.ehi.score >= 60 ? "text-warning" : "text-destructive")}>
                {machine.ehi?.score || machine.healthScore}%
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Trend: <span className="capitalize">{machine.ehi?.trend || "stable"}</span>
              </p>
            </CardContent>
          </Card>

          {/* Failure Risk Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Failure Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{machine.failureProbability}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {machine.remainingUsefulLife}d remaining
              </p>
            </CardContent>
          </Card>

          {/* Availability Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{machine.availability || 98}%</p>
              <p className="mt-1 text-xs text-muted-foreground">
                MTBF: {machine.mtbf || "N/A"}h
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Asset Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Asset Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-sm text-muted-foreground">Asset ID</span>
                    <span className="font-mono text-sm font-medium">{machine.id}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-sm text-muted-foreground">Serial Number</span>
                    <span className="font-mono text-sm font-medium">{machine.serialNumber || "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-sm text-muted-foreground">Manufacturer</span>
                    <span className="text-sm font-medium">{machine.manufacturer || machine.type}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-sm text-muted-foreground">Model</span>
                    <span className="text-sm font-medium">{machine.model || "Standard"}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-sm text-muted-foreground">Installation Date</span>
                    <span className="text-sm font-medium">{machine.installDate || "2020-01-15"}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Location & Hierarchy */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Location & Hierarchy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3 rounded-lg bg-secondary/30 p-3">
                    <MapPin className="size-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{machine.location}</p>
                      {machine.plant && (
                        <div className="mt-2 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-xs text-muted-foreground">Plant</p>
                              <Badge variant="outline" className="text-xs mt-1">
                                {machine.plant}
                              </Badge>
                            </div>
                            {machine.processUnit && (
                              <div>
                                <p className="text-xs text-muted-foreground">Process Unit</p>
                                <Badge variant="outline" className="text-xs mt-1">
                                  {machine.processUnit}
                                </Badge>
                              </div>
                            )}
                          </div>
                          {machine.line && (
                            <div>
                              <p className="text-xs text-muted-foreground">Line</p>
                              <Badge variant="outline" className="text-xs mt-1">
                                {machine.line}
                              </Badge>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {machine.tagId && (
                    <div className="border-t border-border pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Equipment Tag ID</span>
                        <span className="font-mono text-sm font-medium text-primary">{machine.tagId}</span>
                      </div>
                    </div>
                  )}
                  {machine.operationalStatus && (
                    <div className="border-t border-border pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Operating Status</span>
                        <Badge variant="outline" className="text-xs">
                          {machine.operationalStatus}
                        </Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Current Sensor Data */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Current Sensor Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <Thermometer className="size-5 text-warning" />
                    <div>
                      <p className="text-xs text-muted-foreground">Temperature</p>
                      <p className="text-lg font-semibold">{machine.temperature}°C</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <Gauge className="size-5 text-blue-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Vibration</p>
                      <p className="text-lg font-semibold">{machine.vibration} mm/s</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <Zap className="size-5 text-orange-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Current Draw</p>
                      <p className="text-lg font-semibold">{machine.currentDraw}A</p>
                    </div>
                  </div>
                  {machine.pressure && (
                    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                      <Package className="size-5 text-purple-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Pressure</p>
                        <p className="text-lg font-semibold">{machine.pressure} kPa</p>
                      </div>
                    </div>
                  )}
                  {machine.flowRate && (
                    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                      <Gauge className="size-5 text-cyan-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Flow Rate</p>
                        <p className="text-lg font-semibold">{machine.flowRate} m³/h</p>
                      </div>
                    </div>
                  )}
                  {machine.tankLevel !== undefined && (
                    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                      <Package className="size-5 text-blue-400" />
                      <div>
                        <p className="text-xs text-muted-foreground">Tank Level</p>
                        <p className="text-lg font-semibold">{machine.tankLevel}%</p>
                      </div>
                    </div>
                  )}
                  {machine.pH !== undefined && (
                    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                      <Gauge className="size-5 text-green-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">pH</p>
                        <p className="text-lg font-semibold">{machine.pH}</p>
                      </div>
                    </div>
                  )}
                  {machine.bearingTemperature !== undefined && (
                    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                      <Thermometer className="size-5 text-red-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Bearing Temp</p>
                        <p className="text-lg font-semibold">{machine.bearingTemperature}°C</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Health Tab */}
          <TabsContent value="health" className="space-y-4">
            {machine.healthExplanation && <HealthExplanationComponent explanation={machine.healthExplanation} />}

            {machine.failureAnalysis && machine.failureAnalysis.length > 0 && (
              <FailureModeDetails failureAnalysis={machine.failureAnalysis} />
            )}

            {machine.rootCauseAnalysis && machine.rootCauseAnalysis.length > 0 && (
              <RootCauseAnalysisComponent causes={machine.rootCauseAnalysis} />
            )}

            <AiExplanation
              factors={[
                {
                  factor: "Temperature Increase",
                  change: 12,
                  status: "up",
                  description: "Temperature has increased 12% from baseline",
                },
                {
                  factor: "Vibration Pattern Anomaly",
                  change: 25,
                  status: "up",
                  description: "Bearing vibration pattern shows abnormal frequency",
                },
                {
                  factor: "Current Draw Spike",
                  change: 8,
                  status: "up",
                  description: "Sudden spike in current consumption detected",
                },
              ]}
              recommendation="Inspect bearing assembly and schedule maintenance within 48 hours"
              confidence={machine.confidence}
            />
          </TabsContent>

          {/* Maintenance Tab */}
          <TabsContent value="maintenance" className="space-y-4">
            {/* Maintenance Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Maintenance Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Last Maintenance</p>
                      <p className="font-medium">{machine.lastMaintenanceDate || "2026-05-15"}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Next Scheduled</p>
                      <p className="font-medium">{machine.nextScheduledMaintenance || "2026-08-15"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Workflow Timeline */}
            {machine.workflow && machine.workflow.length > 0 && (
              <MaintenanceTimeline steps={machine.workflow} />
            )}

            {/* Work Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Work Orders</CardTitle>
                <CardDescription>{equipmentWorkOrders.length} total work orders</CardDescription>
              </CardHeader>
              <CardContent>
                {equipmentWorkOrders.length > 0 ? (
                  <div className="space-y-2">
                    {equipmentWorkOrders.map((wo) => (
                      <div key={wo.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium">{wo.title}</p>
                          <p className="text-xs text-muted-foreground">{wo.id}</p>
                        </div>
                        <Badge variant="outline">{wo.stage}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No work orders yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg bg-secondary/30 p-4">
                    <BarChart3 className="mb-2 size-5 text-primary" />
                    <p className="text-xs text-muted-foreground">Mean Time Between Failures</p>
                    <p className="mt-1 text-2xl font-bold">{machine.mtbf || "N/A"}h</p>
                  </div>
                  <div className="rounded-lg bg-secondary/30 p-4">
                    <Clock className="mb-2 size-5 text-warning" />
                    <p className="text-xs text-muted-foreground">Mean Time To Repair</p>
                    <p className="mt-1 text-2xl font-bold">{machine.mttr || "N/A"}h</p>
                  </div>
                  <div className="rounded-lg bg-secondary/30 p-4">
                    <Gauge className="mb-2 size-5 text-success" />
                    <p className="text-xs text-muted-foreground">Equipment Availability</p>
                    <p className="mt-1 text-2xl font-bold">{machine.availability || 98}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
