"use client";

import { useEffect, useState, useCallback } from "react";
import { Keyboard } from "lucide-react";
import { StatusIndicator } from "@/components/StatusIndicator";
import { DatePicker } from "@/components/DatePicker";
import { DailyTotalCards } from "@/components/DailyTotalCard";
import { TrendChart } from "@/components/TrendChart";
import { KeyPressChart } from "@/components/KeyPressChart";
import { ComboList } from "@/components/ComboList";
import type { DailyStats, DailyTotal } from "@/lib/types";

function today() {
  return new Date().toISOString().split("T")[0];
}

export default function Dashboard() {
  const [date, setDate] = useState(today());
  const [stats, setStats] = useState<DailyStats | null>(null);
  const [trend, setTrend] = useState<DailyTotal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (d: string) => {
    setLoading(true);
    try {
      const [dailyRes, rangeRes] = await Promise.all([
        fetch(`/api/stats/daily?date=${d}`),
        fetch(`/api/stats/range`),
      ]);
      const daily = await dailyRes.json();
      const range = await rangeRes.json();
      setStats(daily);
      setTrend(range.totals ?? []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(date);
  }, [date, fetchData]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData(date);
    }, 30000);
    return () => clearInterval(interval);
  }, [date, fetchData]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Keyboard className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Keyboard Monitor</h1>
          </div>
          <div className="flex items-center gap-4">
            <StatusIndicator />
            <DatePicker date={date} onChange={setDate} />
          </div>
        </div>

        {loading && !stats ? (
          <div className="flex h-96 items-center justify-center text-muted-foreground">
            Loading...
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Cards */}
            <DailyTotalCards
              totalCount={stats?.totalCount ?? 0}
              uniqueKeys={stats?.uniqueKeys ?? 0}
              topCombo={stats?.topCombo ?? null}
              topComboCount={stats?.topComboCount ?? 0}
            />

            {/* Trend Chart */}
            <TrendChart data={trend} />

            {/* Two-column layout */}
            <div className="grid gap-6 lg:grid-cols-2">
              <KeyPressChart data={stats?.keys ?? []} />
              <ComboList data={stats?.combos ?? []} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
