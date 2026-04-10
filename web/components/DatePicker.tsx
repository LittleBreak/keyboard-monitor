"use client";

import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DatePickerProps {
  date: string;
  onChange: (date: string) => void;
}

export function DatePicker({ date, onChange }: DatePickerProps) {
  const shiftDate = (days: number) => {
    const d = new Date(date + "T00:00:00");
    d.setDate(d.getDate() + days);
    onChange(d.toISOString().split("T")[0]);
  };

  const isToday = date === new Date().toISOString().split("T")[0];

  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-muted-foreground" />
      <Button variant="ghost" size="icon" onClick={() => shiftDate(-1)} className="h-8 w-8">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <input
        type="date"
        value={date}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent border border-border rounded-md px-2 py-1 text-sm"
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => shiftDate(1)}
        disabled={isToday}
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      {!isToday && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(new Date().toISOString().split("T")[0])}
          className="h-8 text-xs"
        >
          Today
        </Button>
      )}
    </div>
  );
}
