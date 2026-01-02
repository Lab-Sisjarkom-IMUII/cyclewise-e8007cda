"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardHeader from "@/components/dashboard-header";
import DashboardSidebar from "@/components/dashboard-sidebar";
import { ArrowLeft } from 'lucide-react';

interface Cycle {
  id: string;
  start_date: string;
  end_date: string | null;
  created_at: string;
}

interface Symptom {
  id: string;
  symptom_type: string;
  description: string | null;
  intensity: number | null;
  recorded_date: string;
}

export default function HistoryClient({
  cycles,
  symptoms,
}: {
  cycles: Cycle[];
  symptoms: Symptom[];
}) {
  const [activeTab, setActiveTab] = useState<"cycles" | "symptoms">("cycles");

  const calculateCycleLength = (cycle: Cycle) => {
    if (!cycle.end_date) return null;
    const start = new Date(cycle.start_date);
    const end = new Date(cycle.end_date);
    return Math.round(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  const getIntensityLabel = (intensity: number | null) => {
    if (!intensity) return "N/A";
    const labels = ["", "Very Mild", "Mild", "Moderate", "Severe", "Very Severe"];
    return labels[intensity] || "N/A";
  };

  // Group symptoms by date
  const symptomsByDate = symptoms.reduce(
    (acc, symptom) => {
      const date = symptom.recorded_date;
      if (!acc[date]) acc[date] = [];
      acc[date].push(symptom);
      return acc;
    },
    {} as Record<string, Symptom[]>
  );

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
              <h1 className="text-3xl font-bold text-foreground">History</h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-slate-700">
              <button
                onClick={() => setActiveTab("cycles")}
                className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                  activeTab === "cycles"
                    ? "border-pink-600 text-pink-600 dark:text-pink-400"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Cycle History
              </button>
              <button
                onClick={() => setActiveTab("symptoms")}
                className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                  activeTab === "symptoms"
                    ? "border-pink-600 text-pink-600 dark:text-pink-400"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Symptom History
              </button>
            </div>

            {/* Cycles Tab */}
            {activeTab === "cycles" && (
              <div className="space-y-4">
                {cycles.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-center text-muted-foreground">
                        No cycles recorded yet
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  cycles.map((cycle) => {
                    const length = calculateCycleLength(cycle);
                    return (
                      <Card key={cycle.id}>
                        <CardContent className="pt-6">
                          <div className="grid md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">
                                Start Date
                              </p>
                              <p className="font-semibold">
                                {new Date(cycle.start_date).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )}
                              </p>
                            </div>

                            {cycle.end_date && (
                              <div>
                                <p className="text-sm text-muted-foreground mb-1">
                                  End Date
                                </p>
                                <p className="font-semibold">
                                  {new Date(cycle.end_date).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    }
                                  )}
                                </p>
                              </div>
                            )}

                            {length && (
                              <div>
                                <p className="text-sm text-muted-foreground mb-1">
                                  Duration
                                </p>
                                <p className="font-semibold">{length} days</p>
                              </div>
                            )}

                            <div>
                              <p className="text-sm text-muted-foreground mb-1">
                                Recorded
                              </p>
                              <p className="font-semibold">
                                {new Date(cycle.created_at).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            )}

            {/* Symptoms Tab */}
            {activeTab === "symptoms" && (
              <div className="space-y-4">
                {symptoms.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-center text-muted-foreground">
                        No symptoms logged yet
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  Object.entries(symptomsByDate)
                    .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
                    .map(([date, dateSymptoms]) => (
                      <div key={date}>
                        <h3 className="font-semibold text-sm text-muted-foreground mb-3">
                          {new Date(date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </h3>
                        <div className="space-y-2">
                          {dateSymptoms.map((symptom) => (
                            <Card key={symptom.id}>
                              <CardContent className="pt-4">
                                <div className="space-y-1">
                                  <p className="font-semibold">
                                    {symptom.symptom_type}
                                  </p>
                                  {symptom.intensity && (
                                    <p className="text-sm text-muted-foreground">
                                      Intensity: {getIntensityLabel(symptom.intensity)}
                                    </p>
                                  )}
                                  {symptom.description && (
                                    <p className="text-sm text-muted-foreground">
                                      {symptom.description}
                                    </p>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
