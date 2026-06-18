"use client"

import { createContext, useContext, useState, useEffect } from "react"

export type UserRole = "admin" | "manager" | "technician"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<User>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error("Failed to parse stored user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Simulate API call with hardcoded credentials
    const credentials: Record<string, { password: string; name: string; role: UserRole }> = {
      "admin@factory.com": {
        password: "admin123",
        name: "Alex Admin",
        role: "admin",
      },
      "manager@factory.com": {
        password: "manager123",
        name: "Sarah Manager",
        role: "manager",
      },
      "technician@factory.com": {
        password: "technician123",
        name: "John Technician",
        role: "technician",
      },
    }

    const credential = credentials[email]
    if (!credential || credential.password !== password) {
      throw new Error("Invalid email or password")
    }

    const newUser: User = {
      id: Math.random().toString(),
      email,
      name: credential.name,
      role: credential.role,
    }

    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
    return newUser
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
