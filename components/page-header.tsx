"use client"

import { Bell, Search, Calendar } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
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
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="size-4" />
            Last 24h
          </Button>
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
