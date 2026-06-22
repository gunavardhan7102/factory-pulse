"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { connections } from "@/lib/data"
import { Activity, Cpu, Network, Radio, RefreshCw, Server, Wifi } from "lucide-react"

const protocolIcon: Record<string, typeof Radio> = {
  "OPC UA": Server,
  MQTT: Radio,
  "Cloud IoT": Wifi,
  PLC: Cpu,
}

function statusStyles(status: string) {
  switch (status) {
    case "Connected":
      return "bg-success/10 text-success border-success/20"
    case "Degraded":
      return "bg-warning/10 text-warning border-warning/20"
    default:
      return "bg-destructive/10 text-destructive border-destructive/20"
  }
}

export default function ConnectivityPage() {
  const totalMachines = connections.reduce((s, c) => s + c.machines, 0)
  const online = connections.filter((c) => c.status === "Connected").length

  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <div className="flex flex-col">
      <PageHeader
        title="Connectivity Center"
        description="Manage pharmaceutical manufacturing protocol gateways linking equipment, sensors, and cloud IoT hubs to PharmaPulse."
        actions={
          <Button variant="outline" size="sm">
            <RefreshCw className="size-4" />
            Refresh
          </Button>
        }
      />
      <div className="flex flex-col gap-4 p-4 md:p-6">
        {/* Topology overview */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Network className="size-5" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{connections.length}</p>
                <p className="text-sm text-muted-foreground">Active gateways</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-success/10 text-success">
                <Activity className="size-5" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  {online}/{connections.length}
                </p>
                <p className="text-sm text-muted-foreground">Gateways online</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Cpu className="size-5" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{totalMachines}</p>
                <p className="text-sm text-muted-foreground">Connected assets</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Topology diagram */}
        <Card>
          <CardHeader>
            <CardTitle>Network Topology</CardTitle>
            <CardDescription>Manufacturing equipment streams telemetry through gateways into the PharmaPulse cloud for regulatory compliance.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-stretch gap-4 lg:flex-row lg:items-center">
              {/* Edge */}
              <div className="flex flex-1 flex-col gap-2 rounded-lg border border-border bg-secondary/40 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Edge Layer</p>
                {connections.map((c) => {
                  const Icon = protocolIcon[c.protocol] ?? Radio
                  return (
                    <div key={c.id} className="flex items-center gap-2 rounded-md bg-card px-3 py-2 text-sm">
                      <Icon className="size-4 text-primary" />
                      <span className="text-foreground">{c.protocol}</span>
                    </div>
                  )
                })}
              </div>

              <div className="flex items-center justify-center text-muted-foreground">
                <div className="h-px w-full flex-1 bg-border lg:h-12 lg:w-px" />
              </div>

              {/* Gateway */}
              <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border-2 border-primary/30 bg-primary/5 p-6">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Server className="size-6" />
                </div>
                <p className="text-sm font-semibold text-foreground">PharmaPulse Gateway</p>
                <p className="text-xs text-muted-foreground">GMP protocol normalization · TLS 1.3</p>
              </div>

              <div className="flex items-center justify-center text-muted-foreground">
                <div className="h-px w-full flex-1 bg-border lg:h-12 lg:w-px" />
              </div>

              {/* Cloud */}
              <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-border bg-secondary/40 p-6">
                <div className="flex size-12 items-center justify-center rounded-xl bg-foreground text-background">
                  <Wifi className="size-6" />
                </div>
                <p className="text-sm font-semibold text-foreground">Cloud Analytics</p>
                <p className="text-xs text-muted-foreground">Ingest · ML inference · Storage</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connections list */}
        <Card>
          <CardHeader>
            <CardTitle>Gateway Connections</CardTitle>
            <CardDescription>Live protocol endpoints and health</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {connections.map((c) => {
              const Icon = protocolIcon[c.protocol] ?? Radio
              return (
                <div
                  key={c.id}
                  className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{c.name}</p>
                      <p className="font-mono text-xs text-muted-foreground">{c.endpoint}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{c.machines}</p>
                      <p className="text-xs text-muted-foreground">assets</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{c.latency} ms</p>
                      <p className="text-xs text-muted-foreground">latency</p>
                    </div>
                    <Badge variant="outline" className={statusStyles(c.status)}>
                      {c.status}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
    </ProtectedRoute>
  )
}
