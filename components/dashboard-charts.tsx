"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  healthTrend,
  failureTimeline,
  downtimeReduction,
  costSavings,
  statusDistribution,
} from "@/lib/data"

export function HealthTrendChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipment Health Score Trend</CardTitle>
        <CardDescription>Average equipment health vs. GMP target over 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            score: { label: "Health Score", color: "var(--chart-1)" },
            target: { label: "Target", color: "var(--muted-foreground)" },
          }}
          className="h-[240px] w-full"
        >
          <AreaChart data={healthTrend} margin={{ left: -12, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="fillScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-score)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-score)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis domain={[60, 100]} tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="target"
              type="monotone"
              stroke="var(--color-target)"
              strokeDasharray="4 4"
              fill="none"
              strokeWidth={1.5}
            />
            <Area
              dataKey="score"
              type="monotone"
              stroke="var(--color-score)"
              fill="url(#fillScore)"
              strokeWidth={2.5}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function FailureTimelineChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Failure Prediction Timeline</CardTitle>
        <CardDescription>Predicted vs. actual failures (6 weeks)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            predicted: { label: "Predicted", color: "var(--chart-1)" },
            actual: { label: "Actual", color: "var(--chart-2)" },
          }}
          className="h-[240px] w-full"
        >
          <BarChart data={failureTimeline} margin={{ left: -12, right: 8, top: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="predicted" fill="var(--color-predicted)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="actual" fill="var(--color-actual)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function DowntimeChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Downtime Reduction</CardTitle>
        <CardDescription>Unplanned manufacturing downtime hours per quarter</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            before: { label: "Before AI", color: "var(--muted-foreground)" },
            after: { label: "With FactoryPulse AI", color: "var(--chart-3)" },
          }}
          className="h-[240px] w-full"
        >
          <LineChart data={downtimeReduction} margin={{ left: -12, right: 8, top: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="quarter" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              dataKey="before"
              type="monotone"
              stroke="var(--color-before)"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
            <Line
              dataKey="after"
              type="monotone"
              stroke="var(--color-after)"
              strokeWidth={2.5}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function CostSavingsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance Cost Savings</CardTitle>
        <CardDescription>Cumulative savings ($K) from GMP-compliant predictive maintenance</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{ savings: { label: "Savings ($K)", color: "var(--chart-3)" } }}
          className="h-[240px] w-full"
        >
          <AreaChart data={costSavings} margin={{ left: -12, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="fillSavings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-savings)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-savings)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="savings"
              type="monotone"
              stroke="var(--color-savings)"
              fill="url(#fillSavings)"
              strokeWidth={2.5}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function StatusDistributionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipment Status Distribution</CardTitle>
        <CardDescription>Current manufacturing equipment health breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            Healthy: { label: "Healthy", color: "var(--success)" },
            Warning: { label: "Warning", color: "var(--warning)" },
            Critical: { label: "Critical", color: "var(--destructive)" },
          }}
          className="mx-auto h-[240px] w-full"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
              data={statusDistribution}
              dataKey="value"
              nameKey="name"
              innerRadius={58}
              outerRadius={88}
              paddingAngle={2}
              strokeWidth={2}
            >
              {statusDistribution.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="mt-2 flex items-center justify-center gap-4">
          {statusDistribution.map((s) => (
            <div key={s.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="size-2.5 rounded-full" style={{ background: s.fill }} />
              {s.name} ({s.value})
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
