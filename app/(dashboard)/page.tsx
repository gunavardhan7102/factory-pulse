"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Cpu, ShieldCheck, AlertTriangle, ClipboardList, CalendarClock, Gauge, Zap, Activity, CheckCircle2, TrendingUp, TrendingDown } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { KpiCard } from "@/components/kpi-card"
import {
  HealthTrendChart,
  FailureTimelineChart,
  DowntimeChart,
  StatusDistributionChart,
} from "@/components/dashboard-charts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge, ProbabilityBadge } from "@/components/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { kpis, kpiTrends, machines } from "@/lib/data"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const [timeFilter, setTimeFilter] = useState<"24h" | "7d" | "30d" | "90d">("24h")
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

  const criticalAssets = machines.filter((m) => m.criticality === "Critical" && m.status === "critical")
  const highRiskAssets = machines.filter((m) => m.criticality === "High" && m.status === "warning")

  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <>
      <PageHeader
        title="DFPCL Operations Dashboard"
        description="Real-time process asset health and predictive maintenance overview for fertilizer production"
      />
      <div className="border-b border-border">
        <div className="flex gap-2 p-4 md:p-6">
          <Button
            variant={timeFilter === "24h" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeFilter("24h")}
          >
            Last 24h
          </Button>
          <Button
            variant={timeFilter === "7d" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeFilter("7d")}
          >
            Last 7 days
          </Button>
          <Button
            variant={timeFilter === "30d" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeFilter("30d")}
          >
            Last 30 days
          </Button>
          <Button
            variant={timeFilter === "90d" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeFilter("90d")}
          >
            Last 90 days
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-6">
          <KpiCard label="Total Process Assets" value={kpis.totalMachines} icon={Cpu} accent="primary" hint="Across 3 plants" />
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
          <KpiCard label="Work Orders" value={kpis.activeWorkOrders} icon={ClipboardList} accent="primary" />
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

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-4">
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
            label="Predicted Failures"
            value={kpis.predictedFailures30d}
            icon={CalendarClock}
            accent="destructive"
            hint="Next 30 days"
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <HealthTrendChart />
          <FailureTimelineChart />
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <DowntimeChart />
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
              <CardTitle>Equipment Requiring Attention</CardTitle>
              <CardDescription>Top {atRisk.length} equipment by priority</CardDescription>
            </div>
            <Button render={<Link href="/machines" />} nativeButton={false} variant="outline" size="sm">
              View all
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2 text-left font-medium">Equipment</th>
                    <th className="py-2 text-left font-medium">Location</th>
                    <th className="py-2 text-center font-medium">Priority</th>
                    <th className="py-2 text-center font-medium">EHI</th>
                    <th className="py-2 text-center font-medium">RUL</th>
                    <th className="py-2 text-center font-medium">Failure Risk</th>
                    <th className="py-2 text-center font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {atRisk.map((m, index) => (
                    <tr
                      key={m.id}
                      className="border-b border-border/50 transition-colors hover:bg-muted/50"
                    >
                      <td className="py-3">
                        <Link
                          href={`/machines/${m.id}`}
                          className="flex flex-col hover:underline"
                        >
                          <span className="font-medium text-foreground">{m.name}</span>
                          <span className="font-mono text-xs text-muted-foreground">{m.id}</span>
                        </Link>
                      </td>
                      <td className="py-3 text-sm text-muted-foreground">{m.location}</td>
                      <td className="py-3 text-center">
                        <Badge variant="outline" className="text-xs font-medium">
                          P{index + 1}
                        </Badge>
                      </td>
                      <td className="py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
                            <div
                              className={cn(
                                "h-full rounded-full",
                                m.healthScore >= 80
                                  ? "bg-green-500"
                                  : m.healthScore >= 60
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              )}
                              style={{ width: `${m.healthScore}%` }}
                            />
                          </div>
                          <span className="font-medium">{m.healthScore}%</span>
                        </div>
                      </td>
                      <td className="py-3 text-center">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs font-medium",
                            m.remainingUsefulLife <= 10
                              ? "bg-red-100 text-red-800 border-red-300"
                              : m.remainingUsefulLife <= 30
                                ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                : "bg-green-100 text-green-800 border-green-300"
                          )}
                        >
                          {m.remainingUsefulLife}d
                        </Badge>
                      </td>
                      <td className="py-3 text-center">
                        <ProbabilityBadge value={m.failureProbability} />
                      </td>
                      <td className="py-3 text-center">
                        <StatusBadge status={m.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
      </>
    </ProtectedRoute>
  )
}
