"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import DashboardHeader from "@/components/dashboard-header"
import DashboardSidebar from "@/components/dashboard-sidebar"
import { ArrowLeft, LogOut } from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface Profile {
  id: string
  full_name: string
  age: number
  weight: number
}

export default function ProfileClient({
  user,
  profile,
}: {
  user: User
  profile: Profile | null
}) {
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || "",
    age: profile?.age?.toString() || "",
    weight: profile?.weight?.toString() || "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const supabase = createClient()
      const { error: dbError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          full_name: formData.fullName,
          age: Number.parseInt(formData.age),
          weight: Number.parseFloat(formData.weight),
        })
        .eq("id", user.id)

      if (dbError) throw dbError

      setSuccess("Profile updated successfully!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <DashboardHeader user={user} profile={profile} onLogout={handleLogout} />

      <div className="flex">
        <DashboardSidebar />

        <main className="flex-1">
          <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-8">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
            </div>

            <div className="grid gap-6">
              {/* User Email Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">Email Address</Label>
                    <p className="text-lg font-semibold mt-1">{user.email}</p>
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">Account Created</Label>
                    <p className="text-lg font-semibold mt-1">
                      {new Date(user.created_at || "").toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Update Profile */}
              <Card>
                <CardHeader>
                  <CardTitle>Health Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          name="age"
                          type="number"
                          value={formData.age}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                          id="weight"
                          name="weight"
                          type="number"
                          step="0.1"
                          value={formData.weight}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}
                    {success && <p className="text-sm text-green-500">{success}</p>}

                    <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Logout */}
              <Card className="border-red-200 dark:border-red-900/50">
                <CardHeader>
                  <CardTitle className="text-red-600 dark:text-red-400">Logout</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Click the button below to logout from your account.
                  </p>
                  <Button onClick={handleLogout} variant="destructive" className="w-full">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
