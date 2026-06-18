"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { PageHeader } from "@/components/page-header"
import { FleetTable } from "@/components/fleet-table"

export default function MachinesPage() {
  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <>
        <PageHeader
          title="Machine Fleet"
          description="Monitor and manage all connected industrial machines"
        />
        <div className="p-4 md:p-6">
          <FleetTable />
        </div>
      </>
    </ProtectedRoute>
  )
}
