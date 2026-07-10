"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { PageHeader } from "@/components/page-header"
import { FleetTable } from "@/components/fleet-table"

export default function MachinesPage() {
  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <>
        <PageHeader
          title="Process Asset Fleet"
          description="Monitor and manage all DFPCL process assets across Taloja, Ratnagiri, and Goa plants"
        />
        <div className="p-4 md:p-6">
          <FleetTable />
        </div>
      </>
    </ProtectedRoute>
  )
}
