"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import {
  Plus,
  Edit2,
  Trash2,
  Mail,
  User,
  Shield,
} from "lucide-react"

interface UserItem {
  id: string
  name: string
  email: string
  role: "manager" | "technician"
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([
    {
      id: "1",
      name: "Sarah Manager",
      email: "manager@factory.com",
      role: "manager",
    },
    {
      id: "2",
      name: "John Technician",
      email: "technician@factory.com",
      role: "technician",
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "manager" as const,
  })

  const handleAdd = () => {
    setFormData({ name: "", email: "", role: "manager" })
    setEditingId(null)
    setShowForm(true)
  }

  const handleEdit = (user: UserItem) => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    })
    setEditingId(user.id)
    setShowForm(true)
  }

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      return
    }

    if (editingId) {
      setUsers(users.map(u => u.id === editingId ? { ...u, ...formData } : u))
    } else {
      setUsers([...users, { id: Date.now().toString(), ...formData }])
    }

    setShowForm(false)
    setFormData({ name: "", email: "", role: "manager" })
    setEditingId(null)
  }

  const handleDelete = (id: string) => {
    setUsers(users.filter(u => u.id !== id))
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex flex-col space-y-6">
        <PageHeader
          title="User Management"
          description="Manage managers and technicians in the system"
        />

        <div className="p-4 md:p-6 bg-background rounded-lg border border-border">
          {/* Add User Form */}
          <div className="mb-6">
            {!showForm ? (
              <Button onClick={handleAdd} className="gap-2">
                <Plus className="size-4" />
                Add New User
              </Button>
            ) : (
              <div className="space-y-4 p-4 border border-border rounded-lg bg-secondary/30">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Name</label>
                  <Input
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Email</label>
                  <Input
                    type="email"
                    placeholder="email@factory.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as "manager" | "technician" })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm"
                  >
                    <option value="manager">Manager</option>
                    <option value="technician">Technician</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                    {editingId ? "Update User" : "Create User"}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowForm(false)
                      setEditingId(null)
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Users Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Users ({users.length})</h3>
            <div className="space-y-2">
              {users.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">No users yet. Click "Add New User" to create one.</p>
              ) : (
                users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/30 transition">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <User className="size-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="size-3" />
                          {user.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-auto">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                          user.role === "manager"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}>
                          <Shield className="size-3" />
                          {user.role}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => handleEdit(user)}
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="size-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(user.id)}
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 border border-border rounded-lg bg-secondary/30">
            <p className="text-xs text-muted-foreground uppercase font-semibold">Total Users</p>
            <p className="text-2xl font-bold mt-2">{users.length}</p>
          </div>
          <div className="p-4 border border-border rounded-lg bg-secondary/30">
            <p className="text-xs text-muted-foreground uppercase font-semibold">Managers</p>
            <p className="text-2xl font-bold mt-2">{users.filter(u => u.role === "manager").length}</p>
          </div>
          <div className="p-4 border border-border rounded-lg bg-secondary/30">
            <p className="text-xs text-muted-foreground uppercase font-semibold">Technicians</p>
            <p className="text-2xl font-bold mt-2">{users.filter(u => u.role === "technician").length}</p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
