"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Cycle {
  id: string;
  user_id: string;
  start_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export default function CycleInputForm({
  userId,
  onSuccess,
}: {
  userId: string;
  onSuccess: (cycle: Cycle) => void;
}) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!startDate) {
        setError("Start date is required");
        setIsLoading(false);
        return;
      }

      const supabase = createClient();
      const { data, error: dbError } = await supabase
        .from("cycles")
        .insert({
          user_id: userId,
          start_date: startDate,
          end_date: endDate || null,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      onSuccess(data as Cycle);
      setStartDate("");
      setEndDate("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="startDate">Start Date</Label>
        <Input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="endDate">End Date (Optional)</Label>
        <Input
          id="endDate"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button
        type="submit"
        className="w-full bg-pink-600 hover:bg-pink-700"
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save Cycle"}
      </Button>
    </form>
  );
}
