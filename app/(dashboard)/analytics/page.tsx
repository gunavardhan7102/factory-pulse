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
          description="ML models forecast pharmaceutical equipment failures, detect anomalies, and ensure regulatory compliance with RUL predictions."
        />
        <div className="p-4 md:p-6">
          <AnalyticsCharts />
        </div>
      </div>
    </ProtectedRoute>
  )
}
