"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts"
import { anomalyData, forecastData, machines } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Brain, Gauge, TrendingDown } from "lucide-react"

const scatterData = machines.map((m) => ({
  vibration: m.vibration,
  temperature: m.temperature,
  health: m.healthScore,
  name: m.name,
  status: m.status,
}))

function pointColor(status: string) {
  if (status === "critical") return "var(--color-destructive)"
  if (status === "warning") return "var(--color-warning)"
  return "var(--color-success)"
}

export function AnalyticsCharts() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* RUL Forecast */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingDown className="size-4 text-primary" />
            <CardTitle>Remaining Useful Life Forecast</CardTitle>
          </div>
          <CardDescription>
            AI-projected health degradation for Extruder Motor H4 over the next 30 days. Maintenance window
            recommended before health drops below 30%.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              actual: { label: "Observed Health", color: "var(--chart-1)" },
              forecast: { label: "Forecast Health", color: "var(--chart-5)" },
            }}
            className="h-[280px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData} margin={{ left: 0, right: 12, top: 8 }}>
                <defs>
                  <linearGradient id="fcast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-destructive)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--color-destructive)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={[0, 100]} unit="%" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ReferenceLine
                  y={30}
                  stroke="var(--color-destructive)"
                  strokeDasharray="4 4"
                  label={{ value: "Failure threshold", position: "insideTopRight", fontSize: 11, fill: "var(--color-destructive)" }}
                />
                <Area
                  type="monotone"
                  dataKey="forecast"
                  stroke="var(--color-destructive)"
                  fill="url(#fcast)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="var(--color-chart-1)"
                  fill="none"
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Anomaly detection */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-warning" />
            <CardTitle>Anomaly Detection</CardTitle>
          </div>
          <CardDescription>Vibration signal with ML-flagged anomalies (mm/s)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{ value: { label: "Vibration", color: "var(--chart-1)" } }}
            className="h-[240px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={anomalyData} margin={{ left: 0, right: 12, top: 8 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-chart-1)"
                  strokeWidth={2}
                  dot={(props) => {
                    const { cx, cy, payload, index } = props
                    const isAnomaly = payload.anomaly
                    return (
                      <circle
                        key={index}
                        cx={cx}
                        cy={cy}
                        r={isAnomaly ? 6 : 3}
                        fill={isAnomaly ? "var(--color-destructive)" : "var(--color-chart-1)"}
                        stroke="var(--color-card)"
                        strokeWidth={2}
                      />
                    )
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Failure mode scatter */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Gauge className="size-4 text-primary" />
            <CardTitle>Fleet Risk Distribution</CardTitle>
          </div>
          <CardDescription>Temperature vs. vibration across all assets</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{ temperature: { label: "Temp", color: "var(--chart-1)" } }}
            className="h-[240px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ left: 0, right: 12, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="vibration"
                  name="Vibration"
                  unit=" mm/s"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  type="number"
                  dataKey="temperature"
                  name="Temp"
                  unit="°C"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ZAxis type="number" dataKey="health" range={[60, 400]} />
                <ChartTooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    const d = payload[0].payload
                    return (
                      <div className="rounded-lg border border-border bg-card p-2 text-xs shadow-md">
                        <p className="font-medium text-card-foreground">{d.name}</p>
                        <p className="text-muted-foreground">{d.vibration} mm/s · {d.temperature}°C</p>
                        <p className="text-muted-foreground">Health {d.health}%</p>
                      </div>
                    )
                  }}
                />
                <Scatter data={scatterData}>
                  {scatterData.map((entry, i) => (
                    <Cell key={i} fill={pointColor(entry.status)} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Model performance */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="size-4 text-primary" />
            <CardTitle>Model Performance</CardTitle>
          </div>
          <CardDescription>Predictive engine accuracy metrics across the deployed fleet</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Prediction Accuracy", value: "94.2%", note: "+2.1% vs last month" },
            { label: "Mean Time to Detect", value: "6.4 hrs", note: "Before failure event" },
            { label: "False Positive Rate", value: "3.8%", note: "Within target band" },
            { label: "Models Deployed", value: "12", note: "1 per asset class" },
          ].map((m) => (
            <div key={m.label} className="rounded-lg border border-border bg-secondary/40 p-4">
              <p className="text-2xl font-semibold text-foreground">{m.value}</p>
              <p className="mt-1 text-sm font-medium text-foreground">{m.label}</p>
              <Badge variant="secondary" className="mt-2 text-xs font-normal text-muted-foreground">
                {m.note}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
