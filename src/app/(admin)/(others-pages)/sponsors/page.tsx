'use client';

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Pagination from "@/components/tables/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const PER_PAGE = 10;

export default function SponsorsTable() {
  const [sponsorData, setSponsorData] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoader(true);
      setError(null);
      try {
        const token = await getAccessToken();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/media-admin/sponsors?page=${page}&per_page=${PER_PAGE}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) {
          throw new Error("Ивээн тэтгэгчдийн мэдээллийг татахад алдаа гарлаа.");
        }
        const data = await res.json();
        setSponsorData(data.sponsors || []);
        setTotalPages(data.pagination?.pages || 1);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "An unknown error occurred";
        toast.error(message);
      } finally {
        setLoader(false);
      }
    };

    fetchData();
  }, [page]);

  const filteredSponsors = sponsorData.filter((sponsor) =>
    sponsor.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageBreadcrumb pageTitle="Ивээн тэтгэгчдийн жагсаалт" />

      <div className="space-y-6">
        <ComponentCard title="Ивээн тэтгэгчид">
          {/* Хайлт */}
          <div className="mb-4 max-w-xs">
            <input
              type="text"
              placeholder="Ивээн тэтгэгч хайх..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>

          {/* Loader, Error, or Table Content */}
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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-red-500">
              <p className="font-semibold">Алдаа гарлаа</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          ) : (
            <>
              {/* Хүснэгт */}
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-white/5">
                <div className="max-w-full overflow-x-auto">
                  <div className="min-w-[600px]">
                    <Table>
                      <TableHeader>
                        <TableRow className="dark:text-white">
                          <TableCell isHeader>Нэр</TableCell>
                          <TableCell isHeader>Вэбсайт</TableCell>
                          <TableCell isHeader>Лого</TableCell>
                          <TableCell isHeader>Бүртгүүлсэн огноо</TableCell>
                        </TableRow>
                      </TableHeader>

                      <TableBody className="divide-y divide-gray-100 dark:divide-white/10">
                        {filteredSponsors.length === 0 && (
                          <TableRow>
                            <TableCell
                              colSpan={4}
                              className="text-center py-4 text-gray-500 dark:text-gray-400"
                            >
                              Ивээн тэтгэгч олдсонгүй.
                            </TableCell>
                          </TableRow>
                        )}
                        {filteredSponsors.map((sponsor) => (
                          <TableRow
                            key={sponsor.id}
                            className="dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/10"
                          >
                            <TableCell className="px-5 py-4 text-start">
                              {sponsor.display_name || sponsor.name}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-start text-sm text-blue-600 underline dark:text-blue-400">
                              <a
                                href={sponsor.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {sponsor.website_url}
                              </a>
                            </TableCell>
                            <TableCell className="px-4 py-3">
                              <img
                                src={sponsor.logo_url}
                                alt={sponsor.name}
                                className="h-8 max-w-[120px]"
                              />
                            </TableCell>
                            <TableCell className="px-4 py-3 text-start text-sm text-gray-500 dark:text-gray-400">
                              {sponsor.created_at
                                ? new Date(sponsor.created_at).toLocaleDateString("mn-MN")
                                : "N/A"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>

              {/* Хуудаслалт */}
              <div className="mt-6 flex justify-end">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            </>
          )}
        </ComponentCard>
      </div>
    </div>
  );
}
