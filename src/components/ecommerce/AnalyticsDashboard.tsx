"use client";
import React, { useEffect, useMemo, useState } from "react";
import { EcommerceMetrics } from "./EcommerceMetrics";
import StatisticsChart from "./StatisticsChart";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { toast } from "sonner";

type AnalyticsResponse = {
  total_users: number;
  total_conversations: number;
  weekly: {
    timezone: string;
    prev_week: { start: string; end: string };
    last_week: { start: string; end: string };
    users: { prev_week: number; last_week: number; pct_growth: number };
    conversations: { prev_week: number; last_week: number; pct_growth: number };
  };
  monthly: {
    timezone: string;
    range: { start_month: string; end_month: string };
    users: { month: string; count: number }[];
    conversations: { month: string; count: number }[];
  };
};

function monthLabel(ym: string): string {
  // ym format: YYYY-MM
  const m = parseInt(ym.split("-")[1], 10);
  return `${m}-р сар`;
}

function formatYM(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function getLast12MonthsRange(): { start: string; end: string } {
  const end = new Date();
  end.setDate(1); // normalize to first day of the month
  const start = new Date(end);
  start.setMonth(start.getMonth() - 11);
  return { start: formatYM(start), end: formatYM(end) };
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [startMonth, setStartMonth] = useState<string>(() => getLast12MonthsRange().start);
  const [endMonth, setEndMonth] = useState<string>(() => getLast12MonthsRange().end);

  const fetchAnalytics = async (params?: { start?: string; end?: string }) => {
    try {
      setLoading(true);
      const token = await getAccessToken();
      const url = new URL(
        `${process.env.NEXT_PUBLIC_API_URL}/api/media-admin/media/analytics`
      );
      if (params?.start) url.searchParams.set("start_month", params.start);
      if (params?.end) url.searchParams.set("end_month", params.end);
      const res = await fetch(url.toString(), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Алдаа гарлаа");
      setData(json as AnalyticsResponse);
    } catch (err: any) {
      toast.error("Статистик татахад алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch handled by the dependency effect below (using default months)

  useEffect(() => {
    // refetch when filters change
    if (startMonth && endMonth && startMonth > endMonth) {
      toast.error("Эхлэх сар Дуусах сараас их байна.");
      return;
    }
    fetchAnalytics({
      start: startMonth || undefined,
      end: endMonth || undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startMonth, endMonth]);

  const { categories, usersSeries, conversationsSeries } = useMemo(() => {
    if (!data?.monthly) {
      return { categories: undefined, usersSeries: undefined, conversationsSeries: undefined };
    }
    const userMonths = data.monthly.users.map((u) => u.month);
    const categories = userMonths.map(monthLabel);
    const userCounts = data.monthly.users.map((u) => u.count);
    const convMap = new Map<string, number>(
      data.monthly.conversations.map((c) => [c.month, c.count])
    );
    const convCounts = userMonths.map((m) => convMap.get(m) ?? 0);
    return { categories, usersSeries: userCounts, conversationsSeries: convCounts };
  }, [data]);

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics
          totalUsers={data?.total_users}
          usersGrowthPct={data?.weekly?.users?.pct_growth}
          totalConversations={data?.total_conversations}
          conversationsGrowthPct={data?.weekly?.conversations?.pct_growth}
          loading={loading && !data}
        />
      </div>

      <div className="col-span-12">
        <StatisticsChart
          categories={categories}
          usersSeries={usersSeries}
          conversationsSeries={conversationsSeries}
          loading={loading && !data}
          startMonth={startMonth}
          endMonth={endMonth}
          onChangeStart={(v) => setStartMonth(v)}
          onChangeEnd={(v) => setEndMonth(v)}
          onClear={() => {
            const def = getLast12MonthsRange();
            setStartMonth(def.start);
            setEndMonth(def.end);
          }}
        />
      </div>
    </div>
  );
}
