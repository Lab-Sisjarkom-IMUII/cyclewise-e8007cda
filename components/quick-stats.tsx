"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Cycle {
  start_date: string;
  end_date: string | null;
}

export default function QuickStats({ cycles }: { cycles: Cycle[] }) {
  const calculateCycleLength = (cycle: Cycle) => {
    if (!cycle.end_date) return null;
    const start = new Date(cycle.start_date);
    const end = new Date(cycle.end_date);
    return Math.round(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  const completedCycles = cycles.filter((c) => c.end_date).length;
  const lengths = cycles
    .map(calculateCycleLength)
    .filter((l) => l !== null) as number[];
  const avgCycleLength =
    lengths.length > 0
      ? Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length)
      : 0;

  const lastCycle = cycles[0];
  const daysSinceLast = lastCycle
    ? Math.floor(
        (Date.now() - new Date(lastCycle.start_date).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  return (
    <div className="grid md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Cycles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{cycles.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Avg Cycle Length
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgCycleLength} days</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Completed Cycles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedCycles}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Days Since Last
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{daysSinceLast} days</div>
        </CardContent>
      </Card>
    </div>
  );
}
