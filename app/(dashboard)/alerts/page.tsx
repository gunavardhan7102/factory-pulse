"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { alerts } from "@/lib/data"
import { AlertCircle, CheckCircle2, Clock, Zap } from "lucide-react"

function AlertIcon({ severity }: { severity: string }) {
  switch (severity) {
    case "critical":
      return <AlertCircle className="size-5 text-red-600" />
    case "high":
      return <Zap className="size-5 text-orange-500" />
    case "medium":
      return <Clock className="size-5 text-yellow-500" />
    default:
      return <CheckCircle2 className="size-5 text-green-600" />
  }
}

function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    critical: "bg-red-100 text-red-800",
    high: "bg-orange-100 text-orange-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  }
  return <Badge className={colors[severity]}>{severity}</Badge>
}

export default function AlertsPage() {
  const critical = alerts.filter((a) => a.severity === "critical")
  const warning = alerts.filter((a) => a.severity === "warning")
  const read = alerts.filter((a) => a.read)

  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <div className="space-y-6">
      <PageHeader
        title="Alerts & Notifications"
        description="Real-time system alerts and predictive warnings"
      />

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{critical.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Require immediate action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">{warning.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Monitor closely</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Read</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{read.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Acknowledged</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unread</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{alerts.filter((a) => !a.read).length}</div>
            <p className="text-xs text-muted-foreground mt-1">Pending review</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">All Alerts</h2>
          <Button variant="outline" size="sm">Export</Button>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => (
            <Card key={alert.id} className={alert.severity === "critical" ? "border-red-200 bg-red-50" : ""}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <AlertIcon severity={alert.severity} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-sm">{alert.title}</h3>
                      <SeverityBadge severity={alert.severity} />
                      {!alert.read && (
                        <Badge className="bg-blue-100 text-blue-800">New</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Machine: {alert.machine}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span>{alert.time}</span>
                      <div className="flex gap-1">
                        {alert.channels.map((ch) => (
                          <Badge key={ch} variant="outline" className="text-xs">{ch}</Badge>
                        ))}
                      </div>
                      {!alert.read && (
                        <Button variant="ghost" size="sm" className="text-primary">Mark read</Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      </div>
    </ProtectedRoute>
  )
}
