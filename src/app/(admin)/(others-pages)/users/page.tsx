'use client';

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Input from "@/components/form/input/InputField";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { useEffect, useState } from "react";

export default function BasicTables() {
  const [tableData, setTableData] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce input to reduce API calls
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch user data on search
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getAccessToken();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/media-admin/user?email=${debouncedSearch}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setTableData(data.users || []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

      fetchData();
  }, [debouncedSearch]);

  return (
    <div>
      <PageBreadcrumb pageTitle="User Search Table" />

      <div className="space-y-6">
        <ComponentCard title="User Search Table">
          {/* Search input */}
          <div className="mb-4 max-w-xs">
            <input
              type="text"
              placeholder="Search by email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableCell isHeader>User Name</TableCell>
                      <TableCell isHeader>Email</TableCell>
                      <TableCell isHeader>Assigned At</TableCell>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {tableData.length === 0 && (
                      <TableRow >
                        <TableCell  className="text-center py-4 text-gray-500 dark:text-gray-400">
                          No users found.
                        </TableCell>
                      </TableRow>
                    )}
                    {tableData.map((order) => (
                      <TableRow key={order.user_id}>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          {order.user?.name || "N/A"}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-sm dark:text-gray-400">
                          {order.user?.email || "N/A"}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-sm dark:text-gray-400">
                          {order.assigned_at
                            ? new Date(order.assigned_at).toLocaleDateString()
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}
