"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, LogIn } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const user = await login(email, password)
      // Redirect based on user role
      if (user?.role === "technician") {
        router.push("/technician")
      } else {
        router.push("/")
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">
      {/* Left Panel - Credentials Info */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 text-white">
        <div>
          <h1 className="text-4xl font-bold mb-3">FactoryPulse AI</h1>
          <p className="text-xl text-slate-300 font-light">Predictive Maintenance System</p>
          <p className="text-slate-400 mt-4 leading-relaxed max-w-md">
            Intelligent maintenance management platform for industrial equipment. Real-time monitoring, predictive analytics, and work order management.
          </p>
        </div>

        <div className="space-y-6">
          {/* Admin Credentials */}
          <div className="border-l-2 border-red-500 pl-6 space-y-2">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-red-500 flex items-center justify-center text-sm font-bold">👨‍💼</div>
              <p className="font-semibold text-lg">Admin</p>
            </div>
            <p className="text-slate-300 text-sm">Email: <span className="text-red-400 font-mono">admin@factory.com</span></p>
            <p className="text-slate-300 text-sm">Password: <span className="text-red-400 font-mono">admin123</span></p>
            <p className="text-slate-500 text-xs">User Management, System Settings, Full Access</p>
          </div>

          {/* Manager Credentials */}
          <div className="border-l-2 border-blue-500 pl-6 space-y-2">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">👔</div>
              <p className="font-semibold text-lg">Manager</p>
            </div>
            <p className="text-slate-300 text-sm">Email: <span className="text-blue-400 font-mono">manager@factory.com</span></p>
            <p className="text-slate-300 text-sm">Password: <span className="text-blue-400 font-mono">manager123</span></p>
            <p className="text-slate-500 text-xs">Dashboard, Maintenance Command Center, Parts Management</p>
          </div>

          {/* Technician Credentials */}
          <div className="border-l-2 border-green-500 pl-6 space-y-2">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-green-500 flex items-center justify-center text-sm font-bold">🔧</div>
              <p className="font-semibold text-lg">Technician</p>
            </div>
            <p className="text-slate-300 text-sm">Email: <span className="text-green-400 font-mono">technician@factory.com</span></p>
            <p className="text-slate-300 text-sm">Password: <span className="text-green-400 font-mono">technician123</span></p>
            <p className="text-slate-500 text-xs">Mobile Workspace, Task Management, Parts Requests</p>
          </div>
        </div>

        <p className="text-slate-500 text-xs">© 2026 FactoryPulse AI. All rights reserved.</p>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex flex-col items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Header */}
          <div className="lg:hidden text-center space-y-2 mb-8">
            <h1 className="text-3xl font-bold text-foreground">FactoryPulse AI</h1>
            <p className="text-sm text-muted-foreground">Predictive Maintenance System</p>
          </div>

          {/* Login Card */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Welcome Back</h2>
              <p className="text-muted-foreground text-sm mt-1">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Message */}
              {error && (
                <div className="flex gap-3 items-start bg-red-50 border border-red-200 rounded-lg p-4">
                  <AlertCircle className="size-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Email Address</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="h-11 text-base border-2 border-border focus:border-blue-500 focus:ring-0"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Password</label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="h-11 text-base border-2 border-border focus:border-blue-500 focus:ring-0"
                />
              </div>

              {/* Sign In Button */}
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full h-11 text-base font-semibold mt-6 bg-blue-600 hover:bg-blue-700"
              >
                <LogIn className="size-4 mr-2" />
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Mobile Credentials Info */}
            <div className="lg:hidden space-y-4 pt-6 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Test Credentials</p>
              
              <div className="space-y-3 text-xs">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="font-semibold text-red-900">Admin</p>
                  <p className="text-red-800">admin@factory.com / admin123</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="font-semibold text-blue-900">Manager</p>
                  <p className="text-blue-800">manager@factory.com / manager123</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="font-semibold text-green-900">Technician</p>
                  <p className="text-green-800">technician@factory.com / technician123</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
