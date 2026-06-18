"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowUpDown, Search, Download, Wrench, ExternalLink } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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

export function FleetTable() {
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [locationFilter, setLocationFilter] = useState<string>("All Locations")
  const [sortKey, setSortKey] = useState<SortKey>("healthScore")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    let rows = machines.filter((m) => {
      const matchesQuery =
        m.id.toLowerCase().includes(query.toLowerCase()) ||
        m.name.toLowerCase().includes(query.toLowerCase())
      const matchesStatus = statusFilter === "all" || m.status === statusFilter
      const matchesLocation = locationFilter === "All Locations" || m.location === locationFilter
      return matchesQuery && matchesStatus && matchesLocation
    })
    rows = [...rows].sort((a, b) => {
      const va = a[sortKey]
      const vb = b[sortKey]
      const cmp = typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb))
      return sortDir === "asc" ? cmp : -cmp
    })
    return rows
  }, [query, statusFilter, locationFilter, sortKey, sortDir])

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
            <Select value={locationFilter} onValueChange={(v) => setLocationFilter(v as string)}>
              <SelectTrigger className="w-[180px]">{locationFilter}</SelectTrigger>
              <SelectContent>
                {locations.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
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
                <TableHead>Location</TableHead>
                <SortHeader label="Temp °C" k="temperature" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                <SortHeader label="Vib mm/s" k="vibration" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                <SortHeader label="Runtime" k="runtimeHours" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                <SortHeader label="Current A" k="currentDraw" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                <SortHeader label="Health" k="healthScore" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                <TableHead>Failure Risk</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((m) => (
                <TableRow key={m.id} data-selected={selected.has(m.id)} className="data-[selected=true]:bg-primary/5">
                  <TableCell>
                    <Checkbox
                      checked={selected.has(m.id)}
                      onCheckedChange={() => toggleRow(m.id)}
                      aria-label={`Select ${m.id}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{m.name}</span>
                      <span className="font-mono text-xs text-muted-foreground">{m.id} · {m.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{m.location}</TableCell>
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
                    <HealthBar value={m.healthScore} />
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
