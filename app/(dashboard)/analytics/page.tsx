"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { PageHeader } from "@/components/page-header"
import { AnalyticsCharts } from "@/components/analytics-charts"

export default function AnalyticsPage() {
  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <div className="flex flex-col">
        <PageHeader
          title="Predictive Analytics"
          description="Machine-learning models forecast failures, detect anomalies, and quantify remaining useful life."
        />
        <div className="p-4 md:p-6">
          <AnalyticsCharts />
        </div>
      </div>
    </ProtectedRoute>
  )
}
