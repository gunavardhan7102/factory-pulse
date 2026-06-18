"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Package, AlertCircle, CheckCircle, Truck, XCircle, Plus, Trash2 } from "lucide-react"
import type { WorkOrder, PartRequest } from "@/lib/data"

function getPartsStatusColor(status: WorkOrder["partsStatus"]) {
  switch (status) {
    case "Pending":
      return "bg-gray-100 text-gray-700"
    case "Ready":
      return "bg-blue-100 text-blue-700"
    case "Issued":
      return "bg-green-100 text-green-700"
    case "Additional Needed":
      return "bg-orange-100 text-orange-700"
  }
}

function getPartsStatusIcon(status: WorkOrder["partsStatus"]) {
  switch (status) {
    case "Pending":
      return <AlertCircle className="size-3" />
    case "Ready":
      return <CheckCircle className="size-3" />
    case "Issued":
      return <Truck className="size-3" />
    case "Additional Needed":
      return <XCircle className="size-3" />
  }
}

export function PartsStatusBadge({ partsStatus }: { partsStatus: WorkOrder["partsStatus"] }) {
  return (
    <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${getPartsStatusColor(partsStatus)}`}>
      {getPartsStatusIcon(partsStatus)}
      {partsStatus}
    </div>
  )
}

export function PartsStatusDialog({
  workOrderId,
  partsStatus,
  parts,
  partsRequests,
  onUpdatePartsStatus,
  onAddPartRequest,
  onAddPart,
}: {
  workOrderId: string
  partsStatus: WorkOrder["partsStatus"]
  parts: string[]
  partsRequests: PartRequest[]
  onUpdatePartsStatus: (orderId: string, status: WorkOrder["partsStatus"]) => void
  onAddPartRequest: (orderId: string, message: string) => void
  onAddPart: (orderId: string, partName: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [requestMessage, setRequestMessage] = useState("")
  const [newPartName, setNewPartName] = useState("")

  const handleStatusChange = (newStatus: WorkOrder["partsStatus"]) => {
    onUpdatePartsStatus(workOrderId, newStatus)
    setOpen(false)
  }

  const handleRequestParts = () => {
    if (requestMessage.trim()) {
      onAddPartRequest(workOrderId, requestMessage)
      setRequestMessage("")
    }
  }

  const handleAddNewPart = () => {
    if (newPartName.trim()) {
      onAddPart(workOrderId, newPartName)
      setNewPartName("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
          <Package className="size-3 mr-1" />
          Parts
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Parts - {workOrderId}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add New Part */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Add Part</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter part name..."
                value={newPartName}
                onChange={(e) => setNewPartName(e.target.value)}
                className="flex-1 px-2 py-1.5 border border-border rounded text-xs bg-background"
              />
              <Button
                onClick={handleAddNewPart}
                disabled={!newPartName.trim()}
                size="sm"
                className="h-8 px-2 text-xs"
              >
                <Plus className="size-3" />
              </Button>
            </div>
          </div>

          {/* Parts List */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Required Parts</h3>
            <div className="space-y-1">
              {parts.map((part, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-foreground bg-secondary/30 p-2 rounded justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="size-3 text-muted-foreground" />
                    {part}
                  </div>
                </div>
              ))}
              {parts.length === 0 && <p className="text-xs text-muted-foreground">No parts added yet</p>}
            </div>
          </div>

          {/* Current Status */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Current Status</h3>
            <div className="flex items-center gap-2 mb-3">
              {getPartsStatusIcon(partsStatus)}
              <span className="text-sm font-medium">{partsStatus}</span>
            </div>
          </div>

          {/* Status Options */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Update Status</h3>
            <div className="space-y-2">
              {(["Pending", "Ready", "Issued"] as const).map((status) => (
                <Button
                  key={status}
                  variant={partsStatus === status ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => handleStatusChange(status)}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>

          {/* Part Requests */}
          {partsRequests.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Part Requests from Technician</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {partsRequests.map((req) => (
                  <div key={req.id} className="border border-border rounded p-2 text-xs bg-secondary/20">
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <p className="text-foreground">{req.message}</p>
                        <p className="text-muted-foreground text-[10px]">{req.timestamp}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-[10px] font-medium whitespace-nowrap ${
                        req.status === "Pending" ? "bg-amber-100 text-amber-700" :
                        req.status === "Approved" ? "bg-green-100 text-green-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {req.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Request Additional Parts */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold mb-2">Request Additional Parts</h3>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Describe additional parts needed..."
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded text-xs bg-background"
                disabled
              />
              <p className="text-xs text-muted-foreground">Technicians request parts from mobile app</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
