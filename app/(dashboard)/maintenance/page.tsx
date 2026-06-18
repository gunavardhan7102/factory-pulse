"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { PageHeader } from "@/components/page-header"
import { MaintenanceBoard } from "@/components/maintenance-board"

export default function MaintenancePage() {
  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <div className="flex flex-col">
        <PageHeader
          title="Maintenance Command Center"
          description="Plan, assign, and track work orders. Drag cards between columns to update their status."
        />
      <div className="p-4 md:p-6">
        <MaintenanceBoard />
      </div>
    </div>
    </ProtectedRoute>
  )
}
