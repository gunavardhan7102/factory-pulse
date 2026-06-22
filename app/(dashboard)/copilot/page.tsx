"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { PageHeader } from "@/components/page-header"
import { AICopilot } from "@/components/ai-copilot"

export default function CopilotPage() {
  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <div className="space-y-6 h-screen flex flex-col">
        <PageHeader
          title="AI Copilot"
          description="Intelligent pharmaceutical maintenance recommendations with GMP compliance and diagnostics"
        />
      <div className="flex-1 min-h-0">
        <AICopilot />
      </div>
    </div>
    </ProtectedRoute>
  )
}
