"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Cycle {
  id: string;
  start_date: string;
  end_date: string | null;
}

export default function MonthlyCalendar({
  cycles,
  currentMonth,
  onMonthChange,
}: {
  cycles: Cycle[];
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
}) {
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getCycleStatus = (day: number) => {
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateStr = checkDate.toISOString().split("T")[0];

    for (const cycle of cycles) {
      const startDate = new Date(cycle.start_date).toISOString().split("T")[0];
      const endDate = cycle.end_date ? new Date(cycle.end_date).toISOString().split("T")[0] : null;

      if (endDate) {
        if (dateStr >= startDate && dateStr <= endDate) {
          return "menstrual";
        }
        // Ovulation is typically around day 14 (between day 12-16)
        const cycleStart = new Date(cycle.start_date);
        const ovulationDate = new Date(cycleStart);
        ovulationDate.setDate(ovulationDate.getDate() + 14);
        const ovulationStr = ovulationDate.toISOString().split("T")[0];

        if (dateStr >= ovulationDate.toISOString().split("T")[0].split("-")[0] + "-" + 
          String(parseInt(ovulationDate.toISOString().split("T")[0].split("-")[1])).padStart(2, "0") + "-" +
          String(Math.max(1, parseInt(ovulationDate.toISOString().split("T")[0].split("-")[2]) - 2)).padStart(2, "0") &&
          dateStr <= ovulationDate.toISOString().split("T")[0].split("-")[0] + "-" + 
          String(parseInt(ovulationDate.toISOString().split("T")[0].split("-")[1])).padStart(2, "0") + "-" +
          String(Math.min(31, parseInt(ovulationDate.toISOString().split("T")[0].split("-")[2]) + 2)).padStart(2, "0")) {
          return "ovulation";
        }
      }

      if (dateStr === startDate) {
        return "menstrual";
      }
    }

    return null;
  };

  const days = [];
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Days of month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthName = currentMonth.toLocaleString("default", { month: "long" });
  const year = currentMonth.getFullYear();

  const handlePrevMonth = () => {
    onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">
          {monthName} {year}
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevMonth}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextMonth}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-sm text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}

        {days.map((day, idx) => {
          const status = day ? getCycleStatus(day) : null;

          return (
            <div
              key={idx}
              className={`
                aspect-square rounded-lg flex items-center justify-center text-sm font-medium
                ${
                  !day
                    ? "bg-transparent"
                    : status === "menstrual"
                    ? "bg-red-200 dark:bg-red-900/40 text-red-900 dark:text-red-200"
                    : status === "ovulation"
                    ? "bg-purple-200 dark:bg-purple-900/40 text-purple-900 dark:text-purple-200"
                    : "bg-gray-100 dark:bg-slate-800 text-foreground hover:bg-gray-200 dark:hover:bg-slate-700"
                }
              `}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex gap-6 flex-wrap text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-200 dark:bg-red-900/40"></div>
          <span>Menstrual Period</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-purple-200 dark:bg-purple-900/40"></div>
          <span>Ovulation Window</span>
        </div>
      </div>
    </div>
  );
}
