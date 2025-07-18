'use client';

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { useEffect, useState } from "react";

export default function SponsorsTable() {
  const [sponsorData, setSponsorData] = useState<any[]>([]);
  const [search, setSearch] = useState("");


  // Fetch sponsor data on search
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getAccessToken();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/media-admin/sponsors`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setSponsorData(data.sponsors || []);
      } catch (err) {
        console.error("Failed to fetch sponsors:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <PageBreadcrumb pageTitle="Sponsors Table" />

      <div className="space-y-6">
        <ComponentCard title="Sponsors Table">
          {/* Search input */}
          <div className="mb-4 max-w-xs">
            <input
              type="text"
              placeholder="Search sponsors..."
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
                      <TableCell isHeader>Name</TableCell>
                      <TableCell isHeader>Email</TableCell>
                      <TableCell isHeader>Company</TableCell>
                      <TableCell isHeader>Joined At</TableCell>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {sponsorData.length === 0 && (
                      <TableRow>
                        <TableCell className="text-center py-4 text-gray-500 dark:text-gray-400">
                          No sponsors found.
                        </TableCell>
                      </TableRow>
                    )}
                    {sponsorData.map((sponsor) => (
                      <TableRow key={sponsor.id}>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          {sponsor.name || "N/A"}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-sm dark:text-gray-400">
                          {sponsor.email || "N/A"}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-sm dark:text-gray-400">
                          {sponsor.company || "N/A"}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-sm dark:text-gray-400">
                          {sponsor.joined_at
                            ? new Date(sponsor.joined_at).toLocaleDateString()
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
