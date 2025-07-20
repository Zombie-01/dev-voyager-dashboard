'use client';

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Pagination from "@/components/tables/Pagination";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { useEffect, useState } from "react";

export default function BasicTables() {
  const [tableData, setTableData] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loader, setLoader] = useState(false);
  const [perPage, setPerPage] = useState(10);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      setLoader(true);
      try {
        const token = await getAccessToken();
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/media-admin/user?email=${debouncedSearch}&page=${page}&per_page=${perPage}`;
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTableData(data.users || []);
        setTotalPages(data.pagination?.pages || 1);
      } catch (err) {
        console.error("Хэрэглэгчдийн мэдээллийг авахад алдаа гарлаа:", err);
      } finally {
        setLoader(false);
      }
    };

    fetchData();
  }, [debouncedSearch, page, perPage]);

  // Export to Excel handler
  const handleExport = () => {
    import("xlsx").then((xlsx) => {
      const exportData = tableData.map((item) => ({
        Нэр: item.user?.name || "Нэргүй",
        Имэйл: item.user?.email || "Имэйл алга",
        Оноосон: item.assigned_at
          ? new Date(item.assigned_at).toLocaleDateString("mn-MN")
          : "N/A",
      }));

      const worksheet = xlsx.utils.json_to_sheet(exportData);
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, "Users");

      xlsx.writeFile(workbook, "users.xlsx");
    });
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Хэрэглэгчийн хайлтын хүснэгт" />

      <div className="space-y-6">
        <ComponentCard title="Хэрэглэгчийн хайлт">
          {/* Search */}
          <div className="mb-4 max-w-xs">
            <input
              type="text"
              placeholder="Имэйлээр хайх..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>

          {/* Per Page + Export */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            {/* Per Page Dropdown */}
            <div>
              <label className="text-sm mr-2 text-gray-600 dark:text-gray-300">Хуудаслалт:</label>
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(parseInt(e.target.value));
                  setPage(1);
                }}
                className="rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
              >
                {[5, 10, 20, 50].map((num) => (
                  <option key={num} value={num}>
                    {num} мөр
                  </option>
                ))}
              </select>
            </div>

            {/* Export to Excel Button */}
            <button
              onClick={handleExport}
              className="px-4 py-2 rounded bg-green-600 text-white text-sm hover:bg-green-700"
            >
              Excel-рүү экспортлох
            </button>
          </div>

          {/* Loader */}
          {loader ? (
            <div className="flex justify-center items-center py-12">
              <svg
                className="animate-spin h-8 w-8 text-blue-500 dark:text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                  <div className="min-w-[600px]">
                    <Table>
                      <TableHeader>
                        <TableRow className="dark:text-white">
                          <TableCell isHeader>Хэрэглэгч</TableCell>
                          <TableCell isHeader>Имэйл</TableCell>
                          <TableCell isHeader>Оноосон огноо</TableCell>
                        </TableRow>
                      </TableHeader>

                      <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {tableData.length === 0 && (
                          <TableRow>
                            <TableCell
                              colSpan={3}
                              className="text-center py-4 text-gray-500 dark:text-gray-400"
                            >
                              Хэрэглэгч олдсонгүй.
                            </TableCell>
                          </TableRow>
                        )}
                        {tableData.map((item) => (
                          <TableRow key={item.user_id} className="dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/[0.05]">
                            <TableCell className="px-5 py-4 text-start flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-sm font-semibold text-gray-700 dark:text-white uppercase">
                                {item.user?.name?.[0] || "?"}
                              </div>
                              <span>{item.user?.name || "Нэргүй"}</span>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-start text-sm text-gray-500 dark:text-gray-400">
                              {item.user?.email || "Имэйл алга"}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-start text-sm text-gray-500 dark:text-gray-400">
                              {item.assigned_at
                                ? new Date(item.assigned_at).toLocaleDateString("mn-MN")
                                : "N/A"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>

              {/* Pagination */}
              <div className="mt-6 flex justify-end">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            </>
          )}
        </ComponentCard>
      </div>
    </div>
  );
}
