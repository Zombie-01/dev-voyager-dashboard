import type { Metadata } from "next";
// import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
// import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
// import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
// import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import AnalyticsDashboard from "@/components/ecommerce/AnalyticsDashboard";

export const metadata: Metadata = {
  title: "Voyager Widget Admin",
  description: "Voyager Widget Admin",
};

export default function Ecommerce() {
  return (
    <AnalyticsDashboard />
  );
}
