"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { PageHeader } from "@/components/page-header"
import { DigitalTwin } from "@/components/digital-twin"

export default function DigitalTwinPage() {
  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <div className="flex flex-col">
        <PageHeader
          title="Equipment Digital Twin"
          description="A live virtual replica of each pharmaceutical asset, synchronized with real-time sensor telemetry for GMP monitoring."
        />
      <div className="p-4 md:p-6">
        <DigitalTwin />
      </div>
    </div>
    </ProtectedRoute>
  )
}
