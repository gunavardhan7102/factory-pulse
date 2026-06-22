"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import {
  Settings as SettingsIcon,
  Database,
  Lock,
  Bell,
} from "lucide-react"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    systemName: "PharmaPulse AI",
    maintenanceMode: false,
    backupFrequency: "daily",
    alertEmail: "admin@pharma.com",
  })

  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex flex-col space-y-6">
        <PageHeader
          title="System Settings"
          description="Configure global system settings and preferences"
        />

        <div className="space-y-6">
          {/* System Information */}
          <div className="p-6 border border-border rounded-lg bg-background">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <SettingsIcon className="size-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold">System Information</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">System Name</label>
                <Input
                  value={settings.systemName}
                  onChange={(e) => setSettings({ ...settings, systemName: e.target.value })}
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Alert Email</label>
                <Input
                  type="email"
                  value={settings.alertEmail}
                  onChange={(e) => setSettings({ ...settings, alertEmail: e.target.value })}
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          {/* Maintenance & Backup */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 border border-border rounded-lg bg-background">
              <div className="flex items-center gap-3 mb-6">
                <div className="size-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Database className="size-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold">Backup Settings</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Backup Frequency</label>
                  <select
                    value={settings.backupFrequency}
                    onChange={(e) => setSettings({ ...settings, backupFrequency: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <p className="text-xs text-muted-foreground">Last backup: 2 hours ago</p>
              </div>
            </div>

            <div className="p-6 border border-border rounded-lg bg-background">
              <div className="flex items-center gap-3 mb-6">
                <div className="size-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <Lock className="size-5 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold">Maintenance Mode</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <span className="text-sm font-medium">Enable Maintenance Mode</span>
                  <button
                    onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      settings.maintenanceMode ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        settings.maintenanceMode ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {settings.maintenanceMode
                    ? "System is in maintenance mode - users cannot login"
                    : "System is running normally"}
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-3">
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              Save Settings
            </Button>
            {saved && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                <Bell className="size-4" />
                Settings saved successfully
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
