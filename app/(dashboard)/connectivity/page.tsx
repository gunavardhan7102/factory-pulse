"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { connections } from "@/lib/data"
import { Activity, Plus, Server, Radio, Trash2, TestTube2, CheckCircle2, AlertCircle } from "lucide-react"

const protocolIcon: Record<string, typeof Radio> = {
  "OPC UA": Server,
  MQTT: Radio,
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
  const [activeTab, setActiveTab] = useState<"opc-ua" | "mqtt">("opc-ua")
  const [testStatus, setTestStatus] = useState<string | null>(null)
  
  const opcConnections = connections.filter((c) => c.protocol === "OPC UA")
  const mqttConnections = connections.filter((c) => c.protocol === "MQTT")

  const handleTestConnection = (name: string) => {
    setTestStatus(name)
    setTimeout(() => setTestStatus(null), 2000)
  }

  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <div className="flex flex-col">
        <PageHeader
          title="Connectivity Configuration"
          description="Configure OPC UA and MQTT protocol connections for pharmaceutical manufacturing equipment"
          actions={
            <Button variant="outline" size="sm">
              <Plus className="size-4" />
              Add Connection
            </Button>
          }
        />
        
        <div className="flex flex-col gap-4 p-4 md:p-6">
          {/* Status Overview */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Activity className="size-5" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{connections.length}</p>
                  <p className="text-sm text-muted-foreground">Total connections</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-success/10 text-success">
                  <CheckCircle2 className="size-5" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">
                    {connections.filter((c) => c.status === "Connected").length}/{connections.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Active connections</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Protocol Tabs */}
          <div className="flex gap-2 border-b border-border">
            <button
              onClick={() => setActiveTab("opc-ua")}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "opc-ua"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Server className="size-4" />
              OPC UA
            </button>
            <button
              onClick={() => setActiveTab("mqtt")}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "mqtt"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Radio className="size-4" />
              MQTT
            </button>
          </div>

          {/* OPC UA Configuration */}
          {activeTab === "opc-ua" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>OPC UA Configuration</CardTitle>
                  <CardDescription>
                    Configure OPC UA (OLE for Process Control Unified Architecture) connections for industrial equipment communication
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Connection Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Plant A OPC Server"
                          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Server Endpoint
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., opc.tcp://192.168.1.100:4840"
                          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Username (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="opc-user"
                          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Password (Optional)
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Security Policy
                        </label>
                        <select className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                          <option>None</option>
                          <option>Basic128</option>
                          <option>Basic256</option>
                          <option>Basic256Sha256</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Timeout (ms)
                        </label>
                        <input
                          type="number"
                          placeholder="5000"
                          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <TestTube2 className="size-4 mr-2" />
                        Test Connection
                      </Button>
                      <Button size="sm">Save Configuration</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* OPC UA Connections List */}
              <Card>
                <CardHeader>
                  <CardTitle>Active OPC UA Connections</CardTitle>
                  <CardDescription>Manage and monitor OPC UA endpoints</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {opcConnections.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No OPC UA connections configured</p>
                  ) : (
                    opcConnections.map((c) => (
                      <div
                        key={c.id}
                        className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Server className="size-5" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{c.name}</p>
                            <p className="font-mono text-xs text-muted-foreground">{c.endpoint}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 sm:gap-6">
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
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* MQTT Configuration */}
          {activeTab === "mqtt" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>MQTT Configuration</CardTitle>
                  <CardDescription>
                    Configure MQTT (Message Queuing Telemetry Transport) broker connections for pharmaceutical IoT devices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Connection Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Plant B MQTT Broker"
                          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Broker Address
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., mqtt.pharmacloud.local"
                          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Port
                        </label>
                        <input
                          type="number"
                          placeholder="1883"
                          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Client ID
                        </label>
                        <input
                          type="text"
                          placeholder="pharma-client-001"
                          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Username
                        </label>
                        <input
                          type="text"
                          placeholder="mqtt-user"
                          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          QoS Level
                        </label>
                        <select className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                          <option>0 - At most once</option>
                          <option>1 - At least once</option>
                          <option>2 - Exactly once</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Topic Subscription
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., pharma/plant/+/telemetry"
                          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <TestTube2 className="size-4 mr-2" />
                        Test Connection
                      </Button>
                      <Button size="sm">Save Configuration</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* MQTT Connections List */}
              <Card>
                <CardHeader>
                  <CardTitle>Active MQTT Connections</CardTitle>
                  <CardDescription>Manage and monitor MQTT broker endpoints</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {mqttConnections.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No MQTT connections configured</p>
                  ) : (
                    mqttConnections.map((c) => (
                      <div
                        key={c.id}
                        className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Radio className="size-5" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{c.name}</p>
                            <p className="font-mono text-xs text-muted-foreground">{c.endpoint}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 sm:gap-6">
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
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
