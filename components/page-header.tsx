"use client"

import { Bell, Search, Calendar, ChevronDown } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
  timeFilter?: "24h" | "7d" | "30d" | "90d"
  onTimeFilterChange?: (filter: "24h" | "7d" | "30d" | "90d") => void
  showTimeFilter?: boolean
}

export function PageHeader({ title, description, actions, timeFilter = "24h", onTimeFilterChange, showTimeFilter = false }: PageHeaderProps) {
  const timeFilterLabels = {
    "24h": "Last 24h",
    "7d": "Last 7 days",
    "30d": "Last 30 days",
    "90d": "Last 90 days",
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex items-center gap-3 px-4 py-3 md:px-6">
        <SidebarTrigger className="text-muted-foreground" />
        <Separator orientation="vertical" className="h-6" />
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-semibold text-foreground md:text-lg">{title}</h1>
          {description ? (
            <p className="hidden truncate text-xs text-muted-foreground sm:block">{description}</p>
          ) : null}
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search Process Assets..." className="h-9 w-56 pl-8" />
          </div>
          {showTimeFilter && onTimeFilterChange ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Calendar className="size-4" />
                  {timeFilterLabels[timeFilter]}
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onTimeFilterChange("24h")} className={timeFilter === "24h" ? "bg-accent" : ""}>
                  Last 24 hours
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onTimeFilterChange("7d")} className={timeFilter === "7d" ? "bg-accent" : ""}>
                  Last 7 days
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onTimeFilterChange("30d")} className={timeFilter === "30d" ? "bg-accent" : ""}>
                  Last 30 days
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onTimeFilterChange("90d")} className={timeFilter === "90d" ? "bg-accent" : ""}>
                  Last 90 days
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="size-4" />
              Last 24h
            </Button>
          )}
        </div>
        <Button variant="outline" size="icon" className="relative size-9 shrink-0">
          <Bell className="size-4" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive" />
          <span className="sr-only">Notifications</span>
        </Button>
        {actions}
      </div>
    </header>
  )
}
