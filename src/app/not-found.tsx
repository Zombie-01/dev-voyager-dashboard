'use client';

import GridShape from "@/components/common/GridShape";
import Link from "next/link";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function NotFoundInner() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  // Read but not directly used in UI; kept for parity
  const statusCode = searchParams.get("Request+failed+with+status+code");

  const message =
    errorDescription ||
    (error === "access_denied"
      ? "Access was denied. Please check your credentials or permissions."
      : "We can’t seem to find the page you are looking for!");

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
      <GridShape />
      <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
        <h1 className="mb-8 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-2xl">
          {error || "ERROR"}
        </h1>

        <p className="mt-10 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
          {message}
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
        >
          Back to Home Page
        </Link>
      </div>

      <p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
        &copy; {new Date().getFullYear()} - TailAdmin
      </p>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense>
      <NotFoundInner />
    </Suspense>
  );
}
