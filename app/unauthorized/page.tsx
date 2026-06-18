import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Lock, ArrowLeft } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="bg-destructive/10 p-4 rounded-full">
            <Lock className="size-8 text-destructive" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
          <p className="text-sm text-muted-foreground">
            You don&apos;t have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" className="flex-1">
            <Link href="/" className="flex items-center">
              <ArrowLeft className="size-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button className="flex-1">
            <Link href="/login">
              Sign In
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
