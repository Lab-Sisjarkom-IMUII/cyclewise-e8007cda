"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardHeader from "@/components/dashboard-header";
import DashboardSidebar from "@/components/dashboard-sidebar";
import MonthlyCalendar from "@/components/monthly-calendar";
import CycleInputForm from "@/components/cycle-input-form";
import QuickStats from "@/components/quick-stats";
import { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  full_name: string;
  age: number;
  weight: number;
}

interface Cycle {
  id: string;
  user_id: string;
  start_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export default function DashboardClient({
  user,
  profile,
  cycles: initialCycles,
}: {
  user: User;
  profile: Profile | null;
  cycles: Cycle[];
}) {
  const [cycles, setCycles] = useState<Cycle[]>(initialCycles || []);
  const [showCycleForm, setShowCycleForm] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const router = useRouter();

  const handleCycleAdded = (newCycle: Cycle) => {
    setCycles([newCycle, ...cycles]);
    setShowCycleForm(false);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <DashboardHeader user={user} profile={profile} onLogout={handleLogout} />

      <div className="flex">
        <DashboardSidebar />

        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Quick Stats */}
            <QuickStats cycles={cycles} />

            {/* Main Dashboard Grid */}
            <div className="grid lg:grid-cols-3 gap-6 mt-8">
              {/* Calendar */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Cycle Calendar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MonthlyCalendar
                      cycles={cycles}
                      currentMonth={currentMonth}
                      onMonthChange={setCurrentMonth}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar Actions */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      onClick={() => setShowCycleForm(!showCycleForm)}
                      className="w-full bg-pink-600 hover:bg-pink-700"
                    >
                      {showCycleForm ? "Cancel" : "Log Cycle"}
                    </Button>

                    <Link href="/dashboard/symptoms" className="block">
                      <Button variant="outline" className="w-full">
                        Log Symptoms
                      </Button>
                    </Link>

                    <Link href="/dashboard/insights" className="block">
                      <Button variant="outline" className="w-full">
                        AI Insights
                      </Button>
                    </Link>

                    <Link href="/dashboard/history" className="block">
                      <Button variant="outline" className="w-full">
                        View History
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {showCycleForm && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Add Cycle</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CycleInputForm
                        userId={user.id}
                        onSuccess={handleCycleAdded}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Latest Cycle Info */}
                {cycles.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Latest Cycle</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Start Date</p>
                        <p className="font-semibold">
                          {new Date(cycles[0].start_date).toLocaleDateString()}
                        </p>
                      </div>
                      {cycles[0].end_date && (
                        <div>
                          <p className="text-muted-foreground">End Date</p>
                          <p className="font-semibold">
                            {new Date(cycles[0].end_date).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
