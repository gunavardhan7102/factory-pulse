"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowUpDown, Search, Download, Wrench, ExternalLink } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge, ProbabilityBadge } from "@/components/status-badge"
import { machines, type Machine, type MachineStatus } from "@/lib/data"
import { cn } from "@/lib/utils"

type SortKey = keyof Pick<
  Machine,
  "id" | "temperature" | "vibration" | "runtimeHours" | "currentDraw" | "healthScore"
>

const locations = ["All Locations", ...Array.from(new Set(machines.map((m) => m.location)))]
const plants = ["All Plants", ...Array.from(new Set(machines.map((m) => m.plant).filter(Boolean)))]
const processUnits = ["All Units", ...Array.from(new Set(machines.map((m) => m.processUnit).filter(Boolean)))]
const lines = ["All Lines", ...Array.from(new Set(machines.map((m) => m.line).filter(Boolean)))]
const operatingStatuses = ["All Status", ...Array.from(new Set(machines.map((m) => m.operationalStatus).filter(Boolean)))]

export function FleetTable() {
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [locationFilter, setLocationFilter] = useState<string>("All Locations")
  const [plantFilter, setPlantFilter] = useState<string>("All Plants")
  const [processUnitFilter, setProcessUnitFilter] = useState<string>("All Units")
  const [lineFilter, setLineFilter] = useState<string>("All Lines")
  const [operatingStatusFilter, setOperatingStatusFilter] = useState<string>("All Status")
  const [criticalityFilter, setCriticalityFilter] = useState<string>("all")
  const [sortKey, setSortKey] = useState<SortKey>("healthScore")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    let rows = machines.filter((m) => {
      const matchesQuery =
        m.id.toLowerCase().includes(query.toLowerCase()) ||
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.tagId?.toLowerCase().includes(query.toLowerCase())
      const matchesStatus = statusFilter === "all" || m.status === statusFilter
      const matchesLocation = locationFilter === "All Locations" || m.location === locationFilter
      const matchesPlant = plantFilter === "All Plants" || m.plant === plantFilter
      const matchesProcessUnit = processUnitFilter === "All Units" || m.processUnit === processUnitFilter
      const matchesLine = lineFilter === "All Lines" || m.line === lineFilter
      const matchesOperatingStatus = operatingStatusFilter === "All Status" || m.operationalStatus === operatingStatusFilter
      const matchesCriticality = criticalityFilter === "all" || m.criticality === criticalityFilter
      return matchesQuery && matchesStatus && matchesLocation && matchesPlant && matchesProcessUnit && matchesLine && matchesOperatingStatus && matchesCriticality
    })
    rows = [...rows].sort((a, b) => {
      const va = a[sortKey]
      const vb = b[sortKey]
      const cmp = typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb))
      return sortDir === "asc" ? cmp : -cmp
    })
    return rows
  }, [query, statusFilter, locationFilter, plantFilter, processUnitFilter, lineFilter, operatingStatusFilter, criticalityFilter, sortKey, sortDir])

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  function toggleAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map((m) => m.id)))
    }
  }

  function toggleRow(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const statusOptions: { value: string; label: string }[] = [
    { value: "all", label: "All Statuses" },
    { value: "healthy", label: "Healthy" },
    { value: "warning", label: "Warning" },
    { value: "critical", label: "Critical" },
  ]

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xs">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by ID or name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as string)}>
              <SelectTrigger className="w-[150px]">
                {statusOptions.find((s) => s.value === statusFilter)?.label}
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={plantFilter} onValueChange={(v) => setPlantFilter(v as string)}>
              <SelectTrigger className="w-[140px]">{plantFilter}</SelectTrigger>
              <SelectContent>
                {plants.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={processUnitFilter} onValueChange={(v) => setProcessUnitFilter(v as string)}>
              <SelectTrigger className="w-[140px]">{processUnitFilter}</SelectTrigger>
              <SelectContent>
                {processUnits.map((u) => (
                  <SelectItem key={u} value={u}>
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={operatingStatusFilter} onValueChange={(v) => setOperatingStatusFilter(v as string)}>
              <SelectTrigger className="w-[140px]">{operatingStatusFilter}</SelectTrigger>
              <SelectContent>
                {operatingStatuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={criticalityFilter} onValueChange={(v) => setCriticalityFilter(v as string)}>
              <SelectTrigger className="w-[140px]">
                {criticalityFilter === "all" ? "All Criticality" : criticalityFilter}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Criticality</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="size-4" />
              Export
            </Button>
          </div>
        </div>

        {selected.size > 0 ? (
          <div className="mt-3 flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
            <span className="text-sm font-medium text-foreground">
              {selected.size} machine{selected.size > 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Wrench className="size-3.5" />
                Create Work Order
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>
                Clear
              </Button>
            </div>
          </div>
        ) : null}
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-10">
                  <Checkbox
                    checked={filtered.length > 0 && selected.size === filtered.length}
                    onCheckedChange={toggleAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <SortHeader label="Machine" k="id" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                <TableHead>Plant</TableHead>
                <TableHead>Process Unit</TableHead>
                <TableHead>Tag ID</TableHead>
                <TableHead>Operating</TableHead>
                <SortHeader label="Temp °C" k="temperature" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                <SortHeader label="Vib mm/s" k="vibration" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                <SortHeader label="Runtime" k="runtimeHours" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                <SortHeader label="Current A" k="currentDraw" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                <TableHead>EHI</TableHead>
                <TableHead>Criticality</TableHead>
                <TableHead>Failure Probability</TableHead>
                <TableHead>Current Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((m) => (
                <TableRow 
                  key={m.id} 
                  data-selected={selected.has(m.id)} 
                  className="data-[selected=true]:bg-primary/5 cursor-pointer transition-colors hover:bg-muted/50"
                  onClick={() => {
                    if (!selected.has(m.id)) {
                      window.location.href = `/machines/${m.id}`
                    }
                  }}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selected.has(m.id)}
                      onCheckedChange={() => toggleRow(m.id)}
                      aria-label={`Select ${m.id}`}
                    />
                  </TableCell>
                  <TableCell className="cursor-pointer">
                    <Link href={`/machines/${m.id}`} className="flex flex-col hover:underline">
                      <span className="font-medium text-foreground">{m.name}</span>
                      <span className="font-mono text-xs text-muted-foreground">{m.id} · {m.type}</span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-foreground">{m.plant || "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{m.processUnit || "—"}</TableCell>
                  <TableCell className="font-mono text-xs font-medium text-foreground">{m.tagId || "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {m.operationalStatus || "—"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={cn(m.temperature >= 85 ? "font-medium text-destructive" : "text-foreground")}>
                      {m.temperature}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={cn(m.vibration >= 5 ? "font-medium text-destructive" : "text-foreground")}>
                      {m.vibration}
                    </span>
                  </TableCell>
                  <TableCell className="tabular-nums text-foreground">{m.runtimeHours.toLocaleString()}</TableCell>
                  <TableCell className="tabular-nums text-foreground">{m.currentDraw}</TableCell>
                  <TableCell>
                    {m.ehi ? (
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-10 overflow-hidden rounded-full bg-muted">
                          <div 
                            className={cn("h-full rounded-full", m.ehi.score >= 80 ? "bg-success" : m.ehi.score >= 60 ? "bg-warning" : "bg-destructive")} 
                            style={{ width: `${m.ehi.score}%` }} 
                          />
                        </div>
                        <span className="text-xs font-medium">{m.ehi.score}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {m.criticality ? (
                      <Badge className={cn(
                        m.criticality === "Critical" ? "bg-red-100 text-red-800" :
                        m.criticality === "High" ? "bg-orange-100 text-orange-800" :
                        m.criticality === "Medium" ? "bg-yellow-100 text-yellow-800" :
                        "bg-green-100 text-green-800"
                      )}>
                        {m.criticality}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <ProbabilityBadge value={m.failureProbability} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={m.status} />
                  </TableCell>
                  <TableCell>
                    <Button
                      render={<Link href={`/digital-twin?machine=${m.id}`} />}
                      nativeButton={false}
                      variant="ghost"
                      size="icon-sm"
                    >
                      <ExternalLink className="size-4" />
                      <span className="sr-only">Open digital twin</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">No machines match your filters.</div>
        ) : null}
      </Card>
      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} of {machines.length} machines
      </p>
    </div>
  )
}

function HealthBar({ value }: { value: number }) {
  const color = value >= 85 ? "bg-success" : value >= 65 ? "bg-warning" : "bg-destructive"
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-14 overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full rounded-full", color)} style={{ width: `${value}%` }} />
      </div>
      <span className="text-sm font-medium tabular-nums text-foreground">{value}%</span>
    </div>
  )
}

function SortHeader({
  label,
  k,
  sortKey,
  sortDir,
  onSort,
}: {
  label: string
  k: SortKey
  sortKey: SortKey
  sortDir: "asc" | "desc"
  onSort: (k: SortKey) => void
}) {
  return (
    <TableHead>
      <button
        onClick={() => onSort(k)}
        className="inline-flex items-center gap-1 text-left font-medium transition-colors hover:text-foreground"
      >
        {label}
        <ArrowUpDown className={cn("size-3", sortKey === k ? "text-primary" : "text-muted-foreground/50")} />
      </button>
    </TableHead>
  )
}
