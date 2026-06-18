"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import {
  Thermometer,
  Activity,
  Clock,
  Zap,
  Gauge,
  CalendarClock,
  ShieldCheck,
  History,
} from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { StatusBadge } from "@/components/status-badge"
import { Progress } from "@/components/ui/progress"
import {
  machines,
  generateSensorTimeline,
  maintenanceHistory,
  type Machine,
} from "@/lib/data"
import { cn } from "@/lib/utils"

export function DigitalTwin({ initialId }: { initialId?: string }) {
  const [selectedId, setSelectedId] = useState(
    initialId && machines.some((m) => m.id === initialId) ? initialId : machines[0].id,
  )
  const machine = machines.find((m) => m.id === selectedId) as Machine
  const timeline = useMemo(() => generateSensorTimeline(), [selectedId])

  // simulate small live fluctuations
  const [live, setLive] = useState({
    temperature: machine.temperature,
    vibration: machine.vibration,
    current: machine.currentDraw,
  })
  useEffect(() => {
    setLive({ temperature: machine.temperature, vibration: machine.vibration, current: machine.currentDraw })
    const interval = setInterval(() => {
      setLive({
        temperature: Math.round((machine.temperature + (Math.random() - 0.5) * 2) * 10) / 10,
        vibration: Math.round((machine.vibration + (Math.random() - 0.5) * 0.4) * 10) / 10,
        current: Math.round((machine.currentDraw + (Math.random() - 0.5) * 2) * 10) / 10,
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [machine])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Select value={selectedId} onValueChange={(v) => setSelectedId(v as string)}>
            <SelectTrigger className="w-[260px]">
              {machine.id} — {machine.name}
            </SelectTrigger>
            <SelectContent>
              {machines.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.id} — {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <StatusBadge status={machine.status} />
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-success" />
          </span>
          Live telemetry · updated every 2s
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Twin visual */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Digital Twin — {machine.type}</CardTitle>
            <CardDescription>{machine.location}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-b from-muted/40 to-background">
              <Image
                src={machine.image}
                alt={`Digital twin of ${machine.name}`}
                width={900}
                height={500}
                className="mx-auto h-auto w-full max-w-xl object-contain"
                priority
              />
              <SensorTag className="left-[18%] top-[24%]" label="Bearing Temp" value={`${live.temperature}°C`} alert={live.temperature >= 85} />
              <SensorTag className="right-[16%] top-[34%]" label="Vibration" value={`${live.vibration} mm/s`} alert={live.vibration >= 5} />
              <SensorTag className="left-[26%] bottom-[16%]" label="Current" value={`${live.current} A`} alert={false} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <LiveMetric icon={Thermometer} label="Temperature" value={`${live.temperature}°C`} alert={live.temperature >= 85} />
              <LiveMetric icon={Activity} label="Vibration" value={`${live.vibration} mm/s`} alert={live.vibration >= 5} />
              <LiveMetric icon={Clock} label="Runtime" value={`${(machine.runtimeHours / 1000).toFixed(1)}k h`} />
              <LiveMetric icon={Zap} label="Power Draw" value={`${live.current} A`} />
            </div>
          </CardContent>
        </Card>

        {/* Health card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="size-4 text-primary" /> Health Assessment
            </CardTitle>
            <CardDescription>AI-derived condition summary</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div>
              <div className="flex items-end justify-between">
                <span className="text-sm text-muted-foreground">Health Score</span>
                <span className="text-3xl font-semibold tracking-tight text-foreground">{machine.healthScore}%</span>
              </div>
              <Progress value={machine.healthScore} className="mt-2 h-2" />
            </div>
            <HealthStat icon={Clock} label="Remaining Useful Life" value={`${machine.remainingUsefulLife} days`} />
            <HealthStat
              icon={CalendarClock}
              label="Predicted Failure Date"
              value={machine.predictedFailureDate ?? "No failure predicted"}
              danger={!!machine.predictedFailureDate && machine.remainingUsefulLife <= 30}
            />
            <HealthStat icon={ShieldCheck} label="Confidence Score" value={`${machine.confidence}%`} />
          </CardContent>
        </Card>
      </div>

      {/* Sensor timeline */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Temperature & Vibration (24h)</CardTitle>
            <CardDescription>Sensor timeline</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                temperature: { label: "Temp °C", color: "var(--chart-5)" },
                vibration: { label: "Vibration", color: "var(--chart-1)" },
              }}
              className="h-[240px] w-full"
            >
              <LineChart data={timeline} margin={{ left: -12, right: 8, top: 8 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} interval={3} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line dataKey="temperature" type="monotone" stroke="var(--color-temperature)" strokeWidth={2} dot={false} />
                <Line dataKey="vibration" type="monotone" stroke="var(--color-vibration)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Power Consumption (24h)</CardTitle>
            <CardDescription>Current draw in amperes</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ current: { label: "Current A", color: "var(--chart-2)" } }}
              className="h-[240px] w-full"
            >
              <AreaChart data={timeline} margin={{ left: -12, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="fillCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-current)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-current)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} interval={3} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area dataKey="current" type="monotone" stroke="var(--color-current)" fill="url(#fillCurrent)" strokeWidth={2.5} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance history */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="size-4 text-primary" /> Maintenance History
          </CardTitle>
          <CardDescription>Recent service records for {machine.id}</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="relative ml-3 border-l border-border">
            {maintenanceHistory.map((h, i) => (
              <li key={i} className="mb-4 ml-5 last:mb-0">
                <span className="absolute -left-1.5 flex size-3 items-center justify-center rounded-full border-2 border-background bg-primary" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-foreground">{h.action}</span>
                  <span className="text-xs text-muted-foreground">
                    {h.date} · Technician {h.tech}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}

function SensorTag({ className, label, value, alert }: { className?: string; label: string; value: string; alert: boolean }) {
  return (
    <div className={cn("absolute hidden -translate-x-1/2 sm:block", className)}>
      <div
        className={cn(
          "flex flex-col rounded-lg border bg-card/95 px-2.5 py-1.5 shadow-sm backdrop-blur",
          alert ? "border-destructive/40" : "border-border",
        )}
      >
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span>
        <span className={cn("text-sm font-semibold tabular-nums", alert ? "text-destructive" : "text-foreground")}>
          {value}
        </span>
      </div>
    </div>
  )
}

function LiveMetric({
  icon: Icon,
  label,
  value,
  alert,
}: {
  icon: typeof Thermometer
  label: string
  value: string
  alert?: boolean
}) {
  return (
    <div className="rounded-lg border border-border p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className={cn("size-3.5", alert ? "text-destructive" : "text-primary")} />
        {label}
      </div>
      <p className={cn("mt-1 text-lg font-semibold tabular-nums", alert ? "text-destructive" : "text-foreground")}>
        {value}
      </p>
    </div>
  )
}

function HealthStat({
  icon: Icon,
  label,
  value,
  danger,
}: {
  icon: typeof Clock
  label: string
  value: string
  danger?: boolean
}) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="size-4" />
        {label}
      </span>
      <span className={cn("text-sm font-semibold", danger ? "text-destructive" : "text-foreground")}>{value}</span>
    </div>
  )
}
