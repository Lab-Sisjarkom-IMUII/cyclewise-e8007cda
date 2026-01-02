"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardHeader from "@/components/dashboard-header";
import DashboardSidebar from "@/components/dashboard-sidebar";
import { ArrowLeft, Sparkles } from 'lucide-react';

interface Cycle {
  id: string;
  start_date: string;
  end_date: string | null;
}

interface Symptom {
  symptom_type: string;
  recorded_date: string;
  intensity: number | null;
}

interface Insight {
  id: string;
  predicted_next_cycle_start: string | null;
  predicted_ovulation_date: string | null;
  cycle_length_avg: number | null;
  insights_text: string | null;
  created_at: string;
}

export default function InsightsClient({
  userId,
  cycles: initialCycles,
  symptoms: initialSymptoms,
  lastInsight: initialInsight,
}: {
  userId: string;
  cycles: Cycle[];
  symptoms: Symptom[];
  lastInsight: Insight | null;
}) {
  const [insight, setInsight] = useState<Insight | null>(initialInsight);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate AI insights based on cycle data
  const generateInsights = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (initialCycles.length < 2) {
        setError("You need at least 2 recorded cycles to generate insights");
        setIsLoading(false);
        return;
      }

      // Calculate cycle lengths
      const cycleLengths = initialCycles
        .filter((c) => c.end_date)
        .map((c) => {
          const start = new Date(c.start_date);
          const end = new Date(c.end_date!);
          return Math.round(
            (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
          );
        });

      const avgCycleLength =
        cycleLengths.length > 0
          ? Math.round(
            cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length
          )
          : 28;

      // Predict next cycle
      const lastCycle = initialCycles[0];
      const predictedNextStart = new Date(lastCycle.start_date);
      predictedNextStart.setDate(
        predictedNextStart.getDate() + avgCycleLength
      );

      // Predict ovulation (typically 14 days before next cycle)
      const predictedOvulation = new Date(predictedNextStart);
      predictedOvulation.setDate(predictedOvulation.getDate() - 14);

      // Get most common symptoms
      const symptomCounts = initialSymptoms.reduce(
        (acc, s) => {
          acc[s.symptom_type] = (acc[s.symptom_type] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      const topSymptoms = Object.entries(symptomCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([symptom]) => symptom);

      const insightsText = `
Based on your cycle tracking data:

Average Cycle Length: ${avgCycleLength} days
Total Cycles Tracked: ${initialCycles.length}
Predicted Next Period: ${predictedNextStart.toLocaleDateString()}
Predicted Ovulation: ${predictedOvulation.toLocaleDateString()}

Your most common symptoms are: ${topSymptoms.join(", ") || "None recorded yet"}

Recommendations:
- Continue tracking regularly to improve prediction accuracy
- Log symptoms daily for better pattern recognition
- Stay hydrated and get adequate rest during your cycle
- ${topSymptoms.length > 0 ? `Consider noting when ${topSymptoms[0]} typically occurs in your cycle` : "Start logging symptoms to get personalized insights"}
      `.trim();

      const supabase = createClient();
      const { data, error: dbError } = await supabase
        .from("ai_insights")
        .insert({
          user_id: userId,
          predicted_next_cycle_start: predictedNextStart.toISOString().split("T")[0],
          predicted_ovulation_date: predictedOvulation.toISOString().split("T")[0],
          cycle_length_avg: avgCycleLength,
          insights_text: insightsText,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      setInsight(data as Insight);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
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
              <h1 className="text-3xl font-bold text-foreground">AI Insights</h1>
            </div>

            <div className="space-y-6">
              {/* Generate Insights Button */}
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    Generate Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Click the button below to generate AI-powered predictions about your menstrual cycle based on your tracking data.
                  </p>
                  <Button
                    onClick={generateInsights}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Analyzing your data..." : "Generate AI Insights"}
                  </Button>
                  {error && (
                    <p className="text-sm text-red-500">{error}</p>
                  )}
                </CardContent>
              </Card>

              {/* Current Insights */}
              {insight && (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Latest Insights</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Generated {new Date(insight.created_at).toLocaleDateString()}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Key Predictions */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                        <CardContent className="pt-4">
                          <p className="text-sm text-muted-foreground mb-1">
                            Predicted Next Period
                          </p>
                          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {insight.predicted_next_cycle_start
                              ? new Date(insight.predicted_next_cycle_start).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )
                              : "N/A"}
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                        <CardContent className="pt-4">
                          <p className="text-sm text-muted-foreground mb-1">
                            Predicted Ovulation Date
                          </p>
                          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {insight.predicted_ovulation_date
                              ? new Date(insight.predicted_ovulation_date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )
                              : "N/A"}
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800">
                        <CardContent className="pt-4">
                          <p className="text-sm text-muted-foreground mb-1">
                            Average Cycle Length
                          </p>
                          <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                            {insight.cycle_length_avg} days
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                        <CardContent className="pt-4">
                          <p className="text-sm text-muted-foreground mb-1">
                            Total Cycles Tracked
                          </p>
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {initialCycles.length}
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Insights Text */}
                    <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3">Analysis</h4>
                      <div className="text-sm text-muted-foreground whitespace-pre-line">
                        {insight.insights_text}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {!insight && (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                      Generate your first insights to see predictions and analysis
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
