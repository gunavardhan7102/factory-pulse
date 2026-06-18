"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { workOrders as initialOrders, technicians, type WorkOrder } from "@/lib/data"
import { SubTasksDialog } from "@/components/sub-tasks-dialog"
import { PartsStatusBadge, PartsStatusDialog } from "@/components/parts-status-dialog"
import { Clock, Wrench, Plus, Edit, Trash2, User, CheckCircle, AlertCircle, XCircle, Play, Flag, Package } from "lucide-react"

const stages: WorkOrder["stage"][] = ["Pending", "Assigned", "In Progress", "Review", "Completed"]

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

function initials(name: string) {
  return name
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
}

function AssignTechnicianDialog({
  order,
  onAssign,
}: {
  order: WorkOrder
  onAssign: (orderId: string, technicianName: string, assignedAt: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [selectedTech, setSelectedTech] = useState("")

  function handleAssign() {
    if (!selectedTech) return
    const now = new Date().toLocaleString()
    onAssign(order.id, selectedTech, now)
    setSelectedTech("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
          <User className="size-3 mr-1" />
          Assign
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Technician</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-3">Select a technician for: {order.title}</p>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {technicians.map((tech) => (
              <div
                key={tech.id}
                onClick={() => setSelectedTech(tech.name)}
                className={`p-3 rounded-lg border-2 cursor-pointer transition ${
                  selectedTech === tech.name
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-muted-foreground"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{tech.name}</p>
                    <p className="text-xs text-muted-foreground">{tech.email}</p>
                  </div>
                  <Badge variant={tech.status === "available" ? "default" : "secondary"}>
                    {tech.status} ({tech.assignedJobs} jobs)
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={!selectedTech} className="flex-1">
              Assign Task
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function EditWorkOrderDialog({
  order,
  onUpdate,
}: {
  order: WorkOrder
  onUpdate: (updatedOrder: WorkOrder) => void
}) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(order.title)
  const [machine, setMachine] = useState(order.machineName)
  const [priority, setPriority] = useState<WorkOrder["priority"]>(order.priority)

  function handleSave() {
    if (!title.trim() || !machine.trim()) return

    const updatedOrder: WorkOrder = {
      ...order,
      title,
      machineName: machine,
      priority,
    }

    onUpdate(updatedOrder)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="Edit work order">
          <Edit className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Work Order</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Work Order Title</Label>
            <Input id="edit-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-machine">Machine Name</Label>
            <Input id="edit-machine" value={machine} onChange={(e) => setMachine(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-priority">Priority</Label>
            <select
              id="edit-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as WorkOrder["priority"])}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!title.trim() || !machine.trim()} className="flex-1">
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function NewWorkOrderDialog({ onAdd }: { onAdd: (order: WorkOrder) => void }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [machine, setMachine] = useState("")
  const [priority, setPriority] = useState<WorkOrder["priority"]>("Medium")

  function handleCreate() {
    if (!title.trim() || !machine.trim()) return

    const newOrder: WorkOrder = {
      id: `WO-${Math.floor(Math.random() * 10000)}`,
      machineId: `M-${Math.floor(Math.random() * 1000)}`,
      machineName: machine,
      title,
      priority,
      stage: "Pending",
      technician: null,
      technicianAccepted: false,
      assignedAt: null,
      acceptedAt: null,
      startedAt: null,
      reviewedAt: null,
      completedAt: null,
      parts: [],
      partsStatus: "Pending",
      partsRequests: [],
      subTasks: [],
      created: new Date().toISOString().split("T")[0],
      due: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    }

    onAdd(newOrder)
    setTitle("")
    setMachine("")
    setPriority("Medium")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button size="sm">
          <Plus className="size-4" />
          New work order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Work Order</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Work Order Title</Label>
            <Input
              id="title"
              placeholder="e.g., Bearing replacement"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="machine">Machine Name</Label>
            <Input
              id="machine"
              placeholder="e.g., Extruder Motor H4"
              value={machine}
              onChange={(e) => setMachine(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as WorkOrder["priority"])}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!title.trim() || !machine.trim()} className="flex-1">
              Create Work Order
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function MaintenanceBoard() {
  const [orders, setOrders] = useState<WorkOrder[]>(initialOrders)
  const [dragId, setDragId] = useState<string | null>(null)

  function onDrop(stage: WorkOrder["stage"]) {
    if (!dragId) return
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === dragId) {
          const updated = { ...o, stage }
          if (stage === "In Progress" && o.stage === "Assigned") {
            updated.stage = "In Progress"
          } else if (stage === "Completed" && o.stage === "In Progress") {
            updated.completedAt = new Date().toLocaleString()
          }
          return updated
        }
        return o
      })
    )
    setDragId(null)
  }

  function handleAddWorkOrder(newOrder: WorkOrder) {
    setOrders((prev) => [newOrder, ...prev])
  }

  function handleUpdateWorkOrder(updatedOrder: WorkOrder) {
    setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)))
  }

  function handleDeleteWorkOrder(id: string) {
    setOrders((prev) => prev.filter((o) => o.id !== id))
  }

  function handleAssignTechnician(orderId: string, technicianName: string, assignedAt: string) {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, technician: technicianName, stage: "Assigned", assignedAt, technicianAccepted: false }
          : o
      )
    )
  }

  function handleAcceptTask(orderId: string) {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, technicianAccepted: true, acceptedAt: new Date().toLocaleString() } : o
      )
    )
  }

  function handleUnassignTechnician(orderId: string) {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              technician: null,
              stage: "Pending",
              technicianAccepted: false,
              assignedAt: null,
              acceptedAt: null,
              startedAt: null,
            }
          : o
      )
    )
  }

  function handleInitiateTask(orderId: string) {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, stage: "In Progress", startedAt: new Date().toLocaleString() } : o
      )
    )
  }

  function handleCompleteTask(orderId: string) {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, stage: "Review", reviewedAt: new Date().toLocaleString() } : o
      )
    )
  }

  function handleApproveCompletion(orderId: string) {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, stage: "Completed", completedAt: new Date().toLocaleString() } : o
      )
    )
  }

  function handleUpdateSubTasks(orderId: string, subTasks: any[]) {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, subTasks } : o))
    )
  }

  function handleUpdatePartsStatus(orderId: string, partsStatus: WorkOrder["partsStatus"]) {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, partsStatus } : o))
    )
  }

  function handleAddPartRequest(orderId: string, message: string) {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              partsStatus: "Additional Needed",
              partsRequests: [
                ...o.partsRequests,
                {
                  id: `PR-${Date.now()}`,
                  timestamp: new Date().toLocaleString(),
                  message,
                  status: "Pending",
                },
              ],
            }
          : o
      )
    )
  }

  function handleAddPart(orderId: string, partName: string) {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, parts: [...o.parts, partName] } : o))
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <NewWorkOrderDialog onAdd={handleAddWorkOrder} />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {stages.map((stage) => {
          const items = orders.filter((o) => o.stage === stage)
          return (
            <div
              key={stage}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(stage)}
              className="flex flex-col gap-3 rounded-lg border border-border bg-secondary/30 p-3"
            >
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-semibold text-foreground">{stage}</h3>
                <Badge variant="secondary" className="text-xs">
                  {items.length}
                </Badge>
              </div>
              <div className="flex flex-col gap-3">
                {items.map((o) => (
                  <Card
                    key={o.id}
                    draggable
                    onDragStart={() => setDragId(o.id)}
                    className="cursor-grab gap-2 p-3 active:cursor-grabbing"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{o.id}</span>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className={priorityStyles(o.priority)}>
                          {o.priority}
                        </Badge>
                        <EditWorkOrderDialog order={o} onUpdate={handleUpdateWorkOrder} />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hover:text-destructive"
                          onClick={() => handleDeleteWorkOrder(o.id)}
                          title="Delete work order"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm font-medium leading-snug text-foreground text-pretty">{o.title}</p>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Wrench className="size-3" />
                        {o.machineName}
                      </div>
                      <PartsStatusBadge partsStatus={o.partsStatus} />
                    </div>
                    <div className="pt-2">
                      <div className="flex gap-1.5">
                        <SubTasksDialog workOrderId={o.id} subTasks={o.subTasks} onUpdateSubTasks={handleUpdateSubTasks} />
                        <PartsStatusDialog
                          workOrderId={o.id}
                          partsStatus={o.partsStatus}
                          parts={o.parts}
                          partsRequests={o.partsRequests}
                          onUpdatePartsStatus={handleUpdatePartsStatus}
                          onAddPartRequest={handleAddPartRequest}
                          onAddPart={handleAddPart}
                        />
                      </div>
                    </div>

                    {/* Assignment & Workflow Status */}
                    {o.stage === "Pending" && !o.technician && (
                      <div className="pt-2">
                        <AssignTechnicianDialog order={o} onAssign={handleAssignTechnician} />
                      </div>
                    )}

                    {o.stage === "Assigned" && o.technician && (
                      <div className="space-y-2 pt-2 border-t border-border">
                        <div className="flex items-center gap-2 justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="size-6">
                              <AvatarFallback className="bg-primary/10 text-[10px] font-medium text-primary">
                                {initials(o.technician)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-foreground">{o.technician}</p>
                              <p className="text-xs text-muted-foreground">Assigned {o.assignedAt}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:text-destructive"
                            onClick={() => handleUnassignTechnician(o.id)}
                            title="Unassign technician"
                          >
                            <XCircle className="size-3" />
                          </Button>
                        </div>
                        {!o.technicianAccepted && (
                          <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-2 py-1 flex items-center gap-1">
                            <AlertCircle className="size-3" />
                            Awaiting acceptance
                          </div>
                        )}
                        {o.technicianAccepted && (
                          <div className="text-xs text-green-600 bg-green-50 border border-green-200 rounded px-2 py-1 flex items-center gap-1">
                            <CheckCircle className="size-3" />
                            Accepted {o.acceptedAt}
                          </div>
                        )}
                      </div>
                    )}

                    {o.stage === "In Progress" && o.technician && (
                      <div className="space-y-2 pt-2 border-t border-border">
                        <div className="flex items-center gap-2">
                          <Avatar className="size-6">
                            <AvatarFallback className="bg-primary/10 text-[10px] font-medium text-primary">
                              {initials(o.technician)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-foreground">{o.technician}</p>
                            <p className="text-xs text-muted-foreground">Working since {o.startedAt}</p>
                          </div>
                        </div>
                        <p className="text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded px-2 py-1">
                          🔧 In Progress
                        </p>
                      </div>
                    )}

                    {o.stage === "Review" && o.technician && (
                      <div className="space-y-2 pt-2 border-t border-border bg-amber-50/30 rounded p-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="size-6">
                            <AvatarFallback className="bg-amber-100 text-[10px] font-medium text-amber-700">
                              {initials(o.technician)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-foreground">{o.technician}</p>
                            <p className="text-xs text-muted-foreground">Submitted {o.reviewedAt}</p>
                          </div>
                        </div>
                        <p className="text-xs text-amber-600 font-medium bg-amber-100 rounded px-2 py-1">
                          ⏳ Pending Review
                        </p>
                      </div>
                    )}

                    {o.stage === "Completed" && o.technician && (
                      <div className="space-y-2 pt-2 border-t border-border bg-green-50/30 rounded p-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="size-6">
                            <AvatarFallback className="bg-green-100 text-[10px] font-medium text-green-700">
                              {initials(o.technician)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-foreground">{o.technician}</p>
                            <p className="text-xs text-muted-foreground">Completed {o.completedAt}</p>
                          </div>
                        </div>
                        <p className="text-xs text-green-600 font-medium">✓ Task Completed</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="size-3" />
                        Due {o.due.slice(5)}
                      </div>
                    </div>
                  </Card>
                ))}
                {items.length === 0 && (
                  <p className="px-1 py-6 text-center text-xs text-muted-foreground">Drop work orders here</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
