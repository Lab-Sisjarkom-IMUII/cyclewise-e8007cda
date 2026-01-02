"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardHeader from "@/components/dashboard-header";
import DashboardSidebar from "@/components/dashboard-sidebar";
import { ArrowLeft, Trash2 } from 'lucide-react';

interface Cycle {
  id: string;
  user_id: string;
  start_date: string;
  end_date: string | null;
  created_at: string;
}

export default function CycleTrackingClient({
  userId,
  initialCycles,
}: {
  userId: string;
  initialCycles: Cycle[];
}) {
  const [cycles, setCycles] = useState<Cycle[]>(initialCycles);
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddCycle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!formData.startDate) {
        setError("Start date is required");
        setIsLoading(false);
        return;
      }

      const supabase = createClient();
      const { data, error: dbError } = await supabase
        .from("cycles")
        .insert({
          user_id: userId,
          start_date: formData.startDate,
          end_date: formData.endDate || null,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      setCycles([data, ...cycles]);
      setFormData({ startDate: "", endDate: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCycle = async (cycleId: string) => {
    if (!confirm("Are you sure you want to delete this cycle?")) return;

    try {
      const supabase = createClient();
      const { error: dbError } = await supabase
        .from("cycles")
        .delete()
        .eq("id", cycleId);

      if (dbError) throw dbError;

      setCycles(cycles.filter((c) => c.id !== cycleId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const calculateCycleLength = (cycle: Cycle) => {
    if (!cycle.end_date) return null;
    const start = new Date(cycle.start_date);
    const end = new Date(cycle.end_date);
    return Math.round(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <DashboardHeader user={{} as any} profile={null} onLogout={() => {}} />

      <div className="flex">
        <DashboardSidebar />

        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-8">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-foreground">Cycle Tracking</h1>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Add Cycle Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Add New Cycle</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddCycle} className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            startDate: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="endDate">End Date (Optional)</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            endDate: e.target.value,
                          }))
                        }
                      />
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <Button
                      type="submit"
                      className="w-full bg-pink-600 hover:bg-pink-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Adding..." : "Add Cycle"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Cycles List */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Your Cycles
                </h2>

                {cycles.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-center text-muted-foreground">
                        No cycles recorded yet. Add your first cycle above.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  cycles.map((cycle) => {
                    const length = calculateCycleLength(cycle);
                    return (
                      <Card key={cycle.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Start Date
                                </p>
                                <p className="font-semibold">
                                  {new Date(
                                    cycle.start_date
                                  ).toLocaleDateString()}
                                </p>
                              </div>

                              {cycle.end_date && (
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    End Date
                                  </p>
                                  <p className="font-semibold">
                                    {new Date(
                                      cycle.end_date
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              )}

                              {length && (
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    Duration
                                  </p>
                                  <p className="font-semibold">{length} days</p>
                                </div>
                              )}
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCycle(cycle.id)}
                              className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
