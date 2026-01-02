"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DashboardHeader from "@/components/dashboard-header";
import DashboardSidebar from "@/components/dashboard-sidebar";
import { ArrowLeft, Trash2 } from 'lucide-react';

interface Symptom {
  id: string;
  user_id: string;
  cycle_id: string | null;
  symptom_type: string;
  description: string | null;
  intensity: number | null;
  recorded_date: string;
}

interface Cycle {
  id: string;
  start_date: string;
  end_date: string | null;
}

const COMMON_SYMPTOMS = [
  "Cramps",
  "Bloating",
  "Headache",
  "Fatigue",
  "Back Pain",
  "Mood Swings",
  "Nausea",
  "Acne",
  "Breast Tenderness",
  "Insomnia",
  "Anxiety",
  "Constipation",
  "Diarrhea",
  "Food Cravings",
];

export default function SymptomsClient({
  userId,
  initialSymptoms,
  initialCycles,
}: {
  userId: string;
  initialSymptoms: Symptom[];
  initialCycles: Cycle[];
}) {
  const [symptoms, setSymptoms] = useState<Symptom[]>(initialSymptoms);
  const [formData, setFormData] = useState({
    symptomType: "",
    customSymptom: "",
    description: "",
    intensity: 3,
    recordedDate: new Date().toISOString().split("T")[0],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddSymptom = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const symptomType = formData.symptomType || formData.customSymptom;

      if (!symptomType) {
        setError("Please select or enter a symptom");
        setIsLoading(false);
        return;
      }

      const supabase = createClient();

      // Find matching cycle for the date
      let cycleId = null;
      const selectedDate = new Date(formData.recordedDate);
      for (const cycle of initialCycles) {
        const startDate = new Date(cycle.start_date);
        const endDate = cycle.end_date
          ? new Date(cycle.end_date)
          : new Date(startDate);
        if (selectedDate >= startDate && selectedDate <= endDate) {
          cycleId = cycle.id;
          break;
        }
      }

      const { data, error: dbError } = await supabase
        .from("symptoms")
        .insert({
          user_id: userId,
          cycle_id: cycleId,
          symptom_type: symptomType,
          description: formData.description || null,
          intensity: formData.intensity,
          recorded_date: formData.recordedDate,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      setSymptoms([data, ...symptoms]);
      setFormData({
        symptomType: "",
        customSymptom: "",
        description: "",
        intensity: 3,
        recordedDate: new Date().toISOString().split("T")[0],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSymptom = async (symptomId: string) => {
    if (!confirm("Are you sure you want to delete this symptom?")) return;

    try {
      const supabase = createClient();
      const { error: dbError } = await supabase
        .from("symptoms")
        .delete()
        .eq("id", symptomId);

      if (dbError) throw dbError;

      setSymptoms(symptoms.filter((s) => s.id !== symptomId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
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
              <h1 className="text-3xl font-bold text-foreground">Log Symptoms</h1>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Symptom Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Log Symptom</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddSymptom} className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="symptomType">Select Symptom</Label>
                      <select
                        id="symptomType"
                        value={formData.symptomType}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            symptomType: e.target.value,
                            customSymptom: "",
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800"
                      >
                        <option value="">Choose from list...</option>
                        {COMMON_SYMPTOMS.map((symptom) => (
                          <option key={symptom} value={symptom}>
                            {symptom}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="customSymptom">Or Add Custom</Label>
                      <Input
                        id="customSymptom"
                        type="text"
                        placeholder="Your custom symptom"
                        value={formData.customSymptom}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            customSymptom: e.target.value,
                            symptomType: "",
                          }))
                        }
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="intensity">Intensity</Label>
                      <div className="flex items-center gap-4">
                        <input
                          id="intensity"
                          type="range"
                          min="1"
                          max="5"
                          value={formData.intensity}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              intensity: parseInt(e.target.value),
                            }))
                          }
                          className="flex-1"
                        />
                        <span className="text-sm font-semibold min-w-20">
                          {getIntensityLabel(formData.intensity)}
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="recordedDate">Date</Label>
                      <Input
                        id="recordedDate"
                        type="date"
                        value={formData.recordedDate}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            recordedDate: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="description">Notes (Optional)</Label>
                      <Textarea
                        id="description"
                        placeholder="Add any additional notes..."
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        className="min-h-24"
                      />
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <Button
                      type="submit"
                      className="w-full bg-pink-600 hover:bg-pink-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging..." : "Log Symptom"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Symptoms List */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Your Symptoms
                </h2>

                {symptoms.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-center text-muted-foreground">
                        No symptoms logged yet. Add your first symptom above.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  Object.entries(symptomsByDate)
                    .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
                    .map(([date, dateSymptoms]) => (
                      <div key={date}>
                        <h3 className="font-semibold text-sm text-muted-foreground mb-2">
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
                                <div className="flex items-start justify-between gap-4">
                                  <div className="space-y-1 flex-1">
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
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteSymptom(symptom.id)}
                                    className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
