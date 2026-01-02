"use client";

import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Profile {
  full_name: string;
  age: number;
  weight: number;
}

export default function DashboardHeader({
  user,
  profile,
  onLogout,
}: {
  user: User;
  profile: Profile | null;
  onLogout: () => void;
}) {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-pink-200 dark:bg-pink-900 flex items-center justify-center text-pink-600 dark:text-pink-400 font-semibold">
            {profile?.full_name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="font-semibold text-foreground">
              {profile?.full_name || "Welcome"}
            </h1>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/profile">
            <Button variant="ghost" size="sm">
              Profile
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
