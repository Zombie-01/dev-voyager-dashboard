"use client";
import React from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import Skeleton from "@/app/(admin)/(ui-elements)/loader/skeleton";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type Props = {
  categories?: string[];
  usersSeries?: number[];
  conversationsSeries?: number[];
  loading?: boolean;
  startMonth?: string;
  endMonth?: string;
  onChangeStart?: (v: string) => void;
  onChangeEnd?: (v: string) => void;
  onClear?: () => void;
};

export default function StatisticsChart({
  categories,
  usersSeries,
  conversationsSeries,
  loading,
  startMonth,
  endMonth,
  onChangeStart,
  onChangeEnd,
  onClear,
}: Props) {
  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF", "#9CB9FF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "straight",
      width: [2, 2],
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      x: {
        format: "dd MMM yyyy",
      },
    },
    xaxis: {
      type: "category",
      categories:
        categories ?? [
          "1-р сар",
          "2-р сар",
          "3-р сар",
          "4-р сар",
          "5-р сар",
          "6-р сар",
          "7-р сар",
          "8-р сар",
          "9-р сар",
          "10-р сар",
          "11-р сар",
          "12-р сар",
        ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
      },
      title: {
        text: "",
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  const series = [
    {
      name: "Бүртгүүлсэн хэрэглэгчид",
      data:
        usersSeries ?? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    {
      name: "Хэрэглэгчдийн асуулт хариулт",
      data:
        conversationsSeries ?? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Статистик
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Сар бүрийн статистик үзүүлэлт
          </p>
        </div>
        <div className="flex items-end w-full gap-3 sm:justify-end">
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 dark:text-gray-300 mb-1">Эхлэх сар</label>
            <input
              type="month"
              value={startMonth ?? ""}
              onChange={(e) => onChangeStart?.(e.target.value)}
              className="border px-3 py-2 rounded-md text-sm dark:bg-transparent dark:text-white dark:border-gray-700"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 dark:text-gray-300 mb-1">Дуусах сар</label>
            <input
              type="month"
              value={endMonth ?? ""}
              onChange={(e) => onChangeEnd?.(e.target.value)}
              className="border px-3 py-2 rounded-md text-sm dark:bg-transparent dark:text-white dark:border-gray-700"
            />
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          {loading ? (
            <Skeleton className="h-[310px] w-full" />
          ) : (
            <ReactApexChart options={options} series={series} type="area" height={310} />
          )}
        </div>
      </div>
    </div>
  );
}
