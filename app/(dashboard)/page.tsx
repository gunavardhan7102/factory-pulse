"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Cpu, ShieldCheck, AlertTriangle, ClipboardList, CalendarClock, Gauge, Zap, Activity, CheckCircle2, TrendingUp, TrendingDown } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { kpis, kpiTrends, machines } from "@/lib/data"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const atRisk = machines
    .filter((m) => m.status !== "healthy")
    .sort((a, b) => {
      // Sort by criticality first, then by remaining useful life
      const criticalityOrder: Record<string, number> = { "Critical": 0, "High": 1, "Medium": 2, "Low": 3 }
      const aCrit = (a.criticality && criticalityOrder[a.criticality]) ?? 4
      const bCrit = (b.criticality && criticalityOrder[b.criticality]) ?? 4
      if (aCrit !== bCrit) return aCrit - bCrit
      return a.remainingUsefulLife - b.remainingUsefulLife
    })
    .slice(0, 5)

  const criticalAssets = machines.filter((m) => m.criticality === "Critical" && m.status !== "healthy")
  const highRiskAssets = machines.filter((m) => m.criticality === "High" && m.status !== "healthy")

  return (
    <ProtectedRoute allowedRoles={["admin", "manager"]}>
      <>
      <PageHeader
        title="Executive Dashboard"
        description="Real-time equipment health and GMP-compliant predictive maintenance overview"
      />
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-6">
          <KpiCard label="Total Equipment" value={kpis.totalMachines} icon={Cpu} accent="primary" hint="Across 3 plants" />
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
          <KpiCard label="Work Orders" value={kpis.activeWorkOrders} icon={ClipboardList} accent="primary" hint={`${kpis.overdueWorkOrders} overdue`} />
          <KpiCard
            label="Overdue WOs"
            value={kpis.overdueWorkOrders}
            icon={AlertTriangle}
            accent="destructive"
          />
          <KpiCard
            label="Failures Prevented"
            value={kpis.predictedFailuresPrevented}
            icon={CheckCircle2}
            accent="success"
            hint="Last 30 days"
          />
        </section>

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          <KpiCard
            label="Avg EHI"
            value={`${kpis.avgEHI}%`}
            icon={Gauge}
            accent="primary"
            trend={{ value: kpiTrends.avgEHI.trend === "up" ? "+2%" : "-1%", positive: kpiTrends.avgEHI.trend === "up" }}
          />
          <KpiCard
            label="Avg MTBF"
            value={`${kpis.avgMTBF}h`}
            icon={Zap}
            accent="primary"
            trend={{ value: kpiTrends.avgMTBF.trend === "up" ? "+100h" : "-50h", positive: kpiTrends.avgMTBF.trend === "up" }}
          />
          <KpiCard
            label="Avg MTTR"
            value={`${kpis.avgMTTR}h`}
            icon={Activity}
            accent="warning"
            trend={{ value: kpiTrends.avgMTTR.trend === "up" ? "+0.5h" : "-0.5h", positive: kpiTrends.avgMTTR.trend === "down" }}
          />
          <KpiCard
            label="Availability"
            value={`${kpis.avgAvailability}%`}
            icon={CheckCircle2}
            accent="success"
            trend={{ value: kpiTrends.avgAvailability.trend === "up" ? "+0.5%" : "-0.5%", positive: kpiTrends.avgAvailability.trend === "up" }}
          />
          <KpiCard
            label="Predicted Failures"
            value={kpis.predictedFailures30d}
            icon={CalendarClock}
            accent="destructive"
            hint="Next 30 days"
          />
          <KpiCard
            label="Health Score"
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

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Critical Assets Alert */}
          {criticalAssets.length > 0 && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-base text-destructive">Critical Assets Requiring Immediate Attention</CardTitle>
                <CardDescription>{criticalAssets.length} critical equipment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {criticalAssets.slice(0, 3).map((m) => (
                  <Link
                    key={m.id}
                    href={`/machines/${m.id}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-2 transition-colors hover:bg-destructive/10"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-destructive/20 text-destructive">{m.remainingUsefulLife}d</Badge>
                      <StatusBadge status={m.status} />
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {/* High Risk Assets */}
          {highRiskAssets.length > 0 && (
            <Card className="border-warning/50 bg-warning/5">
              <CardHeader>
                <CardTitle className="text-base text-warning">High Risk Equipment</CardTitle>
                <CardDescription>{highRiskAssets.length} high-criticality equipment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {highRiskAssets.slice(0, 3).map((m) => (
                  <Link
                    key={m.id}
                    href={`/machines/${m.id}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-warning/20 bg-warning/5 p-2 transition-colors hover:bg-warning/10"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{m.remainingUsefulLife}d</Badge>
                      <StatusBadge status={m.status} />
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>All Equipment Requiring Attention</CardTitle>
              <CardDescription>Ranked by criticality and remaining useful life</CardDescription>
            </div>
            <Button render={<Link href="/machines" />} nativeButton={false} variant="outline" size="sm">
              View all
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {atRisk.map((m) => {
              const getCriticalityColor = (criticality?: string) => {
                switch (criticality) {
                  case "Critical":
                    return "bg-red-100 text-red-800"
                  case "High":
                    return "bg-orange-100 text-orange-800"
                  case "Medium":
                    return "bg-yellow-100 text-yellow-800"
                  case "Low":
                    return "bg-green-100 text-green-800"
                  default:
                    return "bg-gray-100 text-gray-800"
                }
              }

              return (
                <Link
                  key={m.id}
                  href={`/machines/${m.id}`}
                  className="flex items-center justify-between gap-4 rounded-lg border border-border p-3 transition-colors hover:bg-accent/50"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="font-mono text-xs text-muted-foreground">{m.id}</span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{m.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{m.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {m.criticality && (
                      <Badge className={cn("text-xs whitespace-nowrap", getCriticalityColor(m.criticality))}>
                        {m.criticality}
                      </Badge>
                    )}
                    <div className="hidden text-right sm:block">
                      <p className="text-sm font-semibold text-foreground">{m.healthScore}%</p>
                      <p className="text-xs text-muted-foreground">EHI</p>
                    </div>
                    <div className="hidden text-right md:block">
                      <p className="text-sm font-semibold text-foreground">{m.remainingUsefulLife}d</p>
                      <p className="text-xs text-muted-foreground">RUL</p>
                    </div>
                    <ProbabilityBadge value={m.failureProbability} />
                    <StatusBadge status={m.status} />
                  </div>
                </Link>
              )
            })}
          </CardContent>
        </Card>
      </div>
      </>
    </ProtectedRoute>
  )
}
