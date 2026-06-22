"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Cpu, ShieldCheck, AlertTriangle, ClipboardList, CalendarClock, Gauge } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { KpiCard } from "@/components/kpi-card"
import {
  HealthTrendChart,
  FailureTimelineChart,
  DowntimeChart,
  CostSavingsChart,
  StatusDistributionChart,
} from "@/components/dashboard-charts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge, ProbabilityBadge } from "@/components/status-badge"
import { kpis, machines } from "@/lib/data"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const atRisk = machines
    .filter((m) => m.status !== "healthy")
    .sort((a, b) => a.remainingUsefulLife - b.remainingUsefulLife)
    .slice(0, 5)

  return (
    <ProtectedRoute allowedRoles={["admin", "manager"]}>
      <>
      <PageHeader
        title="Executive Dashboard"
        description="Real-time equipment health and GMP-compliant predictive maintenance overview"
      />
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          <KpiCard label="Total Machines" value={kpis.totalMachines} icon={Cpu} accent="primary" hint="Across 3 factories" />
          <KpiCard
            label="Healthy"
            value={kpis.healthyMachines}
            icon={ShieldCheck}
            accent="success"
            trend={{ value: "+2", positive: true }}
          />
          <KpiCard
            label="At Risk"
            value={kpis.atRisk}
            icon={AlertTriangle}
            accent="warning"
            trend={{ value: "+1", positive: false }}
          />
          <KpiCard label="Active Work Orders" value={kpis.activeWorkOrders} icon={ClipboardList} accent="primary" />
          <KpiCard
            label="Predicted Failures"
            value={kpis.predictedFailures30d}
            icon={CalendarClock}
            accent="destructive"
            hint="Next 30 days"
          />
          <KpiCard
            label="Avg Health Score"
            value={`${kpis.avgHealthScore}%`}
            icon={Gauge}
            accent="primary"
            trend={{ value: "-3%", positive: false }}
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <HealthTrendChart />
          <FailureTimelineChart />
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <DowntimeChart />
          <CostSavingsChart />
          <StatusDistributionChart />
        </section>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Machines Requiring Attention</CardTitle>
              <CardDescription>Ranked by remaining useful life</CardDescription>
            </div>
            <Button render={<Link href="/machines" />} nativeButton={false} variant="outline" size="sm">
              View all
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {atRisk.map((m) => (
              <Link
                key={m.id}
                href={`/digital-twin?machine=${m.id}`}
                className="flex items-center justify-between gap-4 rounded-lg border border-border p-3 transition-colors hover:bg-accent/50"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="font-mono text-xs text-muted-foreground">{m.id}</span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{m.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{m.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden text-right sm:block">
                    <p className="text-sm font-semibold text-foreground">{m.healthScore}%</p>
                    <p className="text-xs text-muted-foreground">health</p>
                  </div>
                  <div className="hidden text-right md:block">
                    <p className="text-sm font-semibold text-foreground">{m.remainingUsefulLife}d</p>
                    <p className="text-xs text-muted-foreground">RUL</p>
                  </div>
                  <ProbabilityBadge value={m.failureProbability} />
                  <StatusBadge status={m.status} />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
      </>
    </ProtectedRoute>
  )
}
