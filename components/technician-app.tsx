"use client"

import { useState } from "react"
import { workOrders as initialOrders, type WorkOrder } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Battery,
  ChevronLeft,
  MapPin,
  Clock,
  Wrench,
  Signal,
  Wifi,
  Play,
  Flag,
  Package,
  Plus,
  AlertCircle,
  CheckCircle,
  Truck,
} from "lucide-react"

const CURRENT_TECHNICIAN = "J. Okafor"

function priorityStyles(priority: WorkOrder["priority"]) {
  switch (priority) {
    case "Critical":
      return "border-destructive/20 bg-destructive/10 text-destructive"
    case "High":
      return "border-warning/20 bg-warning/10 text-warning"
    case "Medium":
      return "border-primary/20 bg-primary/10 text-primary"
    default:
      return "border-border bg-secondary text-muted-foreground"
  }
}

function stageStyles(stage: WorkOrder["stage"]) {
  switch (stage) {
    case "Assigned":
      return "bg-amber-50 text-amber-700 border-amber-200"
    case "In Progress":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "Review":
      return "bg-purple-50 text-purple-700 border-purple-200"
    case "Completed":
      return "bg-green-50 text-green-700 border-green-200"
    default:
      return "bg-secondary text-muted-foreground"
  }
}

export function TechnicianApp() {
  const [orders, setOrders] = useState<WorkOrder[]>(initialOrders)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [partRequestDialog, setPartRequestDialog] = useState(false)
  const [partRequestMessage, setPartRequestMessage] = useState("")

  // Filter assigned work orders for current technician
  const assignedOrders = orders.filter(
    (o) => o.technician === CURRENT_TECHNICIAN && o.stage !== "Completed"
  )
  const selected = orders.find((o) => o.id === selectedId) ?? null
  const subTasks = selected?.subTasks || []
  const completedSubTasks = subTasks.filter((t) => t.completed)
  const allSubtasksCompleted = subTasks.length > 0 && completedSubTasks.length === subTasks.length

  function handleToggleSubTask(subTaskId: string) {
    if (!selectedId) return
    setOrders((prev) =>
      prev.map((o) =>
        o.id === selectedId
          ? {
              ...o,
              subTasks: o.subTasks.map((st) =>
                st.id === subTaskId ? { ...st, completed: !st.completed } : st
              ),
            }
          : o
      )
    )
  }

  function handleSubmitPartRequest() {
    if (!selectedId || !partRequestMessage.trim()) return
    setOrders((prev) =>
      prev.map((o) =>
        o.id === selectedId
          ? {
              ...o,
              partsStatus: "Additional Needed",
              partsRequests: [
                ...o.partsRequests,
                {
                  id: `PR-${Date.now()}`,
                  timestamp: new Date().toLocaleString(),
                  message: partRequestMessage,
                  status: "Pending",
                },
              ],
            }
          : o
      )
    )
    setPartRequestMessage("")
    setPartRequestDialog(false)
  }

  function handleInitiateTask(orderId: string) {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, stage: "In Progress", startedAt: new Date().toLocaleString() } : o
      )
    )
  }

  function handleCompleteTask(orderId: string) {
    if (!allSubtasksCompleted) return
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, stage: "Review", reviewedAt: new Date().toLocaleString() } : o
      )
    )
  }

  function handleAcceptAssignment(orderId: string) {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, technicianAccepted: true, acceptedAt: new Date().toLocaleString() }
          : o
      )
    )
  }

  return (
    <div className="mx-auto w-full max-w-[380px]">
      {/* Phone frame */}
      <div className="overflow-hidden rounded-[2.5rem] border-8 border-foreground bg-background shadow-2xl">
        {/* Status bar */}
        <div className="flex items-center justify-between bg-foreground px-6 py-2 text-xs font-medium text-background">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <Signal className="size-3.5" />
            <Wifi className="size-3.5" />
            <Battery className="size-3.5" />
          </div>
        </div>

        {/* App content */}
        <div className="flex h-[620px] flex-col">
          {!selected ? (
            <>
              <div className="border-b border-border bg-card px-4 py-4">
                <p className="text-xs text-muted-foreground">Welcome back,</p>
                <h2 className="text-lg font-semibold text-foreground">{CURRENT_TECHNICIAN}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {assignedOrders.length} job{assignedOrders.length !== 1 ? "s" : ""} assigned
                </p>
              </div>
              <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
                {assignedOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CheckCircle className="size-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No assigned tasks</p>
                  </div>
                ) : (
                  assignedOrders.map((order) => (
                    <button
                      key={order.id}
                      onClick={() => setSelectedId(order.id)}
                      className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3 text-left transition-colors hover:border-primary/40"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-muted-foreground">{order.id}</span>
                        <Badge variant="outline" className={priorityStyles(order.priority)}>
                          {order.priority}
                        </Badge>
                      </div>
                      <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                        <Wrench className="size-3.5 text-primary" />
                        {order.machineName}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge className={`border ${stageStyles(order.stage)}`}>
                          {order.stage}
                        </Badge>
                      </div>
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="size-3" />
                        Due {order.due}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 border-b border-border bg-card px-3 py-3">
                <Button variant="ghost" size="icon" className="size-8" onClick={() => setSelectedId(null)}>
                  <ChevronLeft className="size-5" />
                </Button>
                <div>
                  <p className="text-sm font-semibold text-foreground">{selected.title}</p>
                  <p className="font-mono text-xs text-muted-foreground">{selected.id}</p>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
                <div className="rounded-xl border border-border bg-secondary/40 p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Wrench className="size-4 text-primary" />
                    <span className="text-xs font-medium text-foreground">{selected.machineName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Due: {selected.due}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={priorityStyles(selected.priority)}>
                      {selected.priority} Priority
                    </Badge>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold text-foreground">Work Order Status</h3>
                  <div className={`rounded-lg border p-3 ${stageStyles(selected.stage)}`}>
                    <p className="text-xs font-medium">{selected.stage}</p>
                    {selected.stage === "Assigned" && !selected.technicianAccepted && (
                      <p className="text-xs mt-1">Awaiting your acceptance...</p>
                    )}
                    {selected.stage === "In Progress" && (
                      <p className="text-xs mt-1">Started: {selected.startedAt}</p>
                    )}
                    {selected.stage === "Review" && (
                      <p className="text-xs mt-1">Submitted for review</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-semibold text-foreground">Task Details</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{selected.title}</p>
                </div>

                {subTasks.length > 0 && selected.stage === "In Progress" && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-foreground">Sub-tasks</h3>
                      <span className="text-xs text-muted-foreground">{completedSubTasks.length}/{subTasks.length}</span>
                    </div>
                    <div className="space-y-2 bg-secondary/30 rounded-lg p-3">
                      {subTasks.map((subtask) => (
                        <div key={subtask.id} className="flex items-center gap-2">
                          <Checkbox
                            checked={subtask.completed}
                            onCheckedChange={() => handleToggleSubTask(subtask.id)}
                            className="size-4"
                          />
                          <label className="text-xs text-foreground cursor-pointer flex-1">
                            {subtask.title}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selected.parts.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-foreground">Required Parts</h3>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {selected.parts.map((part) => (
                          <Badge key={part} variant="secondary" className="text-xs font-normal">
                            {part}
                          </Badge>
                        ))}
                      </div>

                      {/* Parts Status */}
                      <div className="border-t pt-3">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-xs text-muted-foreground">Parts Status:</span>
                          <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                            selected.partsStatus === "Pending" ? "bg-gray-100 text-gray-700" :
                            selected.partsStatus === "Ready" ? "bg-blue-100 text-blue-700" :
                            selected.partsStatus === "Issued" ? "bg-green-100 text-green-700" :
                            "bg-orange-100 text-orange-700"
                          }`}>
                            {selected.partsStatus === "Pending" && <AlertCircle className="size-3" />}
                            {selected.partsStatus === "Ready" && <CheckCircle className="size-3" />}
                            {selected.partsStatus === "Issued" && <Truck className="size-3" />}
                            {selected.partsStatus === "Additional Needed" && <AlertCircle className="size-3" />}
                            {selected.partsStatus}
                          </div>
                        </div>

                        {/* Request Additional Parts */}
                        {selected.stage === "In Progress" && (
                          <Dialog open={partRequestDialog} onOpenChange={setPartRequestDialog}>
                            <DialogTrigger>
                              <Button variant="outline" size="sm" className="w-full h-7 text-xs mt-2">
                                <Plus className="size-3 mr-1" />
                                Request Additional Parts
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-sm">
                              <DialogHeader>
                                <DialogTitle>Request Additional Parts</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-3">
                                <div>
                                  <label className="text-xs font-medium text-foreground">What parts do you need?</label>
                                  <Input
                                    placeholder="Describe the parts needed..."
                                    value={partRequestMessage}
                                    onChange={(e) => setPartRequestMessage(e.target.value)}
                                    className="mt-2 text-xs"
                                  />
                                </div>
                                <Button
                                  onClick={handleSubmitPartRequest}
                                  disabled={!partRequestMessage.trim()}
                                  className="w-full h-8 text-xs"
                                >
                                  Submit Request
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}

                        {/* Part Requests History */}
                        {selected.partsRequests.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-xs font-medium text-foreground mb-2">Request History</p>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                              {selected.partsRequests.map((req) => (
                                <div key={req.id} className="bg-secondary/50 rounded p-2 text-xs">
                                  <div className="flex items-start justify-between gap-2">
                                    <span className="text-foreground">{req.message}</span>
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap ${
                                      req.status === "Pending" ? "bg-amber-100 text-amber-700" :
                                      req.status === "Approved" ? "bg-green-100 text-green-700" :
                                      "bg-blue-100 text-blue-700"
                                    }`}>
                                      {req.status}
                                    </span>
                                  </div>
                                  <p className="text-muted-foreground text-[10px] mt-1">{req.timestamp}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-border bg-card p-3 space-y-2">
                {selected.stage === "Assigned" && !selected.technicianAccepted && (
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="sm"
                    onClick={() => handleAcceptAssignment(selected.id)}
                  >
                    <CheckCircle className="size-4 mr-2" />
                    Accept Task
                  </Button>
                )}
                {selected.stage === "Assigned" && selected.technicianAccepted && (
                  <Button
                    className="w-full"
                    size="sm"
                    onClick={() => handleInitiateTask(selected.id)}
                  >
                    <Play className="size-4 mr-2" />
                    Initiate Task
                  </Button>
                )}
                {selected.stage === "In Progress" && (
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    size="sm"
                    onClick={() => handleCompleteTask(selected.id)}
                    disabled={!allSubtasksCompleted}
                  >
                    <Flag className="size-4 mr-2" />
                    Complete Task {completedSubTasks.length > 0 && `(${completedSubTasks.length}/${subTasks.length})`}
                  </Button>
                )}
                {selected.stage === "Review" && (
                  <div className="text-xs text-purple-700 bg-purple-50 border border-purple-200 rounded px-3 py-2 text-center">
                    Task submitted for review
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
