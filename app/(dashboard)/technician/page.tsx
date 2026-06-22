"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { PageHeader } from "@/components/page-header"
import { TechnicianApp } from "@/components/technician-app"

export default function TechnicianPage() {
  return (
    <ProtectedRoute allowedRoles={["technician"]}>
      <div className="space-y-6">
        <PageHeader
          title="Mobile Technician Workspace"
          description="On-site GMP-compliant job management and pharma maintenance checklist execution"
        />
        <div className="flex justify-center py-8">
          <TechnicianApp />
        </div>
      </div>
    </ProtectedRoute>
  )
}
