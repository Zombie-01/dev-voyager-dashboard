"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import Skeleton from "@/app/(admin)/(ui-elements)/loader/skeleton";

type Props = {
  totalUsers?: number;
  usersGrowthPct?: number;
  totalConversations?: number;
  conversationsGrowthPct?: number;
  loading?: boolean;
};

export const EcommerceMetrics: React.FC<Props> = ({
  totalUsers,
  usersGrowthPct,
  totalConversations,
  conversationsGrowthPct,
  loading,
}) => {
  const formatNumber = (n?: number) =>
    typeof n === "number" ? n.toLocaleString() : "-";
  const formatPct = (n?: number) =>
    typeof n === "number" ? `${n.toFixed(2)}%` : "-";

  const usersUp = (usersGrowthPct ?? 0) >= 0;
  const convUp = (conversationsGrowthPct ?? 0) >= 0;

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800" />
            <div className="flex items-end justify-between mt-5">
              <div className="w-full pr-4">
                <Skeleton className="h-3 w-24 mb-3" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-7 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item: Users --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Нийт хэрэглэгчид
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {formatNumber(totalUsers)}
            </h4>
          </div>
          <Badge color={usersUp ? "success" : "error"}>
            {usersUp ? (
              <ArrowUpIcon />
            ) : (
              <ArrowDownIcon className="text-error-500" />
            )}
            {formatPct(usersGrowthPct)}
          </Badge>
        </div>
      </div>

      {/* <!-- Metric Item: User Conversations --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Нийт хэрэглэгчдийн яриа
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {formatNumber(totalConversations)}
            </h4>
          </div>

          <Badge color={convUp ? "success" : "error"}>
            {convUp ? (
              <ArrowUpIcon />
            ) : (
              <ArrowDownIcon className="text-error-500" />
            )}
            {formatPct(conversationsGrowthPct)}
          </Badge>
        </div>
      </div>
    </div>
  );
};
